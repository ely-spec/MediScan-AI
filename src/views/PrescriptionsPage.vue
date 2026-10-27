<template>
  <ion-page>
    <ion-content :fullscreen="true" class="prescriptions-content">
      <div class="page-container">
        <!-- HEADER -->
        <header class="page-header">
          <div>
            <h1>Prescriptions</h1>
            <p>Manage and review your saved prescriptions</p>
          </div>
          <div class="brand">
            Medi<span>Scan</span> AI
          </div>
        </header>
        <!-- SCAN / ADD PRESCRIPTION -->
        <section class="scan-card">
          <div class="scan-icon">
            <ion-icon :icon="cameraOutline"></ion-icon>
          </div>
          <div class="scan-info">
            <span>AI PRESCRIPTION SCANNER</span>
            <h2>Scan a New Prescription</h2>
            <p>
              Take a photo or upload a prescription image to identify
              medicines and save the prescription.
            </p>
          </div>
          <button class="scan-button" @click="scanPrescription">
            <ion-icon :icon="camera"></ion-icon>
            Scan Prescription
          </button>
        </section>
        <!-- SUMMARY -->
        <section class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon green">
              <ion-icon :icon="documentTextOutline"></ion-icon>
            </div>
            <div>
              <span>Total Prescriptions</span>
              <strong>{{ prescriptions.length }}</strong>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon blue">
              <ion-icon :icon="medicalOutline"></ion-icon>
            </div>
            <div>
              <span>Saved Medicines</span>
              <strong>{{ savedMedicines }}</strong>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon orange">
              <ion-icon :icon="timeOutline"></ion-icon>
            </div>
            <div>
              <span>Recent Scan</span>
              <strong>{{ recentScan }}</strong>
            </div>
          </div>
        </section>
        <!-- SEARCH + FILTER -->
        <section class="tools-row">
          <div class="search-box">
            <ion-icon :icon="searchOutline"></ion-icon>
            <input
              v-model="searchText"
              type="text"
              placeholder="Search prescriptions..."
            />
            <button
              v-if="searchText"
              class="clear-search"
              @click="searchText = ''"
            >
              <ion-icon :icon="closeCircle"></ion-icon>
            </button>
          </div>
          <button class="filter-button" @click="showFilter">
            <ion-icon :icon="optionsOutline"></ion-icon>
            Filter
          </button>
        </section>
        <!-- PRESCRIPTION LIST -->
        <section class="prescription-section">
          <div class="section-heading">
            <div>
              <h2>My Prescriptions</h2>
              <p>Your saved prescription history</p>
            </div>
          </div>
          <div class="prescription-list">
            <div
              v-for="prescription in filteredPrescriptions"
              :key="prescription.id"
              class="prescription-card"
            >
              <!-- RX PREVIEW -->
              <div class="rx-preview">
                <div class="rx-text">Rx</div>
                <div class="preview-line long"></div>
                <div class="preview-line"></div>
                <div class="preview-line medium"></div>
              </div>
              <!-- INFORMATION -->
              <div class="prescription-info">
                <div class="prescription-top">
                  <span class="date">
                    <ion-icon :icon="calendarOutline"></ion-icon>
                    {{ prescription.date }}
                  </span>
                  <span class="status">
                    <ion-icon :icon="checkmarkCircle"></ion-icon>
                    Scanned
                  </span>
                </div>
                <h3>{{ prescription.title }}</h3>
                <p>
                  {{ prescription.medicines }} medicines identified
                </p>
                <div class="medicine-tags">
                  <span
                    v-for="medicine in prescription.items"
                    :key="medicine"
                  >
                    {{ medicine }}
                  </span>
                </div>
              </div>
              <div class="card-actions">
                <button class="open-button" type="button" @click="openPrescription(prescription)">
                  <span>View Details</span>
                  <ion-icon :icon="chevronForward"></ion-icon>
                </button>
                <button class="delete-button" type="button" :disabled="deletingId === prescription.id" @click="confirmDelete(prescription)">
                  <ion-icon :icon="trashOutline"></ion-icon>
                  <span>{{ deletingId === prescription.id ? 'Deleting...' : 'Delete' }}</span>
                </button>
              </div>
            </div>
            <!-- EMPTY SEARCH -->
            <div
              v-if="filteredPrescriptions.length === 0"
              class="empty-state"
            >
              <div class="empty-icon">
                <ion-icon :icon="documentTextOutline"></ion-icon>
              </div>
              <h3>No prescriptions found</h3>
              <p>
                Try another search or scan a new prescription.
              </p>
            </div>
          </div>
        </section>
        <!-- SAFETY -->
        <div class="safety-note">
          <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          <div>
            <strong>Your Prescription Data</strong>
            <p>
              Prescription information in MediScan AI is intended to help
              organize medicine information and does not replace instructions
              from a doctor, pharmacist, or other qualified healthcare
              professional.
            </p>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>
 <script setup lang="ts">
