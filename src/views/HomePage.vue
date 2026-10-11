<template>
  <ion-page>
    <ion-content :fullscreen="true" class="home-content">
      <div class="page-container">
        <!-- COMPACT MOBILE-FIRST HEADER -->
        <header class="top-header">
          <button type="button" class="home-avatar" aria-label="Open profile" @click="goToProfile"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile photo" class="home-avatar-img" /><ion-icon v-else :icon="person"></ion-icon></button>
          <div class="welcome-copy">
            <span class="welcome-eyebrow">{{ greeting }},</span>
            <h1>{{ userName }}! <span class="welcome-wave">✦</span></h1>
            <p>Your health companion is here for you.</p>
          </div>
          <div class="header-tools">
 <div class="live-clock"><ion-icon :icon="timeOutline" /><span>{{ liveTime }}</span><small>{{ liveDate }}</small></div>
            <button type="button" class="notification-button" aria-label="Notifications" @click="showNotifications">
              <ion-icon :icon="notifications"></ion-icon>
            </button>
          </div>
        </header>
        <div v-if="notificationOpen" class="notification-backdrop" @click="notificationOpen = false"></div>
        <section v-if="notificationOpen" class="notification-panel" aria-label="Notifications">
          <div class="notification-heading"><strong>Notifications</strong><button type="button" @click="markAllRead">Mark all as read</button></div>
          <div v-for="item in notificationItems" :key="item.id" class="notification-item" :class="{ unread: !item.read }">
            <span class="notification-item-icon"><ion-icon :icon="item.icon" /></span>
            <div><strong>{{ item.title }}</strong><p>{{ item.message }}</p></div>
            <span v-if="!item.read" class="unread-dot"></span>
          </div>
          <div class="notification-footer">{{ unreadCount ? `${unreadCount} unread updates` : 'You are all caught up!' }}</div>
        </section>
        <!-- FEATURED PRESCRIPTION SCANNER -->
        <section class="hero">
          <div class="hero-text">
            <h2>Scan Prescription</h2>
            <p>Use AI to read and analyze your prescription.</p>
            <button type="button" class="hero-cta" @click="scanPrescription">
              Start Scanning <ion-icon :icon="chevronForward"></ion-icon>
            </button>
          </div>
          <div class="hero-art" aria-hidden="true">
            <div class="hero-photo"></div>
            <div class="phone">
              <div class="phone-speaker"></div>
              <div class="rx">Rx</div>
              <div class="line long"></div>
              <div class="line"></div>
              <div class="line medium"></div>
              <div class="line short"></div>
            </div>
            <div class="shield"><ion-icon :icon="shieldCheckmark"></ion-icon></div>
            <div class="pill pill-one"></div>
            <div class="pill pill-two"></div>
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
            <span class="quick-icon"><ion-icon :icon="medicalOutline"></ion-icon></span>
            <span>Nearby<br />Pharmacies</span>
          </button>
          <button type="button" @click="goToComparison">
            <span class="quick-icon"><ion-icon :icon="documentText"></ion-icon></span>
            <span>Cost<br />Comparison</span>
          </button>
        </section>
        <!-- SECONDARY FEATURES: KEEP PRESCRIPTIONS AND REMINDERS -->
        <div class="feature-label">Your Health Tools</div>
        <section class="action-grid">
          <button type="button" class="action-card prescription-card" @click="goToPrescriptions">
            <div class="action-icon purple-icon"><ion-icon :icon="documentText"></ion-icon></div>
            <div class="action-info"><h3>My Prescriptions</h3><p>View your saved prescriptions</p></div>
            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>
          <button type="button" class="action-card reminder-card" @click="showReminder">
            <div class="action-icon orange-icon"><ion-icon :icon="notifications"></ion-icon></div>
            <div class="action-info"><h3>Medication Reminders</h3><p>Manage your schedule</p></div>
            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>
        </section>
        <!-- LIVE ACCOUNT SUMMARY -->
        <section class="section-block dashboard-summary">
          <div class="section-heading"><h2>Your Health Overview</h2></div>
          <div class="summary-grid">
            <button type="button" class="summary-tile" @click="goToPrescriptions">
              <ion-icon :icon="documentText"></ion-icon>
              <strong>{{ loading ? '…' : prescriptionCount === null ? '—' : prescriptionCount }}</strong>
              <span>Saved Prescriptions</span>
            </button>
            <button type="button" class="summary-tile" @click="goToPrescriptions">
              <ion-icon :icon="medicalOutline"></ion-icon>
              <strong>{{ loading ? '…' : medicineCount === null ? '—' : medicineCount }}</strong>
              <span>Recorded Medicines</span>
            </button>
          </div>
          <p v-if="dashboardError" class="dashboard-hint">{{ dashboardError }}</p>
        </section>
        <!-- RECENT PRESCRIPTIONS FROM SUPABASE -->
        <section class="section-block recent-section">
          <div class="section-heading">
            <h2>Recent Prescriptions</h2>
            <button type="button" @click="goToPrescriptions">See All <ion-icon :icon="chevronForward"></ion-icon></button>
          </div>
          <div v-if="loading" class="dashboard-empty">Loading your prescriptions…</div>
          <div v-else-if="recentPrescriptions.length" class="recent-grid">
            <button v-for="(record, index) in recentPrescriptions" :key="String(record.id ?? index)" type="button" class="recent-card" @click="goToPrescriptions">
              <div class="rx-preview">Rx</div>
              <div>
                <span>{{ formatRecordDate(record) }}</span>
                <h3>{{ recordTitle(record) }}</h3>
                <p>{{ recordMedicineSummary(record) }}</p>
              </div>
            </button>
          </div>
          <div v-else class="dashboard-empty">No saved prescriptions to show yet. Scan and save one to get started.</div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { IonPage, IonContent, IonIcon, alertController, onIonViewWillEnter } from '@ionic/vue';
