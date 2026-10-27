<template>
  <ion-page>
    <ion-content :fullscreen="true" class="medicine-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="page-header">
          <div>
            <h1>Medicine</h1>
            <p>Search and identify medicine information</p>
          </div>

          <div class="brand">
            Medi<span>Scan</span> AI
          </div>
        </header>

        <!-- SEARCH -->
        <section class="search-section">
          <div class="search-box">
            <ion-icon :icon="searchOutline"></ion-icon>

            <input
              v-model="searchText"
              type="text"
              placeholder="Search medicine name..."
              autocomplete="off"
              @keyup.enter="searchMedicine"
            />

            <button
              v-if="searchText"
              class="clear-button"
              @click="clearSearch"
            >
              <ion-icon :icon="closeCircle"></ion-icon>
            </button>
          </div>

          <button
            class="search-button"
            :disabled="isSearching"
            @click="searchMedicine"
          >
            <ion-spinner
              v-if="isSearching"
              name="crescent"
            ></ion-spinner>

            <ion-icon
              v-else
              :icon="searchOutline"
            ></ion-icon>

            {{ isSearching ? 'Searching...' : 'Search' }}
          </button>
        </section>

        <!-- SEARCH RESULTS -->
        <section
          v-if="hasSearched"
          class="section search-results-section"
        >
          <div class="section-title title-row">
            <div>
              <h2>Search Results</h2>

              <p v-if="!isSearching && searchResults.length">
                Found {{ searchResults.length }}
                {{ searchResults.length === 1 ? 'result' : 'results' }}
                for "{{ lastSearch }}"
              </p>

              <p v-else-if="!isSearching">
                Results for "{{ lastSearch }}"
              </p>

              <p v-else>
                Searching medicine database...
              </p>
            </div>

            <button
              v-if="!isSearching"
              class="close-results"
              @click="closeResults"
            >
              Close
            </button>
          </div>

          <!-- LOADING -->
          <div
            v-if="isSearching"
            class="result-state"
          >
            <div class="loading-circle">
              <ion-spinner name="crescent"></ion-spinner>
            </div>

            <h3>Searching medicines...</h3>

            <p>
              MediScan is checking the medicine database for matching
              medicine names.
            </p>
          </div>

          <!-- RESULTS -->
          <div
            v-else-if="searchResults.length"
            class="search-results"
          >
            <button
              v-for="medicine in searchResults"
              :key="medicine.rxcui"
              class="result-card"
              @click="selectMedicine(medicine)"
            >
              <div class="result-icon">
                <ion-icon :icon="medical"></ion-icon>
              </div>

              <div class="result-info">
                <span class="result-label">
                  MEDICINE
                </span>

                <h3>{{ medicine.name }}</h3>

                <p v-if="medicine.synonym">
                  {{ medicine.synonym }}
                </p>

                <div class="result-meta">
                  <span>
                    RxCUI: {{ medicine.rxcui }}
                  </span>

                  <span v-if="medicine.tty">
                    {{ formatTermType(medicine.tty) }}
                  </span>
                </div>
              </div>

              <div class="view-result">
                View Details
                <ion-icon :icon="chevronForward"></ion-icon>
              </div>
            </button>
          </div>

          <!-- NO RESULTS -->
          <div
            v-else
            class="result-state"
          >
            <div class="empty-search-icon">
              <ion-icon :icon="searchOutline"></ion-icon>
            </div>

            <h3>No medicine found</h3>

            <p>
              We couldn't find a medicine matching
              "{{ lastSearch }}". Check the spelling or try a generic
              medicine name.
            </p>

            <button
              class="try-again-button"
              @click="focusSearch"
            >
              Try Another Search
            </button>
          </div>
        </section>

        <!-- IDENTIFY MEDICINE -->
        <section class="identify-card">
          <div class="identify-icon">
            <ion-icon :icon="cameraOutline"></ion-icon>
          </div>

          <div class="identify-info">
            <span class="feature-label">
              AI IDENTIFICATION
            </span>

            <h2>Don't know the medicine name?</h2>

            <p>
              Take a photo of the medicine or upload an image to help
              identify it.
            </p>
          </div>

          <button
            class="scan-button"
            @click="identifyMedicine"
          >
            <ion-icon :icon="camera"></ion-icon>
            Identify Medicine
          </button>
        </section>

        <!-- QUICK CATEGORIES -->
        <section class="section">
          <div class="section-title">
            <div>
              <h2>Browse Medicines</h2>
              <p>Explore common medicine categories</p>
            </div>
          </div>

          <div class="category-grid">

            <button
              class="category-card"
              @click="selectCategory('Pain Relief')"
            >
              <div class="category-icon green">
                <ion-icon :icon="medicalOutline"></ion-icon>
              </div>

              <h3>Pain Relief</h3>
              <p>Common pain relief medicines</p>
            </button>

            <button
              class="category-card"
              @click="selectCategory('Vitamins')"
            >
              <div class="category-icon orange">
                <ion-icon :icon="nutritionOutline"></ion-icon>
              </div>

              <h3>Vitamins</h3>
              <p>Vitamins and supplements</p>
            </button>

            <button
              class="category-card"
              @click="selectCategory('Allergy')"
            >
              <div class="category-icon purple">
                <ion-icon :icon="leafOutline"></ion-icon>
              </div>

              <h3>Allergy</h3>
              <p>Common allergy medicines</p>
            </button>

            <button
              class="category-card"
              @click="selectCategory('Others')"
            >
              <div class="category-icon blue">
                <ion-icon :icon="gridOutline"></ion-icon>
              </div>

              <h3>Others</h3>
              <p>Search other medicine categories</p>
            </button>

          </div>
        </section>

        <!-- RECENT SEARCHES -->
        <section class="section">
          <div class="section-title title-row">
            <div>
              <h2>Recent Searches</h2>
              <p>Your recently viewed medicines</p>
            </div>

            <button
              v-if="recentMedicines.length"
              class="clear-history"
              @click="clearHistory"
            >
              Clear
            </button>
          </div>

          <div class="medicine-list">

            <button
              v-for="medicine in recentMedicines"
              :key="medicine.rxcui"
              class="medicine-item"
              @click="openRecentMedicine(medicine)"
            >
              <div
                class="pill-icon"
                :class="medicine.color"
              >
                <ion-icon :icon="medical"></ion-icon>
              </div>

              <div class="medicine-info">
                <h3>{{ medicine.name }}</h3>

                <p>
                  {{
                    medicine.type ||
                    'Medicine information'
                  }}
                </p>
              </div>

              <div class="view-info">
                View Details
                <ion-icon :icon="chevronForward"></ion-icon>
              </div>
            </button>

            <div
              v-if="recentMedicines.length === 0"
              class="empty-state"
            >
              <ion-icon :icon="searchOutline"></ion-icon>

              <h3>No recent searches</h3>

              <p>
                Medicines you view will appear here.
              </p>
            </div>

          </div>
        </section>

        <!-- SAFETY NOTE -->
        <div class="safety-note">
          <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>

          <div>
            <strong>Medicine Safety</strong>

            <p>
              Medicine information shown in MediScan AI is for
              informational and educational purposes only. It does not
              replace professional medical advice, diagnosis or treatment.
              Always follow your prescription and consult a qualified
              healthcare professional or pharmacist when needed.
            </p>
          </div>
        </div>

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
  IonSpinner,
  alertController
} from '@ionic/vue';

