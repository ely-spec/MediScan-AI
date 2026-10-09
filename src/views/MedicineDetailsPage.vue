<template>
  <ion-page>
    <ion-content :fullscreen="true" class="details-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="page-header">
          <button
            class="back-button"
            @click="goBack"
          >
            <ion-icon :icon="arrowBackOutline" />
          </button>

          <div class="header-copy">
            <span class="brand-label">
              MEDISCAN AI
            </span>

            <h1>Medicine Details</h1>

            <p>
              Review medicine information from trusted drug data sources.
            </p>
          </div>
        </header>


        <!-- LOADING -->
        <section
          v-if="loading"
          class="state-card"
        >
          <div class="loading-icon">
            <ion-spinner name="crescent" />
          </div>

          <h2>Loading medicine information...</h2>

          <p>
            MediScan is retrieving available medicine information.
          </p>
        </section>


        <!-- ERROR -->
        <section
          v-else-if="errorMessage"
          class="state-card"
        >
          <div class="error-icon">
            <ion-icon :icon="alertCircleOutline" />
          </div>

          <h2>Unable to load medicine</h2>

          <p>
            {{ errorMessage }}
          </p>

          <div class="state-actions">
            <button
              class="secondary-button"
              @click="goBack"
            >
              Back to Medicine
            </button>

            <button
              class="primary-button"
              @click="loadMedicine"
            >
              Try Again
            </button>
          </div>
        </section>


        <!-- DETAILS -->
        <template v-else-if="medicine">

          <!-- HERO -->
          <section class="medicine-hero">
            <div class="medicine-symbol">
              <ion-icon :icon="medical" />
            </div>

            <div class="medicine-heading">
              <span class="medicine-label">
                MEDICINE INFORMATION
              </span>

              <h2>{{ medicine.name }}</h2>

              <div class="hero-tags">
                <span>
                  RxCUI {{ medicine.rxcui }}
                </span>

                <span v-if="medicine.productType">
                  {{ medicine.productType }}
                </span>

                <span class="source-tag">
                  {{ medicine.source }}
                </span>
              </div>
            </div>
          </section>


          <!-- IMPORTANT NOTICE -->
          <section class="notice-card">
            <div class="notice-icon">
              <ion-icon :icon="informationCircleOutline" />
            </div>

            <div>
              <strong>
                Reference information only
              </strong>

              <p>
                This page displays available medicine and drug-label
                information for reference and educational purposes.
                It does not determine whether a medicine is appropriate
                for you and does not replace advice from a doctor or
                pharmacist.
              </p>
            </div>
          </section>


          <!-- BASIC INFORMATION -->
          <section class="section">
            <div class="section-title">
              <span>OVERVIEW</span>
              <h2>Medicine Information</h2>
              <p>
                Basic identifying information available for this medicine.
              </p>
            </div>

            <div class="info-grid">

              <div class="info-card">
                <div class="info-icon green">
                  <ion-icon :icon="medicalOutline" />
                </div>

                <div>
                  <span>Medicine Name</span>
                  <strong>{{ medicine.name }}</strong>
                </div>
              </div>


              <div class="info-card">
                <div class="info-icon blue">
                  <ion-icon :icon="flaskOutline" />
                </div>

                <div>
                  <span>Generic Name</span>
                  <strong>
                    {{ displayValue(medicine.genericName) }}
                  </strong>
                </div>
              </div>


              <div class="info-card">
                <div class="info-icon purple">
                  <ion-icon :icon="pricetagOutline" />
                </div>

                <div>
                  <span>Brand Name</span>
                  <strong>
                    {{ displayValue(medicine.brandName) }}
                  </strong>
                </div>
              </div>


              <div class="info-card">
                <div class="info-icon orange">
                  <ion-icon :icon="businessOutline" />
                </div>

                <div>
                  <span>Manufacturer</span>
                  <strong>
                    {{ displayValue(medicine.manufacturer) }}
                  </strong>
                </div>
              </div>


              <div class="info-card">
                <div class="info-icon cyan">
                  <ion-icon :icon="layersOutline" />
                </div>

                <div>
                  <span>Product Type</span>
                  <strong>
                    {{ displayValue(medicine.productType) }}
                  </strong>
                </div>
              </div>


              <div class="info-card">
                <div class="info-icon yellow">
                  <ion-icon :icon="gitBranchOutline" />
                </div>

                <div>
                  <span>Route</span>

                  <strong>
                    {{
                      displayArray(
                        medicine.route
                      )
                    }}
                  </strong>
                </div>
              </div>

            </div>
          </section>


          <!-- ACTIVE SUBSTANCE -->
          <section class="section">
            <div class="section-title">
              <span>ACTIVE INGREDIENT</span>
              <h2>Substance Information</h2>
            </div>

            <div class="simple-card">
              <div class="simple-card-icon">
                <ion-icon :icon="flaskOutline" />
              </div>

              <div>
                <span>Substance Name</span>

                <h3>
                  {{
                    displayArray(
                      medicine.substanceName
                    )
                  }}
                </h3>
              </div>
            </div>
          </section>


          <!-- USES -->
          <section class="section">
            <div class="section-title">
              <span>DRUG LABEL INFORMATION</span>
              <h2>Uses & Indications</h2>

              <p>
                Available indications or purposes from the drug label.
              </p>
            </div>

            <div
              v-if="hasContent(
                medicine.indicationsAndUsage
              ) || hasContent(medicine.purpose)"
              class="content-stack"
            >
              <article
                v-if="hasContent(
                  medicine.indicationsAndUsage
                )"
                class="detail-card"
              >
                <div class="detail-heading">
                  <div class="detail-icon green">
                    <ion-icon :icon="documentTextOutline" />
                  </div>

                  <h3>Indications and Usage</h3>
                </div>

                <div
                  v-for="(
                    paragraph,
                    index
                  ) in medicine.indicationsAndUsage"
                  :key="`indication-${index}`"
                  class="detail-text"
                >
                  {{ paragraph }}
                </div>
              </article>


              <article
                v-if="hasContent(medicine.purpose)"
                class="detail-card"
              >
                <div class="detail-heading">
                  <div class="detail-icon blue">
                    <ion-icon :icon="informationCircleOutline" />
                  </div>

                  <h3>Purpose</h3>
                </div>

                <div
                  v-for="(
                    paragraph,
                    index
                  ) in medicine.purpose"
                  :key="`purpose-${index}`"
                  class="detail-text"
                >
                  {{ paragraph }}
                </div>
              </article>
            </div>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No uses or indication information was returned for this
                  medicine from the current data source.
                </p>
              </div>
            </div>
          </section>


          <!-- DOSAGE -->
          <section class="section">
            <div class="section-title">
              <span>LABEL INFORMATION</span>
              <h2>Dosage & Administration</h2>

              <p>
                Drug-label information only. Follow the directions given
                specifically to you by your prescriber or pharmacist.
              </p>
            </div>

            <article
              v-if="hasContent(
                medicine.dosageAndAdministration
              )"
              class="detail-card"
            >
              <div class="detail-heading">
                <div class="detail-icon purple">
                  <ion-icon :icon="readerOutline" />
                </div>

                <h3>Dosage and Administration</h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.dosageAndAdministration"
                :key="`dosage-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No dosage and administration label information was
                  returned for this medicine.
                </p>
              </div>
            </div>
          </section>


          <!-- WARNINGS -->
          <section class="section">
            <div class="section-title">
              <span>SAFETY INFORMATION</span>
              <h2>Warnings & Precautions</h2>

              <p>
                Review available safety information carefully.
              </p>
            </div>

            <div
              v-if="
                hasContent(medicine.warnings) ||
                hasContent(medicine.warningsAndPrecautions)
              "
              class="content-stack"
            >

              <article
                v-if="hasContent(medicine.warnings)"
                class="detail-card warning-card"
              >
                <div class="detail-heading">
                  <div class="detail-icon warning">
                    <ion-icon :icon="warningOutline" />
                  </div>

                  <h3>Warnings</h3>
                </div>

                <div
                  v-for="(
                    paragraph,
                    index
                  ) in medicine.warnings"
                  :key="`warning-${index}`"
                  class="detail-text"
                >
                  {{ paragraph }}
                </div>
              </article>


              <article
                v-if="hasContent(
                  medicine.warningsAndPrecautions
                )"
                class="detail-card warning-card"
              >
                <div class="detail-heading">
                  <div class="detail-icon warning">
                    <ion-icon :icon="shieldCheckmarkOutline" />
                  </div>

                  <h3>Warnings and Precautions</h3>
                </div>

                <div
                  v-for="(
                    paragraph,
                    index
                  ) in medicine.warningsAndPrecautions"
                  :key="`precaution-${index}`"
                  class="detail-text"
                >
                  {{ paragraph }}
                </div>
              </article>

            </div>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No warning information was returned from the current
                  drug-label data source. This does not mean that the
                  medicine has no warnings.
                </p>
              </div>
            </div>
          </section>


          <!-- CONTRAINDICATIONS -->
          <section class="section">
            <div class="section-title">
              <span>SAFETY INFORMATION</span>
              <h2>Contraindications</h2>
            </div>

            <article
              v-if="hasContent(
                medicine.contraindications
              )"
              class="detail-card"
            >
              <div class="detail-heading">
                <div class="detail-icon red">
                  <ion-icon :icon="closeCircleOutline" />
                </div>

                <h3>Contraindications</h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.contraindications"
                :key="`contraindication-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No contraindication information was returned from the
                  current drug-label data source.
                </p>
              </div>
            </div>
          </section>


          <!-- ADVERSE REACTIONS -->
          <section class="section">
            <div class="section-title">
              <span>SAFETY INFORMATION</span>
              <h2>Adverse Reactions</h2>
            </div>

            <article
              v-if="hasContent(
                medicine.adverseReactions
              )"
              class="detail-card"
            >
              <div class="detail-heading">
                <div class="detail-icon orange">
                  <ion-icon :icon="alertCircleOutline" />
                </div>

                <h3>Adverse Reactions</h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.adverseReactions"
                :key="`reaction-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No adverse reaction information was returned from the
                  current drug-label data source.
                </p>
              </div>
            </div>
          </section>


          <!-- INTERACTIONS -->
          <section class="section">
            <div class="section-title">
              <span>SAFETY INFORMATION</span>
              <h2>Drug Interactions</h2>
            </div>

            <article
              v-if="hasContent(
                medicine.drugInteractions
              )"
              class="detail-card"
            >
              <div class="detail-heading">
                <div class="detail-icon purple">
                  <ion-icon :icon="gitCompareOutline" />
                </div>

                <h3>Drug Interactions</h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.drugInteractions"
                :key="`interaction-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>

            <div
              v-else
              class="unavailable-card"
            >
              <ion-icon :icon="informationCircleOutline" />

              <div>
                <strong>
                  Information not available
                </strong>

                <p>
                  No drug interaction information was returned from the
                  current drug-label data source.
                </p>
              </div>
            </div>
          </section>


          <!-- PREGNANCY -->
          <section
            v-if="hasContent(medicine.pregnancy)"
            class="section"
          >
            <div class="section-title">
              <span>ADDITIONAL LABEL INFORMATION</span>
              <h2>Pregnancy / Breastfeeding</h2>
            </div>

            <article class="detail-card">
              <div class="detail-heading">
                <div class="detail-icon blue">
                  <ion-icon :icon="peopleOutline" />
                </div>

                <h3>
                  Pregnancy and Breastfeeding Information
                </h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.pregnancy"
                :key="`pregnancy-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>
          </section>


          <!-- STORAGE -->
          <section
            v-if="
              hasContent(
                medicine.storageAndHandling
              )
            "
            class="section"
          >
            <div class="section-title">
              <span>PRODUCT INFORMATION</span>
              <h2>Storage & Handling</h2>
            </div>

            <article class="detail-card">
              <div class="detail-heading">
                <div class="detail-icon cyan">
                  <ion-icon :icon="archiveOutline" />
                </div>

                <h3>Storage and Handling</h3>
              </div>

              <div
                v-for="(
                  paragraph,
                  index
                ) in medicine.storageAndHandling"
                :key="`storage-${index}`"
                class="detail-text"
              >
                {{ paragraph }}
              </div>
            </article>
          </section>


          <!-- DATA SOURCE -->
          <section class="source-card">
            <div class="source-icon">
              <ion-icon :icon="serverOutline" />
            </div>

            <div>
              <span>DATA SOURCE</span>

              <h3>{{ medicine.source }}</h3>

              <p>
                Medicine identification is based on RxNorm data.
                Additional drug-label sections are displayed when
                corresponding information is available from openFDA.
              </p>
            </div>
          </section>


          <!-- FINAL SAFETY -->
          <section class="final-safety">
            <div class="final-safety-icon">
              <ion-icon :icon="shieldCheckmarkOutline" />
            </div>

            <div>
              <h3>Medicine Safety</h3>

              <p>
                Do not start, stop, change, combine, or adjust a medicine
                based only on information displayed by MediScan AI.
                Medicine labels can vary by product and manufacturer.
                Follow your prescription and speak with a qualified
                healthcare professional or pharmacist if you have
                questions about your medicine.
              </p>
            </div>
          </section>


          <!-- ACTIONS -->
          <div class="bottom-actions">
            <button
              class="secondary-button"
              @click="goBack"
            >
              <ion-icon :icon="arrowBackOutline" />
              Back to Medicine
            </button>

            <button
              class="primary-button"
              @click="searchAnother"
            >
              <ion-icon :icon="searchOutline" />
              Search Another Medicine
            </button>
          </div>

        </template>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonSpinner
} from '@ionic/vue';

