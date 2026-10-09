<template>
  <ion-page>
    <ion-content :fullscreen="true" class="result-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="page-header">
          <button
            class="back-button"
            @click="scanAnother"
          >
            <ion-icon :icon="arrowBackOutline" />
          </button>

          <div>
            <span class="brand-label">MEDISCAN AI</span>
            <h1>Identification Result</h1>
            <p>
              Review the AI-assisted medicine identification carefully.
            </p>
          </div>
        </header>


        <!-- NO RESULT -->
        <section
          v-if="!analysis"
          class="empty-card"
        >
          <div class="empty-icon">
            <ion-icon :icon="alertCircleOutline" />
          </div>

          <h2>No identification result found</h2>

          <p>
            The previous medicine analysis could not be loaded.
            Return to the scanner and analyze a medicine image again.
          </p>

          <button
            class="primary-button"
            @click="scanAnother"
          >
            <ion-icon :icon="cameraOutline" />
            Scan Medicine
          </button>
        </section>


        <template v-else>

          <!-- STATUS HERO -->
          <section
            class="result-hero"
            :class="statusClass"
          >
            <div class="hero-top">
              <div class="status-icon">
                <ion-icon :icon="statusIcon" />
              </div>

              <div class="hero-copy">
                <span>AI ANALYSIS COMPLETE</span>

                <h2>
                  {{ statusTitle }}
                </h2>

                <p>
                  {{ statusDescription }}
                </p>
              </div>

              <div
                class="status-badge"
                :class="statusClass"
              >
                {{ statusLabel }}
              </div>
            </div>


            <div class="confidence-area">
              <div class="confidence-heading">
                <span>Identification Confidence</span>

                <strong>
                  {{ confidence }}%
                </strong>
              </div>

              <div class="confidence-track">
                <div
                  class="confidence-fill"
                  :style="{
                    width: `${confidence}%`
                  }"
                />
              </div>

              <p>
                This score reflects confidence in reading and
                identifying information from the image. It does not
                indicate whether the medicine is appropriate or safe
                for a particular person.
              </p>
            </div>
          </section>


          <!-- IMAGE + PRIMARY RESULT -->
          <section class="main-grid">

            <!-- IMAGE -->
            <div class="image-card">
              <div class="card-heading">
                <span>ANALYZED IMAGE</span>
                <h3>Medicine Photo</h3>
              </div>

              <div
                v-if="medicineImage"
                class="medicine-image"
              >
                <img
                  :src="medicineImage"
                  alt="Analyzed medicine"
                />
              </div>

              <div
                v-else
                class="image-unavailable"
              >
                <ion-icon :icon="imageOutline" />
                <p>Image preview unavailable</p>
              </div>

              <div
                v-if="result?.original_file_name"
                class="file-name"
              >
                <ion-icon :icon="documentTextOutline" />

                <span>
                  {{ result.original_file_name }}
                </span>
              </div>
            </div>


            <!-- PRIMARY IDENTIFICATION -->
            <div class="identification-card">
              <div class="card-heading">
                <span>POSSIBLE IDENTIFICATION</span>
                <h3>
                  {{
                    displayMedicineName ||
                    'Unable to identify reliably'
                  }}
                </h3>
              </div>


              <div
                v-if="analysis.needs_verification"
                class="verification-badge"
              >
                <ion-icon :icon="warningOutline" />
                Needs Verification
              </div>


              <div class="information-list">

                <div class="information-row">
                  <span>Possible Medicine</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.possible_medicine_name
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Generic Name</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.generic_name
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Brand Name</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.brand_name
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Strength</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.strength
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Dosage Form</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.dosage_form
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Manufacturer</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.manufacturer
                      )
                    }}
                  </strong>
                </div>

                <div class="information-row">
                  <span>Visible Imprint</span>
                  <strong>
                    {{
                      valueOrReview(
                        analysis.imprint
                      )
                    }}
                  </strong>
                </div>

              </div>
            </div>

          </section>


          <!-- INSUFFICIENT INFORMATION -->
          <section
            v-if="
              analysis.identification_status ===
              'insufficient_information'
            "
            class="insufficient-card"
          >
            <div class="notice-icon">
              <ion-icon :icon="searchOutline" />
            </div>

            <div>
              <h3>
                More identifying information is needed
              </h3>

              <p>
                MediScan AI could not reliably identify this medicine
                from the current photo. Try another photo showing the
                medicine box, bottle, blister pack, label, or a clear
                tablet/capsule imprint.
              </p>
            </div>
          </section>


          <!-- IDENTIFICATION BASIS -->
          <section
            v-if="identificationBasis.length"
            class="section-card"
          >
            <div class="section-title">
              <div class="section-icon green">
                <ion-icon :icon="scanOutline" />
              </div>

              <div>
                <span>AI REVIEW</span>
                <h2>Identification Basis</h2>
              </div>
            </div>

            <p class="section-description">
              These are the visible details the AI used when
              interpreting the medicine image.
            </p>

            <div class="item-list">
              <div
                v-for="(item, index) in identificationBasis"
                :key="`basis-${index}`"
                class="list-item"
              >
                <ion-icon :icon="checkmarkCircleOutline" />

                <span>
                  {{ item }}
                </span>
              </div>
            </div>
          </section>


          <!-- VISIBLE TEXT -->
          <section
            v-if="visibleText.length"
            class="section-card"
          >
            <div class="section-title">
              <div class="section-icon blue">
                <ion-icon :icon="textOutline" />
              </div>

              <div>
                <span>IMAGE EXTRACTION</span>
                <h2>Visible Medicine Text</h2>
              </div>
            </div>

            <p class="section-description">
              Text detected from the medicine, packaging, label,
              or blister pack.
            </p>

            <div class="text-box">
              <div
                v-for="(text, index) in visibleText"
                :key="`text-${index}`"
                class="extracted-text"
              >
                {{ text }}
              </div>
            </div>
          </section>


          <!-- PACKAGING -->
          <section
            v-if="packagingInformation.length"
            class="section-card"
          >
            <div class="section-title">
              <div class="section-icon purple">
                <ion-icon :icon="cubeOutline" />
              </div>

              <div>
                <span>VISIBLE DETAILS</span>
                <h2>Packaging Information</h2>
              </div>
            </div>

            <div class="item-list">
              <div
                v-for="(item, index) in packagingInformation"
                :key="`package-${index}`"
                class="list-item"
              >
                <ion-icon :icon="informationCircleOutline" />

                <span>
                  {{ item }}
                </span>
              </div>
            </div>
          </section>


          <!-- WARNINGS -->
          <section
            v-if="warnings.length"
            class="warning-card"
          >
            <div class="warning-heading">
              <ion-icon :icon="warningOutline" />

              <div>
                <span>REVIEW REQUIRED</span>
                <h2>Identification Warnings</h2>
              </div>
            </div>

            <div class="warning-list">
              <div
                v-for="(warning, index) in warnings"
                :key="`warning-${index}`"
                class="warning-item"
              >
                <span class="warning-dot" />

                <p>
                  {{ warning }}
                </p>
              </div>
            </div>
          </section>


          <!-- SAFETY -->
          <section class="safety-card">
            <div class="safety-icon">
              <ion-icon :icon="shieldCheckmarkOutline" />
            </div>

            <div>
              <h3>Verify before relying on this result</h3>

              <p>
                Medicine image recognition can make mistakes.
                Similar-looking tablets, capsules, packaging, and
                labels can represent different medicines. Compare this
                result with the original packaging or prescription.
                If the medicine is unclear, ask a pharmacist or
                qualified healthcare professional before using it.
                Do not start, stop, or change medication based only
                on this AI result.
              </p>
            </div>
          </section>


          <!-- ACTIONS -->
          <div class="bottom-actions">

            <button
              class="secondary-button"
              @click="scanAnother"
            >
              <ion-icon :icon="cameraOutline" />
              Scan Another Medicine
            </button>


            <button
              class="primary-button"
              :disabled="!canSearchMedicine"
              @click="viewMedicineInformation"
            >
              <ion-icon :icon="searchOutline" />
              Search Medicine Information
            </button>

          </div>


          <p
            v-if="!canSearchMedicine"
            class="search-note"
          >
            A sufficiently supported medicine name is required before
            MediScan AI can search the medicine database.
          </p>


          <!-- TECHNICAL INFO -->
          <div class="technical-info">
            <span>
              AI-assisted identification
            </span>

            <span v-if="result?.model">
              Model: {{ result.model }}
            </span>

            <span v-if="formattedAnalyzedDate">
              Analyzed {{ formattedAnalyzedDate }}
            </span>
          </div>

        </template>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {
  computed,
  ref
} from 'vue';

