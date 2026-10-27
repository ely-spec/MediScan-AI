<template>
  <ion-page>
    <ion-content :fullscreen="true" class="home-content">
      <div class="page-container">
        <!-- COMPACT MOBILE-FIRST HEADER -->
        <header class="top-header">
          <button
            type="button"
            class="home-avatar"
            aria-label="Open profile"
            @click="goToProfile"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              alt="Profile photo"
              class="home-avatar-img"
            /><ion-icon v-else :icon="person"></ion-icon>
          </button>
          <div class="welcome-copy">
            <span class="welcome-eyebrow">{{ greeting }},</span>
            <h1>{{ userName }}! <span class="welcome-wave">✦</span></h1>
            <p>Your health, made simpler every day.</p>
          </div>
          <div class="header-tools">
            <div class="live-clock">
              <ion-icon :icon="timeOutline" /><span>{{ liveTime }}</span
              ><small>{{ liveDate }}</small>
            </div>
            <button
              type="button"
              class="notification-button"
              aria-label="Notifications"
              @click="showNotifications"
            >
              <ion-icon :icon="notifications"></ion-icon>
            </button>
          </div>
        </header>
        <div
          v-if="notificationOpen"
          class="notification-backdrop"
          @click="notificationOpen = false"
        ></div>
        <section
          v-if="notificationOpen"
          class="notification-panel"
          aria-label="Notifications"
        >
          <div class="notification-heading">
            <strong>Notifications</strong
            ><button type="button" @click="markAllRead">
              Mark all as read
            </button>
          </div>
          <div
            v-for="item in notificationItems"
            :key="item.id"
            class="notification-item"
            :class="{ unread: !item.read }"
          >
            <span class="notification-item-icon"
              ><ion-icon :icon="item.icon"
            /></span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.message }}</p>
            </div>
            <span v-if="!item.read" class="unread-dot"></span>
          </div>
          <div class="notification-footer">
            {{
              unreadCount
                ? `${unreadCount} unread updates`
                : "You are all caught up!"
            }}
          </div>
        </section>
        <!-- FEATURED PRESCRIPTION SCANNER -->
        <section class="hero">
          <div class="hero-text">
            <h2>Scan Prescription</h2>
            <p>Turn a prescription photo into clear, organized information.</p>
            <button type="button" class="hero-cta" @click="scanPrescription">
              Scan Now <ion-icon :icon="chevronForward"></ion-icon>
            </button>
          </div>
        </section>
        <!-- PRIMARY SHORTCUTS -->
        <section class="quick-actions" aria-label="Quick actions">
          <button type="button" @click="goToMedicine">
            <span class="quick-icon"><ion-icon :icon="search"></ion-icon></span>
            <span>Search<br />Medicine</span>
          </button>
          <button type="button" @click="identifyMedicine">
            <span class="quick-icon"><ion-icon :icon="camera"></ion-icon></span>
            <span>Identify<br />Medicine</span>
          </button>
          <button type="button" @click="goToPharmacy">
            <span class="quick-icon"
              ><ion-icon :icon="medicalOutline"></ion-icon
            ></span>
            <span>Nearby<br />Pharmacies</span>
          </button>
          <button type="button" @click="goToComparison">
            <span class="quick-icon"
              ><ion-icon :icon="documentText"></ion-icon
            ></span>
            <span>Cost<br />Comparison</span>
          </button>
        </section>
        <!-- SECONDARY FEATURES: KEEP PRESCRIPTIONS AND REMINDERS -->
        <div class="feature-label">Explore Your Health Tools</div>
        <section class="action-grid">
          <button
            type="button"
            class="action-card prescription-card"
            @click="goToPrescriptions"
          >
            <div class="action-icon purple-icon">
              <ion-icon :icon="documentText"></ion-icon>
            </div>
            <div class="action-info">
              <h3>My Prescriptions</h3>
              <p>View your saved prescriptions</p>
            </div>
            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>
          <button
            type="button"
            class="action-card reminder-card"
            @click="showReminder"
          >
            <div class="action-icon orange-icon">
              <ion-icon :icon="notifications"></ion-icon>
            </div>
            <div class="action-info">
              <h3>Medication Reminders</h3>
              <p>Reminders coming soon</p>
            </div>
            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>
        </section>
        <!-- LIVE ACCOUNT SUMMARY -->
        <section class="section-block dashboard-summary">
          <div class="section-heading"><h2>Your Health at a Glance</h2></div>
          <div class="summary-grid">
            <button
              type="button"
              class="summary-tile saved-card"
              @click="goToPrescriptions"
            >
              <ion-icon :icon="documentText"></ion-icon>
              <strong>{{
                loading
                  ? "…"
                  : prescriptionCount === null
                    ? "—"
                    : prescriptionCount
              }}</strong>
              <small>{{
                loading
                  ? "Checking your records"
                  : prescriptionCount === null
                    ? "Records unavailable"
                    : prescriptionCount === 0
                      ? "Ready for your first scan"
                      : "Your saved scans"
              }}</small>
              <span>Saved Prescriptions</span>
            </button>
            <button
              type="button"
              class="summary-tile medicine-card"
              @click="goToPrescriptions"
            >
              <ion-icon :icon="medicalOutline"></ion-icon>
              <strong>{{
                loading ? "…" : medicineCount === null ? "—" : medicineCount
              }}</strong>
              <small>{{
                loading
                  ? "Checking your records"
                  : medicineCount === null
                    ? "Count not available"
                    : medicineCount === 0
                      ? "No medicines recorded yet"
                      : "Medicines from your records"
              }}</small>
              <span>Medicines in Records</span>
            </button>
          </div>
          <div v-if="dashboardError" class="dashboard-hint">
            <ion-icon :icon="shieldCheckmarkOutline" /><span>{{
              dashboardError
            }}</span>
          </div>
          <p
            v-else-if="!loading && prescriptionCount === 0"
            class="dashboard-tip"
          >
            Start your health journey by scanning and saving your first
            prescription.
          </p>
        </section>
        <!-- RECENT PRESCRIPTIONS FROM SUPABASE -->
        <section class="section-block recent-section">
          <div class="section-heading">
            <h2>Recent Prescriptions</h2>
            <button type="button" @click="goToPrescriptions">
              See All <ion-icon :icon="chevronForward"></ion-icon>
            </button>
          </div>
          <div v-if="loading" class="dashboard-empty">
            Loading your prescriptions…
          </div>
          <div v-else-if="recentPrescriptions.length" class="recent-grid">
            <button
              v-for="(record, index) in recentPrescriptions"
              :key="String(record.id ?? index)"
              type="button"
              class="recent-card"
              @click="goToPrescriptions"
            >
              <div class="rx-preview">Rx</div>
              <div>
                <span>{{ formatRecordDate(record) }}</span>
                <h3>{{ recordTitle(record) }}</h3>
                <p>{{ recordMedicineSummary(record) }}</p>
              </div>
            </button>
          </div>
          <div v-else class="dashboard-empty">
            No saved prescriptions yet. Scan your first prescription to see it
            here.
          </div>
        </section>
        <!-- DISCLAIMER -->
        <div class="medical-note">
          <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          <p>
            MediScan AI provides medicine information for educational purposes
            and does not replace professional medical advice.
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import {
  IonPage,
  IonContent,
  IonIcon,
  alertController,
  onIonViewWillEnter,
} from "@ionic/vue";
import {
  camera,
  search,
  documentText,
  notifications,
  person,
  chevronForward,
  shieldCheckmark,
  shieldCheckmarkOutline,
  medicalOutline,
  timeOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";
import { useRouter } from "vue-router";
import { supabase } from "../utils/supabase";
const router = useRouter();
type PrescriptionRecord = Record<string, unknown>;
const userName = ref("there");
const avatarUrl = ref("");
const loading = ref(true);
const dashboardError = ref("");
const prescriptionCount = ref<number | null>(null);
const medicineCount = ref<number | null>(null);
const recentPrescriptions = ref<PrescriptionRecord[]>([]);
const now = ref(new Date());
let clockInterval: ReturnType<typeof setInterval> | undefined;
const greeting = computed(() => {
  const hour = now.value.getHours();
  return hour < 12
    ? "Good morning"
    : hour < 17
      ? "Good afternoon"
      : "Good evening";
});
const liveTime = computed(() =>
  now.value.toLocaleTimeString("en-PH", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }),
);
const liveDate = computed(() =>
  now.value.toLocaleDateString("en-PH", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }),
);
const notificationOpen = ref(false);
const notificationRead = ref(false);
const notificationItems = computed(() => [
  {
    id: 1,
    icon: checkmarkCircleOutline,
    title: "Welcome to MediScan AI!",
    message: "Your account is ready to use.",
    read: notificationRead.value,
  },
  {
    id: 2,
    icon: documentText,
    title: "Prescription Scanner",
    message: "Scan and save prescriptions securely.",
    read: notificationRead.value,
  },
  {
    id: 3,
    icon: medicalOutline,
    title: "Pharmacy Finder",
    message: "Find pharmacies and compare estimated prices.",
    read: notificationRead.value,
  },
  {
    id: 4,
    icon: notifications,
    title: "Medication Reminders",
    message: "Reminder scheduling is coming soon.",
    read: true,
  },
]);
const unreadCount = computed(
  () => notificationItems.value.filter((item) => !item.read).length,
);
function markAllRead() {
  notificationRead.value = true;
  try {
    localStorage.setItem("mediscan_home_notifications_read", "true");
  } catch {
    /* storage unavailable */
  }
}
onMounted(() => {
  now.value = new Date();
  clockInterval = setInterval(() => {
    now.value = new Date();
  }, 1000);
  try {
    notificationRead.value =
      localStorage.getItem("mediscan_home_notifications_read") === "true";
  } catch {
    /* storage unavailable */
  }
});
onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval);
});
function getMedicines(record: PrescriptionRecord): unknown[] | null {
  for (const key of [
    "prescription_medicines",
    "medicines",
    "medications",
    "items",
    "extracted_medicines",
  ]) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  const analysis =
    record.analysis_result ?? record.result ?? record.extracted_data;
  if (analysis && typeof analysis === "object") {
    const data = analysis as Record<string, unknown>;
    for (const key of ["medicines", "medications"]) {
      if (Array.isArray(data[key])) return data[key] as unknown[];
    }
  }
  return null;
}
function recordTitle(record: PrescriptionRecord): string {
  for (const key of ["title", "patient_name", "prescription_name"]) {
    if (typeof record[key] === "string" && String(record[key]).trim())
      return String(record[key]);
  }
  return "Saved Prescription";
}
function recordMedicineSummary(record: PrescriptionRecord): string {
  const medicines = getMedicines(record);
  return medicines
    ? `${medicines.length} medicine${medicines.length === 1 ? "" : "s"}`
    : "View prescription details";
}
function formatRecordDate(record: PrescriptionRecord): string {
  const raw = record.created_at ?? record.saved_at ?? record.date;
  if (typeof raw !== "string") return "Saved prescription";
  const date = new Date(raw);
  return Number.isNaN(date.getTime())
    ? "Saved prescription"
    : date.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}
