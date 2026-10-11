<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="details-page">
        <div class="details-container">
          <!-- HEADER -->
          <header class="page-header">
            <button class="back-button" @click="goBack">
              <ion-icon :icon="arrowBackOutline" />
            </button>
            <div>
              <p class="eyebrow">MEDISCAN AI</p>
              <h1>Prescription Details</h1>
              <p class="subtitle">
                Review your saved prescription and medicine information.
              </p>
            </div>
          </header>
          <!-- LOADING -->
          <div v-if="loading" class="state-card">
            <div class="loader"></div>
            <h2>Loading prescription...</h2>
            <p>Please wait while MediScan retrieves your saved information.</p>
          </div>
          <!-- ERROR -->
          <div v-else-if="errorMessage" class="state-card error-state">
            <ion-icon :icon="alertCircleOutline" />
            <h2>Unable to load prescription</h2>
            <p>{{ errorMessage }}</p>
            <button class="primary-button small-button" @click="loadPrescription">
              Try Again
            </button>
          </div>
          <template v-else-if="prescription">
            <!-- SUMMARY -->
            <section class="summary-card">
              <div class="summary-icon">
                <span>Rx</span>
              </div>
              <div class="summary-content">
                <div class="summary-top">
                  <div>
                    <span class="status-badge">
                      <ion-icon :icon="checkmarkCircleOutline" />
                      Saved
                    </span>
                    <h2>
                      {{ prescriptionTitle }}
                    </h2>
                    <p>
                      {{ formattedCreatedDate }}
                    </p>
                  </div>
                  <div class="medicine-count">
                    <strong>{{ medicines.length }}</strong>
                    <span>
                      {{ medicines.length === 1 ? 'Medicine' : 'Medicines' }}
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <!-- PRESCRIPTION INFORMATION -->
            <section class="section">
              <div class="section-heading">
                <p class="eyebrow">PRESCRIPTION INFORMATION</p>
                <h2>Prescription Overview</h2>
              </div>
              <div class="information-grid">
                <div class="information-card">
                  <div class="info-icon">
                    <ion-icon :icon="personOutline" />
                  </div>
                  <div>
                    <span>Patient Name</span>
                    <strong>
                      {{ displayValue(prescription.patient_name) }}
                    </strong>
                  </div>
                </div>
                <div class="information-card">
                  <div class="info-icon">
                    <ion-icon :icon="medkitOutline" />
                  </div>
                  <div>
                    <span>Doctor</span>
                    <strong>
                      {{ displayValue(prescription.doctor_name) }}
                    </strong>
                  </div>
                </div>
                <div class="information-card">
                  <div class="info-icon blue">
                    <ion-icon :icon="calendarOutline" />
                  </div>
                  <div>
                    <span>Prescription Date</span>
                    <strong>
                      {{ formattedPrescriptionDate }}
                    </strong>
                  </div>
                </div>
                <div class="information-card">
                  <div class="info-icon purple">
                    <ion-icon :icon="timeOutline" />
                  </div>
                  <div>
                    <span>Saved to MediScan</span>
                    <strong>
                      {{ formattedCreatedDate }}
                    </strong>
                  </div>
                </div>
              </div>
            </section>
            <!-- MEDICINES -->
            <section class="section">
              <div class="section-heading medicine-heading">
                <div>
                  <p class="eyebrow">SAVED MEDICINES</p>
                  <h2>Detected Medicines</h2>
                  <p class="section-description">
                    Medicine information confirmed during prescription review.
                  </p>
                </div>
                <span class="count-badge">
                  {{ medicines.length }}
                  {{ medicines.length === 1 ? 'medicine' : 'medicines' }}
                </span>
              </div>
              <div v-if="medicines.length" class="medicine-list">
                <article
                  v-for="(medicine, index) in medicines"
                  :key="medicine.id || index"
                  class="medicine-card"
                >
                  <div class="medicine-header">
                    <div class="medicine-number">
                      {{ index + 1 }}
                    </div>
                    <div class="medicine-name">
                      <span>MEDICINE</span>
                      <h3>
                        {{ displayValue(medicine.medicine_name) }}
                      </h3>
                    </div>
                    <span
                      class="review-badge"
                      :class="{ warning: medicine.needs_review }"
                    >
                      <ion-icon
                        :icon="
                          medicine.needs_review
                            ? alertCircleOutline
                            : checkmarkCircleOutline
                        "
                      />
                      {{
                        medicine.needs_review
                          ? 'Needs Review'
                          : 'Reviewed'
                      }}
                    </span>
                  </div>
                  <div class="medicine-details-grid">
                    <div class="medicine-detail">
                      <span>Dosage Form</span>
                      <strong>
                        {{ displayValue(medicine.dosage_form) }}
                      </strong>
                    </div>
                    <div class="medicine-detail">
                      <span>Strength</span>
                      <strong>
                        {{ displayValue(medicine.strength) }}
                      </strong>
                    </div>
                    <div class="medicine-detail">
                      <span>Dosage</span>
                      <strong>
                        {{ displayValue(medicine.dosage) }}
                      </strong>
                    </div>
                    <div class="medicine-detail">
                      <span>Frequency</span>
                      <strong>
                        {{ displayValue(medicine.frequency) }}
                      </strong>
                    </div>
                    <div class="medicine-detail">
                      <span>Duration</span>
                      <strong>
                        {{ displayValue(medicine.duration) }}
                      </strong>
                    </div>
                    <div class="medicine-detail">
                      <span>Prescribed Quantity</span>
                      <strong>{{ getQuantity(medicine) ?? 'Not specified' }}</strong>
                    </div>
                    <div class="medicine-detail">
                      <span>AI Confidence</span>
                      <strong>
                        {{ formatConfidence(medicine.confidence) }}
                      </strong>
                    </div>
                  </div>
                  <div
                    v-if="medicine.instructions"
                    class="instruction-box"
                  >
                    <ion-icon :icon="informationCircleOutline" />
                    <div>
                      <span>Prescription Instruction</span>
                      <p>{{ medicine.instructions }}</p>
                    </div>
                  </div>
                </article>
              </div>
              <div v-else class="empty-medicines">
                <ion-icon :icon="medicalOutline" />
                <h3>No medicine information saved</h3>
                <p>
                  This prescription does not currently contain structured
                  medicine information.
                </p>
              </div>
            </section>
            <!-- OCR TEXT -->
            <section class="section">
              <div class="section-heading">
                <p class="eyebrow">OCR REFERENCE</p>
                <h2>Extracted Prescription Text</h2>
                <p class="section-description">
                  Original text extracted during prescription scanning.
                </p>
              </div>
              <div class="ocr-card">
                <pre>{{ formattedOcrText }}</pre>
              </div>
            </section>
            <!-- SAFETY -->
            <section class="safety-card">
              <div class="safety-icon">
                <ion-icon :icon="shieldCheckmarkOutline" />
              </div>
              <div>
                <h3>Review prescription information carefully</h3>
                <p>
                  MediScan AI may make mistakes when reading printed or
                  handwritten prescriptions. Always compare medicine names,
                  strength, dosage, frequency, duration and instructions with
                  the original prescription. Confirm unclear information with
                  a pharmacist or qualified healthcare professional.
                </p>
              </div>
            </section>
            <!-- ACTION -->
            <div class="bottom-actions">
              <button class="secondary-button" @click="goBack">
                <ion-icon :icon="arrowBackOutline" />
                Back to Prescriptions
              </button>
              <button class="pharmacy-button" :disabled="!transferableMedicines.length" @click="findInPharmacies">
                <ion-icon :icon="medicalOutline" />
                Find These Medicines in Pharmacies
              </button>
              <button class="primary-button" @click="scanAnother">
                <ion-icon :icon="cameraOutline" />
                Scan Another Prescription
              </button>
            </div>
          </template>
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
  IonIcon
} from '@ionic/vue';
import {
  arrowBackOutline,
  alertCircleOutline,
  calendarOutline,
  cameraOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  medicalOutline,
  medkitOutline,
  personOutline,
  shieldCheckmarkOutline,
  timeOutline
} from 'ionicons/icons';
import {
  useRoute,
  useRouter
} from 'vue-router';
import { supabase } from '../utils/supabase';
interface MedicineRow {
  id?: string;
  medicine_name: string | null;
  dosage_form: string | null;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
  confidence: string | number | null;
  needs_review: boolean | null;
  prescribed_quantity?: number | string | null;
  quantity?: number | string | null;
}
interface PrescriptionRow {
  id: string;
  patient_name: string | null;
  doctor_name: string | null;
  prescription_date: string | null;
  extracted_text: string | null;
  created_at: string;
  prescription_medicines?: MedicineRow[] | null;
}
const route = useRoute();
const router = useRouter();
const loading = ref(true);
const errorMessage = ref('');
const prescription =
  ref<PrescriptionRow | null>(null);
