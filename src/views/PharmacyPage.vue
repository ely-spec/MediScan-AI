<template>

  <ion-page>

    <ion-header

      ><ion-toolbar><ion-title>Pharmacy</ion-title></ion-toolbar></ion-header

    >

    <ion-content ref="pageContent" class="ion-padding">

      <main class="pharmacy-page">

        <div class="hero">

          <div class="hero-icon">✚</div>

          <div>

            <h1>Pharmacy Finder</h1>

            <p>Nearby pharmacies, medicines, and sample price comparison.</p>

          </div>

        </div>

        <button

          v-if="activeTab === 'nearby' && hasSearched"

          class="back-action finder-back"

          @click="backToFinder"

        >

          ← Back to Find Pharmacy

        </button>

        <nav class="main-tabs" aria-label="Pharmacy sections">

          <button

            :class="{ active: activeTab === 'nearby' }"

            @click="activeTab = 'nearby'"

          >

            📍 Nearby

          </button>

          <button

            :class="{ active: activeTab === 'medicines' }"

            :disabled="!hasSearched && !chosenItems.length"

            @click="openMedicines"

          >

            💊 Medicines

            <span v-if="chosenItems.length">({{ chosenItems.length }})</span>

          </button>

          <button

            :class="{ active: activeTab === 'compare' }"

            :disabled="!pharmacies.length || !chosenItems.length"

            @click="comparePrices"

          >

            ₱ Compare

          </button>

        </nav>

        <section v-show="activeTab === 'nearby'">

          <div v-if="chosenItems.length && !hasSearched" class="prescription-import-note" role="status">
  <strong>✓ Prescription medicines received ({{ chosenItems.length }})</strong>
  <p>Strengths and prescribed quantities are carried over. Find nearby pharmacies, then review your medicine list before comparing sample prices.</p>
  <p v-if="quantitiesToReview.length" class="quantity-warning">{{ quantitiesToReview.length }} medicine(s) have no confirmed quantity. Please review before comparing.</p>