async function loadDashboard() {
  loading.value = true;
  dashboardError.value = "";
  prescriptionCount.value = null;
  medicineCount.value = null;
  recentPrescriptions.value = [];
  avatarUrl.value = "";
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      userName.value = "there";
      dashboardError.value = "Sign in to view your saved health records.";
      return;
    }
    const metadata = user.user_metadata ?? {};
    const fullName =
      metadata.full_name ||
      metadata.display_name ||
      metadata.name ||
      user.email?.split("@")[0] ||
      "there";
    userName.value = String(fullName).trim().split(/\s+/)[0] || "there";
    const avatarPath = metadata.avatar_path;
    if (
      typeof avatarPath === "string" &&
      avatarPath.startsWith(`${user.id}/`)
    ) {
      const { data } = await supabase.storage
        .from("profile-photos")
        .createSignedUrl(avatarPath, 3600);
      avatarUrl.value = data?.signedUrl ?? "";
    }
    // Records are scoped to the logged-in account. No sample data is used for totals.
    const { data, error } = await supabase
      .from("prescriptions")
      .select("*, prescription_medicines(id, medicine_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (error) {
      dashboardError.value =
        "Your prescription summary is temporarily unavailable. You can still use the other tools.";
      return;
    }
    const records = (data ?? []) as PrescriptionRecord[];
    prescriptionCount.value = records.length;
    recentPrescriptions.value = records.slice(0, 3);
    medicineCount.value = records.reduce<number>((total, record) => {
      const items = record.prescription_medicines;
      return total + (Array.isArray(items) ? items.length : 0);
    }, 0);
  } catch (error) {
    console.error("Home dashboard load failed:", error);
    dashboardError.value = "Could not load the dashboard. Please try again.";
  } finally {
    loading.value = false;
  }
}
onIonViewWillEnter(loadDashboard);
const scanPrescription = () => router.push("/scan-prescription");
const goToMedicine = () => router.push("/tabs/medicine");
const goToPrescriptions = () => router.push("/tabs/prescriptions");
const goToProfile = () => router.push("/tabs/profile");
const identifyMedicine = () => router.push("/identify-medicine");
const goToPharmacy = () => router.push("/tabs/pharmacy");
const goToComparison = () => router.push("/tabs/pharmacy");
async function showMessage(header: string, message: string) {
  const alert = await alertController.create({
    header,
    message,
    buttons: ["OK"],
  });
  await alert.present();
}
const showNotifications = () => {
  notificationOpen.value = !notificationOpen.value;
};
const showReminder = () =>
  showMessage(
    "Medication Reminders",
    "Medication reminder scheduling is not configured yet.",
  );
