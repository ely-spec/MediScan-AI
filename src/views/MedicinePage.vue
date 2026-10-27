<template>
  <ion-page>
    <ion-content :fullscreen="true" class="medicine-content">
      <div class="page-container">
        <!-- HEADER -->
        <header class="page-header">
          <div class="header-decoration" aria-hidden="true">✦</div>
          <div>
            <h1>Medicine</h1>
            <p>Search and identify medicine information</p>
          </div>

          <div class="brand">Medi<span>Scan</span> AI</div>
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

            <button v-if="searchText" class="clear-button" @click="clearSearch">
              <ion-icon :icon="closeCircle"></ion-icon>
            </button>
          </div>

          <button
            class="search-button"
            :disabled="isSearching"
            @click="searchMedicine"
          >
            <ion-spinner v-if="isSearching" name="crescent"></ion-spinner>

            <ion-icon v-else :icon="searchOutline"></ion-icon>

            {{ isSearching ? "Searching..." : "Search" }}
          </button>
        </section>

        <!-- SEARCH RESULTS -->
        <section v-if="hasSearched" class="section search-results-section">
          <div class="section-title title-row">
            <div>
              <h2>Search Results</h2>

              <p v-if="!isSearching && searchResults.length">
                Found {{ searchResults.length }}
                {{ searchResults.length === 1 ? "result" : "results" }}
                for "{{ lastSearch }}"
              </p>

              <p v-else-if="!isSearching">Results for "{{ lastSearch }}"</p>

              <p v-else>Searching medicine database...</p>
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
          <div v-if="isSearching" class="result-state">
            <div class="loading-circle">
              <ion-spinner name="crescent"></ion-spinner>
            </div>

            <h3>Searching medicines...</h3>

            <p>
              MediScan is checking the medicine database for matching medicine
              names.
            </p>
          </div>

          <!-- RESULTS -->
          <div v-else-if="searchResults.length" class="search-results">
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
                <span class="result-label"> MEDICINE </span>

                <h3>{{ medicine.name }}</h3>

                <p v-if="medicine.synonym">
                  {{ medicine.synonym }}
                </p>

                <div class="result-meta">
                  <span> RxCUI: {{ medicine.rxcui }} </span>

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
          <div v-else class="result-state">
            <div class="empty-search-icon">
              <ion-icon :icon="searchOutline"></ion-icon>
            </div>

            <h3>No medicine found</h3>

            <p>
              We couldn't find a medicine matching "{{ lastSearch }}". Check the
              spelling or try a generic medicine name.
            </p>

            <button class="try-again-button" @click="focusSearch">
              Try Another Search
            </button>
          </div>
        </section>

        <!-- IDENTIFY MEDICINE -->
        <section class="identify-card">
          <div class="identify-decoration" aria-hidden="true">
            <span class="bottle">✚</span><span class="capsule">◒</span>
          </div>
          <div class="identify-icon">
            <ion-icon :icon="cameraOutline"></ion-icon>
          </div>

          <div class="identify-info">
            <span class="feature-label"> AI IDENTIFICATION </span>

            <h2>Don't know the medicine name?</h2>

            <p>
              Take a photo of the medicine or upload an image to help identify
              it.
            </p>
          </div>

          <button class="scan-button" @click="identifyMedicine">
            <ion-icon :icon="camera"></ion-icon>
            Identify Medicine
          </button>
        </section>

        <!-- QUICK CATEGORIES -->
        <section class="section browse-section">
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

            <button class="category-card" @click="selectCategory('Vitamins')">
              <div class="category-icon orange">
                <ion-icon :icon="nutritionOutline"></ion-icon>
              </div>

              <h3>Vitamins</h3>
              <p>Vitamins and supplements</p>
            </button>

            <button class="category-card" @click="selectCategory('Allergy')">
              <div class="category-icon purple">
                <ion-icon :icon="leafOutline"></ion-icon>
              </div>

              <h3>Allergy</h3>
              <p>Common allergy medicines</p>
            </button>

            <button class="category-card" @click="selectCategory('Others')">
              <div class="category-icon blue">
                <ion-icon :icon="gridOutline"></ion-icon>
              </div>

              <h3>Others</h3>
              <p>Search other medicine categories</p>
            </button>
          </div>
        </section>

        <!-- RECENT SEARCHES -->
        <section class="section recent-section">
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
              <div class="pill-icon" :class="medicine.color">
                <ion-icon :icon="medical"></ion-icon>
              </div>

              <div class="medicine-info">
                <h3>{{ medicine.name }}</h3>

                <p>
                  {{ medicine.type || "Medicine information" }}
                </p>
              </div>

              <div class="view-info">
                View Details
                <ion-icon :icon="chevronForward"></ion-icon>
              </div>
            </button>

            <div v-if="recentMedicines.length === 0" class="empty-state">
              <ion-icon :icon="searchOutline"></ion-icon>

              <h3>No recent searches</h3>

              <p>Medicines you view will appear here.</p>
            </div>
          </div>
        </section>

        <!-- SAFETY NOTE -->
        <div class="safety-note">
          <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>

          <div>
            <strong>Medicine Safety</strong>

            <p>
              Medicine information shown in MediScan AI is for informational and
              educational purposes only. It does not replace professional
              medical advice, diagnosis or treatment. Always follow your
              prescription and consult a qualified healthcare professional or
              pharmacist when needed.
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  IonPage,
  IonContent,
  IonIcon,
  IonSpinner,
  alertController,
} from "@ionic/vue";

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
  shieldCheckmarkOutline,
} from "ionicons/icons";