import {
  IonPage,
  IonContent,
  IonIcon
} from '@ionic/vue';

import {
  alertCircleOutline,
  arrowBackOutline,
  cameraOutline,
  checkmarkCircleOutline,
  cubeOutline,
  documentTextOutline,
  imageOutline,
  informationCircleOutline,
  scanOutline,
  searchOutline,
  shieldCheckmarkOutline,
  textOutline,
  warningOutline
} from 'ionicons/icons';

import {
  useRouter
} from 'vue-router';


interface MedicineAnalysis {
  medicine_detected: boolean;

  identification_status:
    | 'identified'
    | 'possible_match'
    | 'insufficient_information';

  possible_medicine_name:
    string | null;

  generic_name:
    string | null;

  brand_name:
    string | null;

  strength:
    string | null;

  dosage_form:
    string | null;

  manufacturer:
    string | null;

  visible_text:
    string[];

  imprint:
    string | null;

  packaging_information:
    string[];

  confidence:
    number;

  needs_verification:
    boolean;

  identification_basis:
    string[];

  warnings:
    string[];
}


interface StoredResult {
  analysis:
    MedicineAnalysis;

  model?:
    string | null;

  analyzed_at?:
    string;

  original_file_name?:
    string;
}


const router =
  useRouter();


const result =
  ref<StoredResult | null>(
    null
  );