</script>
<style scoped>
/* MediScan AI • Poppins-first accessible home dashboard */
.home-content {
  --background: #eaf8f3;
  font-family: "Poppins", sans-serif;
}
.home-content button {
  font-family: inherit;
}
.page-container {
  position: relative;
  isolation: isolate;
  width: 100%;
  max-width: 660px;
  margin: 0 auto;
  padding: calc(58px + env(safe-area-inset-top, 0px)) 17px
    calc(112px + env(safe-area-inset-bottom, 0px));
  min-height: 100%;
  background-color: #effbf7;
  background-image:
    linear-gradient(
      180deg,
      rgba(244, 255, 251, 0.2),
      rgba(246, 255, 251, 0.36)
    ),
    url("/mediscan/mediscan-home-bg.webp");
  background-position:
    center top,
    center top;
  background-size:
    100% 100%,
    100% auto;
  background-repeat: no-repeat, repeat-y;
}
.page-container::before {
  content: "+";
  position: absolute;
  z-index: -1;
  top: 340px;
  left: 5px;
  font-size: 86px;
  font-weight: 400;
  color: #4ac7a90d;
  pointer-events: none;
}
.page-container::after {
  content: "";
  position: absolute;
  z-index: -1;
  right: 0;
  top: 800px;
  width: 180px;
  height: 180px;
  border: 30px solid #4bc7a20b;
  border-radius: 50%;
  pointer-events: none;
}
.top-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  position: relative;
}
.home-avatar {
  width: 62px;
  height: 62px;
  flex: 0 0 62px;
  border: 3px solid white;
  border-radius: 50%;
  background: #dff7ef;
  color: #098a70;
  display: grid;
  place-items: center;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 7px 19px #124f4023;
  cursor: pointer;
}
.home-avatar ion-icon {
  font-size: 30px;
}
.home-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.welcome-copy {
  flex: 1;
  min-width: 0;
}
.welcome-eyebrow {
  color: #54796e;
  font-size: 14px;
  font-weight: 650;
}
.welcome-copy h1 {
  margin: 2px 0 4px;
  font-size: 28px;
  line-height: 1.12;
  letter-spacing: -0.65px;
  color: #153a30;
  font-weight: 800;
  overflow-wrap: anywhere;
}
.welcome-wave {
  color: #00a88a;
}
.welcome-copy p {
  margin: 0;
  font-size: 13px;
  line-height: 1.35;
  color: #65857a;
}
.header-tools {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
}
.live-clock {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 11px 12px;
  background: #e0f7ee;
  border: 1px solid #ccecdf;
  border-radius: 24px;
  color: #087660;
  font-weight: 800;
  font-size: 12px;
  white-space: nowrap;
}
.live-clock ion-icon {
  font-size: 17px;
}
.live-clock small {
  display: none;
}
.notification-button {
  width: 49px;
  height: 49px;
  border: 1px solid #e0f0e9;
  border-radius: 50%;
  background: #fff;
  color: #07876e;
  display: grid;
  place-items: center;
  box-shadow: 0 6px 17px #124f4018;
  cursor: pointer;
}
.notification-button ion-icon {
  font-size: 25px;
}
/* The artwork is a background; the text and CTA remain real, accessible controls. */
.hero {
  position: relative;
  isolation: isolate;
  min-height: 255px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border-radius: 26px;
  padding: 27px 23px;
  background-color: #006b60;
  background-image:
    linear-gradient(
      90deg,
      rgba(0, 65, 58, 0.87) 0%,
      rgba(0, 92, 80, 0.69) 36%,
      rgba(0, 92, 80, 0.04) 72%
    ),
    url("/mediscan/mediscan-scan-banner.webp");
  background-size: cover;
  background-position:
    center,
    58% center;
  background-repeat: no-repeat;
  box-shadow: 0 16px 32px #006f5b29;
}