</div>
<div v-if="!hasSearched" class="finder-start">

            <ion-button

              expand="block"

              :disabled="loading"

              @click="findPharmacies"

              ><ion-spinner

                v-if="loading"

                slot="start"

                name="crescent"

              /><ion-icon v-else slot="start" :icon="locationOutline" />{{

                loading ? "Finding pharmacies..." : "Find Pharmacies"

              }}</ion-button

            >

          </div>

          <p v-if="errorMessage" class="error" role="alert">

            {{ errorMessage }}

          </p>

          <p v-if="statusMessage" class="status" role="status">

            {{ statusMessage }}

          </p>

          <template v-if="hasSearched && pharmacies.length">

            <section class="medicine-entry medicine-entry-top">

              <h2>💊 Need to find your medicines?</h2>

              <p>

                Your prescription medicines are already selected when available.

                Review the medicines and quantities before comparing demo prices.

              </p>

              <button class="primary-action" @click="openMedicines">

                {{ chosenItems.length ? `Continue to Medicines (${chosenItems.length}) →` : "Find Your Medicine →" }}

              </button>

            </section>

            <div class="view-tabs">

              <button

                :class="{ active: view === 'list' }"

                @click="view = 'list'"

              >

                ☷ List View</button

              ><button :class="{ active: view === 'map' }" @click="showMap">

                ♧ Map View

              </button>

            </div>

            <div

              v-show="view === 'map'"

              ref="mapElement"

              class="map"

              aria-label="Map of nearby pharmacies"

            ></div>

            <template v-if="view === 'list'"

              ><h2 class="section-title">

                Nearby Pharmacies ({{ pharmacies.length }})

              </h2>

              <article

                v-for="pharmacy in pharmacies"

                :key="pharmacy.id"

                class="pharmacy-card"

              >

                <h3>{{ pharmacy.name }}</h3>

                <p>{{ pharmacy.address || "Address not available" }}</p>

                <p class="distance">

                  📍 {{ formatDistance(pharmacy.distanceKm) }} away

                  (straight-line)

                </p>

                <a

                  :href="directionsUrl(pharmacy)"

                  target="_blank"

                  rel="noopener noreferrer"

                  >Get Directions ↗</a

                >

              </article>

            </template>

          </template>

        </section>

        <section v-if="activeTab === 'medicines'" class="medicine-panel">

          <button class="back-action section-back" @click="backToNearby">

            ← Back to Nearby Pharmacies

          </button>

          <h2>My Medicine List</h2>

          <p class="muted">

            Search and select multiple medicines. Each medicine has its own

            quantity and unit.

          </p>

          <input

            v-model="medicineSearch"

            class="search-input"

            type="search"

            placeholder="Search generic or brand name..."

            aria-label="Search medicines"

            @keyup.enter="searchRxNorm"

          />

          <button

            class="secondary-action"

            :disabled="rxLoading || medicineSearch.trim().length < 3"

            @click="searchRxNorm"

          >

            {{

              rxLoading

                ? "Searching RxNorm..."

                : "Search More Medicines via RxNorm"

            }}

          </button>

          <p class="muted info-text">

            {{ filteredMedicines.length }} matching medicines shown •

            {{ localCatalog.length }} local demo medicines + RxNorm search

          </p>

          <p v-if="rxError" class="error" role="status">{{ rxError }}</p>

          <p v-else-if="rxSearched" class="status">

            RxNorm catalog now has {{ remoteCatalog.length }} medicine entries.

            US terminology may differ from Philippine brands.

          </p>

          <div class="medicine-options">

            <label

              v-for="med in filteredMedicines"

              :key="med.id"

              class="medicine-option"

              ><input

                type="checkbox"

                :checked="!!selections[med.id]"

                @change="toggleMedicine(med.id)"

              /><span

                ><strong>{{ med.name }}</strong

                ><small>{{ med.description }}</small></span

              ></label

            >

            <p v-if="!filteredMedicines.length" class="muted">

              No local match. Try the RxNorm search button.

            </p>

          </div>

          <p v-if="!pharmacies.length" class="muted pharmacy-hint">Your medicines are ready. Find nearby pharmacies to enable price comparison.</p>

          <button v-if="!pharmacies.length" class="secondary-action" :disabled="loading" @click="findPharmacies">{{ loading ? "Finding pharmacies..." : "📍 Find Pharmacies for Comparison" }}</button>

          <div v-if="chosenItems.length" class="chosen-list">

            <h3>Selected medicines ({{ chosenItems.length }})</h3>

            <div v-for="item in chosenItems" :key="item.id" class="chosen-item">

              <div class="chosen-heading">

                <strong>{{ item.name }}</strong

                ><button class="remove" @click="toggleMedicine(item.id)">

                  Remove

                </button>

              </div>

              <div class="quantity-row">

                <select

                  :value="item.unit"

                  :aria-label="`Unit for ${item.name}`"

                  @change="setUnit(item.id, $event)"

                >

                  <option value="piece">Per piece / tablet / capsule</option>

                  <option value="pack">

                    Blister / strip pack (10 pcs) — demo

                  </option>

                </select>

                <div class="stepper">

                  <button

                    :aria-label="`Decrease ${item.name}`"

                    @click="changeQuantity(item.id, -1)"

                  >

                    −</button

                  ><span>{{ item.quantity }}</span

                  ><button

                    :aria-label="`Increase ${item.name}`"

                    @click="changeQuantity(item.id, 1)"

                  >

                    +

                  </button>

                </div>

              </div>

              <p class="muted">Requested: {{ requestedPieces(item) }} pieces</p>

              <p v-if="quantitiesToReview.includes(item.id)" class="quantity-warning">

                Quantity not detected from prescription. Please verify and adjust using + / −.

              </p>

            </div>

            <button class="primary-action" :disabled="!pharmacies.length" @click="comparePrices">

              Compare {{ chosenItems.length }} Medicines at

              {{ pharmacies.length }} Pharmacies →

            </button>

          </div>

          <p class="disclaimer">

            Demo only: medicine prices, pack sizes and stock are simulated. Some

            dosage forms (e.g., liquids, creams, injections) are NOT sold per

            tablet or 10-piece strip; verify the correct product and packaging

            before using a comparison.

          </p>

        </section>

        <section v-if="activeTab === 'compare'" class="compare-section">

          <div class="compare-navigation">

            <button class="back-action" @click="backToMedicines">

              ← Back to Medicines</button

            ><ion-button

              size="small"

              fill="outline"

              router-link="/tabs/home"

              class="home-top-btn"

              >⌂ Home</ion-button

            >

          </div>

          <div class="section-heading">

            <div>

              <h2>Compare Pharmacy Prices</h2>

              <p class="muted">

                {{ chosenItems.length }} selected medicines •

                {{ pharmacies.length }} pharmacies

              </p>

            </div>

            <select v-model="sortBy" aria-label="Sort comparison">

              <option value="cheapest">Complete & cheapest first</option>

              <option value="nearest">Nearest first</option>

            </select>

          </div>

          <p class="disclaimer important">

            SAMPLE PRICES & SIMULATED STOCK ONLY — not real pharmacy quotes,

            inventory or guaranteed availability.

          </p>

          <article

            v-for="pharmacy in sortedPharmacies"

            :key="pharmacy.id"

            class="pharmacy-card"

          >

            <div class="card-heading">

              <div>

                <h3>{{ pharmacy.name }}</h3>

                <p class="distance">

                  📍 {{ formatDistance(pharmacy.distanceKm) }} away

                </p>

              </div>

              <span

                class="availability-tag"

                :class="complete(pharmacy) ? 'available' : 'low'"

                >{{

                  complete(pharmacy)

                    ? "Complete"

                    : `${missingCount(pharmacy)} missing`

                }}</span

              >

            </div>

            <div class="breakdown">

              <div

                v-for="item in chosenItems"

                :key="item.id"

                class="medicine-breakdown"

              >

                <div class="breakdown-row">

                  <span

                    ><strong>{{ item.name }}</strong

                    ><small

                      >{{ item.quantity }}

                      {{

                        item.unit === "pack"

                          ? "strip pack(s) × 10 pcs"

                          : "piece(s)"

                      }}

                      × {{ peso(unitPrice(pharmacy, item)) }}</small

                    ></span

                  ><strong>{{

                    enoughStock(pharmacy, item)

                      ? peso(lineTotal(pharmacy, item))

                      : "—"

                  }}</strong>

                </div>

                <span

                  class="availability-tag"

                  :class="stockClass(pharmacy, item)"

                  >{{ stockLabel(pharmacy, item) }}</span

                >

              </div>

              <div class="breakdown-total">

                <span>{{

                  complete(pharmacy)

                    ? "Estimated Complete Total"

                    : "Estimated Partial Total"

                }}</span

                ><strong>{{ peso(pharmacyTotal(pharmacy)) }}</strong>

              </div>

              <p v-if="!complete(pharmacy)" class="muted">

                Excludes unavailable / insufficient-stock items. This is NOT the

                full prescription cost.

              </p>

            </div>

            <a

              :href="directionsUrl(pharmacy)"

              target="_blank"

              rel="noopener noreferrer"

              >Get Directions ↗</a

            >

          </article>

          <button class="secondary-action" @click="activeTab = 'medicines'">

            ← Edit Medicines & Quantities

          </button>

        </section>

      </main>

    </ion-content>

  </ion-page>