import {
  computed,
  onMounted,
  ref
} from 'vue';
import {
  IonPage,
  IonContent,
  IonIcon,
  alertController
} from '@ionic/vue';
import {
  camera,
  cameraOutline,
  documentTextOutline,
  medicalOutline,
  timeOutline,
  searchOutline,
  closeCircle,
  optionsOutline,
  calendarOutline,
  checkmarkCircle,
  chevronForward,
  shieldCheckmarkOutline,
  trashOutline
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { supabase } from '../utils/supabase';
const router = useRouter();
interface PrescriptionCard {
  id: string;
  date: string;
  title: string;
  medicines: number;
  items: string[];
  createdAt: string;
}
interface MedicineRow {
  medicine_name: string | null;
}
interface PrescriptionRow {
  id: string;
  patient_name: string | null;
  doctor_name: string | null;
  prescription_date: string | null;
  created_at: string;
  prescription_medicines?: MedicineRow[] | null;
}
const searchText = ref('');
const prescriptions =
  ref<PrescriptionCard[]>([]);
const savedMedicines = ref(0);
const deletingId = ref<string | null>(null);
const recentScan = computed(() => {
  if (
    prescriptions.value.length === 0
  ) {
    return '—';
  }
  const date = new Date(
    prescriptions.value[0].createdAt
  );
  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric'
    }
  );
});
const formatDate = (
  value: string
) => {
  const date = new Date(value);
  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );
};
const loadPrescriptions =
  async () => {
    try {
      const {
        data,
        error
      } =
        await supabase
          .from('prescriptions')
          .select(`
            id,
            patient_name,
            doctor_name,
            prescription_date,
            created_at,
            prescription_medicines (
              medicine_name
            )
          `)
          .order(
            'created_at',
            {
              ascending: false
            }
          );
      if (error) {
        throw error;
      }
      const rows =
        (data || []) as PrescriptionRow[];
      prescriptions.value =
        rows.map(
          (prescription) => {
            const medicines =
              prescription
                .prescription_medicines ||
              [];
            const medicineNames =
              medicines
                .map(
                  (medicine) =>
                    medicine
                      .medicine_name
                )
                .filter(
                  (
                    name
                  ): name is string =>
                    Boolean(name)
                );
            let title =
              'Prescription';
            if (
              prescription.patient_name
            ) {
              title =
                `${prescription.patient_name}'s Prescription`;
            } else if (
              prescription.doctor_name
            ) {
              title =
                `Prescription — ${prescription.doctor_name}`;
            }
            return {
              id:
                prescription.id,
              date:
                formatDate(
                  prescription.created_at
                ),
              title,
              medicines:
                medicines.length,
              items:
                medicineNames,
              createdAt:
                prescription.created_at
            };
          }
        );
      savedMedicines.value =
        prescriptions.value.reduce(
          (
            total,
            prescription
          ) =>
            total +
            prescription.medicines,
          0
        );
    } catch (error) {
      console.error(
        'Unable to load prescriptions:',
        error
      );
      const alert =
        await alertController.create({
          header:
            'Unable to Load',
          message:
            'MediScan could not load your saved prescriptions from the database.',
          buttons: ['OK']
        });
      await alert.present();
    }
  };