import { useRouter } from "vue-router";

import {
  getCategorySearchTerm,
  searchMedicines,
} from "../services/medicineApi";

import type { MedicineSearchResult } from "../services/medicineApi";

const router = useRouter();

const searchText = ref("");

const lastSearch = ref("");

const isSearching = ref(false);

const hasSearched = ref(false);

const searchResults = ref<MedicineSearchResult[]>([]);

interface RecentMedicine {
  rxcui: string;
  name: string;
  type: string;
  color: string;
}

const recentMedicines = ref<RecentMedicine[]>([]);

const STORAGE_KEY = "mediscan_recent_medicines";

/* =========================================================
   ALERT
========================================================= */

const showMessage = async (header: string, message: string) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: ["OK"],
  });

  await alert.present();
};

/* =========================================================
   SEARCH MEDICINE
========================================================= */

const searchMedicine = async () => {
  const query = searchText.value.trim();

  if (!query) {
    await showMessage("Search Medicine", "Enter a medicine name first.");

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
    const results = await searchMedicines(query);

    searchResults.value = results;
  } catch (error) {
    console.error("Medicine search error:", error);

    await showMessage(
      "Search Unavailable",
      "MediScan could not search the medicine database right now. Check your internet connection and try again.",
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
  searchText.value = "";
};

const closeResults = () => {
  searchResults.value = [];

  hasSearched.value = false;

  lastSearch.value = "";
};

const focusSearch = () => {
  searchText.value = "";

  hasSearched.value = false;

  searchResults.value = [];

  setTimeout(() => {
    const input = document.querySelector<HTMLInputElement>(".search-box input");

    input?.focus();
  }, 100);
};

/* =========================================================
   SELECT MEDICINE
========================================================= */

const selectMedicine = (medicine: MedicineSearchResult) => {
  addRecentMedicine(medicine);

  router.push(`/medicine/${medicine.rxcui}`);
};

/* =========================================================
   RECENT MEDICINES
========================================================= */

const addRecentMedicine = (medicine: MedicineSearchResult) => {
  const existing = recentMedicines.value.filter(
    (item) => item.rxcui !== medicine.rxcui,
  );

  const colors = ["green-pill", "blue-pill", "orange-pill"];

  const recent: RecentMedicine = {
    rxcui: medicine.rxcui,

    name: medicine.name,

    type: formatTermType(medicine.tty),

    color: colors[existing.length % colors.length],
  };

  recentMedicines.value = [recent, ...existing].slice(0, 5);

  saveRecentMedicines();
};

const saveRecentMedicines = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMedicines.value));
  } catch (error) {
    console.warn("Unable to save recent medicines:", error);
  }
};

const loadRecentMedicines = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      recentMedicines.value = [];

      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      recentMedicines.value = [];

      return;
    }

    recentMedicines.value = parsed.slice(0, 5);
  } catch (error) {
    console.warn("Unable to load recent medicines:", error);

    recentMedicines.value = [];
  }
};

const clearHistory = () => {
  recentMedicines.value = [];

  localStorage.removeItem(STORAGE_KEY);
};

const openRecentMedicine = (medicine: RecentMedicine) => {
  router.push(`/medicine/${medicine.rxcui}`);
};

/* =========================================================
   CATEGORY
========================================================= */