const medicineImage =
  ref('');


/* =========================================================
   LOAD RESULT
========================================================= */

const loadResult = () => {
  const storedResult =
    sessionStorage.getItem(
      'mediscan_medicine_identification'
    );


  const storedImage =
    sessionStorage.getItem(
      'mediscan_medicine_image'
    );


  medicineImage.value =
    storedImage || '';


  if (!storedResult) {
    return;
  }


  try {
    const parsed =
      JSON.parse(
        storedResult
      );


    if (
      parsed &&
      parsed.analysis
    ) {
      result.value =
        parsed;
    }

  } catch (error) {
    console.error(
      'Could not load medicine identification:',
      error
    );

    result.value =
      null;
  }
};


loadResult();


/* =========================================================
   ANALYSIS
========================================================= */

const analysis =
  computed(() =>
    result.value?.analysis ||
    null
  );


const confidence =
  computed(() => {

    const value =
      Number(
        analysis.value
          ?.confidence
      );


    if (
      !Number.isFinite(
        value
      )
    ) {
      return 0;
    }


    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          value
        )
      )
    );
  });


const visibleText =
  computed(() => {

    if (
      !Array.isArray(
        analysis.value
          ?.visible_text
      )
    ) {
      return [];
    }


    return analysis.value!
      .visible_text
      .filter(
        item =>
          typeof item ===
            'string' &&
          item.trim()
      );
  });


const packagingInformation =
  computed(() => {

    if (
      !Array.isArray(
        analysis.value
          ?.packaging_information
      )
    ) {
      return [];
    }


    return analysis.value!
      .packaging_information
      .filter(
        item =>
          typeof item ===
            'string' &&
          item.trim()
      );
  });


const identificationBasis =
  computed(() => {

    if (
      !Array.isArray(
        analysis.value
          ?.identification_basis
      )
    ) {
      return [];
    }


    return analysis.value!
      .identification_basis
      .filter(
        item =>
          typeof item ===
            'string' &&
          item.trim()
      );
  });


const warnings =
  computed(() => {

    if (
      !Array.isArray(
        analysis.value
          ?.warnings
      )
    ) {
      return [];
    }


    return analysis.value!
      .warnings
      .filter(
        item =>
          typeof item ===
            'string' &&
          item.trim()
      );
  });


/* =========================================================
   DISPLAY NAME
========================================================= */

const displayMedicineName =
  computed(() => {

    const current =
      analysis.value;


    if (!current) {
      return '';
    }


    return (
      current
        .possible_medicine_name ||
      current
        .brand_name ||
      current
        .generic_name ||
      ''
    );
  });


/* =========================================================
   STATUS
========================================================= */

const statusClass =
  computed(() => {

    switch (
      analysis.value
        ?.identification_status
    ) {

      case 'identified':
        return 'identified';

      case 'possible_match':
        return 'possible';

      default:
        return 'insufficient';
    }
  });


const statusLabel =
  computed(() => {

    switch (
      analysis.value
        ?.identification_status
    ) {

      case 'identified':
        return 'Strong Match';

      case 'possible_match':
        return 'Possible Match';

      default:
        return 'Needs More Information';
    }
  });