.hero-text {
  position: relative;
  z-index: 2;
  width: 67%;
}
.hero-text h2 {
  color: #fff;
  font-size: 30px;
  letter-spacing: -0.6px;
  line-height: 1.14;
  margin: 0 0 12px;
  font-weight: 800;
}
.hero-text p {
  color: #e0fff6;
  font-size: 15px;
  line-height: 1.55;
  margin: 0;
}
.hero-cta {
  margin-top: 23px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 14px 17px;
  border: 0;
  border-radius: 15px;
  background: #edfff9;
  color: #006e5e;
  font-size: 15px;
  font-weight: 800;
  box-shadow: 0 7px 18px #003b342c;
  cursor: pointer;
}
.hero-cta ion-icon {
  font-size: 19px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
  margin: 20px 0 34px;
}
.quick-actions button {
  min-width: 0;
  min-height: 132px;
  padding: 13px 4px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 11px;
  border: 1px solid #e2eee8;
  border-radius: 21px;
  background: linear-gradient(150deg, #fff, #fafffd);
  color: #163b31;
  font-size: 13px;
  line-height: 1.25;
  font-weight: 800;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 9px 22px #125f4914;
}
.quick-icon {
  width: 52px;
  height: 52px;
  border-radius: 17px;
  background: linear-gradient(140deg, #e2faf2, #cef5e8);
  color: #008f78;
  display: grid;
  place-items: center;
  box-shadow: inset 0 1px 0 #fff;
}
.quick-icon ion-icon {
  font-size: 28px;
}
.feature-label,
.section-heading h2 {
  font-size: 23px;
  font-weight: 800;
  color: #193c32;
  letter-spacing: -0.5px;
  line-height: 1.3;
}
.feature-label {
  margin: 0 0 17px;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
  margin-bottom: 36px;
}
.action-card {
  position: relative;
  overflow: hidden;
  min-width: 0;
  min-height: 178px;
  padding: 19px;
  border: 1px solid #ffffffbb;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  color: #18372e;
  cursor: pointer;
  box-shadow: 0 10px 25px #184f3f12;
}
.action-card::before {
  content: "";
  position: absolute;
  width: 120px;
  height: 120px;
  right: -55px;
  top: -55px;
  border: 18px solid #ffffff75;
  border-radius: 50%;
  pointer-events: none;
}
.prescription-card {
  background: linear-gradient(140deg, #f8f6ff, #ebe9ff);
}
.reminder-card {
  background: linear-gradient(140deg, #fff9f4, #ffeadc);
}
.action-icon {
  width: 54px;
  height: 54px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  box-shadow: 0 5px 15px #453a5810;
}
.action-icon ion-icon {
  font-size: 28px;
}
.purple-icon {
  color: #655bc0;
  background: #e3e0ff;
}
.orange-icon {
  color: #d9772d;
  background: #ffe3d1;
}
.action-info {
  position: relative;
  z-index: 1;
}
.action-info h3 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.28;
}
.action-info p {
  margin: 0;
  color: #647a72;
  font-size: 13px;
  line-height: 1.45;
}
.action-card .arrow {
  position: absolute;
  display: block;
  bottom: 19px;
  right: 15px;
  font-size: 18px;
  color: #668b7e;
}
.section-block {
  margin-top: 32px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 17px;
}
.section-heading h2 {
  margin: 0;
}
.section-heading button {
  display: flex;
  align-items: center;
  gap: 3px;
  border: 0;
  background: transparent;
  color: #008d70;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}
.summary-tile {
  position: relative;
  overflow: hidden;
  min-height: 196px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 8px;
  padding: 19px;
  background: linear-gradient(150deg, #fff 48%, #e8faf3);
  border: 1px solid #dceee6;
  border-radius: 25px;
  color: #163e34;
  text-align: left;
  box-shadow: 0 10px 26px #164f3f14;
  cursor: pointer;
}
.summary-tile:nth-child(2) {
  background: linear-gradient(150deg, #fff 48%, #e7f7f6);
}
.summary-tile::after {
  content: "";
  position: absolute;
  right: -40px;
  top: -42px;
  width: 118px;
  height: 118px;
  border-radius: 50%;
  background: #a3eed526;
}
.summary-tile ion-icon {
  font-size: 30px;
  color: #008d71;
  background: #ddf8ed;
  padding: 12px;
  border-radius: 17px;
  box-sizing: content-box;
}
.summary-tile strong {
  font-size: 37px;
  font-weight: 800;
  line-height: 1.1;
  margin-top: 2px;
}
.summary-tile span {
  font-size: 14px;
  font-weight: 750;
  color: #315a4d;
  line-height: 1.3;
}
.summary-tile small {
  font-size: 11px;
  line-height: 1.35;
  color: #6b8a7f;
}
.dashboard-hint {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin: 14px 0 0;
  padding: 13px 14px;
  border: 1px solid #f1ddca;
  border-radius: 15px;
  background: #fff9f2;
  font-size: 13px;
  line-height: 1.5;
  color: #8a6145;
}
.dashboard-hint ion-icon {
  flex: 0 0 20px;
  font-size: 20px;
}
.dashboard-tip {
  margin: 13px 2px 0;
  color: #4b8170;
  font-size: 13px;
  line-height: 1.5;
}
.recent-grid {
  display: grid;
  gap: 11px;
}
.recent-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 15px;
  border: 1px solid #e0eee7;
  border-radius: 19px;
  background: #fff;
  color: #17372f;
  text-align: left;
  box-shadow: 0 6px 16px #164f3f0b;
  cursor: pointer;
}
.rx-preview {
  flex: 0 0 64px;
  height: 66px;
  display: grid;
  place-items: center;
  border-radius: 16px;
  background: #e3f8f0;
  color: #09886e;
  font-size: 24px;
  font-weight: 800;
}
.recent-card span {
  font-size: 12px;
  color: #7b8e86;
}
.recent-card h3 {
  margin: 4px 0;
  font-size: 16px;
}
.recent-card p {
  margin: 0;
  font-size: 13px;
  color: #71857d;
}
.dashboard-empty {
  padding: 23px 19px;
  border: 1px solid #deeee6;
  border-radius: 20px;
  background: #ffffffd9;
  color: #587b6e;
  font-size: 14px;
  line-height: 1.6;
  box-shadow: 0 6px 18px #164f3f0b;
}
.medical-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 30px;
  padding: 18px;
  background: #ddf5eb;
  border: 1px solid #d1ebdf;
  border-radius: 18px;
  color: #59796e;
}
.medical-note ion-icon {
  flex: 0 0 25px;
  font-size: 25px;
  color: #078a6d;
}
.medical-note p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
}
.notification-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #0b262633;
}
.notification-panel {
  position: fixed;
  z-index: 51;
  top: calc(110px + env(safe-area-inset-top, 0px));
  right: 15px;
  width: min(360px, calc(100vw - 30px));
  max-height: 70vh;
  overflow-y: auto;
  border: 1px solid #e5f0ec;
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 16px 50px #123f3433;
}
.notification-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
  padding: 16px;
  border-bottom: 1px solid #e9f2ee;
}
.notification-heading strong {
  font-size: 17px;
}
.notification-heading button {
  border: 0;
  background: transparent;
  color: #00876e;
  font-size: 12px;
  font-weight: 700;
}
.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  padding: 13px 15px;
  border-bottom: 1px solid #eff5f2;
}
.notification-item.unread {
  background: #f6fcf9;
}
.notification-item-icon {
  flex: 0 0 36px;
  height: 36px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e2f8ef;
  color: #008c70;
}
.notification-item strong {
  font-size: 14px;
}
.notification-item p {
  margin: 4px 0 0;
  color: #71867d;
  font-size: 12px;
  line-height: 1.4;
}
.unread-dot {
  position: absolute;
  top: 19px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e76d6d;
}
.notification-footer {
  padding: 12px;
  text-align: center;
  background: #ecfaf4;
  color: #087e65;
  font-size: 12px;
}
button:focus-visible {
  outline: 3px solid #00a888;
  outline-offset: 3px;
}
@media (max-width: 430px) {
  .hero {
    min-height: 252px;
    background-position:
      center,
      59% center;
    background-image:
      linear-gradient(
        90deg,
        rgba(0, 65, 58, 0.94) 0%,
        rgba(0, 79, 70, 0.79) 43%,
        rgba(0, 82, 73, 0.06) 85%
      ),
      url("/mediscan/mediscan-scan-banner.webp");
  }
  .hero-text {
    width: 69%;
  }

  .page-container {
    padding-left: 13px;
    padding-right: 13px;
  }
  .top-header {
    gap: 8px;
  }
  .home-avatar {
    width: 53px;
    height: 53px;
    flex-basis: 53px;
  }
  .welcome-eyebrow {
    font-size: 12px;
  }
  .welcome-copy h1 {
    font-size: 24px;
  }
  .welcome-copy p {
    font-size: 11px;
  }
  .live-clock {
    padding: 9px 8px;
    font-size: 11px;
  }
  .notification-button {
    width: 43px;
    height: 43px;
  }
  .hero-text h2 {
    font-size: 27px;
  }
  .hero-text p {
    font-size: 13px;
  }
  .quick-actions {
    gap: 7px;
  }
  .quick-actions button {
    font-size: 11px;
    padding: 12px 2px;
  }
  .quick-icon {
    width: 45px;
    height: 45px;
  }
  .action-card {
    padding: 16px;
  }
  .action-info h3 {
    font-size: 15px;
  }
  .action-info p {
    font-size: 12px;
  }
  .summary-tile {
    padding: 16px;
  }
  .summary-tile span {
    font-size: 13px;
  }
}
@media (max-width: 355px) {
  .home-avatar {
    width: 46px;
    height: 46px;
    flex-basis: 46px;
  }
  .welcome-copy h1 {
    font-size: 21px;
  }
  .welcome-copy p {
    font-size: 10px;
  }
  .live-clock {
    font-size: 10px;
    padding: 8px 6px;
  }
  .notification-button {
    width: 37px;
    height: 37px;
  }
  .quick-actions button {
    font-size: 10px;
  }
  .hero-text h2 {
    font-size: 24px;
  }
  .hero-text p {
    font-size: 12px;
  }
  .action-info h3 {
    font-size: 14px;
  }
}
@media (min-width: 700px) {
  .page-container {
    padding-top: 48px;
  }
  .hero {
    min-height: 270px;
  }
  .hero-text h2 {
    font-size: 36px;
  }
  .hero-text p {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    scroll-behavior: auto !important;
  }
}

