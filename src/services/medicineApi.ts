// src/services/medicineApi.ts

const RXNORM_BASE_URL =
  'https://rxnav.nlm.nih.gov/REST';

const OPENFDA_BASE_URL =
  'https://api.fda.gov/drug/label.json';


/* =========================================================
   TYPES
========================================================= */

export interface MedicineSearchResult {
  rxcui: string;
  name: string;
  synonym: string;
  tty: string;
}

export interface MedicineDetails {
  rxcui: string;
  name: string;

  genericName: string | null;
  brandName: string | null;

  manufacturer: string | null;
  productType: string | null;
  route: string[];
  substanceName: string[];

  indicationsAndUsage: string[];
  purpose: string[];

  dosageAndAdministration: string[];

  warnings: string[];
  warningsAndPrecautions: string[];

  contraindications: string[];

  adverseReactions: string[];

  drugInteractions: string[];

  pregnancy: string[];

  storageAndHandling: string[];

  source: string;
}


/* =========================================================
   HELPER FUNCTIONS
========================================================= */

const cleanText = (
  value: unknown
): string | null => {
  if (
    typeof value !== 'string'
  ) {
    return null;
  }

  const cleaned =
    value.trim();

  return cleaned || null;
};


const cleanStringArray = (
  value: unknown
): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === 'string'
    )
    .map(
      item => item.trim()
    )
    .filter(Boolean);
};


const uniqueStrings = (
  values: string[]
): string[] => {
  return [
    ...new Set(
      values.filter(Boolean)
    )
  ];
};


/* =========================================================
   SEARCH MEDICINE
   RxNorm Approximate Search
========================================================= */

export const searchMedicines =
  async (
    query: string
  ): Promise<MedicineSearchResult[]> => {

    const medicineName =
      query.trim();

    if (!medicineName) {
      return [];
    }

    try {
      const url =
        `${RXNORM_BASE_URL}` +
        `/approximateTerm.json` +
        `?term=${encodeURIComponent(medicineName)}` +
        `&maxEntries=10`;

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `RxNorm request failed: ${response.status}`
        );
      }

      const data =
        await response.json();

      const candidates =
        data?.approximateGroup
          ?.candidate || [];

      if (!Array.isArray(candidates)) {
        return [];
      }

      const uniqueRxcuis =
        [
          ...new Set(
            candidates
              .map(
                (candidate: any) =>
                  String(
                    candidate?.rxcui || ''
                  )
              )
              .filter(Boolean)
          )
        ].slice(0, 8);

      if (
        uniqueRxcuis.length === 0
      ) {
        return [];
      }

      const results =
        await Promise.all(
          uniqueRxcuis.map(
            async (rxcui) => {
              try {
                const properties =
                  await getRxNormProperties(
                    rxcui
                  );

                if (!properties) {
                  return null;
                }

                return {
                  rxcui,

                  name:
                    properties.name ||
                    medicineName,

                  synonym:
                    properties.synonym ||
                    '',

                  tty:
                    properties.tty ||
                    ''
                } satisfies MedicineSearchResult;

              } catch {
                return null;
              }
            }
          )
        );

      return results.filter(
        (
          result
        ): result is MedicineSearchResult =>
          result !== null
      );

    } catch (error) {
      console.error(
        'Medicine search failed:',
        error
      );

      throw new Error(
        'Unable to search medicines right now.'
      );
    }
  };


/* =========================================================
   RXNORM PROPERTIES
========================================================= */

const getRxNormProperties =
  async (
    rxcui: string
  ): Promise<{
    name: string;
    synonym: string;
    tty: string;
  } | null> => {

    const url =
      `${RXNORM_BASE_URL}` +
      `/rxcui/${encodeURIComponent(rxcui)}` +
      `/properties.json`;

    const response =
      await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    const properties =
      data?.properties;

    if (!properties) {
      return null;
    }

    return {
      name:
        cleanText(
          properties.name
        ) || '',

      synonym:
        cleanText(
          properties.synonym
        ) || '',

      tty:
        cleanText(
          properties.tty
        ) || ''
    };
  };


/* =========================================================
   GET RXNORM NAME
========================================================= */

export const getMedicineName =
  async (
    rxcui: string
  ): Promise<string | null> => {

    try {
      const properties =
        await getRxNormProperties(
          rxcui
        );

      return (
        properties?.name ||
        properties?.synonym ||
        null
      );

    } catch (error) {
      console.error(
        'Unable to get medicine name:',
        error
      );

      return null;
    }
  };


/* =========================================================
   OPENFDA SEARCH
========================================================= */