import {
  searchOutline,
  closeCircle,
  cameraOutline,
  camera,
  medicalOutline,
  medical,
  nutritionOutline,
  leafOutline,
  gridOutline,
  chevronForward,
  shieldCheckmarkOutline
} from 'ionicons/icons';

import { useRouter } from 'vue-router';

import {
  getCategorySearchTerm,
  searchMedicines
} from '../services/medicineApi';

import type {
  MedicineSearchResult
} from '../services/medicineApi';

const router = useRouter();

const searchText = ref('');

const lastSearch = ref('');

const isSearching = ref(false);

const hasSearched = ref(false);

const searchResults =
  ref<MedicineSearchResult[]>([]);


interface RecentMedicine {
  rxcui: string;
  name: string;
  type: string;
  color: string;
}


const recentMedicines =
  ref<RecentMedicine[]>([]);


const STORAGE_KEY =
  'mediscan_recent_medicines';


/* =========================================================
   ALERT
========================================================= */

const showMessage = async (
  header: string,
  message: string
) => {
  const alert =
    await alertController.create({
      header,
      message,
      buttons: ['OK']
    });

  await alert.present();
};


/* =========================================================
   SEARCH MEDICINE
========================================================= */

const searchMedicine = async () => {
  const query =
    searchText.value.trim();

  if (!query) {
    await showMessage(
      'Search Medicine',
      'Enter a medicine name first.'
    );

    return;
  }

  if (isSearching.value) {
    return;
  }

  lastSearch.value = query;

  hasSearched.value = true;

  isSearching.value = true;

  searchResults.value = [];

  try {
    const results =
      await searchMedicines(
        query
      );

    searchResults.value =
      results;

  } catch (error) {
    console.error(
      'Medicine search error:',
      error
    );

    await showMessage(
      'Search Unavailable',
      'MediScan could not search the medicine database right now. Check your internet connection and try again.'
    );

    hasSearched.value = false;

  } finally {
    isSearching.value = false;
  }
};