import {
  alertCircleOutline,
  archiveOutline,
  arrowBackOutline,
  businessOutline,
  closeCircleOutline,
  documentTextOutline,
  flaskOutline,
  gitBranchOutline,
  gitCompareOutline,
  informationCircleOutline,
  layersOutline,
  medical,
  medicalOutline,
  peopleOutline,
  pricetagOutline,
  readerOutline,
  searchOutline,
  serverOutline,
  shieldCheckmarkOutline,
  warningOutline
} from 'ionicons/icons';

import {
  useRoute,
  useRouter
} from 'vue-router';

import {
  getMedicineDetails
} from '../services/medicineApi';

import type {
  MedicineDetails
} from '../services/medicineApi';


const route = useRoute();

const router = useRouter();


const loading = ref(true);

const errorMessage = ref('');

const medicine =
  ref<MedicineDetails | null>(null);


/* =========================================================
   LOAD MEDICINE
========================================================= */

const loadMedicine = async () => {
  loading.value = true;

  errorMessage.value = '';

  medicine.value = null;

  try {
    const rxcui =
      String(
        route.params.id || ''
      ).trim();

    if (!rxcui) {
      throw new Error(
        'No medicine identifier was provided.'
      );
    }

    medicine.value =
      await getMedicineDetails(
        rxcui
      );

  } catch (error) {
    console.error(
      'Unable to load medicine details:',
      error
    );

    errorMessage.value =
      error instanceof Error
        ? error.message
        : 'MediScan could not retrieve medicine information right now.';
  } finally {
    loading.value = false;
  }
};