</template>

<script setup lang="ts">

import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

import { onIonViewWillEnter } from "@ionic/vue";

import {

  IonPage,

  IonHeader,

  IonToolbar,

  IonTitle,

  IonContent,

  IonButton,

  IonIcon,

  IonSpinner,

} from "@ionic/vue";

import { locationOutline } from "ionicons/icons";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { supabase } from "../utils/supabase";

type Pharmacy = {

  id: string;

  name: string;

  lat: number;

  lon: number;

  address: string;

  distanceKm: number;

};

type PharmacyRow = {

  id: number;

  name: string;

  address: string | null;

  lat: number;

  lon: number;

};

type Medicine = {

  id: string;

  name: string;

  description: string;

  basePiece: number;

  basePack: number;

  source?: "local" | "RxNorm";

};

type Selection = { quantity: number; unit: "piece" | "pack" };

type ChosenMedicine = Medicine & Selection;

const medicines: Medicine[] = [

  {

    id: "paracetamol",

    name: "Paracetamol 500 mg",

    description: "Pain and fever relief",

    basePiece: 5.25,

    basePack: 48.5,

  },

  {

    id: "biogesic",

    name: "Biogesic 500 mg",

    description: "Paracetamol brand",

    basePiece: 6.0,

    basePack: 55.75,

  },

  {

    id: "cetirizine",

    name: "Cetirizine 10 mg",

    description: "Antihistamine",

    basePiece: 8.75,

    basePack: 80.5,

  },

  {

    id: "ibuprofen",

    name: "Ibuprofen 200 mg",

    description: "Pain relief",

    basePiece: 7.5,

    basePack: 68.25,

  },

  {

    id: "neozep",

    name: "Neozep",

    description: "Cold symptom medicine",

    basePiece: 9.25,

    basePack: 87.0,

  },

  {

    id: "loratadine",

    name: "Loratadine 10 mg",

    description: "Antihistamine",

    basePiece: 11.5,

    basePack: 108.75,

  },

  {

    id: "mefenamic",

    name: "Mefenamic Acid 500 mg",

    description: "Pain relief",

    basePiece: 12.25,

    basePack: 115.5,

  },

  {

    id: "ascorbic",

    name: "Ascorbic Acid 500 mg",

    description: "Vitamin C",

    basePiece: 4.75,

    basePack: 44.0,

  },

];

const extraNames = [

  "Amoxicillin 500 mg",

  "Azithromycin 500 mg",

  "Metformin 500 mg",

  "Amlodipine 5 mg",

  "Losartan 50 mg",

  "Omeprazole 20 mg",

  "Atorvastatin 20 mg",

  "Simvastatin 20 mg",

  "Clopidogrel 75 mg",

  "Aspirin 80 mg",

  "Salbutamol 2 mg",

  "Montelukast 10 mg",

  "Allopurinol 100 mg",

  "Levetiracetam 500 mg",

  "Gabapentin 300 mg",

  "Carbamazepine 200 mg",

  "Prednisone 5 mg",

  "Furosemide 40 mg",

  "Spironolactone 25 mg",

  "Ciprofloxacin 500 mg",

  "Doxycycline 100 mg",

  "Fluconazole 150 mg",

  "Metronidazole 500 mg",

  "Pantoprazole 40 mg",

  "Levothyroxine 50 mcg",

  "Sertraline 50 mg",

  "Escitalopram 10 mg",

  "Bisoprolol 5 mg",

  "Valsartan 80 mg",

  "Glimepiride 2 mg",

  "Sitagliptin 100 mg",

  "Acetylcysteine 600 mg",

  "Loperamide 2 mg",

  "Domperidone 10 mg",

  "Ondansetron 4 mg",

  "Hydrochlorothiazide 25 mg",

];

const localCatalog: Medicine[] = [

  ...medicines.map((m) => ({ ...m, source: "local" as const })),

  ...extraNames.map((name, i) => ({

    id: `local-${i}`,

    name,

    description: "Demo catalog • confirm dosage form",

    basePiece: Math.round((5.25 + ((i * 7) % 39) + (i % 4) * 0.25) * 100) / 100,

    basePack:

      Math.round((48.75 + ((i * 13) % 215) + (i % 3) * 0.5) * 100) / 100,

    source: "local" as const,

  })),

];

const remoteCatalog = ref<Medicine[]>([]);

// Medicine handoff from a confirmed prescription (session only).

// Sender saves: sessionStorage.setItem("mediscan_prescription_pharmacy", JSON.stringify([{name:"Paracetamol 500 mg",quantity:10}]))

const PRESCRIPTION_TRANSFER_KEY = "mediscan_prescription_pharmacy";

const SAVED_PRESCRIPTION_TRANSFER_KEY = "mediscan_pharmacy_prescription";

// These medicines were imported without a clearly stated prescribed quantity.

const quantitiesToReview = ref<string[]>([]);