/* =========================================================
   CLEAR SEARCH
========================================================= */

const clearSearch = () => {
  searchText.value = '';
};


const closeResults = () => {
  searchResults.value = [];

  hasSearched.value = false;

  lastSearch.value = '';
};


const focusSearch = () => {
  searchText.value = '';

  hasSearched.value = false;

  searchResults.value = [];

  setTimeout(() => {
    const input =
      document.querySelector<HTMLInputElement>(
        '.search-box input'
      );

    input?.focus();
  }, 100);
};


/* =========================================================
   SELECT MEDICINE
========================================================= */

const selectMedicine = (
  medicine: MedicineSearchResult
) => {
  addRecentMedicine(
    medicine
  );

  router.push(
    `/medicine/${medicine.rxcui}`
  );
};


/* =========================================================
   RECENT MEDICINES
========================================================= */

const addRecentMedicine = (
  medicine: MedicineSearchResult
) => {
  const existing =
    recentMedicines.value.filter(
      item =>
        item.rxcui !==
        medicine.rxcui
    );

  const colors = [
    'green-pill',
    'blue-pill',
    'orange-pill'
  ];

  const recent:
    RecentMedicine = {
      rxcui:
        medicine.rxcui,

      name:
        medicine.name,

      type:
        formatTermType(
          medicine.tty
        ),

      color:
        colors[
          existing.length %
          colors.length
        ]
    };

  recentMedicines.value = [
    recent,
    ...existing
  ].slice(0, 5);

  saveRecentMedicines();
};


const saveRecentMedicines = () => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        recentMedicines.value
      )
    );
  } catch (error) {
    console.warn(
      'Unable to save recent medicines:',
      error
    );
  }
};


const loadRecentMedicines = () => {
  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      recentMedicines.value = [];

      return;
    }

    const parsed =
      JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      recentMedicines.value = [];

      return;
    }

    recentMedicines.value =
      parsed.slice(0, 5);

  } catch (error) {
    console.warn(
      'Unable to load recent medicines:',
      error
    );

    recentMedicines.value = [];
  }
};


const clearHistory = () => {
  recentMedicines.value = [];

  localStorage.removeItem(
    STORAGE_KEY
  );
};


const openRecentMedicine = (
  medicine: RecentMedicine
) => {
  router.push(
    `/medicine/${medicine.rxcui}`
  );
};


/* =========================================================
   CATEGORY
========================================================= */

const selectCategory = async (
  category: string
) => {
  if (
    category === 'Others'
  ) {
    searchText.value = '';

    hasSearched.value = false;

    searchResults.value = [];

    setTimeout(() => {
      const input =
        document.querySelector<HTMLInputElement>(
          '.search-box input'
        );

      input?.focus();
    }, 100);

    return;
  }

  const searchTerm =
    getCategorySearchTerm(
      category
    );

  if (!searchTerm) {
    return;
  }

  searchText.value =
    searchTerm;

  await searchMedicine();
};


/* =========================================================
   IDENTIFY MEDICINE
========================================================= */

const identifyMedicine = () => {
  router.push('/identify-medicine');
};


/* =========================================================
   TERM TYPE
========================================================= */