/* =========================================================
   DISPLAY HELPERS
========================================================= */

const displayValue = (
  value:
    string |
    null |
    undefined
) => {
  if (
    !value ||
    !value.trim()
  ) {
    return 'Information not available';
  }

  return value;
};


const displayArray = (
  values: string[]
) => {
  if (
    !values ||
    values.length === 0
  ) {
    return 'Information not available';
  }

  return values.join(', ');
};


const hasContent = (
  values: string[]
) => {
  return (
    Array.isArray(values) &&
    values.length > 0
  );
};


/* =========================================================
   NAVIGATION
========================================================= */

const goBack = () => {
  router.push(
    '/tabs/medicine'
  );
};


const searchAnother = () => {
  router.push(
    '/tabs/medicine'
  );
};


/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(() => {
  loadMedicine();
});
</script>


<style scoped>
.details-content {
  --background: #f5faf8;
}

.page-container {
  width: min(100%, 1060px);
  margin: 0 auto;
  padding: 44px 28px 80px;
  color: #13231e;
}


/* HEADER */

.page-header {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 30px;
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
  box-shadow:
    0 7px 20px
    rgba(30, 70, 60, 0.05);
}

.header-copy {
  flex: 1;
}

.brand-label {
  color: #07966e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.header-copy h1 {
  margin: 4px 0 6px;
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.8px;
}