const filteredPrescriptions =
  computed(() => {
    const query =
      searchText.value
        .trim()
        .toLowerCase();
    if (!query) {
      return prescriptions.value;
    }
    return prescriptions.value.filter(
      (prescription) => {
        const titleMatch =
          prescription.title
            .toLowerCase()
            .includes(query);
        const dateMatch =
          prescription.date
            .toLowerCase()
            .includes(query);
        const medicineMatch =
          prescription.items.some(
            (medicine) =>
              medicine
                .toLowerCase()
                .includes(query)
          );
        return (
          titleMatch ||
          dateMatch ||
          medicineMatch
        );
      }
    );
  });
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
const confirmDelete = async (prescription: PrescriptionCard) => {
  if (deletingId.value) return;
  const alert = await alertController.create({
    header: 'Delete Prescription?',
    message: `Delete "${prescription.title}" and its ${prescription.medicines} saved medicine(s)? This cannot be undone.`,
    cssClass: 'delete-confirmation-alert',
    buttons: [
      { text: 'Cancel', role: 'cancel' },
      {
        text: 'Yes, Delete',
        role: 'destructive',
        handler: () => { void deletePrescription(prescription); }
      }
    ]
  });
  await alert.present();
};
const deletePrescription = async (prescription: PrescriptionCard) => {
  deletingId.value = prescription.id;
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) throw new Error('Please log in again to delete prescriptions.');
    // Database foreign key must use ON DELETE CASCADE for prescription_medicines.
    // RLS must restrict DELETE to the authenticated prescription owner.
    const { data: deleted, error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', prescription.id)
      .select('id');
    if (error) throw error;
    if (!deleted?.length) throw new Error('No prescription was deleted. Check your Supabase DELETE policy.');
    await loadPrescriptions();
    await showMessage('Prescription Deleted', 'The prescription was removed. Linked medicines are deleted by the database cascade.');
  } catch (error) {
    console.error('Unable to delete prescription:', error);
    await showMessage('Delete Failed', error instanceof Error ? error.message : 'Unable to delete this prescription.');
  } finally {
    deletingId.value = null;
  }
};
const scanPrescription = () => {
  router.push(
    '/scan-prescription'
  );
};
const showFilter = async () => {
  await showMessage(
    'Filter Prescriptions',
    'Additional prescription filters will be added later.'
  );
};
const openPrescription = (
  prescription: PrescriptionCard
) => {
  router.push(
    `/prescription/${prescription.id}`
  );
};
onMounted(() => {
  loadPrescriptions();
});
</script>
<style scoped>
/* Consistent typography for the Prescriptions tab only */
.page-container {
  font-family: 'Poppins', sans-serif;
}
.page-container button,
.page-container input {
  font-family: inherit;
}