const formatTermType = (
  tty: string
) => {
  switch (tty) {
    case 'IN':
      return 'Ingredient';

    case 'PIN':
      return 'Precise Ingredient';

    case 'MIN':
      return 'Multiple Ingredients';

    case 'SCD':
      return 'Clinical Drug';

    case 'SBD':
      return 'Branded Drug';

    case 'SCDF':
      return 'Clinical Drug Form';

    case 'SBDF':
      return 'Branded Drug Form';

    case 'SCDC':
      return 'Clinical Drug Component';

    case 'SBDC':
      return 'Branded Drug Component';

    case 'BN':
      return 'Brand Name';

    case 'DF':
      return 'Dose Form';

    default:
      return tty
        ? `Medicine • ${tty}`
        : 'Medicine';
  }
};


/* =========================================================
   INITIAL LOAD
========================================================= */

onMounted(async () => {
  loadRecentMedicines();

  /*
   * Check if the user came from
   * AI Medicine Identification.
   *
   * MedicineIdentificationResultPage stores the
   * generic medicine name here before navigating
   * to the Medicine page.
   */
  const aiSearchTerm =
    sessionStorage.getItem(
      'mediscan_medicine_search_term'
    );

  if (!aiSearchTerm) {
    return;
  }

  /*
   * Remove it immediately so refreshing or
   * returning to this page will not repeatedly
   * trigger the same automatic search.
   */
  sessionStorage.removeItem(
    'mediscan_medicine_search_term'
  );

  const cleanSearchTerm =
    aiSearchTerm.trim();

  if (!cleanSearchTerm) {
    return;
  }

  /*
   * Put the AI-identified generic name
   * directly into the search box.
   */
  searchText.value =
    cleanSearchTerm;

  /*
   * Automatically search RxNorm using
   * the existing searchMedicine() function.
   */
  await searchMedicine();
});
</script>

<style scoped>
.medicine-content {
  --background: #f6faf9;
}

.page-container {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 40px 28px 120px;
  color: #13231e;
}

/* HEADER */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 34px;
  font-weight: 800;
}

.page-header p {
  margin: 0;
  color: #78847f;
  font-size: 15px;
}

.brand {
  font-size: 23px;
  font-weight: 800;
}

.brand span {
  color: #07966e;
}

/* SEARCH */

.search-section {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.search-box {
  flex: 1;
  height: 62px;
  background: white;
  border: 1px solid #dfe8e5;
  border-radius: 18px;
  display: flex;
  align-items: center;
  padding: 0 19px;
  gap: 12px;
  transition: 0.2s;
}

.search-box:focus-within {
  border-color: #07966e;
  box-shadow:
    0 0 0 3px
    rgba(7, 150, 110, 0.08);
}

.search-box > ion-icon {
  font-size: 24px;
  color: #84938e;
}

.search-box input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #13231e;
}

.search-box input::placeholder {
  color: #a0aaa7;
}

.clear-button {
  border: none;
  background: transparent;
  color: #9aa6a2;
  cursor: pointer;
}

.clear-button ion-icon {
  font-size: 21px;
}