.header-copy p {
  margin: 0;
  color: #78847f;
  font-size: 14px;
}


/* STATE */

.state-card {
  min-height: 350px;
  padding: 50px 25px;
  border: 1px solid #e0eae7;
  border-radius: 25px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-icon,
.error-icon {
  width: 65px;
  height: 65px;
  border-radius: 20px;
  background: #e1f7f0;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-icon ion-spinner {
  width: 30px;
  height: 30px;
}

.error-icon ion-icon {
  font-size: 32px;
}

.state-card h2 {
  margin: 17px 0 7px;
  font-size: 21px;
}

.state-card > p {
  max-width: 500px;
  margin: 0;
  color: #798680;
  line-height: 1.6;
}

.state-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}


/* HERO */

.medicine-hero {
  display: flex;
  align-items: center;
  gap: 21px;
  padding: 27px;
  margin-bottom: 18px;
  background: white;
  border: 1px solid #dfeae6;
  border-radius: 25px;
  box-shadow:
    0 12px 30px
    rgba(30, 70, 60, 0.06);
}

.medicine-symbol {
  width: 82px;
  height: 82px;
  min-width: 82px;
  border-radius: 22px;
  background: #dcf7ee;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.medicine-symbol ion-icon {
  font-size: 39px;
}

.medicine-heading {
  flex: 1;
  min-width: 0;
}