const statusTitle =
  computed(() => {

    switch (
      analysis.value
        ?.identification_status
    ) {

      case 'identified':
        return (
          displayMedicineName.value ||
          'Medicine information detected'
        );

      case 'possible_match':
        return (
          displayMedicineName.value ||
          'Possible medicine match detected'
        );

      default:
        return 'Unable to reliably identify';
    }
  });


const statusDescription =
  computed(() => {

    switch (
      analysis.value
        ?.identification_status
    ) {

      case 'identified':
        return 'The image contains strong readable medicine-identifying information. Review the details below and verify them against the original medicine packaging.';

      case 'possible_match':
        return 'The image contains useful identifying information, but some details remain uncertain. Treat this as a possible match until verified.';

      default:
        return 'The current image does not contain enough reliable identifying information. A clearer image of the label, packaging, blister pack, or imprint may help.';
    }
  });


const statusIcon =
  computed(() => {

    switch (
      analysis.value
        ?.identification_status
    ) {

      case 'identified':
        return checkmarkCircleOutline;

      case 'possible_match':
        return warningOutline;

      default:
        return searchOutline;
    }
  });


/* =========================================================
   SEARCH ELIGIBILITY
========================================================= */

const canSearchMedicine =
  computed(() => {

    const current =
      analysis.value;


    if (!current) {
      return false;
    }


    if (
      current
        .identification_status ===
      'insufficient_information'
    ) {
      return false;
    }


    return Boolean(
      current
        .possible_medicine_name ||
      current
        .generic_name ||
      current
        .brand_name
    );
  });


/* =========================================================
   DATE
========================================================= */

const formattedAnalyzedDate =
  computed(() => {

    const value =
      result.value
        ?.analyzed_at;


    if (!value) {
      return '';
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return '';
    }


    return date.toLocaleString(
      undefined,
      {
        dateStyle:
          'medium',

        timeStyle:
          'short'
      }
    );
  });


/* =========================================================
   HELPERS
========================================================= */

const valueOrReview = (
  value:
    string |
    null |
    undefined
) => {

  if (
    typeof value ===
      'string' &&
    value.trim()
  ) {
    return value;
  }


  return 'Not identified';
};


/* =========================================================
   NAVIGATION
========================================================= */

const scanAnother = () => {
  sessionStorage.removeItem(
    'mediscan_medicine_identification'
  );

  sessionStorage.removeItem(
    'mediscan_medicine_image'
  );


  router.push(
    '/identify-medicine'
  );
};


const viewMedicineInformation =
  () => {

    if (
      !analysis.value ||
      !canSearchMedicine.value
    ) {
      return;
    }


    const searchTerm =
      analysis.value
        .generic_name ||
      analysis.value
        .possible_medicine_name ||
      analysis.value
        .brand_name;


    if (!searchTerm) {
      return;
    }


    /*
      Store the AI-supported name.

      MedicinePage can later read this value
      and automatically run the RxNorm search.
    */

    sessionStorage.setItem(
      'mediscan_medicine_search_term',
      searchTerm
    );


    router.push(
      '/tabs/medicine'
    );
  };
</script>


<style scoped>
.result-content {
  --background: #f5faf8;
}

.page-container {
  width: min(100%, 1050px);
  margin: 0 auto;
  padding: 44px 28px 80px;
  color: #13231e;
}


/* HEADER */

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 28px;
}

.back-button {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border: 1px solid #dbe7e3;
  border-radius: 15px;
  background: white;
  color: #183a2f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
}

.brand-label,
.card-heading span,
.section-title span,
.warning-heading span {
  color: #07966e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.page-header h1 {
  margin: 4px 0 5px;
  font-size: 34px;
  font-weight: 800;
}

.page-header p {
  margin: 0;
  color: #7a8984;
  font-size: 13px;
}


/* HERO */

.result-hero {
  padding: 25px;
  margin-bottom: 18px;
  border: 1px solid #cce7de;
  border-radius: 24px;
  background: white;
}

.result-hero.identified {
  background:
    linear-gradient(
      135deg,
      #e9faf5,
      #f8fffc
    );
}

.result-hero.possible {
  border-color: #ecd597;
  background:
    linear-gradient(
      135deg,
      #fff9e9,
      #fffdf7
    );
}

.result-hero.insufficient {
  border-color: #e3d6c7;
  background:
    linear-gradient(
      135deg,
      #fff8f0,
      #fffdf9
    );
}