.prescriptions-content {
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
  font-size: 30px;
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
/* SCAN CARD */
.scan-card {
  background: linear-gradient(
    135deg,
    #dff8f1,
    #c3f1e4
  );
  border-radius: 26px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}
.scan-icon {
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
.scan-icon ion-icon {
  font-size: 36px;
}
.scan-info {
  flex: 1;
}
.scan-info > span {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #078b67;
}
.scan-info h2 {
  margin: 6px 0 7px;
  font-size: 21px;
}
.scan-info p {
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

  font-size: 15px;
}
/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}
.stat-card {
  min-height: 100px;
  background: white;
  border-radius: 20px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow:
    0 5px 18px rgba(30, 70, 60, 0.05);
}
.stat-icon {
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon ion-icon {
  font-size: 25px;
}
.green {
  background: #def7ef;
  color: #07966e;
}
.blue {
  background: #e5f2ff;
  color: #3487cc;
}
.orange {
  background: #fff0df;
  color: #df7927;
}
.stat-card span {
  display: block;
  margin-bottom: 5px;
  color: #84908c;
  font-size: 13px;
}
.stat-card strong {
  font-size: 23px;
}
/* SEARCH */
.tools-row {
  display: flex;
  gap: 12px;
  margin-bottom: 35px;
}
.search-box {
  flex: 1;
  height: 58px;
  background: white;
  border:
    1px solid #dfe8e5;
  border-radius: 17px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 18px;
}
.search-box:focus-within {
  border-color: #07966e;
  box-shadow:
    0 0 0 3px rgba(7, 150, 110, 0.08);
}
.search-box > ion-icon {
  font-size: 22px;
  color: #899691;
}
.search-box input {
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: #14241f;
  font-size: 15px;
}
.search-box input::placeholder {
  color: #a1aaa7;
}
.clear-search {
  border: none;
  background: transparent;
  color: #9aa6a2;
  cursor: pointer;
}
.clear-search ion-icon {
  font-size: 20px;
}
.filter-button {
  min-width: 115px;
  border: 1px solid #dfe8e5;
  border-radius: 17px;
  background: white;
  color: #263831;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  cursor: pointer;

  font-size: 15px;
}
/* SECTION */
.prescription-section {
  margin-bottom: 35px;
}
.section-heading {
  margin-bottom: 16px;
}
.section-heading h2 {
  margin: 0 0 5px;
  font-size: 21px;
}
.section-heading p {
  margin: 0;
  color: #84908c;
  font-size: 14px;
}
/* PRESCRIPTION CARDS */
.prescription-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.prescription-card {
  width: 100%;
  border: none;
  border-radius: 23px;
  background: white;
  padding: 20px;
  color: #14241f;
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: left;
  box-shadow:
    0 5px 18px rgba(30, 70, 60, 0.05);
  transition: 0.2s;
}
.prescription-card:hover {
  transform: translateY(-2px);
  box-shadow:
    0 9px 23px rgba(30, 70, 60, 0.08);
}
.rx-preview {
  width: 105px;
  height: 100px;
  min-width: 105px;
  border-radius: 16px;
  background: #f7f9f8;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.rx-text {
  margin-bottom: 10px;
  font-size: 25px;
  font-weight: 800;
  color: #35473f;
}
.preview-line {
  width: 75%;
  height: 5px;
  margin-bottom: 6px;
  border-radius: 10px;
  background: #d9dfdd;
}
.preview-line.long {
  width: 95%;
}
.preview-line.medium {
  width: 55%;
}
.prescription-info {
  flex: 1;
}
.prescription-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 7px;
}
.date {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #84908c;
  font-size: 12px;
}
.status {
  padding: 5px 8px;
  border-radius: 20px;
  background: #e3f8f1;
  color: #078d68;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
}
.prescription-info h3 {
  margin: 0 0 5px;
  font-size: 17px;
}
.prescription-info > p {
  margin: 0 0 11px;
  color: #7f8c87;
  font-size: 14px;
}
.medicine-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.medicine-tags span {
  padding: 5px 9px;
  border-radius: 8px;
  background: #f0f5f3;
  color: #5e7069;
  font-size: 12px;
}
.card-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.open-button {
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #07966e;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}
.open-button ion-icon {
  font-size: 19px;
}
.delete-button {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #ffd8d8;
  background: #fff3f3;
  color: #bf3333;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.delete-button:disabled { opacity: .5; cursor: wait; }
/* EMPTY */
.empty-state {
  background: white;
  border-radius: 23px;
  padding: 50px 20px;
  text-align: center;
}
.empty-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto 14px;
  border-radius: 20px;
  background: #e3f8f1;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-icon ion-icon {
  font-size: 32px;
}
.empty-state h3 {
  margin: 0 0 6px;
}
.empty-state p {
  margin: 0;
  color: #83908b;
  font-size: 14px;
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
  font-size: 15px;
}
.safety-note p {
  margin: 5px 0 0;
  color: #65756f;
  line-height: 1.5;
  font-size: 13px;
}
/* MOBILE */
@media (max-width: 700px) {
  .page-container {
    padding:
      calc(25px + env(safe-area-inset-top))
      18px
      115px;
  }
  .page-header h1 {
    font-size: 28px;
  }
  .brand {
    display: none;
  }
  .scan-card {
    flex-wrap: wrap;
    padding: 22px;
  }
  .scan-info {
    min-width:
      calc(100% - 100px);
  }
  .scan-button {
    width: 100%;
    justify-content: center;
  }
  .stats-grid {
    grid-template-columns: 1fr;
  }
  .stat-card {
    min-height: 80px;
  }
  .tools-row {
    flex-direction: column;
  }
  .filter-button {
    width: 100%;
    height: 52px;
  }
  .prescription-card {
    align-items: flex-start;
    gap: 14px;
  }
  .rx-preview {
    width: 75px;
    height: 80px;
    min-width: 75px;
    padding: 10px;
  }
  .rx-text {
    font-size: 20px;
  }
  .open-button span {
    display: inline;
  }
  .card-actions { margin-left: auto; }
  .prescription-top {
    flex-wrap: wrap;
  }
}
@media (max-width: 420px) {
  .prescription-card {
    position: relative;
  }
  .medicine-tags {
    display: none;
  }
  .card-actions { align-self: center; }
  .open-button { position: static; transform: none; }
  .prescription-info { padding-right: 0; }
  .delete-button { padding: 8px; }
}
</style>