const selectCategory = async (category: string) => {
  if (category === "Others") {
    searchText.value = "";

    hasSearched.value = false;

    searchResults.value = [];

    setTimeout(() => {
      const input =
        document.querySelector<HTMLInputElement>(".search-box input");

      input?.focus();
    }, 100);

    return;
  }

  const searchTerm = getCategorySearchTerm(category);

  if (!searchTerm) {
    return;
  }

  searchText.value = searchTerm;

  await searchMedicine();
};

/* =========================================================
   IDENTIFY MEDICINE
========================================================= */

const identifyMedicine = () => {
  router.push("/identify-medicine");
};

/* =========================================================
   TERM TYPE
========================================================= */

const formatTermType = (tty: string) => {
  switch (tty) {
    case "IN":
      return "Ingredient";

    case "PIN":
      return "Precise Ingredient";

    case "MIN":
      return "Multiple Ingredients";

    case "SCD":
      return "Clinical Drug";

    case "SBD":
      return "Branded Drug";

    case "SCDF":
      return "Clinical Drug Form";

    case "SBDF":
      return "Branded Drug Form";

    case "SCDC":
      return "Clinical Drug Component";

    case "SBDC":
      return "Branded Drug Component";

    case "BN":
      return "Brand Name";

    case "DF":
      return "Dose Form";

    default:
      return tty ? `Medicine • ${tty}` : "Medicine";
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
  const aiSearchTerm = sessionStorage.getItem("mediscan_medicine_search_term");

  if (!aiSearchTerm) {
    return;
  }

  /*
   * Remove it immediately so refreshing or
   * returning to this page will not repeatedly
   * trigger the same automatic search.
   */
  sessionStorage.removeItem("mediscan_medicine_search_term");

  const cleanSearchTerm = aiSearchTerm.trim();

  if (!cleanSearchTerm) {
    return;
  }

  /*
   * Put the AI-identified generic name
   * directly into the search box.
   */
  searchText.value = cleanSearchTerm;

  /*
   * Automatically search RxNorm using
   * the existing searchMedicine() function.
   */
  await searchMedicine();
});
</script>