.search-button {
  min-width: 130px;
  border: none;
  border-radius: 18px;
  background: #07966e;
  color: white;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.search-button:hover {
  background: #06835f;
}

.search-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.search-button ion-spinner {
  width: 19px;
  height: 19px;
  color: white;
}

/* SEARCH RESULTS */

.search-results-section {
  animation: resultAppear 0.25s ease;
}

@keyframes resultAppear {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-results {
  border: none;
  background: transparent;
  color: #07966e;
  font-weight: 700;
  cursor: pointer;
}

.search-results {
  display: grid;
  gap: 11px;
}

.result-card {
  width: 100%;
  border: 1px solid #e0eae7;
  border-radius: 20px;
  background: white;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: left;
  color: #14241f;
  cursor: pointer;
  transition: 0.2s;
  box-shadow:
    0 5px 18px
    rgba(30, 70, 60, 0.04);
}

.result-card:hover {
  transform: translateY(-2px);
  border-color: #b9dfd3;
  box-shadow:
    0 10px 25px
    rgba(30, 70, 60, 0.08);
}

.result-icon {
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 16px;
  background: #def7ef;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon ion-icon {
  font-size: 27px;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-label {
  color: #07966e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.result-info h3 {
  margin: 4px 0 5px;
  font-size: 16px;
  line-height: 1.35;
}

.result-info p {
  margin: 0 0 7px;
  color: #76857f;
  font-size: 12px;
  line-height: 1.4;
}

.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.result-meta span {
  padding: 4px 8px;
  border-radius: 999px;
  background: #f0f6f4;
  color: #6b7b75;
  font-size: 10px;
  font-weight: 600;
}

.view-result {
  color: #07966e;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.result-state {
  min-height: 230px;
  background: white;
  border: 1px solid #e0eae7;
  border-radius: 22px;
  padding: 45px 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-circle,
.empty-search-icon {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  background: #e5f7f1;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-circle ion-spinner {
  width: 28px;
  height: 28px;
}

.empty-search-icon ion-icon {
  font-size: 29px;
}

.result-state h3 {
  margin: 15px 0 6px;
  font-size: 18px;
}

.result-state p {
  max-width: 450px;
  margin: 0;
  color: #7a8983;
  font-size: 13px;
  line-height: 1.6;
}

.try-again-button {
  margin-top: 17px;
  border: none;
  border-radius: 12px;
  padding: 11px 16px;
  background: #07966e;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

/* IDENTIFY */

.identify-card {
  background:
    linear-gradient(
      135deg,
      #dff8f1,
      #c3f1e4
    );
  border-radius: 26px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 38px;
}

.identify-icon {
  width: 72px;
  height: 72px;
  min-width: 72px;
  border-radius: 22px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #07966e;
}

.identify-icon ion-icon {
  font-size: 36px;
}

.identify-info {
  flex: 1;
}

.feature-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #078b67;
}

.identify-info h2 {
  margin: 6px 0 7px;
  font-size: 21px;
}

.identify-info p {
  margin: 0;
  color: #60716b;
  line-height: 1.5;
  font-size: 14px;
}

.scan-button {
  border: none;
  border-radius: 15px;
  padding: 14px 18px;
  background: #07966e;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  white-space: nowrap;
}

/* SECTIONS */

.section {
  margin-bottom: 38px;
}

.section-title {
  margin-bottom: 16px;
}

.section-title h2 {
  margin: 0 0 5px;
  font-size: 22px;
}

.section-title p {
  margin: 0;
  color: #83908c;
  font-size: 13px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.clear-history {
  border: none;
  background: transparent;
  color: #07966e;
  font-weight: 700;
  cursor: pointer;
}

/* CATEGORIES */

.category-grid {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 15px;
}

.category-card {
  border: none;
  background: white;
  border-radius: 21px;
  padding: 22px 18px;
  text-align: left;
  color: #14241f;
  box-shadow:
    0 5px 18px
    rgba(30, 70, 60, 0.05);
  cursor: pointer;
  transition: 0.2s;
}

.category-card:hover {
  transform: translateY(-3px);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 17px;
}

.category-icon ion-icon {
  font-size: 25px;
}

.green {
  background: #def7ef;
  color: #07966e;
}

.orange {
  background: #fff0df;
  color: #e27b27;
}

.purple {
  background: #ededff;
  color: #6963c8;
}

.blue {
  background: #e6f3ff;
  color: #3789cd;
}

.category-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.category-card p {
  margin: 0;
  color: #84908c;
  font-size: 12px;
  line-height: 1.4;
}

/* RECENT MEDICINES */

.medicine-list {
  background: white;
  border-radius: 24px;
  padding: 0 23px;
  box-shadow:
    0 5px 20px
    rgba(30, 70, 60, 0.05);
}

.medicine-item {
  width: 100%;
  min-height: 92px;
  border: none;
  border-bottom:
    1px solid #edf1ef;
  background: transparent;
  color: #14241f;
  display: flex;
  align-items: center;
  gap: 17px;
  text-align: left;
  cursor: pointer;
}

.medicine-item:last-child {
  border-bottom: none;
}

.pill-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-icon ion-icon {
  font-size: 26px;
}

.green-pill {
  background: #def7ef;
  color: #07966e;
}

.blue-pill {
  background: #e5f2ff;
  color: #3487cc;
}

.orange-pill {
  background: #fff0df;
  color: #e07825;
}

.medicine-info {
  flex: 1;
}

.medicine-info h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.medicine-info p {
  margin: 0;
  color: #84908c;
  font-size: 13px;
}

.view-info {
  color: #07966e;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

.empty-state {
  padding: 45px 20px;
  text-align: center;
  color: #85918d;
}

.empty-state > ion-icon {
  font-size: 40px;
  color: #9eaaa6;
}

.empty-state h3 {
  color: #273a33;
  margin: 10px 0 5px;
}

.empty-state p {
  margin: 0;
  font-size: 13px;
}

/* SAFETY */

.safety-note {
  background: #e7f8f3;
  border-radius: 18px;
  padding: 18px 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.safety-note > ion-icon {
  font-size: 27px;
  min-width: 27px;
  color: #07966e;
}

.safety-note strong {
  font-size: 14px;
}

.safety-note p {
  margin: 5px 0 0;
  color: #65756f;
  line-height: 1.5;
  font-size: 12px;
}

/* MOBILE */

@media (max-width: 700px) {
  .page-container {
    padding:
      calc(
        25px +
        env(safe-area-inset-top)
      )
      18px
      115px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .brand {
    display: none;
  }

  .search-section {
    flex-direction: column;
  }

  .search-button {
    height: 55px;
    width: 100%;
  }

  .identify-card {
    flex-wrap: wrap;
    padding: 22px;
  }

  .identify-info {
    min-width:
      calc(100% - 100px);
  }

  .scan-button {
    width: 100%;
    justify-content: center;
  }

  .category-grid {
    grid-template-columns:
      1fr 1fr;
  }

  .view-info,
  .view-result {
    font-size: 0;
  }

  .view-info ion-icon,
  .view-result ion-icon {
    font-size: 21px;
  }

  .result-card {
    padding: 16px;
  }
}

@media (max-width: 380px) {
  .category-grid {
    grid-template-columns: 1fr;
  }
}


/* ============================================================
   MEDISCAN AI — CONSISTENT MAIN-TAB TYPOGRAPHY
   Presentation only: no changes to layout, routes, or functions.
   Keep special brand, feature-label and decorative styles intact.
   ============================================================ */
.medicine-content {
  font-family: 'Poppins', sans-serif;
}
.medicine-content .page-container,
.medicine-content button,
.medicine-content input {
  font-family: 'Poppins', sans-serif;
}

/* Page heading and supporting copy */
.page-header h1 { font-size: 30px; font-weight: 800; line-height: 1.2; }
.page-header p { font-size: 14px; line-height: 1.5; }

/* Shared section hierarchy */
.section-title h2 { font-size: 21px; font-weight: 700; line-height: 1.3; }
.section-title p { font-size: 14px; line-height: 1.5; }

/* Standard card typography */
.result-info h3,
.category-card h3,
.medicine-info h3 { font-size: 17px; font-weight: 600; line-height: 1.4; }
.result-info p,
.category-card p,
.medicine-info p { font-size: 14px; line-height: 1.5; }
.result-state h3,
.empty-state h3 { font-size: 17px; font-weight: 600; }
.result-state p,
.empty-state p { font-size: 14px; line-height: 1.55; }

/* Actions and fields */
.search-box input { font-size: 16px; }
.search-button,
.scan-button,
.try-again-button { font-size: 15px; font-weight: 600; }
.close-results,
.clear-history,
.view-result,
.view-info { font-size: 13px; font-weight: 600; }

/* AI card retains its intentional featured heading */
.identify-info p { font-size: 14px; line-height: 1.55; }
.safety-note strong { font-size: 15px; font-weight: 600; }
.safety-note p { font-size: 13px; line-height: 1.55; }

/* Keep metadata and decorative eyebrow labels visually distinct */
.result-meta span { font-size: 12px; }
.result-info .result-label,
.identify-info .feature-label { font-size: 11px; }

@media (max-width: 700px) {
  .page-header h1 { font-size: 30px; }
  .section-title h2 { font-size: 21px; }
  .page-header p,
  .section-title p { font-size: 14px; }
  .category-card { min-width: 0; }
  .category-card h3,
  .medicine-info h3,
  .result-info h3 { overflow-wrap: anywhere; }
}

@media (max-width: 380px) {
  /* Keep the existing one-column category layout on narrow screens. */
  .page-header h1 { font-size: 28px; }
}
</style>
<!-- Comfortable mobile search field sizing; search behavior unchanged. -->
<style scoped>
@media (max-width: 700px) {
  .search-box { min-height: 52px; height: 52px; padding-inline: 17px; gap: 13px; border-radius: 15px; }
  .search-box > ion-icon { font-size: 26px; min-width: 26px; flex-shrink: 0; }
  .search-box input { min-width: 0; font-size: 16px; }
}
</style>