const medicines = computed(() => {
  return (
    prescription.value
      ?.prescription_medicines || []
  );
});
const getQuantity = (medicine: MedicineRow): number | null => {
  const raw = medicine.prescribed_quantity ?? medicine.quantity;
  if (raw === null || raw === undefined || String(raw).trim() === '') return null;
  const amount = Number(raw);
  return Number.isSafeInteger(amount) && amount > 0 ? amount : null;
};
const transferableMedicines = computed(() => medicines.value.filter(m => !!m.medicine_name?.trim()));
const findInPharmacies = async () => {
  if (!transferableMedicines.value.length) return;
  const payload = transferableMedicines.value.map(m => ({
    name: m.medicine_name!.trim(),
    medicine_name: m.medicine_name!.trim(),
    strength: m.strength?.trim() || '',
    dosage_form: m.dosage_form?.trim() || '',
    quantity: getQuantity(m),
    quantityNeedsReview: getQuantity(m) === null
  }));
  try {
    sessionStorage.setItem('mediscan_pharmacy_prescription', JSON.stringify(payload));
    await router.push('/tabs/pharmacy');
  } catch (error) {
    console.error('Unable to send saved medicines to Pharmacy:', error);
  }
};
const prescriptionTitle = computed(() => {
  if (!prescription.value) {
    return 'Prescription';
  }
  if (prescription.value.patient_name) {
    return `${prescription.value.patient_name}'s Prescription`;
  }
  if (prescription.value.doctor_name) {
    return `Prescription — ${prescription.value.doctor_name}`;
  }
  return 'Saved Prescription';
});
const formattedCreatedDate = computed(() => {
  if (!prescription.value?.created_at) {
    return 'Not available';
  }
  return formatDate(
    prescription.value.created_at
  );
});
const formattedPrescriptionDate = computed(() => {
  if (!prescription.value?.prescription_date) {
    return 'Not available';
  }
  return formatDate(
    prescription.value.prescription_date
  );
});
const formattedOcrText = computed(() => {
  const text =
    prescription.value?.extracted_text?.trim();
  if (!text) {
    return 'No extracted prescription text was saved for this record.';
  }
  return text;
});
const displayValue = (
  value: string | null | undefined
) => {
  if (!value || !value.trim()) {
    return 'Needs review';
  }
  return value;
};
const formatDate = (
  value: string
) => {
  const date = new Date(value);
  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }
  return date.toLocaleDateString(
    'en-US',
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }
  );
};
const formatConfidence = (
  confidence: string | number | null
) => {
  if (
    confidence === null ||
    confidence === undefined ||
    confidence === ''
  ) {
    return 'Not available';
  }
  if (
    typeof confidence === 'number'
  ) {
    return `${confidence}%`;
  }
  const value =
    confidence.toLowerCase();
  if (value === 'high') {
    return 'High';
  }
  if (value === 'medium') {
    return 'Medium';
  }
  if (value === 'low') {
    return 'Low';
  }
  return confidence;
};
const loadPrescription =
  async () => {
    loading.value = true;
    errorMessage.value = '';
    try {
      const prescriptionId =
        String(
          route.params.id || ''
        ).trim();
      if (!prescriptionId) {
        throw new Error(
          'No prescription ID was provided.'
        );
      }
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
            extracted_text,
            created_at,
            prescription_medicines (*)
          `)
          .eq(
            'id',
            prescriptionId
          )
          .single();
      if (error) {
        throw error;
      }
      prescription.value =
        data as PrescriptionRow;
    } catch (error) {
      console.error(
        'Unable to load prescription details:',
        error
      );
      errorMessage.value =
        'MediScan could not retrieve this saved prescription from the database.';
    } finally {
      loading.value = false;
    }
  };
const goBack = () => {
  router.push(
    '/tabs/prescriptions'
  );
};
const scanAnother = () => {
  router.push(
    '/scan-prescription'
  );
};
onMounted(() => {
  loadPrescription();
});
</script>
<style scoped>
.details-page {
  min-height: 100%;
  background:
    linear-gradient(
      180deg,
      #f4fbf8 0%,
      #f7fbfa 55%,
      #ffffff 100%
    );
  color: #10251d;
  padding: 48px 24px 80px;
}
.details-container {
  width: min(1060px, 100%);
  margin: 0 auto;
}
.page-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
}
.page-header h1 {
  margin: 3px 0 7px;
  font-size: clamp(30px, 4vw, 44px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -1.3px;
}
.subtitle,
.section-description {
  margin: 0;
  color: #718078;
  line-height: 1.6;
}
.eyebrow {
  margin: 0;
  color: #008b69;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.3px;
}
.back-button {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: grid;
  place-items: center;
  border: 1px solid #dbe8e3;
  border-radius: 15px;
  background: #ffffff;
  color: #173b2f;
  font-size: 23px;
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(20, 75, 58, 0.06);
}
.summary-card {
  display: flex;
  gap: 20px;
  padding: 25px;
  border: 1px solid #d8ebe4;
  border-radius: 24px;
  background: #ffffff;
  box-shadow: 0 14px 35px rgba(19, 78, 59, 0.07);
  margin-bottom: 38px;
}
.summary-icon {
  width: 82px;
  height: 82px;
  flex: 0 0 82px;
  display: grid;
  place-items: center;
  border-radius: 20px;
  background: #eff8f5;
}
.summary-icon span {
  font-size: 34px;
  font-weight: 900;
  color: #24483c;
}
.summary-content {
  flex: 1;
  min-width: 0;
}
.summary-top {
  display: flex;
  justify-content: space-between;
  gap: 25px;
  align-items: center;
}
.summary-top h2 {
  margin: 10px 0 6px;
  font-size: 25px;
}
.summary-top p {
  margin: 0;
  color: #74817c;
}
.status-badge,
.count-badge,
.review-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}
.status-badge {
  padding: 7px 11px;
  color: #007b5e;
  background: #dcf7ee;
}
.medicine-count {
  min-width: 105px;
  text-align: center;
  padding: 14px 18px;
  border-radius: 18px;
  background: #effaf6;
}
.medicine-count strong {
  display: block;
  color: #008b69;
  font-size: 28px;
}
.medicine-count span {
  color: #6e7b76;
  font-size: 12px;
}
.section {
  margin-bottom: 40px;
}
.section-heading {
  margin-bottom: 18px;
}
.section-heading h2 {
  margin: 5px 0 5px;
  font-size: 28px;
}
.medicine-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}
.count-badge {
  padding: 9px 14px;
  background: #dcf7ee;
  color: #007d60;
  white-space: nowrap;
}
.information-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.information-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 19px;
  background: #ffffff;
  border: 1px solid #e1ebe7;
  border-radius: 18px;
}
.info-icon {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #ddf8ef;
  color: #00926d;
  font-size: 21px;
}
.info-icon.blue {
  color: #2c7ed8;
  background: #e8f3ff;
}
.info-icon.purple {
  color: #7957d5;
  background: #f0ebff;
}
.information-card span,
.medicine-detail span,
.instruction-box span {
  display: block;
  margin-bottom: 5px;
  color: #7b8883;
  font-size: 11px;
}
.information-card strong {
  font-size: 15px;
}
.medicine-list {
  display: grid;
  gap: 18px;
}
.medicine-card {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e1ebe7;
  border-radius: 24px;
  box-shadow: 0 12px 30px rgba(19, 78, 59, 0.06);
}
.medicine-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.medicine-number {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #dcf7ee;
  color: #008b69;
  font-size: 20px;
  font-weight: 900;
}
.medicine-name {
  flex: 1;
  min-width: 0;
}
.medicine-name span {
  color: #81908a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
}
.medicine-name h3 {
  margin: 4px 0 0;
  font-size: 21px;
}
.review-badge {
  padding: 8px 12px;
  color: #007d60;
  background: #dcf7ee;
}
.review-badge.warning {
  color: #9a6700;
  background: #fff0c8;
}
.medicine-details-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.medicine-detail {
  min-height: 75px;
  padding: 15px;
  border-radius: 15px;
  background: #f5f9f7;
}
.medicine-detail strong {
  display: block;
  font-size: 14px;
  line-height: 1.45;
}
.instruction-box {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  padding: 16px;
  border-radius: 15px;
  background: #eaf4ff;
  color: #245c8b;
}
.instruction-box ion-icon {
  flex: 0 0 auto;
  margin-top: 2px;
  font-size: 20px;
}
.instruction-box p {
  margin: 0;
  line-height: 1.55;
}
.ocr-card {
  max-height: 420px;
  overflow: auto;
  padding: 22px;
  background: #ffffff;
  border: 1px solid #dfe9e5;
  border-radius: 20px;
}
.ocr-card pre {
  margin: 0;
  color: #344a42;
  font-family:
    "Courier New",
    monospace;
  font-size: 13px;
  line-height: 1.9;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.safety-card {
  display: flex;
  gap: 15px;
  padding: 20px;
  margin: 10px 0 30px;
  border: 1px solid #f2d58f;
  border-radius: 20px;
  background: #fff8e8;
}
.safety-icon {
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #ffe9ae;
  color: #a56f00;
  font-size: 23px;
}
.safety-card h3 {
  margin: 1px 0 6px;
  font-size: 16px;
}
.safety-card p {
  margin: 0;
  color: #806a39;
  font-size: 13px;
  line-height: 1.6;
}
.bottom-actions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}
.pharmacy-button {
  min-height: 56px;
  padding: 10px 18px;
  border: none;
  border-radius: 16px;
  background: #007f61;
  color: #fff;
  font-weight: 800;
  cursor: pointer;
}
.pharmacy-button:disabled { opacity: .5; cursor: not-allowed; }
.primary-button,
.secondary-button {
  min-height: 56px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 0 20px;
  border-radius: 16px;
  font-weight: 800;
  cursor: pointer;
}
.primary-button {
  border: none;
  color: #ffffff;
  background: #008b69;
  box-shadow: 0 10px 25px rgba(0, 139, 105, 0.2);
}
.secondary-button {
  border: 1px solid #99d4c2;
  color: #007d60;
  background: #ffffff;
}
.small-button {
  min-height: 45px;
  margin-top: 8px;
}
.state-card,
.empty-medicines {
  padding: 50px 25px;
  text-align: center;
  border: 1px solid #e0ebe7;
  border-radius: 24px;
  background: #ffffff;
}
.state-card h2,
.empty-medicines h3 {
  margin: 14px 0 7px;
}
.state-card p,
.empty-medicines p {
  color: #75827d;
}
.error-state ion-icon,
.empty-medicines ion-icon {
  color: #008b69;
  font-size: 45px;
}
.loader {
  width: 38px;
  height: 38px;
  margin: 0 auto;
  border: 4px solid #dcebe6;
  border-top-color: #008b69;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 760px) {
  .details-page {
    padding: 28px 16px 60px;
  }
  .summary-top,
  .medicine-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .medicine-count {
    width: 100%;
  }
  .information-grid,
  .medicine-details-grid {
    grid-template-columns: 1fr;
  }
  .bottom-actions {
    grid-template-columns: 1fr;
  }
  .medicine-header {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .review-badge {
    margin-left: 63px;
  }
}
@media (max-width: 480px) {
  .page-header {
    gap: 12px;
  }
  .back-button {
    width: 43px;
    height: 43px;
    flex-basis: 43px;
  }
  .summary-card {
    flex-direction: column;
  }
  .summary-icon {
    width: 65px;
    height: 65px;
    flex-basis: 65px;
  }
  .medicine-card {
    padding: 18px;
  }
}
</style>