<style scoped>
/* MediScan AI — Medicine tab | clean, single-source responsive styles */
.medicine-content {
  --background: #eaf9f4;
  font-family: "Poppins", sans-serif;
}
.page-container {
  position: relative;
  width: min(100%, 816px);
  min-height: 100%;
  margin: 0 auto;
  padding: calc(36px + env(safe-area-inset-top)) 24px 130px;
  color: #103c32;
  background-color: #edfbf6;
  background-image: url("/mediscan/medicine-bg-top.webp");
  background-position: center top;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
button,
input {
  font: inherit;
}
button {
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
button:focus-visible {
  outline: 3px solid #1dbb94;
  outline-offset: 3px;
}
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  position: relative;
  margin: 0 0 26px;
}
.page-header h1 {
  font-size: clamp(30px, 4.5vw, 38px);
  font-weight: 800;
  letter-spacing: -1.2px;
  line-height: 1.16;
  margin: 0 0 8px;
  color: #092d27;
}
.page-header p {
  margin: 0;
  color: #4f7770;
  font-size: 14px;
  line-height: 1.5;
}
.brand {
  padding-top: 6px;
  white-space: nowrap;
  font-size: 20px;
  font-weight: 800;
  color: #0b322a;
}
.brand span {
  color: #00a781;
}
.header-decoration {
  display: none;
}
.search-section {
  display: flex;
  align-items: stretch;
  gap: 9px;
  margin-bottom: 23px;
}
.search-box {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  background: #fff url("/mediscan/medicine-search-bg.webp") center / 100% 100%
    no-repeat;
  box-shadow: 0 8px 24px rgba(27, 111, 88, 0.07);
}
.search-box:focus-within {
  outline: 2px solid rgba(0, 170, 130, 0.28);
}
.search-box > ion-icon {
  flex-shrink: 0;
  font-size: 25px;
  color: #829995;
}
.search-box input {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  outline: none;
  border: 0;
  background: transparent;
  color: #153e35;
  font-size: 15px;
}
.search-box input::placeholder {
  color: #879e99;
}
.clear-button {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: #93a5a0;
  padding: 3px;
}
.clear-button ion-icon {
  font-size: 22px;
}
.search-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  min-width: 122px;
  min-height: 64px;
  padding: 0 15px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 22px;
  background: linear-gradient(135deg, #00a67d, #00bc94);
  color: white;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 9px 19px rgba(0, 151, 111, 0.17);
}
.search-button:disabled {
  opacity: 0.75;
  cursor: wait;
}
.search-button ion-icon {
  font-size: 18px;
}
.search-button ion-spinner {
  width: 18px;
  height: 18px;
}
/* Identification art is a complete image, never cover-cropped. */
.identify-card {
  position: relative;
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 17px;
  row-gap: 13px;
  align-content: center;
  min-height: 220px;
  padding: 26px 32px;
  margin-bottom: 33px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 27px;
  background: #d8f7ec url("/mediscan/medicine-ai-banner.webp") center / 100%
    100% no-repeat;
  box-shadow: 0 14px 26px rgba(17, 105, 81, 0.08);
  overflow: hidden;
}
.identify-decoration {
  display: none;
}
.identify-icon {
  grid-column: 1;
  grid-row: 1 / 3;
  align-self: start;
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 23px;
  background: rgba(255, 255, 255, 0.94);
  color: #00a17d;
  box-shadow: 0 8px 20px rgba(12, 119, 91, 0.07);
}
.identify-icon ion-icon {
  font-size: 33px;
}
.identify-info {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  max-width: 420px;
  padding-right: 35px;
}
.feature-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.9px;
  color: #009d7b;
}
.identify-info h2 {
  margin: 5px 0 7px;
  color: #0a332b;
  font-size: clamp(17px, 2.5vw, 21px);
  font-weight: 700;
  line-height: 1.3;
}
.identify-info p {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #4e726b;
}
.scan-button {
  grid-column: 2;
  grid-row: 2;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 43px;
  padding: 10px 18px;
  border: 0;
  border-radius: 100px;
  color: #fff;
  background: linear-gradient(120deg, #00a47e, #00b98f);
  box-shadow: 0 7px 17px rgba(0, 157, 118, 0.17);
  font-size: 12px;
  font-weight: 700;
}
.scan-button ion-icon {
  font-size: 16px;
}
.section {
  margin-bottom: 32px;
}
.section-title {
  margin-bottom: 14px;
}
.section-title h2 {
  margin: 0 0 4px;
  color: #0a352c;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.6px;
  line-height: 1.3;
}
.section-title p {
  margin: 0;
  color: #62847c;
  font-size: 12px;
  line-height: 1.5;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.clear-history,
.close-results {
  padding: 7px 0;
  border: 0;
  background: transparent;
  color: #009d7a;
  font-size: 13px;
  font-weight: 700;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.category-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  aspect-ratio: 0.78 / 1;
  min-height: 0;
  padding: 16px 14px 17px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  text-align: left;
  color: #102e29;
  box-shadow: 0 9px 20px rgba(16, 107, 82, 0.05);
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  overflow: hidden;
  transition: transform 0.2s ease;
}
.category-card:hover {
  transform: translateY(-3px);
}
.category-card:nth-child(1) {
  background-color: #e5fbf3;
  background-image: url("/mediscan/medicine-pain-relief.webp");
}
.category-card:nth-child(2) {
  background-color: #fff1e5;
  background-image: url("/mediscan/medicine-vitamins.webp");
}
.category-card:nth-child(3) {
  background-color: #f1edff;
  background-image: url("/mediscan/medicine-allergy.webp");
}
.category-card:nth-child(4) {
  background-color: #e8f4ff;
  background-image: url("/mediscan/medicine-others.webp");
}
.category-icon {
  display: none;
}
.category-card h3 {
  position: relative;
  z-index: 1;
  margin: 0 0 5px;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.3;
}
.category-card p {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: 98%;
  color: #4e716b;
  font-size: 11px;
  line-height: 1.4;
  overflow-wrap: break-word;
}
.medicine-list {
  min-height: 196px;
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  background: #f8fffc url("/mediscan/medicine-recent-searches.webp") center /
    100% 100% no-repeat;
  box-shadow: 0 8px 22px rgba(16, 107, 82, 0.05);
  overflow: hidden;
}
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 196px;
  padding: 23px 16px;
  text-align: center;
}
.empty-state > ion-icon {
  box-sizing: content-box;
  font-size: 30px;
  color: #009b78;
  padding: 13px;
  background: rgba(223, 250, 240, 0.94);
  border-radius: 20px;
}
.empty-state h3 {
  margin: 12px 0 5px;
  color: #123a31;
  font-size: 17px;
  font-weight: 800;
}
.empty-state p {
  margin: 0;
  color: #66827b;
  font-size: 12px;
}
.medicine-item {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 87px;
  gap: 14px;
  padding: 12px 0;
  border: 0;
  border-bottom: 1px solid rgba(20, 110, 84, 0.1);
  background: transparent;
  text-align: left;
  color: #143c32;
}
.medicine-item:last-child {
  border-bottom: 0;
}
.pill-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 49px;
  height: 49px;
  border-radius: 15px;
}
.pill-icon ion-icon {
  font-size: 25px;
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
  min-width: 0;
  flex: 1;
}
.medicine-info h3 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 700;
  overflow-wrap: anywhere;
}
.medicine-info p {
  margin: 0;
  color: #68847b;
  font-size: 12px;
}
.view-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #009b78;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}
.safety-note {
  display: flex;
  align-items: center;
  min-height: 139px;
  padding: 22px 28px 22px 132px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 25px;
  background: #e1f8ef url("/mediscan/medicine-safety.webp") center / 100% 100%
    no-repeat;
  box-shadow: 0 8px 20px rgba(16, 107, 82, 0.05);
}
.safety-note > ion-icon {
  display: none;
}
.safety-note > div {
  min-width: 0;
}
.safety-note strong {
  color: #10392f;
  font-size: 14px;
  font-weight: 800;
}
.safety-note p {
  margin: 6px 0 0;
  color: #4e7068;
  font-size: 12px;
  line-height: 1.55;
}
/* Search results — keep existing interactions and improve styling */
.search-results-section {
  animation: resultAppear 0.22s ease;
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
.search-results {
  display: grid;
  gap: 10px;
}
.result-card {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  padding: 16px;
  border: 1px solid #dcf1e8;
  border-radius: 19px;
  background: rgba(255, 255, 255, 0.93);
  color: #133c32;
  text-align: left;
}
.result-icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 15px;
  background: #def7ef;
  color: #07966e;
}
.result-icon ion-icon {
  font-size: 24px;
}
.result-info {
  flex: 1;
  min-width: 0;
}
.result-label {
  color: #009d79;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}
.result-info h3 {
  margin: 4px 0;
  font-size: 15px;
  overflow-wrap: anywhere;
}
.result-info p {
  margin: 0 0 7px;
  color: #68837a;
  font-size: 12px;
}
.result-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.result-meta span {
  padding: 4px 7px;
  border-radius: 100px;
  background: #eff8f4;
  color: #607b71;
  font-size: 10px;
}
.view-result {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  color: #009b78;
  font-size: 11px;
  font-weight: 700;
}
.result-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 195px;
  padding: 25px;
  border: 1px solid #e0f2e9;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}
.loading-circle,
.empty-search-icon {
  display: grid;
  place-items: center;
  width: 55px;
  height: 55px;
  border-radius: 17px;
  background: #e1f9ef;
  color: #009b78;
}
.empty-search-icon ion-icon {
  font-size: 28px;
}
.result-state h3 {
  margin: 12px 0 5px;
  font-size: 17px;
}
.result-state p {
  max-width: 440px;
  margin: 0;
  color: #69867d;
  font-size: 12px;
  line-height: 1.55;
}
.try-again-button {
  margin-top: 16px;
  padding: 10px 16px;
  border: 0;
  border-radius: 14px;
  background: #00a983;
  color: white;
  font-size: 12px;
  font-weight: 700;
}
@media (max-width: 700px) {
  .page-container {
    padding: calc(24px + env(safe-area-inset-top)) 17px 115px;
  }
  .page-header {
    margin-bottom: 21px;
  }
  .page-header h1 {
    font-size: 30px;
  }
  .page-header p {
    font-size: 11px;
  }
  .brand {
    font-size: 13px;
    padding-top: 7px;
  }
  .search-section {
    gap: 7px;
    margin-bottom: 19px;
  }
  .search-box {
    height: 53px;
    padding: 0 12px;
    gap: 8px;
    border-radius: 17px;
  }
  .search-box > ion-icon {
    font-size: 20px;
  }
  .search-box input {
    font-size: 12px;
  }
  .search-button {
    min-width: 89px;
    min-height: 53px;
    padding: 0 9px;
    border-radius: 17px;
    font-size: 12px;
  }
  .search-button ion-icon {
    font-size: 15px;
  }
  .identify-card {
    grid-template-columns: 55px minmax(0, 1fr);
    min-height: 220px;
    gap: 10px 12px;
    padding: 20px 18px;
    margin-bottom: 28px;
    border-radius: 23px;
  }
  .identify-icon {
    width: 54px;
    height: 54px;
    border-radius: 17px;
  }
  .identify-icon ion-icon {
    font-size: 27px;
  }
  .identify-info {
    padding-right: 10px;
  }
  .identify-info h2 {
    font-size: 16px;
  }
  .identify-info p {
    font-size: 11px;
  }
  .feature-label {
    font-size: 9px;
  }
  .scan-button {
    padding: 10px 12px;
    font-size: 11px;
  }
  .section {
    margin-bottom: 27px;
  }
  .section-title h2 {
    font-size: 20px;
  }
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .category-card {
    aspect-ratio: 0.86 / 1;
    padding: 12px;
    border-radius: 20px;
  }
  .category-card h3 {
    font-size: 13px;
  }
  .category-card p {
    font-size: 10px;
  }
  .safety-note {
    padding: 17px 15px 17px 80px;
    min-height: 150px;
  }
  .safety-note strong {
    font-size: 12px;
  }
  .safety-note p {
    font-size: 10px;
    line-height: 1.55;
  }
  .view-info,
  .view-result {
    font-size: 0;
  }
  .view-info ion-icon,
  .view-result ion-icon {
    font-size: 19px;
  }
}
@media (min-width: 701px) and (max-width: 900px) {
  .identify-info {
    padding-right: 35px;
  }
}
@media (max-width: 360px) {
  .page-container {
    padding-left: 12px;
    padding-right: 12px;
  }
  .brand {
    font-size: 11px;
  }
  .page-header h1 {
    font-size: 27px;
  }
  .search-button {
    min-width: 76px;
    font-size: 11px;
  }
  .identify-card {
    padding: 15px 12px;
  }
  .identify-info h2 {
    font-size: 14px;
  }
  .category-card {
    padding: 10px;
  }
  .category-card h3 {
    font-size: 12px;
  }
  .category-card p {
    font-size: 9px;
  }
  .safety-note {
    padding-left: 67px;
  }
}

/* Final unified refinements — artwork stays fully visible */
.search-section {
  align-items: center;
  gap: 10px;
}
.search-box {
  box-sizing: border-box;
  height: 62px;
  border-radius: 32px;
  padding-inline: 21px;
  background: #fff;
}
.search-button {
  box-sizing: border-box;
  height: 62px;
  min-height: 62px;
  min-width: 128px;
  padding-inline: 18px;
  border-radius: 32px;
  white-space: nowrap;
  background: linear-gradient(135deg, #00a67d, #00bc94);
}
.search-button ion-icon {
  flex-shrink: 0;
}
.identify-card {
  background-size: 100% 100%;
}
.category-card {
  background-size: 100% 100%;
}
.category-card h3,
.category-card p {
  max-width: 100%;
}
.recent-section {
  margin-bottom: 36px;
}
.recent-section .section-title {
  margin-bottom: 18px;
}
.medicine-list {
  box-sizing: border-box;
  min-height: 196px;
  background-size: 100% 100%;
  border-radius: 28px;
}
.empty-state {
  box-sizing: border-box;
  min-height: 196px;
}
.empty-state > ion-icon {
  font-size: 31px;
  padding: 16px;
  border-radius: 20px;
}
.empty-state h3 {
  margin: 12px 0 4px;
  font-size: 18px;
}
.empty-state p {
  font-size: 13px;
  line-height: 1.5;
}
.safety-note {
  box-sizing: border-box;
  min-height: 151px;
  border-radius: 28px;
  background-size: 100% 100%;
}
.safety-note > div {
  min-width: 0;
  flex: 1;
}
.safety-note strong {
  display: block;
  font-size: 15px;
  line-height: 1.4;
}
.safety-note p {
  margin-top: 7px;
  font-size: 13px;
  line-height: 1.6;
}
@media (max-width: 700px) {
  .search-section {
    gap: 7px;
  }
  .search-box {
    height: 53px;
    padding-inline: 13px;
    border-radius: 22px;
  }
  .search-button {
    height: 53px;
    min-height: 53px;
    min-width: 89px;
    padding-inline: 9px;
    border-radius: 22px;
    font-size: 12px;
  }
  .medicine-list,
  .empty-state {
    min-height: 180px;
  }
  .medicine-list {
    padding-inline: 10px;
  }
  .empty-state h3 {
    font-size: 16px;
  }
  .empty-state p {
    font-size: 11px;
  }
  .safety-note {
    min-height: 145px;
  }
  .safety-note strong {
    font-size: 12px;
  }
  .safety-note p {
    font-size: 10px;
    line-height: 1.55;
  }
}
@media (max-width: 360px) {
  .search-button {
    min-width: 76px;
    font-size: 11px;
    gap: 4px;
  }
}
</style>