const searchOpenFda =
  async (
    medicineName: string
  ): Promise<any | null> => {

    const searches = [
      `openfda.generic_name:"${medicineName}"`,
      `openfda.brand_name:"${medicineName}"`,
      `openfda.substance_name:"${medicineName}"`
    ];

    for (
      const search of searches
    ) {
      try {
        const url =
          `${OPENFDA_BASE_URL}` +
          `?search=${encodeURIComponent(search)}` +
          `&limit=1`;

        const response =
          await fetch(url);

        if (
          response.status === 404
        ) {
          continue;
        }

        if (!response.ok) {
          continue;
        }

        const data =
          await response.json();

        const result =
          data?.results?.[0];

        if (result) {
          return result;
        }

      } catch (error) {
        console.warn(
          'openFDA search attempt failed:',
          error
        );
      }
    }

    return null;
  };


/* =========================================================
   GET MEDICINE DETAILS
========================================================= */

export const getMedicineDetails =
  async (
    rxcui: string
  ): Promise<MedicineDetails> => {

    const rxProperties =
      await getRxNormProperties(
        rxcui
      );

    if (!rxProperties) {
      throw new Error(
        'Medicine information was not found.'
      );
    }

    const medicineName =
      rxProperties.name ||
      rxProperties.synonym;

    if (!medicineName) {
      throw new Error(
        'Medicine name was not found.'
      );
    }

    let fdaData:
      any | null = null;

    /*
      RxNorm names may contain strength and
      dosage form. Try the complete name first.
    */

    fdaData =
      await searchOpenFda(
        medicineName
      );

    /*
      If no FDA result was found,
      try a simplified medicine name.
    */

    if (!fdaData) {
      const simplifiedName =
        medicineName
          .replace(
            /\[[^\]]+\]/g,
            ''
          )
          .replace(
            /\([^)]*\)/g,
            ''
          )
          .replace(
            /\b\d+(\.\d+)?\s*(mg|mcg|g|ml|%|unit|units)\b/gi,
            ''
          )
          .replace(
            /\b(tablet|capsule|solution|suspension|cream|ointment|injection|spray|patch)\b/gi,
            ''
          )
          .replace(
            /\s+/g,
            ' '
          )
          .trim();

      if (
        simplifiedName &&
        simplifiedName !== medicineName
      ) {
        fdaData =
          await searchOpenFda(
            simplifiedName
          );
      }
    }

    const openFda =
      fdaData?.openfda || {};

    const genericNames =
      cleanStringArray(
        openFda.generic_name
      );

    const brandNames =
      cleanStringArray(
        openFda.brand_name
      );

    const manufacturers =
      cleanStringArray(
        openFda.manufacturer_name
      );

    const productTypes =
      cleanStringArray(
        openFda.product_type
      );

    const routes =
      cleanStringArray(
        openFda.route
      );

    const substances =
      cleanStringArray(
        openFda.substance_name
      );

    const warnings =
      uniqueStrings([
        ...cleanStringArray(
          fdaData?.warnings
        ),

        ...cleanStringArray(
          fdaData?.boxed_warning
        )
      ]);

    const warningsAndPrecautions =
      uniqueStrings([
        ...cleanStringArray(
          fdaData?.warnings_and_cautions
        ),

        ...cleanStringArray(
          fdaData?.precautions
        )
      ]);

    const pregnancy =
      uniqueStrings([
        ...cleanStringArray(
          fdaData?.pregnancy
        ),

        ...cleanStringArray(
          fdaData?.pregnancy_or_breast_feeding
        )
      ]);

    return {
      rxcui,

      name:
        medicineName,

      genericName:
        genericNames[0] ||
        null,

      brandName:
        brandNames[0] ||
        null,

      manufacturer:
        manufacturers[0] ||
        null,

      productType:
        productTypes[0] ||
        null,

      route:
        routes,

      substanceName:
        substances,

      indicationsAndUsage:
        cleanStringArray(
          fdaData?.indications_and_usage
        ),

      purpose:
        cleanStringArray(
          fdaData?.purpose
        ),

      dosageAndAdministration:
        cleanStringArray(
          fdaData?.dosage_and_administration
        ),

      warnings,

      warningsAndPrecautions,

      contraindications:
        cleanStringArray(
          fdaData?.contraindications
        ),

      adverseReactions:
        cleanStringArray(
          fdaData?.adverse_reactions
        ),

      drugInteractions:
        cleanStringArray(
          fdaData?.drug_interactions
        ),

      pregnancy,

      storageAndHandling:
        cleanStringArray(
          fdaData?.storage_and_handling
        ),

      source:
        fdaData
          ? 'RxNorm + openFDA'
          : 'RxNorm'
    };
  };


/* =========================================================
   MEDICINE CATEGORY SEARCH
========================================================= */

export const getCategorySearchTerm =
  (
    category: string
  ): string => {

    switch (
      category.toLowerCase()
    ) {
      case 'pain relief':
        return 'acetaminophen';

      case 'vitamins':
        return 'vitamin';

      case 'allergy':
        return 'cetirizine';

      default:
        return '';
    }
  };