function readPrescribedQuantity(record: Record<string, unknown>): number | null {

  // Only read explicit quantity fields. Never calculate from dose/frequency/duration.

  const candidates = [

    record.quantity, record.qty, record.prescribedQuantity,

    record.prescribed_quantity, record.dispenseQuantity,

    record.dispense_quantity, record.numberOfUnits,

  ];

  for (const value of candidates) {

    if (typeof value !== "number" && typeof value !== "string") continue;

    const raw = String(value).trim();

    const match = raw.match(/^(?:#|qty\s*[:=]?\s*)?(\d{1,3})(?:\s*(?:pcs?|pieces?|tablets?|capsules?|tabs?|caps?))?$/i);

    if (!match) continue;

    const parsed = Number(match[1]);

    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= 999) return parsed;

  }

  return null;

}

function receivePrescriptionMedicines(): void {

  let raw: string | null = null;

  try {

    raw = sessionStorage.getItem(SAVED_PRESCRIPTION_TRANSFER_KEY)

      || sessionStorage.getItem(PRESCRIPTION_TRANSFER_KEY);

  } catch { return; }

  if (!raw) return;

  try {

    const incoming: unknown = JSON.parse(raw);

    if (!Array.isArray(incoming) || !incoming.length) return;

    const newRemote: Medicine[] = [];

    const nextSelections: Record<string, Selection> = {};

    const nextReview: string[] = [];

    for (const value of incoming.slice(0, 40)) {

      if (!value || typeof value !== "object") continue;

      const record = value as Record<string, unknown>;

      const rawName = String(record.name || record.medicineName || "").trim();

      const strength = String(record.strength || "").trim();

      const name = (strength && !rawName.toLowerCase().includes(strength.toLowerCase())

        ? `${rawName} ${strength}` : rawName).slice(0, 150);

      if (!name) continue;

      const existing = catalog.value.find(m => m.name.toLowerCase() === name.toLowerCase());

      const id = existing?.id || `prescription-${hashNumber(name.toLowerCase())}`;

      if (!existing && !newRemote.some(m => m.id === id)) {

        newRemote.push({ id, name, description: "From prescription • demo pricing only; confirm dosage form", basePiece: 5, basePack: 48, source: "local" });

      }

      const qty = readPrescribedQuantity(record);

      if (qty === null) nextReview.push(id);

      nextSelections[id] = { quantity: qty ?? 1, unit: "piece" };

    }

    remoteCatalog.value = [...remoteCatalog.value.filter(m => !m.id.startsWith("prescription-")), ...newRemote];

    selections.value = nextSelections;
    medicineSearch.value = "";

    quantitiesToReview.value = nextReview;

    // Keep the Nearby-first flow; imported medicines are already selected for step 2.

    activeTab.value = "nearby";

    scrollToTop();

    sessionStorage.removeItem(PRESCRIPTION_TRANSFER_KEY);

    sessionStorage.removeItem(SAVED_PRESCRIPTION_TRANSFER_KEY);

  } catch (error) {

    console.warn("Unable to import prescription medicines", error);

  }

}

onIonViewWillEnter(receivePrescriptionMedicines);

const catalog = computed(() => [...localCatalog, ...remoteCatalog.value]);

const activeTab = ref<"nearby" | "medicines" | "compare">("nearby");

const pageContent = ref<InstanceType<typeof IonContent> | null>(null);

function openMedicines(): void {

  activeTab.value = "medicines";

  scrollToTop();

}

function backToNearby(): void {

  activeTab.value = "nearby";

  scrollToTop();

}

function backToMedicines(): void {

  activeTab.value = "medicines";

  scrollToTop();

}

function backToFinder(): void {

  activeTab.value = "nearby";

  view.value = "list";

  hasSearched.value = false;

  pharmacies.value = [];

  statusMessage.value = "";

  errorMessage.value = "";

  map?.remove();

  map = null;

  markerLayer = null;

  scrollToTop();

}

function scrollToTop(): void {

  nextTick(() => {

    pageContent.value?.$el?.scrollToTop?.(300);

  });

}

const rxLoading = ref(false);

const rxError = ref("");

const rxSearched = ref(false);

let rxRequestId = 0;

function hashNumber(value: string): number {

  let h = 0;

  for (let i = 0; i < value.length; i++)

    h = (h * 31 + value.charCodeAt(i)) >>> 0;

  return h;

}

function makeRemoteMedicine(name: string, id: string): Medicine {

  const h = hashNumber(id);

  return {

    id: `rx-${id}`,

    name,

    description: "RxNorm catalog • US terminology; demo pricing only",

    basePiece: Math.round((4.25 + (h % 88) + (h % 4) * 0.25) * 100) / 100,

    basePack: Math.round((38.5 + (h % 350) + (h % 3) * 0.25) * 100) / 100,

    source: "RxNorm",

  };

}

async function searchRxNorm(): Promise<void> {

  const query = medicineSearch.value.trim();

  if (query.length < 3) {

    rxError.value = "Enter at least 3 characters.";

    return;

  }

  const requestId = ++rxRequestId;

  rxLoading.value = true;

  rxError.value = "";

  rxSearched.value = false;

  try {

    // Public RxNav REST endpoint. This is a medicine terminology lookup, NOT stock/pricing.

    const response = await fetch(

      `https\://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(query)}`,

    );

    if (!response.ok)

      throw new Error(`RxNorm returned HTTP ${response.status}`);

    const body = await response.json();

    const groups = body?.drugGroup?.conceptGroup || [];

    const matches: Medicine[] = [];

    const seen = new Set<string>();

    for (const group of groups)

      for (const item of group.conceptProperties || []) {

        const name = String(item.name || "").trim();

        const id = String(item.rxcui || "").trim();

        if (!name || !id || seen.has(id)) continue;

        seen.add(id);

        matches.push(makeRemoteMedicine(name, id));

        if (matches.length >= 80) break;

      }

    if (requestId !== rxRequestId) return;

    remoteCatalog.value = [

      ...remoteCatalog.value.filter(

        (old) => !matches.some((m) => m.id === old.id),

      ),

      ...matches,

    ];

    rxSearched.value = true;

    if (!matches.length)

      rxError.value =

        "No RxNorm matches found. Try the generic name or a different spelling.";

  } catch (error) {

    if (requestId !== rxRequestId) return;

    rxError.value =

      "RxNorm search is unavailable right now (network/CORS). Local catalog still works.";

    console.warn("RxNorm search error:", error);

  } finally {

    if (requestId === rxRequestId) rxLoading.value = false;

  }

}

const mapElement = ref<HTMLElement | null>(null);

const loading = ref(false);

const errorMessage = ref("");

const statusMessage = ref("");

const hasSearched = ref(false);

const pharmacies = ref<Pharmacy[]>([]);

const view = ref<"list" | "map">("list");

const sortBy = ref<"nearest" | "cheapest">("nearest");

const medicineSearch = ref("");

const comparisonVisible = ref(false);

const selections = ref<Record<string, Selection>>({});

const filteredMedicines = computed(() =>

  catalog.value

    .filter((m) =>

      m.name.toLowerCase().includes(medicineSearch.value.toLowerCase()),

    )

    .slice(0, 100),

);

const chosenItems = computed<ChosenMedicine[]>(() =>

  catalog.value.flatMap((m) =>

    selections.value[m.id] ? [{ ...m, ...selections.value[m.id] }] : [],

  ),

);

const sortedPharmacies = computed(() =>

  [...pharmacies.value].sort((a, b) => {

    if (sortBy.value === "cheapest") {

      const ac = complete(a),

        bc = complete(b);

      if (ac !== bc) return ac ? -1 : 1;

      return pharmacyTotal(a) - pharmacyTotal(b);

    }

    return a.distanceKm - b.distanceKm;

  }),

);

let map: L.Map | null = null;

let markerLayer: L.LayerGroup | null = null;

let currentLocation: { lat: number; lon: number } | null = null;

let disposed = false;

const SEARCH_RADIUS_METERS = 5000;

function toggleMedicine(id: string): void {

  const next = { ...selections.value };

  if (next[id]) delete next[id];

  else next[id] = { quantity: 1, unit: "piece" };

  selections.value = next;

  quantitiesToReview.value = quantitiesToReview.value.filter((value) => value !== id);

  comparisonVisible.value = false;

  sortBy.value = "nearest";

}

function changeQuantity(id: string, amount: number): void {

  const selection = selections.value[id];

  if (!selection) return;

  selections.value = {

    ...selections.value,

    [id]: {

      ...selection,

      quantity: Math.max(1, Math.min(999, selection.quantity + amount)),

    },

  };

  quantitiesToReview.value = quantitiesToReview.value.filter((value) => value !== id);

  comparisonVisible.value = false;

  sortBy.value = "nearest";

}

function setUnit(id: string, event: Event): void {

  const selection = selections.value[id];

  if (!selection) return;

  const unit =

    (event.target as HTMLSelectElement).value === "pack" ? "pack" : "piece";

  selections.value = { ...selections.value, [id]: { ...selection, unit } };

  comparisonVisible.value = false;

  sortBy.value = "nearest";

}

function comparePrices(): void {

  if (!chosenItems.value.length || !pharmacies.value.length) return;

  comparisonVisible.value = true;

  activeTab.value = "compare";

  view.value = "list";

  sortBy.value = "cheapest";

}

function peso(amount: number): string {

  return `₱${amount.toFixed(2)}`;

}

// Stable, deterministic variation per pharmacy + medicine. These are NOT real-world prices.

function simulatedMultiplier(pharmacy: Pharmacy, medicineId: string): number {

  const seed = `${pharmacy.id}|${medicineId}`;

  let hash = 0;

  for (let i = 0; i < seed.length; i++)

    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;

  return 0.88 + (hash % 29) / 100;

}

function unitPrice(pharmacy: Pharmacy, item: ChosenMedicine): number {

  const base = item.unit === "pack" ? item.basePack : item.basePiece;

  return Math.round(base * simulatedMultiplier(pharmacy, item.id) * 4) / 4;

}

type StockState = "available" | "low" | "out" | "not-listed";

function stockState(pharmacy: Pharmacy, item: ChosenMedicine): StockState {

  const h = hashNumber(`stock|${pharmacy.id}|${item.id}`) % 100;

  if (h < 12) return "not-listed";

  if (h < 29) return "out";

  if (h < 47) return "low";

  return "available";

}

function requestedPieces(item: ChosenMedicine): number {

  return item.quantity * (item.unit === "pack" ? 10 : 1);

}

function availablePieces(pharmacy: Pharmacy, item: ChosenMedicine): number {

  const state = stockState(pharmacy, item);

  if (state === "out" || state === "not-listed") return 0;

  if (state === "available") return requestedPieces(item) + 30;

  return Math.max(1, Math.floor(requestedPieces(item) * 0.4));

}

function enoughStock(pharmacy: Pharmacy, item: ChosenMedicine): boolean {

  return availablePieces(pharmacy, item) >= requestedPieces(item);

}

function stockLabel(pharmacy: Pharmacy, item: ChosenMedicine): string {

  const state = stockState(pharmacy, item);

  if (state === "not-listed") return "Not Listed";

  if (state === "out") return "Out of Stock";

  if (state === "low")

    return `Low Stock • ${availablePieces(pharmacy, item)} of ${requestedPieces(item)} pcs`;

  return "Available";

}

function lineTotal(pharmacy: Pharmacy, item: ChosenMedicine): number {

  return enoughStock(pharmacy, item)

    ? unitPrice(pharmacy, item) * item.quantity

    : 0;

}

function pharmacyTotal(pharmacy: Pharmacy): number {

  return chosenItems.value.reduce(

    (sum, item) => sum + lineTotal(pharmacy, item),

    0,

  );

}

function complete(pharmacy: Pharmacy): boolean {

  return (

    chosenItems.value.length > 0 &&

    chosenItems.value.every((item) => enoughStock(pharmacy, item))

  );

}

function missingCount(pharmacy: Pharmacy): number {

  return chosenItems.value.filter((item) => !enoughStock(pharmacy, item))

    .length;

}

function stockClass(pharmacy: Pharmacy, item: ChosenMedicine): string {

  return stockState(pharmacy, item);

}

watch(activeTab, async (tab) => {

  if (tab === "nearby" && view.value === "map") {

    await nextTick();

    await loadMap();

  }

});

function getLocation(): Promise<{ lat: number; lon: number }> {

  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {

      reject(new Error("Location is not supported on this device or browser."));

      return;

    }

    navigator.geolocation.getCurrentPosition(

      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),

      (e) =>

        reject(

          new Error(

            e.code === 1

              ? "Location permission denied. Allow location access and try again."

              : e.code === 2

                ? "Location unavailable. Turn on GPS and try again."

                : "Location request timed out. Please try again.",

          ),

        ),

      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },

    );

  });

}