.hero-top {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.status-icon {
  width: 55px;
  height: 55px;
  min-width: 55px;
  border-radius: 17px;
  background: #daf5ec;
  color: #078d68;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon ion-icon {
  font-size: 27px;
}

.hero-copy {
  flex: 1;
}

.hero-copy > span {
  color: #078d68;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.hero-copy h2 {
  margin: 5px 0 7px;
  font-size: 23px;
}

.hero-copy p {
  max-width: 690px;
  margin: 0;
  color: #6d7d77;
  font-size: 12px;
  line-height: 1.6;
}

.status-badge {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.status-badge.identified {
  background: #d8f5eb;
  color: #07845f;
}

.status-badge.possible {
  background: #fff0bd;
  color: #8a6500;
}

.status-badge.insufficient {
  background: #f5e7d9;
  color: #8b6545;
}


/* CONFIDENCE */

.confidence-area {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(90, 120, 110, 0.14);
}

.confidence-heading {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  font-size: 12px;
}

.confidence-heading span {
  color: #63736d;
  font-weight: 700;
}

.confidence-heading strong {
  color: #078d68;
  font-size: 14px;
}

.confidence-track {
  height: 9px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #e2ebe8;
}

.confidence-fill {
  height: 100%;
  border-radius: inherit;
  background: #07966e;
  transition: width 0.4s ease;
}

.confidence-area p {
  margin: 8px 0 0;
  color: #8a9692;
  font-size: 10px;
  line-height: 1.5;
}


/* MAIN */

.main-grid {
  display: grid;
  grid-template-columns:
    minmax(0, 0.9fr)
    minmax(0, 1.1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.image-card,
.identification-card,
.section-card {
  padding: 21px;
  border: 1px solid #dfe9e5;
  border-radius: 22px;
  background: white;
}

.card-heading h3 {
  margin: 5px 0 15px;
  font-size: 19px;
}

.medicine-image {
  min-height: 280px;
  max-height: 430px;
  overflow: hidden;
  border-radius: 17px;
  background: #eef4f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medicine-image img {
  width: 100%;
  max-height: 430px;
  object-fit: contain;
  display: block;
}

.image-unavailable {
  min-height: 280px;
  border-radius: 17px;
  background: #f0f5f3;
  color: #8c9994;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.image-unavailable ion-icon {
  font-size: 37px;
}

.image-unavailable p {
  margin: 8px 0 0;
  font-size: 12px;
}

.file-name {
  margin-top: 11px;
  padding: 11px 13px;
  border-radius: 12px;
  background: #f4f8f6;
  color: #65736e;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 7px;
}

.file-name span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* IDENTIFICATION */

.verification-badge {
  width: fit-content;
  margin: -5px 0 15px;
  padding: 7px 10px;
  border-radius: 999px;
  background: #fff0bd;
  color: #896300;
  font-size: 10px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
}

.information-list {
  border-top: 1px solid #edf1ef;
}

.information-row {
  display: grid;
  grid-template-columns: 145px 1fr;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid #edf1ef;
}

.information-row span {
  color: #87938f;
  font-size: 11px;
}

.information-row strong {
  color: #20332c;
  font-size: 12px;
  overflow-wrap: anywhere;
}


/* GENERIC SECTIONS */

.section-card {
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon ion-icon {
  font-size: 20px;
}

.section-title h2 {
  margin: 3px 0 0;
  font-size: 18px;
}

.green {
  background: #def7ef;
  color: #07966e;
}

.blue {
  background: #e5f2ff;
  color: #3787cb;
}

.purple {
  background: #eeeaff;
  color: #735fd2;
}

.section-description {
  margin: 13px 0;
  color: #7a8984;
  font-size: 11px;
  line-height: 1.6;
}

.item-list {
  display: grid;
  gap: 8px;
  margin-top: 15px;
}

.list-item {
  padding: 12px 14px;
  border-radius: 13px;
  background: #f5f9f7;
  color: #53645e;
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 9px;
}

.list-item ion-icon {
  min-width: 17px;
  margin-top: 1px;
  color: #07966e;
  font-size: 17px;
}


/* EXTRACTED TEXT */

.text-box {
  max-height: 300px;
  padding: 15px;
  overflow-y: auto;
  border-radius: 14px;
  background: #f4f8f6;
}

.extracted-text {
  padding: 8px 0;
  border-bottom: 1px solid #e3ebe8;
  color: #394d46;
  font-size: 12px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.extracted-text:last-child {
  border-bottom: none;
}


/* INSUFFICIENT */

.insufficient-card {
  display: flex;
  gap: 14px;
  margin-bottom: 16px;
  padding: 19px;
  border: 1px solid #e7d5bd;
  border-radius: 18px;
  background: #fff9f2;
}

.notice-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  border-radius: 13px;
  background: #f8e7d1;
  color: #996f3d;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon ion-icon {
  font-size: 21px;
}

.insufficient-card h3 {
  margin: 1px 0 5px;
  font-size: 14px;
}

.insufficient-card p {
  margin: 0;
  color: #7e6d5b;
  font-size: 11px;
  line-height: 1.6;
}


/* WARNINGS */

.warning-card {
  margin-bottom: 16px;
  padding: 20px;
  border: 1px solid #edd397;
  border-radius: 19px;
  background: #fff9e9;
}

.warning-heading {
  display: flex;
  align-items: center;
  gap: 11px;
}

.warning-heading > ion-icon {
  color: #ad7a00;
  font-size: 24px;
}

.warning-heading span {
  color: #a67400;
}

.warning-heading h2 {
  margin: 3px 0 0;
  font-size: 17px;
}

.warning-list {
  margin-top: 14px;
}

.warning-item {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-top: 8px;
}

.warning-dot {
  width: 6px;
  height: 6px;
  min-width: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: #c28b0d;
}

.warning-item p {
  margin: 0;
  color: #806b39;
  font-size: 11px;
  line-height: 1.55;
}


/* SAFETY */

.safety-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 22px;
  padding: 20px;
  border: 1px solid #efcaca;
  border-radius: 19px;
  background: #fff6f6;
}

.safety-icon {
  width: 45px;
  height: 45px;
  min-width: 45px;
  border-radius: 13px;
  background: #ffe2e2;
  color: #b44848;
  display: flex;
  align-items: center;
  justify-content: center;
}

.safety-icon ion-icon {
  font-size: 22px;
}

.safety-card h3 {
  margin: 1px 0 6px;
  font-size: 14px;
}

.safety-card p {
  margin: 0;
  color: #805e5e;
  font-size: 11px;
  line-height: 1.65;
}


/* BUTTONS */

.primary-button,
.secondary-button {
  min-height: 54px;
  padding: 0 18px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.primary-button {
  border: none;
  background: #07966e;
  color: white;
  box-shadow:
    0 9px 22px
    rgba(7, 150, 110, 0.16);
}

.secondary-button {
  border: 1px solid #acd9cc;
  background: white;
  color: #078662;
}

.primary-button:disabled {
  background: #b8c9c3;
  box-shadow: none;
  cursor: not-allowed;
}

.bottom-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
}

.search-note {
  margin: 10px 0 0;
  text-align: right;
  color: #8c9994;
  font-size: 10px;
}


/* EMPTY */

.empty-card {
  max-width: 620px;
  margin: 90px auto;
  padding: 45px 30px;
  border: 1px solid #dfe9e5;
  border-radius: 24px;
  background: white;
  text-align: center;
}

.empty-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto 16px;
  border-radius: 19px;
  background: #fff0dd;
  color: #a97532;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon ion-icon {
  font-size: 31px;
}

.empty-card h2 {
  margin: 0 0 8px;
  font-size: 21px;
}

.empty-card p {
  max-width: 480px;
  margin: 0 auto 20px;
  color: #7d8a85;
  font-size: 12px;
  line-height: 1.6;
}


/* TECHNICAL */

.technical-info {
  margin-top: 20px;
  color: #9aa5a1;
  font-size: 9px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 14px;
}


/* RESPONSIVE */

@media (max-width: 750px) {
  .page-container {
    padding:
      calc(
        26px +
        env(safe-area-inset-top)
      )
      17px
      55px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .hero-top {
    flex-wrap: wrap;
  }

  .status-badge {
    margin-left: 71px;
  }

  .main-grid {
    grid-template-columns: 1fr;
  }

  .information-row {
    grid-template-columns: 120px 1fr;
  }

  .bottom-actions {
    grid-template-columns: 1fr;
  }

  .search-note {
    text-align: center;
  }
}

@media (max-width: 430px) {
  .page-header {
    gap: 12px;
  }

  .back-button {
    width: 43px;
    height: 43px;
    min-width: 43px;
  }

  .result-hero {
    padding: 19px;
  }

  .status-icon {
    width: 48px;
    height: 48px;
    min-width: 48px;
  }

  .status-badge {
    margin-left: 0;
  }

  .information-row {
    grid-template-columns: 1fr;
    gap: 4px;
  }

  .medicine-image {
    min-height: 220px;
  }
}
</style>