.medicine-label {
  color: #07966e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
}

.medicine-heading h2 {
  margin: 6px 0 11px;
  font-size: 28px;
  line-height: 1.25;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.hero-tags span {
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff5f3;
  color: #61716b;
  font-size: 11px;
  font-weight: 700;
}

.hero-tags .source-tag {
  background: #dcf7ee;
  color: #078662;
}


/* NOTICE */

.notice-card {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 38px;
  padding: 18px 20px;
  border: 1px solid #bfe3d7;
  border-radius: 18px;
  background: #eaf8f4;
}

.notice-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 12px;
  background: white;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notice-icon ion-icon {
  font-size: 21px;
}

.notice-card strong {
  font-size: 14px;
}

.notice-card p {
  margin: 5px 0 0;
  color: #61766f;
  font-size: 12px;
  line-height: 1.6;
}


/* SECTION */

.section {
  margin-bottom: 40px;
}

.section-title {
  margin-bottom: 17px;
}

.section-title > span {
  color: #07966e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.section-title h2 {
  margin: 5px 0 5px;
  font-size: 26px;
}

.section-title p {
  margin: 0;
  color: #7d8a85;
  font-size: 13px;
  line-height: 1.5;
}


/* INFO GRID */

.info-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.info-card {
  min-height: 92px;
  padding: 17px 18px;
  border: 1px solid #e0e9e6;
  border-radius: 18px;
  background: white;
  display: flex;
  align-items: center;
  gap: 14px;
}

.info-icon {
  width: 45px;
  height: 45px;
  min-width: 45px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon ion-icon {
  font-size: 21px;
}

.info-card span {
  display: block;
  margin-bottom: 5px;
  color: #84918c;
  font-size: 11px;
}

.info-card strong {
  display: block;
  font-size: 14px;
  line-height: 1.45;
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

.orange {
  background: #fff0df;
  color: #db7829;
}

.cyan {
  background: #e2f8fa;
  color: #278d96;
}

.yellow {
  background: #fff5d7;
  color: #b47a08;
}


/* SIMPLE CARD */

.simple-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 21px;
  border: 1px solid #e0e9e6;
  border-radius: 19px;
  background: white;
}

.simple-card-icon {
  width: 51px;
  height: 51px;
  min-width: 51px;
  border-radius: 15px;
  background: #def7ef;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.simple-card-icon ion-icon {
  font-size: 25px;
}

.simple-card span {
  color: #83918c;
  font-size: 11px;
}

.simple-card h3 {
  margin: 5px 0 0;
  font-size: 16px;
}


/* DETAIL CONTENT */

.content-stack {
  display: grid;
  gap: 14px;
}

.detail-card {
  padding: 22px;
  border: 1px solid #e0e9e6;
  border-radius: 20px;
  background: white;
}

.detail-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.detail-heading h3 {
  margin: 0;
  font-size: 16px;
}

.detail-icon {
  width: 39px;
  height: 39px;
  min-width: 39px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-icon ion-icon {
  font-size: 19px;
}

.detail-icon.warning {
  background: #fff0cc;
  color: #aa7200;
}

.detail-icon.red {
  background: #ffe6e6;
  color: #c64a4a;
}

.detail-text {
  color: #465a53;
  font-size: 13px;
  line-height: 1.75;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.detail-text + .detail-text {
  margin-top: 13px;
}

.warning-card {
  border-color: #eed79f;
  background: #fffdf8;
}


/* UNAVAILABLE */

.unavailable-card {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  padding: 19px;
  border: 1px dashed #d6e2de;
  border-radius: 17px;
  background: #fafcfb;
}

.unavailable-card > ion-icon {
  min-width: 21px;
  margin-top: 1px;
  color: #81918b;
  font-size: 21px;
}

.unavailable-card strong {
  font-size: 13px;
}

.unavailable-card p {
  margin: 4px 0 0;
  color: #7b8984;
  font-size: 12px;
  line-height: 1.55;
}


/* SOURCE */

.source-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid #dce7e3;
  border-radius: 19px;
  background: white;
}

.source-icon {
  width: 47px;
  height: 47px;
  min-width: 47px;
  border-radius: 14px;
  background: #e8f4ff;
  color: #367fc0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.source-icon ion-icon {
  font-size: 22px;
}

.source-card span {
  color: #7f8d87;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.source-card h3 {
  margin: 4px 0 5px;
  font-size: 15px;
}

.source-card p {
  margin: 0;
  color: #75837e;
  font-size: 12px;
  line-height: 1.55;
}


/* FINAL SAFETY */

.final-safety {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 27px;
  padding: 20px;
  border: 1px solid #efd28d;
  border-radius: 19px;
  background: #fff8e8;
}

.final-safety-icon {
  width: 47px;
  height: 47px;
  min-width: 47px;
  border-radius: 14px;
  background: #ffe7a8;
  color: #a66f00;
  display: flex;
  align-items: center;
  justify-content: center;
}

.final-safety-icon ion-icon {
  font-size: 23px;
}

.final-safety h3 {
  margin: 1px 0 6px;
  font-size: 15px;
}

.final-safety p {
  margin: 0;
  color: #806a3a;
  font-size: 12px;
  line-height: 1.6;
}


/* BUTTONS */

.bottom-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
}

.primary-button,
.secondary-button {
  min-height: 55px;
  padding: 0 20px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.primary-button {
  border: none;
  background: #07966e;
  color: white;
  box-shadow:
    0 10px 24px
    rgba(7, 150, 110, 0.18);
}

.secondary-button {
  border: 1px solid #a9d9ca;
  background: white;
  color: #078662;
}


/* MOBILE */

@media (max-width: 700px) {
  .page-container {
    padding:
      calc(
        26px +
        env(safe-area-inset-top)
      )
      17px
      55px;
  }

  .header-copy h1 {
    font-size: 29px;
  }

  .medicine-hero {
    align-items: flex-start;
    padding: 21px;
  }

  .medicine-symbol {
    width: 64px;
    height: 64px;
    min-width: 64px;
  }

  .medicine-symbol ion-icon {
    font-size: 31px;
  }

  .medicine-heading h2 {
    font-size: 21px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .bottom-actions {
    grid-template-columns: 1fr;
  }

  .state-actions {
    width: 100%;
    flex-direction: column;
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

  .medicine-hero {
    flex-direction: column;
  }

  .notice-card,
  .final-safety {
    padding: 16px;
  }
}
</style>