function distanceKm(

  aLat: number,

  aLon: number,

  bLat: number,

  bLon: number,

): number {

  const rad = (v: number) => (v * Math.PI) / 180;

  const dLat = rad(bLat - aLat),

    dLon = rad(bLon - aLon);

  const h =

    Math.sin(dLat / 2) ** 2 +

    Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLon / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

}

function formatDistance(km: number): string {

  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;

}

function directionsUrl(p: Pharmacy): string {

  return `https\://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${p.lat},${p.lon}`)}`;

}

async function fetchNearbyPharmacies(

  lat: number,

  lon: number,

): Promise<Pharmacy[]> {

  const radiusKm = SEARCH_RADIUS_METERS / 1000;

  const latDelta = radiusKm / 111.32;

  const lonDelta =

    radiusKm /

    (111.32 * Math.max(Math.abs(Math.cos((lat * Math.PI) / 180)), 0.01));

  const { data, error } = await supabase

    .from("pharmacies")

    .select("id, name, address, lat, lon")

    .gte("lat", lat - latDelta)

    .lte("lat", lat + latDelta)

    .gte("lon", lon - lonDelta)

    .lte("lon", lon + lonDelta)

    .limit(1000);

  if (error) {

    console.error("Supabase pharmacy query error:", error);

    throw new Error("Unable to load pharmacy records from the database.");

  }

  return ((data || []) as PharmacyRow[])

    .filter((row) => Number.isFinite(row.lat) && Number.isFinite(row.lon))

    .map((row) => ({

      id: String(row.id),

      name: row.name,

      address: row.address || "",

      lat: row.lat,

      lon: row.lon,

      distanceKm: distanceKm(lat, lon, row.lat, row.lon),

    }))

    .filter((p) => p.distanceKm <= radiusKm)

    .sort((a, b) => a.distanceKm - b.distanceKm);

}

async function loadMap(): Promise<void> {

  if (!mapElement.value || !currentLocation || disposed) return;

  if (!map) {

    map = L.map(mapElement.value, { scrollWheelZoom: false });

    L.tileLayer("https\://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

      attribution: "&copy; OpenStreetMap contributors",

      maxZoom: 19,

    }).addTo(map);

    markerLayer = L.layerGroup().addTo(map);

  }

  if (!markerLayer) return;

  markerLayer.clearLayers();

  L.circleMarker([currentLocation.lat, currentLocation.lon], {

    radius: 9,

    color: "#ffffff",

    weight: 3,

    fillColor: "#008c70",

    fillOpacity: 1,

  })

    .addTo(markerLayer)

    .bindTooltip("Your approximate location");

  const bounds = L.latLngBounds([[currentLocation.lat, currentLocation.lon]]);

  for (const p of pharmacies.value) {

    L.circleMarker([p.lat, p.lon], {

      radius: 7,

      color: "#ffffff",

      weight: 2,

      fillColor: "#007b63",

      fillOpacity: 1,

    })

      .addTo(markerLayer)

      .bindTooltip(p.name);

    bounds.extend([p.lat, p.lon]);

  }

  map.fitBounds(bounds.pad(0.15), {

    maxZoom: pharmacies.value.length ? 14 : 15,

  });

  await nextTick();

  map.invalidateSize();

}

async function showMap(): Promise<void> {

  view.value = "map";

  await nextTick();

  await loadMap();

}

async function findPharmacies(): Promise<void> {

  if (loading.value) return;

  loading.value = true;

  errorMessage.value = "";

  statusMessage.value = "";

  pharmacies.value = [];

  hasSearched.value = false;

  comparisonVisible.value = false;

  activeTab.value = "nearby";

  view.value = "list";

  sortBy.value = "nearest";

  try {

    currentLocation = await getLocation();

    if (disposed) return;

    statusMessage.value = "Location received. Checking pharmacy database...";

    pharmacies.value = await fetchNearbyPharmacies(

      currentLocation.lat,

      currentLocation.lon,

    );

    if (disposed) return;

    hasSearched.value = true;

    statusMessage.value = pharmacies.value.length

      ? `Found ${pharmacies.value.length} pharmacies within 5 km. Distances are straight-line estimates.`

      : "No pharmacy records are available within 5 km yet.";

  } catch (e) {

    statusMessage.value = "";

    errorMessage.value =

      e instanceof Error

        ? e.message

        : "Unable to search pharmacies. Please try again.";

  } finally {

    loading.value = false;

  }

}

onBeforeUnmount(() => {

  disposed = true;

  map?.remove();

  map = null;

  markerLayer = null;

});

</script>

<style scoped>

ion-toolbar {

  --background: #ffffff;

  --color: #123c34;

}

ion-content {

  --background: #f4faf8;

  --color: #123c34;

}

.pharmacy-page {

  max-width: 640px;

  margin: 0 auto;

  padding: 16px 4px 36px;

  color: #123c34;

}

.hero {

  display: flex;

  gap: 12px;

  align-items: center;

  margin-bottom: 18px;

}

.hero-icon,

.entry-icon {

  display: grid;

  place-items: center;

  flex: 0 0 48px;

  height: 48px;

  border-radius: 14px;

  background: #d7f5e9;

  color: #008d70;

  font-size: 27px;

  font-weight: 800;

}

.hero h1 {

  margin: 0 0 4px;

  font-size: 22px;

  font-weight: 800;

}

.hero p,

.entry-top p,

.muted {

  margin: 0;

  color: #688078;

  font-size: 13px;

  line-height: 1.5;

}

ion-button {

  --background: #008d70;

  --border-radius: 12px;

  font-weight: 700;

  margin: 12px 0;

}

.error {

  background: #fff1ef;

  color: #b42318;

  padding: 12px;

  border-radius: 10px;

}

.status {

  color: #456a60;

  font-size: 12px;

  margin: 15px 0;

}

.view-tabs {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 4px;

  background: #e0f0eb;

  padding: 4px;

  border-radius: 12px;

  margin: 18px 0;

}

.view-tabs button {

  border: 0;

  background: transparent;

  border-radius: 9px;

  padding: 12px;

  color: #42685d;

  font-weight: 700;

  cursor: pointer;

}

.view-tabs button.active {

  background: #008d70;

  color: white;

}

.map {

  height: 330px;

  border-radius: 16px;

  overflow: hidden;

  margin: 16px 0;

  z-index: 0;

}

.section-heading {

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin: 16px 0;

}

.section-heading h2 {

  font-size: 18px;

  margin: 0;

}

select,

.search-input {

  background: #fff;

  border: 1px solid #d8e9e2;

  color: #123c34;

  border-radius: 10px;

  padding: 10px;

  max-width: 100%;

}

.section-heading select {

  font-size: 12px;

}

.pharmacy-card,

.medicine-panel,

.medicine-entry {

  background: white;

  border: 1px solid #e0eee8;

  border-radius: 16px;

  padding: 16px;

  margin: 12px 0;

}

.card-heading {

  display: flex;

  justify-content: space-between;

  gap: 10px;

}

.pharmacy-card h3 {

  margin: 0 0 8px;

  font-size: 16px;

  font-weight: 650;

}

.pharmacy-card p {

  margin: 5px 0;

  color: #688078;

  font-size: 12px;

}

.pharmacy-card .distance {

  color: #008d70;

  font-weight: 700;

}

.pharmacy-card a {

  display: inline-block;

  color: #007d63;

  font-size: 13px;

  font-weight: 750;

  text-decoration: none;

  margin-top: 10px;

}

.price-badge {

  flex-shrink: 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 5px;

  background: #e2f6ed;

  border-radius: 10px;

  padding: 10px;

  color: #008d70;

}

.price-badge small {

  font-size: 10px;

}

.price-badge strong {

  font-size: 17px;

}

.breakdown {

  background: #f5faf8;

  border-radius: 10px;

  padding: 12px;

  margin: 14px 0 4px;

}

.breakdown-row,

.breakdown-total {

  display: flex;

  justify-content: space-between;

  gap: 12px;

  font-size: 12px;

  padding: 7px 0;

}

.breakdown-row small {

  color: #688078;

}

.breakdown-total {

  border-top: 1px solid #d9e9e2;

  color: #008d70;

  font-weight: 800;

  font-size: 14px;

}

.medicine-entry {

  margin-top: 20px;

  background: #effaf5;

}

.medicine-entry-top {

  margin-top: 14px;

  margin-bottom: 12px;

}

.finder-back {

  margin: 0 0 6px;

}

.back-action {

  background: transparent;

  border: 1px solid #cde5da;

  color: #007d63;

  border-radius: 10px;

  padding: 10px 12px;

  font-size: 12px;

  font-weight: 750;

  cursor: pointer;

}

.section-back {

  margin-bottom: 16px;

}

.entry-top {

  display: flex;

  gap: 12px;

  align-items: center;

  margin-bottom: 14px;

}

.entry-top h2 {

  margin: 0 0 4px;

  font-size: 16px;

}

.primary-action {

  display: block;

  width: 100%;

  border: 0;

  border-radius: 11px;

  padding: 14px;

  background: #008d70;

  color: #fff;

  font-weight: 800;

  cursor: pointer;

}

.secondary-action {

  display: block;

  width: 100%;

  border: 1px solid #008d70;

  border-radius: 11px;

  padding: 12px;

  background: #fff;

  color: #008d70;

  font-weight: 700;

  margin-top: 8px;

  cursor: pointer;

}

.medicine-panel h2 {

  margin: 0 0 6px;

  font-size: 19px;

}

.search-input {

  width: 100%;

  box-sizing: border-box;

  margin: 14px 0;

}

.medicine-options {

  max-height: 250px;

  overflow-y: auto;

  display: grid;

  gap: 7px;

}

.medicine-option {

  display: flex;

  align-items: center;

  gap: 12px;

  border: 1px solid #e1eee8;

  border-radius: 11px;

  padding: 12px;

  cursor: pointer;

}

.medicine-option input {

  accent-color: #008d70;

  width: 17px;

  height: 17px;

}

.medicine-option span {

  display: flex;

  flex-direction: column;

  gap: 4px;

}

.medicine-option strong {

  font-size: 13px;

}

.medicine-option small {

  color: #6a8079;

  font-size: 11px;

}

.chosen-list {

  border-top: 1px solid #e0eee8;

  margin-top: 18px;

  padding-top: 10px;

}

.chosen-list h3 {

  font-size: 15px;

}

.chosen-item {

  padding: 12px 0;

  border-bottom: 1px solid #e8f2ee;

}

.chosen-item > strong {

  font-size: 13px;

}

.quantity-row {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 10px;

  margin-top: 9px;

}

.quantity-row select {

  flex: 1;

  min-width: 0;

  font-size: 12px;

}

.stepper {

  display: flex;

  gap: 10px;

  align-items: center;

}

.stepper button {

  border: 0;

  border-radius: 9px;

  background: #e2f4ed;

  color: #007d63;

  font-size: 19px;

  width: 34px;

  height: 34px;

  cursor: pointer;

}

.chosen-list .primary-action {

  margin-top: 16px;

}

.disclaimer {

  color: #687f77;

  font-size: 11px;

  line-height: 1.6;

  margin: 15px 0 0;

}

@media (max-width: 440px) {

  .hero h1 {

    font-size: 19px;

  }

  .quantity-row {

    align-items: stretch;

    flex-direction: column;

  }

  .stepper {

    justify-content: flex-end;

  }

}

.main-tabs {

  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 5px;

  padding: 5px;

  background: #e0f0eb;

  border-radius: 13px;

  margin: 18px 0;

}

.main-tabs button {

  padding: 11px 3px;

  border: 0;

  border-radius: 9px;

  font-size: 12px;

  font-weight: 750;

  color: #42685d;

  background: transparent;

  cursor: pointer;

}

.main-tabs button.active {

  color: #fff;

  background: #008d70;

}

.main-tabs button:disabled {

  opacity: 0.45;

  cursor: not-allowed;

}

.intro-card {

  background: #fff;

  border: 1px solid #e0eee8;

  border-radius: 16px;

  padding: 16px;

}

.intro-card h2,

.medicine-entry h2 {

  font-size: 18px;

  margin: 0 0 7px;

}

.intro-card p,

.medicine-entry p {

  color: #688078;

  font-size: 13px;

  line-height: 1.5;

}

.section-title {

  font-size: 18px;

  margin-top: 20px;

}

.info-text {

  margin: 12px 0 !important;

}

.chosen-heading {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 10px;

}

.remove {

  border: 0;

  color: #b42318;

  background: transparent;

  font-size: 12px;

  cursor: pointer;

}

.compare-section .section-heading h2 {

  font-size: 18px;

  margin: 0 0 5px;

}

.important {

  padding: 12px;

  background: #fff8e8;

  color: #8a5400;

  border-radius: 10px;

}

.availability-tag {

  display: inline-block;

  font-size: 11px;

  font-weight: 700;

  padding: 5px 8px;

  border-radius: 8px;

  background: #e5e9eb;

  color: #56616a;

}

.availability-tag.available {

  background: #dff5e9;

  color: #007b63;

}

.availability-tag.low {

  background: #fff1d5;

  color: #9b6100;

}

.availability-tag.out {

  background: #ffe4e2;

  color: #b42318;

}

.availability-tag.not-listed {

  background: #eceff1;

  color: #53616b;

}

.medicine-breakdown {

  padding: 9px 0;

  border-bottom: 1px solid #e5eee9;

}

.medicine-breakdown:last-of-type {

  border-bottom: 0;

}

.medicine-breakdown .breakdown-row {

  align-items: flex-start;

}

.medicine-breakdown .breakdown-row span {

  display: flex;

  flex-direction: column;

  gap: 5px;

}

.medicine-breakdown .availability-tag {

  margin-top: 3px;

}

.compare-section .pharmacy-card {

  margin: 16px 0;

}

.secondary-action:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}

@media (max-width: 420px) {

  .section-heading {

    flex-direction: column;

    align-items: stretch;

  }

}

.compare-navigation {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 12px;

  margin-bottom: 16px;

}

.home-top-btn {

  --background: transparent;

  --color: #007d63;

  --border-color: #cde5da;

  --border-radius: 10px;

  --box-shadow: none;

  font-size: 12px;

  font-weight: 750;

  margin: 0;

  min-height: 34px;

}

.finder-start {

  padding: 12px 0;

}

.quantity-warning {

  margin: 7px 0 0;

  font-size: 12px;

  line-height: 1.45;

  color: #925900;

  background: #fff7e5;

  padding: 8px 10px;

  border-radius: 8px;

}

.primary-action:disabled { opacity: 0.5; cursor: not-allowed; }

.pharmacy-hint { margin-top: 14px; }

.prescription-import-note { background: #eaf8f1; border: 1px solid #bfe9d6; border-radius: 14px; padding: 14px; margin: 12px 0; }
.prescription-import-note strong { color: #007d63; font-size: 14px; }
.prescription-import-note p { color: #55736a; font-size: 12px; line-height: 1.5; margin: 7px 0 0; }
.quantity-warning { color: #986000 !important; font-size: 12px; }
</style>