/* Option A — Light Mint Pastel. Text and live counts are Vue elements. */
.action-card,
.summary-tile {
  background-color: #e6f9f2;
  background-size: 100% 100% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  border: 1px solid rgba(255, 255, 255, 0.92);
  box-shadow: 0 9px 23px rgba(27, 116, 91, 0.15);
  color: #143b31;
  isolation: isolate;
}
.action-card::before,
.summary-tile::after {
  display: none;
}
.action-card::after,
.summary-tile::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.46) 0%,
    rgba(255, 255, 255, 0.16) 54%,
    transparent 77%
  );
  pointer-events: none;
}
.prescription-card {
  background-image: url("/mediscan/mediscan-my-prescriptions-pastel.webp");
}
.reminder-card {
  background-image: url("/mediscan/mediscan-medication-reminders-pastel.webp");
}
.summary-tile.saved-card {
  background-image: url("/mediscan/mediscan-saved-prescriptions-pastel.webp");
}
.summary-tile.medicine-card {
  background-image: url("/mediscan/mediscan-medicines-records-pastel.webp");
}
.action-info h3,
.summary-tile strong,
.summary-tile span {
  color: #133b31;
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.7);
}
.action-info p,
.summary-tile small {
  color: #456b5f;
  text-shadow: 0 1px 2px #ffffffa8;
}
.action-card .arrow {
  color: #167c68;
}
.action-icon {
  background: rgba(169, 241, 216, 0.88);
  color: #078c71;
  border: 1px solid #ffffffa8;
}
.orange-icon {
  background: rgba(255, 219, 177, 0.9);
  color: #db792b;
}
.summary-tile ion-icon {
  color: #078c71;
  background: rgba(172, 244, 222, 0.9);
  border: 1px solid #ffffffb0;
}
.summary-tile {
  min-height: 196px;
}
.summary-tile strong {
  font-size: 39px;
}
@media (max-width: 430px) {
  .action-card,
  .summary-tile {
    min-height: 170px;
    padding: 14px;
  }
  .action-info h3 {
    max-width: 150px;
    font-size: 14px;
  }
  .action-info p {
    max-width: 130px;
    font-size: 11px;
  }
  .summary-tile span {
    font-size: 12px;
  }
  .summary-tile small {
    font-size: 10px;
  }

  
/* Clearer text on pastel artwork */
.action-info {
  position: relative;
  z-index: 3;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 100%;
  padding: 7px 10px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 10px rgba(0, 70, 50, 0.06);
}

.action-info h3 {
  color: #143e33 !important;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 3px;
}

.action-info p {
  color: #41675d !important;
  font-weight: 500;
  line-height: 1.35;
  margin: 0;
}

/* Clearer dashboard numbers and labels */
.summary-tile strong,
.summary-tile small {
  color: #143e33 !important;
  text-shadow: 0 1px 2px rgba(255,255,255,0.8);
}

.summary-tile {
  position: relative;
}

.summary-tile strong,
.summary-tile small,
.summary-tile span {
  z-index: 2;
}

/* Smaller phone screens */
@media (max-width: 430px) {
  .action-info {
    padding: 6px 8px;
  }

  .action-info h3 {
    font-size: 12px;
  }

  .action-info p {
    font-size: 10px;
  }
}

/* Remove unwanted white edges around artwork */
.action-card,
.summary-tile {
  position: relative;
  overflow: hidden !important;
  border-radius: 24px !important;
  border: none !important;
  background-color: transparent !important;
  background-size: 100% 100% !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  box-shadow: 0 8px 20px rgba(20, 100, 80, 0.10);
}

/* Remove white layers from card pseudo-elements */
.action-card::before,
.action-card::after,
.summary-tile::before,
.summary-tile::after {
  background-color: transparent !important;
}

/* Keep icons and text above artwork */
.action-card > *,
.summary-tile > * {
  position: relative;
  z-index: 2;
}

/* Center the icon badges horizontally */
.action-card .action-icon,
.summary-tile .summary-icon {
  margin-left: auto !important;
  margin-right: auto !important;
}

/* Keep the icons centered inside their badges */
.action-icon,
.summary-icon {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Move the whole icon badges toward the center */
.action-card .action-icon,
.summary-tile .summary-icon {
  transform: translateX(55px) !important;
}

}
</style>