import { camera, search, documentText, notifications, person, chevronForward, shieldCheckmarkOutline, medicalOutline, timeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { supabase } from '../utils/supabase';
const router = useRouter();
type PrescriptionRecord = Record<string, unknown>;
const userName = ref('there');
const avatarUrl = ref('');
const loading = ref(true);
const dashboardError = ref('');
const prescriptionCount = ref<number | null>(null);
const medicineCount = ref<number | null>(null);
const recentPrescriptions = ref<PrescriptionRecord[]>([]);
const now = ref(new Date());
let clockInterval: ReturnType<typeof setInterval> | undefined;
const greeting = computed(() => {
  const hour = now.value.getHours();
  return hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
});
const liveTime = computed(() => now.value.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true }));
const liveDate = computed(() => now.value.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' }));
const notificationOpen = ref(false);
const notificationRead = ref(false);
const notificationItems = computed(() => [
  { id: 1, icon: checkmarkCircleOutline, title: 'Welcome to MediScan AI!', message: 'Your account is ready to use.', read: notificationRead.value },
  { id: 2, icon: documentText, title: 'Prescription Scanner', message: 'Scan and save prescriptions securely.', read: notificationRead.value },
  { id: 3, icon: medicalOutline, title: 'Pharmacy Finder', message: 'Find pharmacies and compare estimated prices.', read: notificationRead.value },
  { id: 4, icon: notifications, title: 'Medication Reminders', message: 'Reminder scheduling is coming soon.', read: true }
]);
const unreadCount = computed(() => notificationItems.value.filter(item => !item.read).length);
function markAllRead() {
  notificationRead.value = true;
  try { localStorage.setItem('mediscan_home_notifications_read', 'true'); } catch { /* storage unavailable */ }
}
onMounted(() => {
  now.value = new Date();
  clockInterval = setInterval(() => { now.value = new Date(); }, 1000);
  try { notificationRead.value = localStorage.getItem('mediscan_home_notifications_read') === 'true'; } catch { /* storage unavailable */ }
});
onUnmounted(() => { if (clockInterval) clearInterval(clockInterval); });
function getMedicines(record: PrescriptionRecord): unknown[] | null {
  for (const key of ['medicines', 'medications', 'items', 'extracted_medicines']) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }
  const analysis = record.analysis_result ?? record.result ?? record.extracted_data;
  if (analysis && typeof analysis === 'object') {
    const data = analysis as Record<string, unknown>;
    for (const key of ['medicines', 'medications']) {
      if (Array.isArray(data[key])) return data[key] as unknown[];
    }
  }
  return null;
}
function recordTitle(record: PrescriptionRecord): string {
  for (const key of ['title', 'patient_name', 'prescription_name']) {
    if (typeof record[key] === 'string' && String(record[key]).trim()) return String(record[key]);
  }
  return 'Saved Prescription';
}
function recordMedicineSummary(record: PrescriptionRecord): string {
  const medicines = getMedicines(record);
  return medicines ? `${medicines.length} medicine${medicines.length === 1 ? '' : 's'}` : 'View prescription details';
}
function formatRecordDate(record: PrescriptionRecord): string {
  const raw = record.created_at ?? record.saved_at ?? record.date;
  if (typeof raw !== 'string') return 'Saved prescription';
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? 'Saved prescription' : date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
async function loadDashboard() {
  loading.value = true;
  dashboardError.value = '';
  prescriptionCount.value = null;
  medicineCount.value = null;
  recentPrescriptions.value = [];
  avatarUrl.value = '';
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      userName.value = 'there';
      dashboardError.value = 'Sign in to view your saved health records.';
      return;
    }
    const metadata = user.user_metadata ?? {};
    const fullName = metadata.full_name || metadata.display_name || metadata.name || user.email?.split('@')[0] || 'there';
    userName.value = String(fullName).trim().split(/\s+/)[0] || 'there';
    const avatarPath = metadata.avatar_path;
    if (typeof avatarPath === 'string' && avatarPath.startsWith(`${user.id}/`)) {
      const { data } = await supabase.storage.from('profile-photos').createSignedUrl(avatarPath, 3600);
      avatarUrl.value = data?.signedUrl ?? '';
    }
    // Records are scoped to the logged-in account. No sample data is used for totals.
    const { data, error } = await supabase.from('prescriptions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1000);
    if (error) {
      dashboardError.value = 'Prescription summary could not load. Check your prescriptions table and access policies.';
      return;
    }
    const records = (data ?? []) as PrescriptionRecord[];
    prescriptionCount.value = records.length;
    recentPrescriptions.value = records.slice(0, 3);
    const arrays = records.map(getMedicines);
    // If the schema stores medicines in a separate table, do not show a misleading zero.
    medicineCount.value = arrays.every((entry) => entry !== null) ? arrays.reduce<number>((sum, entry) => sum + (entry?.length ?? 0), 0) : null;
  } catch (error) {
    console.error('Home dashboard load failed:', error);
    dashboardError.value = 'Could not load the dashboard. Please try again.';
  } finally {
    loading.value = false;
  }
}
onMounted(loadDashboard);
onIonViewWillEnter(loadDashboard);
const scanPrescription = () => router.push('/scan-prescription');
const goToMedicine = () => router.push('/tabs/medicine');
const goToPrescriptions = () => router.push('/tabs/prescriptions');
const goToProfile = () => router.push('/tabs/profile');
const identifyMedicine = () => router.push('/identify-medicine');
const goToPharmacy = () => router.push('/tabs/pharmacy');
const goToComparison = () => router.push('/tabs/pharmacy');
async function showMessage(header: string, message: string) {
  const alert = await alertController.create({ header, message, buttons: ['OK'] });
  await alert.present();
}
const showNotifications = () => { notificationOpen.value = !notificationOpen.value; };
const showReminder = () => showMessage('Medication Reminders', 'Medication reminder scheduling is not configured yet.');
</script>
<style scoped>
.home-content {
  --background: #f7fbfa;
  color: #12241e;
}
.page-container {
  width: min(100%, 1000px);
  margin: auto;
  padding: 35px 28px 120px;
}
/* HEADER */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.brand-icon {
  width: 58px;
  height: 58px;
  border-radius: 20px;
  background: linear-gradient(135deg, #e2faf3, #b9f0df);
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-icon ion-icon {
  font-size: 34px;
  color: #07966e;
}
.brand h1 {
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  color: #102019;
}
.brand h1 span {
  color: #06966d;
}
.brand p {
  margin: 3px 0 0;
  color: #74817d;
  font-size: 15px;
}
.user-area {
  display: flex;
  align-items: center;
  gap: 14px;
}
.greeting {
  text-align: right;
}
.greeting span {
  display: block;
  color: #64716d;
  font-size: 14px;
}
.greeting strong {
  font-size: 20px;
}
.profile-circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background: #e5ecea;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}
.profile-circle ion-icon {
  font-size: 31px;
  color: #36463f;
}
.online-dot {
  width: 12px;
  height: 12px;
  background: #0bb982;
  border-radius: 50%;
  border: 2px solid white;
  position: absolute;
  right: 1px;
  bottom: 5px;
}
/* HERO */
.hero {
  min-height: 270px;
  border-radius: 30px;
  background:
    radial-gradient(
      circle at 85% 20%,
      rgba(255,255,255,.7),
      transparent 25%
    ),
    linear-gradient(110deg, #e4faf4, #bdeee1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 35px 45px;
  margin-bottom: 25px;
}
.hero-text {
  width: 52%;
  position: relative;
  z-index: 2;
}
.hero-text h2 {
  margin: 0 0 18px;
  font-size: 44px;
  line-height: 1.08;
  color: #11231d;
}
.hero-text h2 span {
  color: #078d68;
}
.hero-text p {
  max-width: 480px;
  margin: 0;
  line-height: 1.55;
  font-size: 18px;
  color: #53655f;
}
.hero-art {
  width: 40%;
  height: 220px;
  position: relative;
}
.phone {
  position: absolute;
  right: 60px;
  top: 5px;
  width: 125px;
  height: 205px;
  background: white;
  border: 8px solid #167d6a;
  border-radius: 25px;
  transform: rotate(5deg);
  padding: 45px 15px 15px;
  box-shadow: 0 15px 30px rgba(0, 100, 80, .18);
}
.phone-speaker {
  width: 40px;
  height: 6px;
  background: #166c60;
  border-radius: 10px;
  position: absolute;
  top: 13px;
  left: 34px;
}
.rx {
  color: #859c96;
  font-size: 27px;
  font-weight: 800;
  margin-bottom: 15px;
}
.line {
  width: 70%;
  height: 7px;
  background: #c7d1ce;
  border-radius: 10px;
  margin-bottom: 10px;
}
.line.long {
  width: 90%;
}
.line.medium {
  width: 75%;
}
.line.short {
  width: 50%;
}
.shield {
  position: absolute;
  right: 5px;
  bottom: 12px;
  width: 100px;
  height: 100px;
  border-radius: 35px;
  background: linear-gradient(145deg, #2fd5a8, #087e62);
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(5deg);
  box-shadow: 0 12px 25px rgba(0, 100, 70, .22);
}
.shield ion-icon {
  font-size: 58px;
  color: white;
}
.pill {
  position: absolute;
  width: 47px;
  height: 21px;
  border-radius: 20px;
  background: linear-gradient(90deg, white 50%, #069b73 50%);
  box-shadow: 0 6px 12px rgba(0,0,0,.15);
}
.pill-one {
  bottom: 20px;
  left: 40px;
  transform: rotate(35deg);
}
.pill-two {
  top: 30px;
  left: 25px;
  transform: rotate(-30deg);
}
/* ACTION CARDS */
.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 38px;
}
.action-card {
  border: none;
  min-height: 135px;
  border-radius: 25px;
  background: white;
  padding: 22px;
  display: flex;
  align-items: center;
  text-align: left;
  gap: 18px;
  cursor: pointer;
  box-shadow: 0 5px 18px rgba(32, 70, 60, .07);
  color: #13221d;
  transition: .2s;
}
.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(32, 70, 60, .12);
}
.scan-card {
  background: linear-gradient(135deg, #087e5f, #0aa879);
  color: white;
}
.prescription-card {
  background: linear-gradient(135deg, #f8f8ff, #eeeeff);
}
.reminder-card {
  background: linear-gradient(135deg, #fff9f4, #fff0e5);
}
.action-icon {
  width: 68px;
  height: 68px;
  min-width: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.action-icon ion-icon {
  font-size: 35px;
}
.scan-icon {
  background: rgba(255,255,255,.18);
}
.green-icon {
  background: #d8f6ed;
  color: #078d69;
}
.purple-icon {
  background: #e8e8ff;
  color: #615fc0;
}
.orange-icon {
  background: #ffeadb;
  color: #e26d1e;
}
.action-info {
  flex: 1;
}
.action-info h3 {
  font-size: 21px;
  margin: 0 0 7px;
  font-weight: 750;
}
.action-info p {
  margin: 0;
  opacity: .72;
  font-size: 15px;
  line-height: 1.4;
}
.arrow {
  font-size: 25px;
}
/* SECTIONS */
.section-block {
  margin-top: 35px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
.section-heading h2 {
  margin: 0;
  font-size: 27px;
}
.section-heading button {
  border: none;
  background: transparent;
  color: #078c68;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.medication-list {
  background: white;
  border-radius: 27px;
  padding: 5px 25px;
  box-shadow: 0 5px 20px rgba(30, 70, 60, .06);
}
.medicine-row {
  min-height: 100px;
  display: flex;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #edf0ef;
}
.medicine-row:last-child {
  border-bottom: none;
}
.medicine-pill {
  width: 52px;
  height: 24px;
  border-radius: 20px;
  transform: rotate(-40deg);
  box-shadow: 0 3px 8px rgba(0,0,0,.15);
}
.red-pill {
  background: linear-gradient(90deg, #ef3636 50%, white 50%);
}
.white-pill {
  background: linear-gradient(90deg, #e6e8e8 50%, white 50%);
}
.yellow-pill {
  background: linear-gradient(90deg, #ffbd00 50%, #ffe257 50%);
}
.medicine-details {
  flex: 1;
}
.medicine-details h3 {
  margin: 0 0 5px;
  font-size: 19px;
}
.medicine-details p {
  margin: 0;
  color: #75817e;
}
.medicine-time {
  padding: 9px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 700;
}
.red-time {
  background: #fff0f0;
  color: #e43b3b;
}
.green-time {
  background: #e6f8f1;
  color: #078b67;
}
.blue-time {
  background: #eaf5ff;
  color: #2385d4;
}
.medicine-arrow {
  color: #8b9995;
  font-size: 23px;
}
/* RECENT */
.recent-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
}
.recent-card {
  width: 100%;
  border: none;
  background: white;
  border-radius: 22px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 17px;
  text-align: left;
  color: #13221d;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(30,70,60,.06);
}
.recent-card:hover {
  transform: translateY(-2px);
}
.rx-preview {
  width: 90px;
  height: 70px;
  min-width: 90px;
  border-radius: 13px;
  background:
    repeating-linear-gradient(
      #ecefee,
      #ecefee 5px,
      white 5px,
      white 12px
    );
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  font-weight: 800;
  color: #25362f;
}
.recent-card span {
  color: #8b9693;
  font-size: 14px;
}
.recent-card h3 {
  margin: 5px 0;
  font-size: 18px;
}
.recent-card p {
  margin: 0;
  color: #74807d;
}
/* DISCLAIMER */
.medical-note {
  margin-top: 35px;
  background: #e8f8f3;
  padding: 17px 20px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: #64746f;
  font-size: 13px;
}
.medical-note ion-icon {
  color: #07966e;
  font-size: 27px;
}
.medical-note p {
  margin: 0;
}
/* MOBILE */
@media (max-width: 700px) {
  .page-container {
    padding:
      calc(25px + env(safe-area-inset-top))
      18px
      calc(110px + env(safe-area-inset-bottom));
  }
  .brand h1 {
    font-size: 26px;
  }
  .brand p {
    font-size: 12px;
  }
  .greeting span {
    display: none;
  }
  .greeting strong {
    font-size: 15px;
  }
  .hero {
    padding: 28px 25px;
    min-height: 235px;
  }
  .hero-text {
    width: 65%;
  }
  .hero-text h2 {
    font-size: 34px;
  }
  .hero-text p {
    font-size: 15px;
  }
  .hero-art {
    width: 35%;
    transform: scale(.8);
  }
  .action-grid {
    grid-template-columns: 1fr;
  }
  .recent-grid {
    grid-template-columns: 1fr;
  }
  .medicine-time {
    font-size: 12px;
    padding: 7px 9px;
  }
  .medicine-details h3 {
    font-size: 16px;
  }
  .medicine-details p {
    font-size: 13px;
  }
}
/* ============================================================
   MEDISCAN AI — PREMIUM 3D MOBILE HOME REDESIGN
   Non-destructive style overrides. Original CSS above retained.
   Bottom navigation is owned by TabsPage.vue, not this file.
   ============================================================ */
.home-content { --background: #f5faf9; }
.page-container { max-width: 1060px; padding-top: 26px; }
.top-header { margin-bottom: 20px; }
.brand-icon {
  background: linear-gradient(145deg,#e7fff7,#8bdfc7);
  border: 1px solid #fff;
  box-shadow: 0 7px 18px rgba(0,125,100,.13), inset 0 2px 7px #fff;
}
.brand h1 { font-size: 28px; letter-spacing: -.8px; }
.brand p { font-size: 11px; letter-spacing: 1.4px; font-weight: 700; text-transform: uppercase; }
.profile-circle { border: 3px solid white; box-shadow: 0 4px 16px rgba(5,84,72,.12); }
.hero {
  position: relative;
  min-height: 270px;
  border-radius: 27px;
  padding: 31px 36px;
  background: radial-gradient(circle at 85% 8%,rgba(92,250,217,.6),transparent 33%),
              linear-gradient(120deg,#005b51 0%,#007c6e 55%,#00b39c 100%);
  box-shadow: 0 18px 35px rgba(0,114,97,.16);
}
.hero::after {
  content: '';
  position: absolute;
  width: 190px; height: 190px;
  border-radius: 50%;
  right: -42px; top: -88px;
  background: radial-gradient(circle at 32% 28%,rgba(255,255,255,.65),rgba(96,247,220,.1) 55%,transparent 70%);
  border: 1px solid rgba(255,255,255,.2);
  pointer-events: none;
}
.hero-text { width: 55%; }
.hero-kicker { font-size: 11px; color: #a8fff0; font-weight: 800; letter-spacing: 1.7px; margin-bottom: 10px; }
.hero-text h2 { font-size: 36px; color: #fff; line-height: 1.12; margin-bottom: 12px; }
.hero-text h2 span { color: #b4fff1; }
.hero-text p { color: #d9fff5; font-size: 14px; max-width: 380px; }
.hero-cta {
  margin-top: 19px; display: inline-flex; align-items: center; gap: 6px;
  padding: 11px 16px; background: #e8fff9; color: #005f54;
  border: 0; border-radius: 11px; font-weight: 800; font-size: 13px;
  box-shadow: 0 5px 16px rgba(0,40,35,.16); cursor: pointer;
}
.hero-cta ion-icon { font-size: 15px; }
.hero-art { z-index: 1; }
.phone { border-color: #b8fff0; box-shadow: 0 14px 28px rgba(0,25,22,.3); }
.shield { background: linear-gradient(135deg,#6df9d8,#00a68b); }
.quick-actions { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin: 17px 0 27px; }
.quick-actions button {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 0; gap: 9px; padding: 16px 6px 14px;
  border: 1px solid #e6f3f0; border-radius: 18px;
  background: #fff; color: #14352f; cursor: pointer;
  box-shadow: 0 5px 16px rgba(22,92,76,.06);
  font-weight: 750; font-size: 12px; line-height: 1.3; text-align: center;
}
.quick-icon {
  width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;
  border-radius: 14px; color: #008d79;
  background: linear-gradient(145deg,#e9fff8,#d0f5e9);
}
.quick-icon ion-icon { font-size: 23px; }
.feature-label { color: #173a32; font-size: 18px; font-weight: 800; margin: 0 0 12px; }
.action-grid { gap: 12px; margin-bottom: 28px; }
.action-card { min-height: 105px; border-radius: 20px; padding: 16px; gap: 12px; }
.action-icon { width: 50px; height: 50px; min-width: 50px; }
.action-icon ion-icon { font-size: 25px; }
.action-info h3 { font-size: 16px; margin-bottom: 4px; }
.action-info p { font-size: 12px; }
.arrow { font-size: 19px; }
.section-block { margin-top: 24px; }
.section-heading h2 { font-size: 21px; color: #17352f; }
.section-heading button { font-size: 13px; }
.medication-list { border: 1px solid #eef5f3; border-radius: 22px; }
.medicine-row { min-height: 80px; }
.medicine-details h3 { font-size: 15px; }
.medicine-details p { font-size: 12px; }
.medicine-time { font-size: 12px; }
.recent-card { border: 1px solid #edf4f1; }
.medical-note { font-size: 12px; }
button:focus-visible, .profile-circle:focus-visible { outline: 3px solid #26bba0; outline-offset: 3px; }
@media (max-width: 700px) {
  .page-container { padding: calc(18px + env(safe-area-inset-top)) 15px calc(100px + env(safe-area-inset-bottom)); }
  .top-header { margin-bottom: 16px; }
  .brand { gap: 8px; }
  .brand-icon { width: 41px; height: 41px; border-radius: 13px; }
  .brand-icon ion-icon { font-size: 25px; }
  .brand h1 { font-size: 20px; }
  .brand p { font-size: 8px; letter-spacing: .8px; }
  .user-area { gap: 7px; }
  .greeting strong { font-size: 12px; }
  .profile-circle { width: 42px; height: 42px; }
  .profile-circle ion-icon { font-size: 24px; }
  .hero { min-height: 214px; padding: 22px 18px; border-radius: 22px; }
  .hero-text { width: 66%; }
  .hero-kicker { font-size: 9px; margin-bottom: 8px; }
  .hero-text h2 { font-size: 25px; margin-bottom: 8px; }
  .hero-text p { font-size: 11px; line-height: 1.5; }
  .hero-cta { margin-top: 12px; font-size: 11px; padding: 9px 12px; }
  .hero-art { width: 34%; height: 160px; transform: scale(.7); transform-origin: center right; }
  .phone { right: 8px; top: -6px; }
  .shield { right: -39px; bottom: -16px; }
  .quick-actions { gap: 7px; margin: 12px 0 23px; }
  .quick-actions button { padding: 12px 2px; border-radius: 14px; font-size: 9px; gap: 7px; }
  .quick-icon { width: 35px; height: 35px; border-radius: 11px; }
  .quick-icon ion-icon { font-size: 19px; }
  .feature-label { font-size: 16px; }
  .action-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; }
  .action-card { flex-direction: column; align-items: flex-start; min-height: 122px; padding: 13px; gap: 7px; border-radius: 17px; }
  .action-icon { width: 36px; height: 36px; min-width: 36px; }
  .action-icon ion-icon { font-size: 20px; }
  .action-info h3 { font-size: 13px; }
  .action-info p { font-size: 10px; }
  .action-card .arrow { display: none; }
  .section-heading h2 { font-size: 18px; }
  .medication-list { padding: 4px 12px; }
  .medicine-row { gap: 9px; min-height: 78px; }
  .medicine-pill { width: 36px; height: 19px; flex-shrink: 0; }
  .medicine-details { min-width: 0; }
  .medicine-details h3 { font-size: 12px; }
  .medicine-details p { font-size: 10px; }
  .medicine-time { font-size: 10px; padding: 6px; white-space: nowrap; }
  .medicine-arrow { display: none; }
  .recent-grid { grid-template-columns: 1fr; }
  .recent-card { padding: 12px; }
  .rx-preview { width: 65px; min-width: 65px; height: 58px; }
}
@media (max-width: 350px) {
  .greeting { display: none; }
  .hero-text h2 { font-size: 22px; }
  .hero-art { transform: scale(.58); }
  .quick-actions button { font-size: 8px; }
}
@media (prefers-reduced-motion: reduce) { .action-card { transition: none; } }
/* ===========================================================
   COMPACT REFERENCE-INSPIRED HOME — FINAL OVERRIDES
   Existing original styles and functional handlers retained.
   =========================================================== */
.home-content { --background: #f4fbf9; }
.page-container { width: min(100%, 940px); padding: 23px 24px 110px; }
.top-header { margin-bottom: 19px; gap: 14px; }
.welcome-copy { min-width: 0; }
.welcome-eyebrow { color: #667f77; font-size: 13px; font-weight: 600; }
.welcome-copy h1 { margin: 3px 0 4px; font-size: 27px; line-height: 1.15; font-weight: 850; color: #123b34; }
.welcome-wave { color: #00a885; }
.welcome-copy p { margin: 0; color: #79918a; font-size: 12px; }
.header-tools { display: flex; align-items: center; gap: 11px; }
.notification-button { width: 44px; height: 44px; border-radius: 15px; border: 1px solid #e2f0eb; background: #fff; color: #007c66; display: grid; place-items: center; cursor: pointer; box-shadow: 0 4px 15px rgba(0,95,76,.06); }
.notification-button ion-icon { font-size: 21px; }
.profile-circle { width: 45px; height: 45px; border: 2px solid #fff; padding: 0; }
.profile-circle ion-icon { font-size: 25px; }
.hero { min-height: 235px; padding: 26px 30px; margin-bottom: 17px; border-radius: 25px; }
.hero-text { width: 60%; }
.hero-text h2 { font-size: 32px; }
.hero-text p { font-size: 13px; line-height: 1.5; }
.hero-art { width: 35%; }
.quick-actions { margin: 0 0 25px; gap: 11px; }
.quick-actions button { min-height: 105px; }
.feature-label { margin-bottom: 12px; }
.action-grid { grid-template-columns: repeat(2,minmax(0,1fr)); margin-bottom: 27px; }
.action-card { min-height: 95px; }
.section-block { margin-top: 25px; }
@media (max-width: 700px) {
  .page-container { padding: calc(18px + env(safe-area-inset-top)) 15px calc(110px + env(safe-area-inset-bottom)); }
  .top-header { margin-bottom: 16px; }
  .welcome-copy h1 { font-size: 23px; }
  .welcome-copy p { font-size: 11px; }
  .notification-button { width: 40px; height: 40px; border-radius: 13px; }
  .profile-circle { width: 41px; height: 41px; }
  .hero { min-height: 206px; padding: 21px 18px; border-radius: 21px; }
  .hero-text { width: 68%; }
  .hero-text h2 { font-size: 25px; }
  .hero-text p { font-size: 11px; }
  .hero-art { width: 32%; height: 155px; transform: scale(.64); transform-origin: center right; }
  .quick-actions { gap: 7px; margin-bottom: 23px; }
  .quick-actions button { min-height: 90px; padding: 10px 2px; font-size: 9px; }
  .action-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px; }
  .action-card { min-height: 112px; padding: 12px; }
}
@media (max-width: 370px) {
  .welcome-copy h1 { font-size: 21px; }
  .welcome-copy p { font-size: 10px; }
  .header-tools { gap: 6px; }
  .hero-text h2 { font-size: 22px; }
  .hero-art { transform: scale(.54); }
  .quick-actions button { font-size: 8px; }
}
/* Reference-matched mobile dashboard — presentation only */
.home-content {
  --background: #f2fbf9;
}
.page-container {
  max-width: 510px;
  width: 100%;
  padding: 22px 16px 105px;
}
.top-header {
  display:flex;
  align-items:center;
  gap: 10px;
  margin-bottom: 17px;
}
.home-avatar {
  flex: 0 0 44px;
  width:44px;
  height:44px;
  border-radius:50%;
  display:grid;
  place-items:center;
  background:linear-gradient(135deg,#c8f2e9,#eefdfa);
  border:3px solid #fff;
  box-shadow:0 4px 14px #126e5e19;
  color:#007c69;
  font-size:26px;
}
.welcome-copy {
  flex:1;
}
.welcome-eyebrow {
  font-size:11px;
  color:#2e4c4c;
}
.welcome-copy h1 {
  margin: 1px 0;
  font-size:20px;
  color:#142d36;
}
.welcome-copy p {
  font-size:10px;
}
.header-tools {
  margin-left:auto;
}
.notification-button {
  width:37px;
  height:37px;
  border-radius:50%;
}
.hero {
  min-height:188px;
  padding:20px 17px;
  border-radius:19px;
  margin-bottom:11px;
  overflow:hidden;
  background:linear-gradient(120deg,#004d45,#007d70 54%,#00c1aa);
}
.hero-text {
  width:61%;
  position:relative;
  z-index:3;
}
.hero-text h2 {
  font-size:21px;
  font-weight:800;
  line-height:1.12;
  margin:0 0 10px;
  color:#fff;
}
.hero-text h2 span {
  color:inherit;
}
.hero-text p {
  font-size:11px;
  line-height:1.5;
  margin-bottom:13px;
  color:#e4fffa;
}
.hero-cta {
  min-height:34px;
  padding:8px 13px;
  border-radius:12px;
  font-size:11px;
}
.hero-art {
  width:44%;
  height:100%;
  position:absolute;
  right:0;
  top:0;
  transform:none;
  z-index:1;
}
.hero-art .phone,.hero-art .shield,.hero-art .pill {
  display:none;
}
.hero-photo {
  position:absolute;
  inset:-5px -9px -5px -25px;
  background:url('/mediscan/home-hero-art.webp') center / cover no-repeat;
  -webkit-mask-image:linear-gradient(to right,transparent 0%,black 30%);
  mask-image:linear-gradient(to right,transparent 0%,black 30%);
}
.quick-actions {
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:9px;
  margin:0 0 21px;
}
.quick-actions button {
  min-height:91px;
  padding:10px 2px;
  border-radius:15px;
  font-size:9px;
  line-height:1.25;
  box-shadow:0 6px 18px #126e5e0a;
}
.quick-icon {
  width:34px;
  height:34px;
  border-radius:11px;
  margin-bottom:7px;
}
.quick-icon ion-icon {
  font-size:19px;
}
.feature-label,.action-grid {
  display:none;
} /* existing handlers remain in script */
.section-block {
  margin-top:17px;
}
.section-heading {
  margin-bottom:10px;
}
.section-heading h2 {
  font-size:16px;
  font-weight:800;
  color:#142d36;
}
.section-heading button {
  font-size:11px;
}
.demo-indicator {
  font-size:9px;
  font-weight:500;
  color:#738f88;
  vertical-align:middle;
}
.medication-list {
  padding:4px 10px;
  border-radius:18px;
}
.medicine-row {
  min-height:59px;
  padding:8px 4px;
  gap:10px;
}
.medicine-pill {
  transform:scale(.72);
  flex-shrink:0;
}
.medicine-details {
  flex:1;
  min-width:0;
}
.medicine-details h3 {
  font-size:11px;
  margin:0 0 3px;
}
.medicine-details p {
  font-size:10px;
  margin:0;
}
.medicine-time {
  padding:5px 7px;
  font-size:10px;
  white-space:nowrap;
}
.medicine-arrow {
  display:none;
}
.recent-section {
  margin-top:19px;
}
.recent-grid {
  grid-template-columns:1fr;
  gap:8px;
}
.recent-card {
  min-height:66px;
  padding:10px;
}
.recent-card:nth-child(n+2) {
  display:none;
}
.medical-note {
  margin-top:17px;
  font-size:10px;
}
@media (min-width: 700px) {
  .page-container {
    max-width:510px;
    padding-top:25px;
  }
}
@media (max-width: 370px) {
  .page-container {
    padding-left:10px;
    padding-right:10px;
  }
  .hero {
    padding:17px 12px;
  }
  .hero-text h2 {
    font-size:19px;
  }
  .hero-text p {
    font-size:10px;
  }
  .quick-actions {
    gap:5px;
  }
  .quick-actions button {
    font-size:8px;
  }
}
/* =============================================================
   MOBILE REFERENCE POLISH
   Design-only adjustments; original routes and handlers retained.
   ============================================================= */
.home-content {
  --background: #f4faf9;
}
.page-container {
  max-width: 430px;
  margin-inline: auto;
  padding: 20px 15px calc(105px + env(safe-area-inset-bottom));
}
.top-header {
  margin-bottom: 15px;
}
.hero {
  min-height: 192px;
  border-radius: 17px;
  padding: 19px 16px;
  box-shadow: 0 10px 24px rgba(0, 90, 75, 0.12);
}
.hero-text {
  width: 63%;
}
.hero-text h2 {
  font-size: 21px;
  line-height: 1.15;
}
.hero-text p {
  font-size: 10.5px;
  line-height: 1.45;
}
.hero-cta {
  border-radius: 11px;
  padding: 9px 12px;
  font-size: 10px;
}
.hero-art {
  width: 46%;
}
.hero-photo {
  background-position: center;
  background-size: cover;
}
.quick-actions {
  gap: 8px;
  margin-bottom: 20px;
}
.quick-actions button {
  min-height: 87px;
  border-radius: 13px;
  padding: 9px 2px;
  font-size: 9px;
}
.quick-icon {
  margin-bottom: 3px;
}
.section-heading h2 {
  font-size: 15px;
}
.medication-list {
  padding: 3px 8px;
  border-radius: 16px;
}
.medicine-row {
  min-height: 60px;
}
.medicine-details h3 {
  color: #172d35;
  font-size: 11px;
}
.medicine-details p {
  color: #7a9291;
  font-size: 9px;
}
.medicine-time {
  font-size: 9px;
}
/* Keep demo data intact in script; display two compact rows like the reference. */
.medicine-row:nth-child(n + 3) {
  display: none;
}
@media (min-width: 700px) {
  .page-container {
    max-width: 430px;
    padding-top: 25px;
  }
}
@media (max-width: 370px) {
  .hero-text h2 {
    font-size: 19px;
  }
  .quick-actions {
    gap: 5px;
  }
}
</style>
<style scoped>
.feature-label { display:block !important; }
.action-grid { display:grid !important; }
.recent-card:nth-child(n+2) { display:flex !important; }
.home-avatar { cursor:pointer; padding:0; overflow:hidden; }
.home-avatar-img { width:100%; height:100%; object-fit:cover; border-radius:50%; }
.summary-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
.summary-tile { background:#fff; border:1px solid #e4f2ed; border-radius:17px; padding:15px 12px; display:flex; flex-direction:column; align-items:flex-start; gap:7px; text-align:left; color:#174338; cursor:pointer; box-shadow:0 5px 16px #126e5e0a; }
.summary-tile ion-icon { font-size:22px; color:#008f73; }
.summary-tile strong { font-size:27px; line-height:1; }
.summary-tile span { font-size:11px; color:#6b827b; }
.dashboard-empty { padding:22px 16px; border-radius:16px; background:white; color:#70837d; font-size:12px; }
.dashboard-hint { font-size:11px; color:#9b5a3c; margin:10px 2px; }
/* Compact live clock and notification drawer */
.top-header { position:relative; }
.header-tools { flex-shrink:0; }
.live-clock { display:flex; align-items:center; gap:5px; border:1px solid #dcefe9; border-radius:13px; background:#e9f8f3; color:#075e4f; padding:7px 9px; font-size:11px; font-weight:800; white-space:nowrap; }
.live-clock ion-icon { font-size:13px; }
.live-clock small { font-size:10px; font-weight:600; color:#52776b; border-left:1px solid #bcded2; padding-left:6px; }
.notification-button { position:relative; }
.notification-dot,.unread-dot { position:absolute; width:8px; height:8px; border-radius:50%; background:#f05262; border:2px solid white; }
.notification-dot { right:3px; top:3px; }
.notification-backdrop { position:fixed; inset:0; z-index:50; background:rgba(11,38,32,.15); }
.notification-panel { position:fixed; z-index:51; top:75px; right:max(14px,calc((100vw - 510px)/2)); width:min(360px,calc(100vw - 28px)); background:white; border:1px solid #e5f0ec; border-radius:18px; box-shadow:0 16px 55px #164e4133; overflow:hidden; }
.notification-heading { display:flex; align-items:center; justify-content:space-between; padding:17px 16px; border-bottom:1px solid #edf3f1; }
.notification-heading strong { font-size:16px; color:#17352f; }
.notification-heading button { border:0; background:none; color:#008b6f; font-size:11px; font-weight:700; cursor:pointer; }
.notification-item { position:relative; display:flex; gap:10px; align-items:flex-start; padding:13px 15px; border-bottom:1px solid #f0f5f2; }
.notification-item.unread { background:#f6fcf9; }
.notification-item-icon { display:grid; place-items:center; flex-shrink:0; width:34px; height:34px; border-radius:12px; background:#e0f8ef; color:#008c70; font-size:18px; }
.notification-item div { padding-right:10px; }
.notification-item strong { display:block; font-size:12px; color:#19392f; }
.notification-item p { margin:3px 0 0; font-size:11px; line-height:1.4; color:#72847e; }
.notification-item .unread-dot { right:12px; top:18px; }
.notification-footer { padding:12px; text-align:center; font-size:11px; color:#008b6f; background:#edf9f5; }
@media(max-width:500px) { .top-header { flex-wrap:wrap; } .header-tools { gap:5px; } .live-clock { padding:5px 7px; font-size:10px; } .live-clock small { display:none; } .notification-panel { top:75px; right:12px; } }
@media(max-width:370px) { .live-clock { font-size:9px; } .welcome-copy h1 { font-size:18px; } }
</style>
