<template>
  <ion-page>
    <ion-content :fullscreen="true" class="result-content">
      <div class="page-container">
        <!-- HEADER -->
        <header class="top-header">
          <button class="back-button" @click="goBack">
            <ion-icon :icon="arrowBackOutline"></ion-icon>
          </button>
          <div class="header-title">
            <h1>OCR Result</h1>
            <p>Review and confirm the extracted information.</p>
          </div>
          <div class="brand-icon">
            <ion-icon :icon="medicalOutline"></ion-icon>
          </div>
        </header>
        <!-- 4 STEP FLOW -->
        <section class="steps">
          <div class="step completed">
            <div class="step-circle">
              <ion-icon :icon="cameraOutline"></ion-icon>
            </div>
            <span>1. Capture</span>
          </div>
          <div class="step-line completed-line"></div>
          <div class="step completed">
            <div class="step-circle">
              <ion-icon :icon="documentTextOutline"></ion-icon>
            </div>
            <span>2. Extract Text</span>
          </div>
          <div class="step-line completed-line"></div>
          <div class="step active">
            <div class="step-circle">
              <ion-icon :icon="medicalOutline"></ion-icon>
            </div>
            <span>3. Identify</span>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-circle">
              <ion-icon :icon="checkmarkOutline"></ion-icon>
            </div>
            <span>4. Review</span>
          </div>
        </section>
        <!-- NO OCR -->
        <section
          v-if="!hasDetectedText"
          class="no-text-card"
        >
          <div class="no-text-icon">
            <ion-icon :icon="alertCircleOutline"></ion-icon>
          </div>
          <h2>No Readable Text Found</h2>
          <p>
            MediScan could not find readable prescription text.
            Please scan the prescription again using a clearer image.
          </p>
          <button
            class="retry-button"
            @click="scanAgain"
          >
            <ion-icon :icon="cameraOutline"></ion-icon>
            Scan Again
          </button>
        </section>
        <template v-else>
          <!-- SUCCESS / SUMMARY -->
          <section class="result-summary">
            <div class="success-panel">
              <div class="success-icon">
                <ion-icon :icon="sparklesOutline"></ion-icon>
              </div>
              <div>
                <h2>Text extracted successfully</h2>
                <p>
                  Review the detected information below.
                  You can edit anything that was read incorrectly.
                </p>
              </div>
            </div>
            <div class="confidence-panel">
              <div class="confidence-header">
                <strong>Extraction status</strong>
                <span>
                  {{ medicines.length }}
                  {{ medicines.length === 1 ? 'medicine' : 'medicines' }}
                  identified
                </span>
              </div>
              <div class="confidence-track">
                <div
                  class="confidence-fill"
                  :style="{ width: `${overallConfidence}%` }"
                ></div>
              </div>
              <div class="confidence-footer">
                <span>
                  AI-assisted identification
                </span>
                <strong>{{ overallConfidence }}%</strong>
              </div>
            </div>
          </section>
          <!-- DETECTED MEDICINES -->
          <section class="medicine-section">
            <div class="medicine-heading">
              <div>
                <span class="eyebrow">
                  IDENTIFIED FROM OCR
                </span>
                <h2>Detected Medicines</h2>
                <p>
                  Medicine information identified from the OCR text.
                </p>
              </div>
              <div class="medicine-count">
                {{ medicines.length }}
                {{ medicines.length === 1 ? 'medicine' : 'medicines' }}
                found
              </div>
            </div>
            <!-- MEDICINES FOUND -->
            <div
              v-if="medicines.length > 0"
              class="medicine-list"
            >
              <article
                v-for="(medicine, index) in medicines"
                :key="medicine.id"
                class="medicine-card"
              >
                <div class="medicine-top">
                  <div class="medicine-number">
                    {{ index + 1 }}
                  </div>
                  <div class="medicine-name">
                    <span>MEDICINE</span>
                    <h3>
                      {{ medicine.name || 'Unclear medicine name' }}
                      <template v-if="medicine.strength">
                        {{ medicine.strength }}
                      </template>
                    </h3>
                  </div>
                  <div
                    class="confidence-badge"
                    :class="confidenceClass(medicine.confidence)"
                  >
                    <ion-icon
                      :icon="
                        medicine.confidence >= 80
                          ? checkmarkCircleOutline
                          : alertCircleOutline
                      "
                    ></ion-icon>
                    {{ confidenceLabel(medicine.confidence) }}
                  </div>
                </div>
                <!-- DETAILS -->
                <div class="medicine-details">
                  <div class="detail-box">
                    <div class="detail-icon">
                      <ion-icon :icon="medicalOutline"></ion-icon>
                    </div>
                    <div>
                      <span>Dosage Form</span>
                      <strong>
                        {{ medicine.dosageForm || 'Needs review' }}
                      </strong>
                    </div>
                  </div>
                  <div class="detail-box">
                    <div class="detail-icon">
                      <ion-icon :icon="fitnessOutline"></ion-icon>
                    </div>
                    <div>
                      <span>Strength</span>
                      <strong>
                        {{ medicine.strength || 'Needs review' }}
                      </strong>
                    </div>
                  </div>
                  <div class="detail-box">
                    <div class="detail-icon blue-icon">
                      <ion-icon :icon="timeOutline"></ion-icon>
                    </div>
                    <div>
                      <span>Frequency</span>
                      <strong>
                        {{ medicine.frequency || 'Needs review' }}
                      </strong>
                    </div>
                  </div>
                  <div class="detail-box">
                    <div class="detail-icon purple-icon">
                      <ion-icon :icon="calendarOutline"></ion-icon>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong>
                        {{ medicine.duration || '—' }}
                      </strong>
                    </div>
                  </div>
                  <div class="detail-box">
                    <div class="detail-icon"><ion-icon :icon="medicalOutline"></ion-icon></div>
                    <div><span>Prescribed Quantity</span><strong>{{ medicine.quantity ?? 'Not specified' }}</strong></div>
                  </div>
                </div>
                <div v-if="medicine.quantity == null" class="quantity-review-note">
                  Quantity not detected. Check the original prescription and use
                  <strong>Edit detected information</strong> to enter the prescribed quantity.
                  Do not estimate from frequency or duration.
                </div>
                <!-- INSTRUCTION -->
                <div
                  v-if="medicine.instruction"
                  class="instruction"
                >
                  <ion-icon :icon="informationCircleOutline"></ion-icon>
                  <div>
                    <span>Prescription Instruction</span>
                    <p>{{ medicine.instruction }}</p>
                  </div>
                </div>
                <!-- EDIT -->
                <div
                  v-if="editingMedicine === medicine.id"
                  class="edit-area"
                >
                  <div class="edit-grid">
                    <label>
                      Medicine Name
                      <input
                        v-model="medicine.name"
                        type="text"
                      />
                    </label>
                    <label>
                      Strength
                      <input
                        v-model="medicine.strength"
                        type="text"
                      />
                    </label>
                    <label>
                      Dosage Form
                      <input
                        v-model="medicine.dosageForm"
                        type="text"
                      />
                    </label>
                    <label>
                      Frequency
                      <input
                        v-model="medicine.frequency"
                        type="text"
                      />
                    </label>
                    <label>
                      Duration
                      <input
                        v-model="medicine.duration"
                        type="text"
                      />
                    </label>
                    <label>
                      Instruction
                      <input
                        v-model="medicine.instruction"
                        type="text"
                      />
                    </label>
                  </div>
                  <label>
                    Prescribed Quantity (optional)
                    <input
                        :value="medicine.quantity ?? ''"
                        @input="updateQuantity(medicine, $event)"
                        type="number"
                        min="1"
                        max="999"
                        step="1"
                        placeholder="Enter quantity from Rx"
                      />
                  </label>
                  <button
                    class="done-edit-button"
                    @click="editingMedicine = null"
                  >
                    <ion-icon :icon="checkmarkOutline"></ion-icon>
                    Done Editing
                  </button>
                </div>
                <button
                  v-else
                  class="edit-card-button"
                  @click="editingMedicine = medicine.id"
                >
                  <ion-icon :icon="createOutline"></ion-icon>
                  Edit detected information
                </button>
              </article>
            </div>
            <!-- OCR TEXT BUT NO MEDICINES -->
            <div
              v-else
              class="no-medicines"
            >
              <ion-icon :icon="alertCircleOutline"></ion-icon>
              <div>
                <h3>Medicine details need review</h3>
                <p>
                  Text was successfully extracted, but MediScan could not
                  confidently separate medicine information from this scan.
                  Review the extracted prescription text below.
                </p>
              </div>
            </div>
          </section>
          <!-- RAW OCR -->
          <section class="extracted-section">
            <div class="extracted-heading">
              <div>
                <span class="eyebrow">
                  OCR REFERENCE
                </span>
                <h2>Extracted Prescription Text</h2>
              </div>
              <button
                class="toggle-text-button"
                @click="showFullText = !showFullText"
              >
                {{ showFullText ? 'Hide Full Text' : 'View Full Text' }}
                <ion-icon
                  :icon="
                    showFullText
                      ? chevronUpOutline
                      : chevronDownOutline
                  "
                ></ion-icon>
              </button>
            </div>
            <div
              class="raw-text"
              :class="{ collapsed: !showFullText }"
            >
              {{ ocrText }}
            </div>
          </section>
          <!-- WARNING -->
          <section class="safety-card">
            <div class="safety-icon">
              <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            </div>
            <div>
              <h3>Review before confirming</h3>
              <p>
                OCR and automatic medicine identification can make mistakes,
                especially with handwritten prescriptions. Compare every
                medicine name, strength, dosage and instruction with the
                original prescription. Confirm unclear information with a
                pharmacist or healthcare professional.
              </p>
            </div>
          </section>
          <!-- ACTIONS -->
          <section class="actions">
            <button
              class="secondary-button"
              @click="editAllInformation"
            >
              <ion-icon :icon="createOutline"></ion-icon>
              Edit Information
            </button>
            <button
              class="primary-button"
              @click="confirmAndContinue"
            >
              Confirm and Continue
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </section>
          <button
            class="scan-again-link"
            @click="scanAgain"
          >
            <ion-icon :icon="cameraOutline"></ion-icon>
            Scan Another Prescription
          </button>
        </template>
      </div>
    </ion-content>
    <div v-if="showSavedModal" class="saved-overlay" role="presentation">
      <section class="saved-dialog" role="dialog" aria-modal="true" aria-labelledby="saved-title">
        <div class="saved-icon"><ion-icon :icon="checkmarkCircleOutline" /></div>
        <div class="saved-eyebrow">PRESCRIPTION CONFIRMED</div>
        <h2 id="saved-title">Prescription Saved!</h2>
        <p class="saved-subtitle">Your reviewed prescription has been saved successfully. Ready to find your medicines?</p>
        <div class="saved-summary">
          <div class="saved-summary-head"><span>Confirmed medicines</span><strong>{{ medicines.length }}</strong></div>
          <div v-for="medicine in medicines" :key="medicine.id" class="saved-medicine">
            <div class="saved-pill-icon"><ion-icon :icon="medicalOutline" /></div>
            <div class="saved-medicine-info"><strong>{{ medicine.name }} {{ medicine.strength }}</strong><small>{{ medicine.dosageForm || 'Dosage form not specified' }}</small></div>
            <span class="saved-quantity">{{ medicine.quantity != null ? `Qty ${medicine.quantity}` : 'Qty to verify' }}</span>
          </div>
        </div>
        <p class="saved-note"><ion-icon :icon="informationCircleOutline" /> Pharmacy prices and stock are simulated for demo only. Verify medicines and quantities with a pharmacist.</p>
        <button class="saved-primary" type="button" @click="finishSavedPrescription(true)">Find Medicines in Pharmacies <ion-icon :icon="arrowForwardOutline" /></button>
        <button class="saved-secondary" type="button" @click="finishSavedPrescription(false)">View My Prescriptions</button>
      </section>
    </div>
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
  arrowBackOutline,
  arrowForwardOutline,
  cameraOutline,
  documentTextOutline,
  medicalOutline,
  checkmarkOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  sparklesOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  fitnessOutline,
  timeOutline,
  calendarOutline,
  createOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { supabase } from '../utils/supabase';
const router = useRouter();
const showSavedModal = ref(false);
const savedPrescriptionId = ref<string | null>(null);
const finishSavedPrescription = (goToPharmacy: boolean) => {
  if (goToPharmacy) {
    const transfer = medicines.value.map(medicine => ({
      name: medicine.strength.trim() && !medicine.name.toLowerCase().includes(medicine.strength.trim().toLowerCase())
        ? `${medicine.name.trim()} ${medicine.strength.trim()}` : medicine.name.trim(),
      quantity: medicine.quantity != null && Number.isInteger(medicine.quantity) ? medicine.quantity : null
    }));
    sessionStorage.setItem('mediscan_prescription_pharmacy', JSON.stringify(transfer));
  } else {
    sessionStorage.removeItem('mediscan_prescription_pharmacy');
  }
  for (const key of ['mediscan_ocr_text', 'mediscan_ai_result', 'mediscan_scan_filename', 'mediscan_scan_date', 'mediscan_ocr_method']) {
    sessionStorage.removeItem(key);
  }
  showSavedModal.value = false;
  window.location.replace(goToPharmacy ? '/tabs/pharmacy' : '/tabs/prescriptions');
};
/* =========================================
   GEMINI RESULT TYPES
\========================================= */
type AIConfidence =
  | 'high'
  | 'medium'
  | 'low';
interface AIMedicine {
  name: string | null;
  form: string | null;
  strength: string | null;
  dosage: string | null;
  frequency: string | null;
  duration: string | null;
  instructions: string | null;
  confidence: AIConfidence;
  needs_review: boolean;
}
interface AIAnalysis {
  prescription_detected: boolean;
  patient_name: string | null;
  doctor_name: string | null;
  prescription_date: string | null;
  extracted_text: string;
  medicines: AIMedicine[];
  warnings: string[];
}
/* =========================================
   DISPLAY / EDITABLE MEDICINE TYPE
\========================================= */
interface Medicine {
  id: number;
  name: string;
  strength: string;
  dosageForm: string;
  dosage: string;
  frequency: string;
  duration: string;
  instruction: string;
  confidence: number;
  confidenceLevel: AIConfidence;
  needsReview: boolean;
  rawText: string;
  quantity: number | null;
}
/* =========================================
   PAGE DATA
\========================================= */
const ocrText =
  ref('');
const fileName =
  ref('Prescription image');
const scanDate =
  ref('Not available');
const medicines =
  ref<Medicine[]>([]);
const editingMedicine =
  ref<number | null>(null);
const showFullText =
  ref(false);
/* =========================================
   AI METADATA
\========================================= */
const prescriptionDetected =
  ref<boolean | null>(null);
const patientName =
  ref('');
const doctorName =
  ref('');
const prescriptionDate =
  ref('');
const aiWarnings =
  ref<string[]>([]);
const aiResultAvailable =
  ref(false);
/* =========================================
   CONFIDENCE CONVERSION
   Gemini returns:
   high / medium / low
   The existing UI uses a percentage bar.
   IMPORTANT:
   This percentage is only a UI representation
   of the AI reading-confidence category.
   It is NOT medical certainty.
\========================================= */
const confidenceToNumber = (
  confidence: unknown
): number => {
  if (confidence === 'high') {
    return 95;
  }
  if (confidence === 'medium') {
    return 70;
  }
  return 40;
};
/* =========================================
   NORMALIZE STRING
   Never invent missing information.
\========================================= */
const safeString = (
  value: unknown
): string => {
  if (
    typeof value !== 'string'
  ) {
    return '';
  }
  return value.trim();
};
/* =========================================
   NORMALIZE CONFIDENCE
\========================================= */
const safeConfidence = (
  value: unknown
): AIConfidence => {
  if (
    value === 'high' ||
    value === 'medium' ||
    value === 'low'
  ) {
    return value;
  }
  return 'low';
};
/* =========================================
   MAP GEMINI MEDICINE TO EXISTING UI
\========================================= */
const mapAIMedicine = (
  medicine: any,
  index: number
): Medicine => {
  const confidenceLevel =
    safeConfidence(
      medicine?.confidence
    );
  const name =
    safeString(
      medicine?.name
    );
  const strength =
    safeString(
      medicine?.strength
    );
  const dosageForm =
    safeString(
      medicine?.form
    );
  const dosage =
    safeString(
      medicine?.dosage
    );
  const frequency =
    safeString(
      medicine?.frequency
    );
  const duration =
    safeString(
      medicine?.duration
    );
  const instruction =
    safeString(
      medicine?.instructions
    );
  /*
    Respect backend review flag.
    If the medicine name itself is missing,
    review is automatically required.
  */
  const needsReview =
    medicine?.needs_review === true ||
    !name;
  return {
    id: index + 1,
    name,
    strength,
    dosageForm,
    dosage,
    frequency,
    duration,
    instruction,
    confidence:
      confidenceToNumber(
        confidenceLevel
      ),
    confidenceLevel,
    needsReview,
    /*
      We intentionally do not manufacture
      medicine-specific OCR text here.
      The full original OCR transcription
      remains visible below the cards.
    */
    rawText: '',
    quantity: (() => {
      const value = medicine?.quantity;
      const numberValue = typeof value === 'number' ? value : (typeof value === 'string' && value.trim() ? Number(value) : NaN);
      return Number.isInteger(numberValue) && numberValue > 0 && numberValue <= 999 ? numberValue : null;
    })()
  };
};
/* =========================================
   LOAD SAVED RESULT
\========================================= */
onMounted(() => {
  const savedText =
    sessionStorage.getItem(
      'mediscan_ocr_text'
    );
  const savedAIResult =
    sessionStorage.getItem(
      'mediscan_ai_result'
    );
  const savedFileName =
    sessionStorage.getItem(
      'mediscan_scan_filename'
    );
  const savedScanDate =
    sessionStorage.getItem(
      'mediscan_scan_date'
    );
  /* -------------------------------------
     RAW TESSERACT OCR
  ------------------------------------- */
  if (savedText) {
    ocrText.value =
      savedText.trim();
  }
  /* -------------------------------------
     GEMINI STRUCTURED RESULT
  ------------------------------------- */
  if (savedAIResult) {
    try {
      const parsed:
        AIAnalysis =
        JSON.parse(
          savedAIResult
        );
      aiResultAvailable.value =
        true;
      if (
        typeof parsed
          ?.prescription_detected ===
        'boolean'
      ) {
        prescriptionDetected.value =
          parsed.prescription_detected;
      }
      patientName.value =
        safeString(
          parsed?.patient_name
        );
      doctorName.value =
        safeString(
          parsed?.doctor_name
        );
      prescriptionDate.value =
        safeString(
          parsed?.prescription_date
        );
      if (
        Array.isArray(
          parsed?.warnings
        )
      ) {
        aiWarnings.value =
          parsed.warnings
            .filter(
              warning =>
                typeof warning ===
                'string'
            )
            .map(
              warning =>
                warning.trim()
            )
            .filter(Boolean);
      }
      /*
        If for some reason the OCR key is
        missing, use extracted_text returned
        by the backend.
        The backend preserves the original
        OCR transcription rather than
        rewriting it.
      */
      if (
        !ocrText.value &&
        typeof parsed
          ?.extracted_text ===
          'string'
      ) {
        ocrText.value =
          parsed.extracted_text.trim();
      }
      /*
        THIS IS THE IMPORTANT CHANGE.
        No extractMedicines(ocrText).
        We use Gemini's structured medicines
        directly.
      */
      if (
        Array.isArray(
          parsed?.medicines
        )
      ) {
        medicines.value =
          parsed.medicines.map(
            (
              medicine,
              index
            ) =>
              mapAIMedicine(
                medicine,
                index
              )
          );
      } else {
        medicines.value = [];
      }
    } catch (error) {
      console.error(
        'Unable to read MediScan AI result:',
        error
      );
      aiResultAvailable.value =
        false;
      medicines.value = [];
    }
  }
  /* -------------------------------------
     FILE NAME
  ------------------------------------- */
  if (savedFileName) {
    fileName.value =
      savedFileName;
  }
  /* -------------------------------------
     SCAN DATE
  ------------------------------------- */
  if (savedScanDate) {
    const date =
      new Date(
        savedScanDate
      );
    if (
      !Number.isNaN(
        date.getTime()
      )
    ) {
      scanDate.value =
        date.toLocaleString(
          'en-PH',
          {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          }
        );
    }
  }
});
/* =========================================
   HAS OCR TEXT
\========================================= */
const hasDetectedText =
  computed(() => {
    return (
      ocrText.value
        .trim()
        .length > 0
    );
  });
/* =========================================
   OVERALL AI READING CONFIDENCE
   This is an average of the UI mappings:
   high   = 95
   medium = 70
   low    = 40
   It is NOT medical correctness.
\========================================= */
const overallConfidence =
  computed(() => {
    if (
      medicines.value.length ===
      0
    ) {
      return 0;
    }
    const total =
      medicines.value.reduce(
        (
          sum,
          medicine
        ) =>
          sum +
          medicine.confidence,
        0
      );
    return Math.round(
      total /
        medicines.value.length
    );
  });
/* =========================================
   REVIEW COUNT
\========================================= */
const medicinesNeedingReview =
  computed(() => {
    return medicines.value.filter(
      medicine =>
        medicine.needsReview
    ).length;
  });
/* =========================================
   CONFIDENCE DISPLAY
\========================================= */
const confidenceLabel = (
  confidence: number
) => {
  if (
    confidence >= 80
  ) {
    return 'High';
  }
  if (
    confidence >= 55
  ) {
    return 'Needs Review';
  }
  return 'Low';
};
const confidenceClass = (
  confidence: number
) => {
  if (
    confidence >= 80
  ) {
    return 'high';
  }
  if (
    confidence >= 55
  ) {
    return 'medium';
  }
  return 'low';
};
/* =========================================
   EDIT ALL
\========================================= */
const editAllInformation =
  async () => {
    if (
      medicines.value.length ===
      0
    ) {
      const alert =
        await alertController.create({
          header:
            'No Medicine Fields Detected',
          message:
            aiResultAvailable.value
              ? 'MediScan AI did not identify a medicine reliably enough to create an editable medicine card. Review the extracted OCR text and scan again if needed.'
              : 'No AI-structured medicine result is available. Please scan the prescription again.',
          buttons: ['OK']
        });
      await alert.present();
      return;
    }
    editingMedicine.value =
      medicines.value[0].id;
    /*
      Wait until Vue displays the edit area.
    */
    setTimeout(
      () => {
        const firstCard =
          document.querySelector(
            '.medicine-card'
          );
        firstCard?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      },
      50
    );
  };
/* =========================================
   CONFIRM REVIEWED INFORMATION
\========================================= */
const updateQuantity = (medicine: Medicine, event: Event) => {
  const value = (event.target as HTMLInputElement).value.trim();
  medicine.quantity = value === '' ? null : Number(value);
};
const confirmAndContinue =
  async () => {
    /* =========================================
       VALIDATION
    ========================================= */
    if (
      medicines.value.length ===
      0
    ) {
      const alert =
        await alertController.create({
          header:
            'Review Required',
          message:
            'No structured medicine information was identified. Review the prescription text or scan the prescription again before confirming.',
          buttons: ['OK']
        });
      await alert.present();
      return;
    }
    const missingMedicineName =
      medicines.value.some(
        (medicine) =>
          !medicine.name.trim()
      );
    if (missingMedicineName) {
      const alert =
        await alertController.create({
          header:
            'Medicine Name Needs Review',
          message:
            'At least one medicine name could not be read reliably. Please compare it with the original prescription and edit the information before confirming.',
          buttons: ['OK']
        });
      await alert.present();
      return;
    }
      const invalidQuantity = medicines.value.some(m =>
      m.quantity !== null && m.quantity !== undefined && m.quantity !== ('' as unknown as number) &&
      (!Number.isInteger(m.quantity) || m.quantity < 1 || m.quantity > 999)
    );
    if (invalidQuantity) {
      const alert = await alertController.create({
        header: 'Check Quantity',
        message: 'Use a whole number from 1 to 999, or leave quantity blank if the prescription does not specify it.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
      const missingQuantities = medicines.value.filter(m => m.quantity == null);
    if (missingQuantities.length > 0) {
      const alert = await alertController.create({
        header: 'Verify Prescribed Quantities',
        message: `${missingQuantities.length} medicine(s) have no confirmed quantity. Review the original prescription and enter the quantity if written. You may continue without it, but the quantity must still be verified in Pharmacy.`,
        buttons: [
          { text: 'Review Quantities', role: 'review' },
          { text: 'Continue Without Quantity', role: 'continue' }
        ]
      });
      await alert.present();
      const { role } = await alert.onDidDismiss();
      if (role !== 'continue') {
        editingMedicine.value = missingQuantities[0].id;
        return;
      }
    }
/* =========================================
       SAVE REVIEWED COPY LOCALLY
    ========================================= */
    sessionStorage.setItem(
      'mediscan_detected_medicines',
      JSON.stringify(
        medicines.value
      )
    );
    sessionStorage.setItem(
      'mediscan_reviewed_prescription',
      JSON.stringify({
        patient_name:
          patientName.value || null,
        doctor_name:
          doctorName.value || null,
        prescription_date:
          prescriptionDate.value ||
          null,
        medicines:
          medicines.value,
        warnings:
          aiWarnings.value,
        reviewed_at:
          new Date().toISOString()
      })
    );
    /* =========================================
       SAVE TO SUPABASE
    ========================================= */
    try {
      /*
        STEP 1:
        Save the prescription.
      */
      const {
        data: prescription,
        error: prescriptionError
      } =
        await supabase
          .from('prescriptions')
          .insert({
            patient_name:
              patientName.value.trim() ||
              null,
            doctor_name:
              doctorName.value.trim() ||
              null,
            prescription_date:
              prescriptionDate.value.trim() ||
              null,
            extracted_text:
              ocrText.value.trim(),
            scan_method:
              'MediScan AI Vision + OCR'
          })
          .select('id')
          .single();
      if (prescriptionError) {
        throw prescriptionError;
      }
      if (!prescription?.id) {
        throw new Error(
          'No prescription ID was returned.'
        );
      }
      /*
        STEP 2:
        Prepare medicines using the
        prescription ID we just created.
      */
      const medicineRows =
        medicines.value.map(
          (medicine) => ({
            prescription_id:
              prescription.id,
            medicine_name:
              medicine.name.trim() ||
              null,
            dosage_form:
              medicine.dosageForm.trim() ||
              null,
            strength:
              medicine.strength.trim() ||
              null,
            dosage:
              medicine.dosage.trim() ||
              null,
            frequency:
              medicine.frequency.trim() ||
              null,
            duration:
              medicine.duration.trim() ||
              null,
            instructions:
              medicine.instruction.trim() ||
              null,
            confidence:
              medicine.confidenceLevel,
            needs_review:
              medicine.needsReview,
            quantity: medicine.quantity
          })
        );
      /*
        STEP 3:
        Save all medicines.
      */
      const {
        error: medicinesError
      } =
        await supabase
          .from(
            'prescription_medicines'
          )
          .insert(
            medicineRows
          );
      if (medicinesError) {
        /*
          Remove the main prescription if
          medicine saving failed so we don't
          leave an incomplete record.
        */
        await supabase
          .from('prescriptions')
          .delete()
          .eq(
            'id',
            prescription.id
          );
        throw medicinesError;
      }
      /* =========================================
         SUCCESS
      ========================================= */
      sessionStorage.setItem(
        'mediscan_saved_prescription_id',
        prescription.id
      );
      savedPrescriptionId.value = prescription.id;
      showSavedModal.value = true;
    } catch (error) {
      console.error(
        'Unable to save prescription:',
        error
      );
      const errorAlert =
        await alertController.create({
          header:
            'Unable to Save',
          message:
            'MediScan could not save this prescription to the database. Your current scan is still available, so you can try again.',
          buttons: ['OK']
        });
      await errorAlert.present();
    }
  };
/* =========================================
   BACK
\========================================= */
const goBack = () => {
  router.back();
};
/* =========================================
   SCAN AGAIN
\========================================= */
const scanAgain = () => {
  sessionStorage.removeItem(
    'mediscan_ocr_text'
  );
  sessionStorage.removeItem(
    'mediscan_ai_result'
  );
  sessionStorage.removeItem(
    'mediscan_scan_filename'
  );
  sessionStorage.removeItem(
    'mediscan_scan_date'
  );
  sessionStorage.removeItem(
    'mediscan_ocr_method'
  );
  sessionStorage.removeItem(
    'mediscan_detected_medicines'
  );
  sessionStorage.removeItem(
    'mediscan_reviewed_prescription'
  );
  router.push(
    '/scan-prescription'
  );
};
</script>
<style scoped>
.result-content {
  --background: #f5faf8;
  --color: #10231c;
}
.page-container {
  width: min(100%, 1050px);
  margin: 0 auto;
  padding: 35px 28px 70px;
  color: #10231c;
}
.page-container h1,
.page-container h2,
.page-container h3,
.page-container strong {
  color: #10231c;
}
/* HEADER */
.top-header {
  display: grid;
  grid-template-columns: 55px 1fr 55px;
  align-items: center;
  gap: 15px;
  margin-bottom: 32px;
}
.back-button,
.brand-icon {
  width: 50px;
  height: 50px;
  border-radius: 17px;
}
.back-button {
  border: none;
  background: #ffffff;
  color: #17372c;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 5px 18px rgba(20, 60, 48, 0.07);
}
.back-button ion-icon {
  font-size: 25px;
}
.header-title {
  text-align: center;
}
.header-title h1 {
  margin: 0 0 5px;
  font-size: 30px;
  font-weight: 850;
  color: #10231c !important;
}
.header-title p {
  margin: 0;
  color: #718079;
  font-size: 14px;
}
.brand-icon {
  background: #ddf7ee;
  color: #078b67;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-icon ion-icon {
  font-size: 27px;
}
/* STEPS */
.steps {
  max-width: 760px;
  margin: 0 auto 36px;
  display: flex;
  align-items: flex-start;
}
.step {
  min-width: 95px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #7e8c87;
  font-size: 12px;
  font-weight: 750;
  text-align: center;
}
.step-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #e7ecea;
  color: #66736e;
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-circle ion-icon {
  font-size: 23px;
}
.step.completed,
.step.active {
  color: #067f60;
}
.step.completed .step-circle {
  background: #dff8ef;
  color: #078b67;
}
.step.active .step-circle {
  background: #078b67;
  color: #ffffff;
  box-shadow: 0 6px 18px rgba(7, 139, 103, 0.23);
}
.step-line {
  flex: 1;
  height: 3px;
  margin-top: 24px;
  background: #d8dfdc;
}
.completed-line {
  background: #48b998;
}
/* SUMMARY */
.result-summary {
  display: grid;
  grid-template-columns: 1.35fr 0.8fr;
  gap: 18px;
  margin-bottom: 35px;
}
.success-panel,
.confidence-panel {
  border-radius: 24px;
  background: #ffffff;
}
.success-panel {
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 17px;
  background: linear-gradient(135deg, #e1faf2, #f5fffb);
  border: 1px solid #c9eee2;
}
.success-icon {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 19px;
  background: #d2f5e9;
  color: #078b67;
  display: flex;
  align-items: center;
  justify-content: center;
}
.success-icon ion-icon {
  font-size: 31px;
}
.success-panel h2 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #075e49 !important;
}
.success-panel p {
  margin: 0;
  color: #326f5d;
  line-height: 1.5;
  font-size: 13px;
}
.confidence-panel {
  padding: 22px;
  box-shadow: 0 5px 20px rgba(20, 60, 48, 0.05);
}
.confidence-header,
.confidence-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.confidence-header {
  margin-bottom: 15px;
}
.confidence-header strong {
  font-size: 14px;
}
.confidence-header span {
  color: #078b67;
  font-size: 11px;
  font-weight: 800;
}
.confidence-track {
  height: 10px;
  overflow: hidden;
  border-radius: 100px;
  background: #e6ece9;
}
.confidence-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #078b67, #19b98b);
}
.confidence-footer {
  margin-top: 10px;
}
.confidence-footer span {
  color: #83908b;
  font-size: 10px;
}
.confidence-footer strong {
  color: #078b67 !important;
  font-size: 18px;
}
/* MEDICINES */
.medicine-section {
  margin-top: 15px;
}
.medicine-heading {
  margin-bottom: 17px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 15px;
}
.eyebrow {
  display: block;
  margin-bottom: 5px;
  color: #078b67;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}
.medicine-heading h2,
.extracted-heading h2 {
  margin: 0 0 5px;
  font-size: 26px;
  color: #10231c !important;
}
.medicine-heading p {
  margin: 0;
  color: #74817c;
  font-size: 13px;
}
.medicine-count {
  padding: 8px 14px;
  border-radius: 100px;
  background: #ddf7ee;
  color: #078b67;
  font-size: 12px;
  font-weight: 850;
}
.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.medicine-card {
  padding: 24px;
  border-radius: 25px;
  background: #ffffff;
  box-shadow: 0 6px 22px rgba(20, 60, 48, 0.06);
}
.medicine-top {
  display: flex;
  align-items: center;
  gap: 15px;
}
.medicine-number {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 15px;
  background: #d9f6ec;
  color: #078b67;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
  font-weight: 900;
}
.medicine-name {
  flex: 1;
}
.medicine-name span {
  display: block;
  color: #74857f;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.8px;
}
.medicine-name h3 {
  margin: 5px 0 0;
  font-size: 21px;
  color: #10231c !important;
}
.confidence-badge {
  padding: 8px 12px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 850;
}
.confidence-badge.high {
  background: #def7ef;
  color: #078b67;
}
.confidence-badge.medium {
  background: #fff2cf;
  color: #a56c00;
}
.confidence-badge.low {
  background: #ffe9e9;
  color: #c44747;
}
.confidence-badge ion-icon {
  font-size: 16px;
}
.medicine-details {
  margin-top: 19px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 11px;
}
.detail-box {
  min-height: 78px;
  padding: 13px;
  border-radius: 16px;
  background: #f6f9f8;
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-icon {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 12px;
  background: #dff7ef;
  color: #078b67;
  display: flex;
  align-items: center;
  justify-content: center;
}
.blue-icon {
  background: #e5f1ff;
  color: #2d78c2;
}
.purple-icon {
  background: #f0eaff;
  color: #7452b7;
}
.detail-icon ion-icon {
  font-size: 19px;
}
.detail-box span,
.detail-box strong {
  display: block;
}
.detail-box span {
  margin-bottom: 4px;
  color: #7b8984;
  font-size: 10px;
}
.detail-box strong {
  font-size: 12px;
  color: #183128 !important;
}
.instruction {
  margin-top: 14px;
  padding: 14px;
  border-radius: 15px;
  background: #eef6ff;
  color: #32668e;
  display: flex;
  align-items: flex-start;
  gap: 9px;
}
.instruction > ion-icon {
  min-width: 19px;
  margin-top: 1px;
  font-size: 19px;
}
.instruction span {
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.5px;
}
.instruction p {
  margin: 4px 0 0;
  font-size: 12px;
  line-height: 1.45;
}
.edit-card-button,
.done-edit-button {
  margin-top: 15px;
  min-height: 43px;
  padding: 0 15px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-weight: 750;
}
.edit-card-button {
  border: 1px solid #d7e5e0;
  background: #ffffff;
  color: #078b67;
}
.done-edit-button {
  border: none;
  background: #078b67;
  color: #ffffff;
}
.quantity-review-note {
  margin-top: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff7e6;
  color: #91600b;
  font-size: 12px;
  line-height: 1.5;
}
.edit-area > label {
  display: block;
  margin-top: 12px;
  color: #60716b;
  font-size: 12px;
  font-weight: 700;
}
.edit-area > label input {
  display: block;
  width: 100%;
  height: 44px;
  margin-top: 6px;
  padding: 0 12px;
  border: 1px solid #d6e2de;
  border-radius: 11px;
  background: #fbfdfc;
  color: #142c23;
}
.edit-area {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e6eeeb;
}
.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.edit-grid label {
  color: #60716b;
  font-size: 11px;
  font-weight: 700;
}
.edit-grid input {
  width: 100%;
  height: 44px;
  margin-top: 6px;
  padding: 0 12px;
  border: 1px solid #d6e2de;
  border-radius: 11px;
  outline: none;
  background: #fbfdfc;
  color: #142c23;
  font-size: 13px;
}
.edit-grid input:focus {
  border-color: #078b67;
}
.no-medicines {
  padding: 22px;
  border-radius: 20px;
  background: #fff7e7;
  border: 1px solid #f1dda9;
  display: flex;
  gap: 13px;
  color: #85620e;
}
.no-medicines > ion-icon {
  min-width: 25px;
  font-size: 25px;
}
.no-medicines h3 {
  margin: 0 0 5px;
  color: #785900 !important;
}
.no-medicines p {
  margin: 0;
  line-height: 1.5;
  font-size: 12px;
}
/* EXTRACTED TEXT */
.extracted-section {
  margin-top: 35px;
}
.extracted-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 14px;
}
.toggle-text-button {
  border: none;
  background: transparent;
  color: #078b67;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}
.raw-text {
  max-height: 550px;
  overflow: auto;
  padding: 22px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e2e9e6;
  color: #21352e;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  line-height: 1.75;
}
.raw-text.collapsed {
  max-height: 145px;
  overflow: hidden;
  position: relative;
}
/* SAFETY */
.safety-card {
  margin-top: 25px;
  padding: 19px;
  border-radius: 20px;
  background: #fff8e8;
  border: 1px solid #f0ddad;
  display: flex;
  align-items: flex-start;
  gap: 13px;
}
.safety-icon {
  width: 43px;
  height: 43px;
  min-width: 43px;
  border-radius: 13px;
  background: #ffedbd;
  color: #9d6c00;
  display: flex;
  align-items: center;
  justify-content: center;
}
.safety-icon ion-icon {
  font-size: 23px;
}
.safety-card h3 {
  margin: 0 0 6px;
  color: #765500 !important;
  font-size: 15px;
}
.safety-card p {
  margin: 0;
  color: #806b3a;
  line-height: 1.55;
  font-size: 12px;
}
/* ACTIONS */
.actions {
  margin-top: 27px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 13px;
}
.actions button {
  min-height: 57px;
  border-radius: 17px;
  font-size: 14px;
  font-weight: 850;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.secondary-button {
  border: 1px solid #078b67;
  background: #ffffff;
  color: #078b67;
}
.primary-button {
  border: none;
  background: linear-gradient(135deg, #087e60, #075541);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(7, 126, 96, 0.18);
}
.scan-again-link {
  margin: 18px auto 0;
  border: none;
  background: transparent;
  color: #74827d;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
/* NO TEXT */
.no-text-card {
  padding: 45px 25px;
  border-radius: 25px;
  background: #ffffff;
  text-align: center;
}
.no-text-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto 15px;
  border-radius: 20px;
  background: #fff0dd;
  color: #b97400;
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-text-icon ion-icon {
  font-size: 33px;
}
.no-text-card h2 {
  margin: 0 0 8px;
}
.no-text-card p {
  max-width: 550px;
  margin: 0 auto 20px;
  color: #718079;
  line-height: 1.55;
  font-size: 13px;
}
.retry-button {
  min-height: 47px;
  padding: 0 20px;
  border: none;
  border-radius: 14px;
  background: #078b67;
  color: #ffffff;
  cursor: pointer;
  font-weight: 800;
}
/* RESPONSIVE */
@media (max-width: 800px) {
  .result-summary {
    grid-template-columns: 1fr;
  }
  .medicine-details {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 700px) {
  .page-container {
    padding:
      calc(22px + env(safe-area-inset-top))
      16px
      calc(40px + env(safe-area-inset-bottom));
  }
  .top-header {
    grid-template-columns: 44px 1fr 44px;
    gap: 8px;
  }
  .back-button,
  .brand-icon {
    width: 42px;
    height: 42px;
    border-radius: 14px;
  }
  .header-title h1 {
    font-size: 21px;
  }
  .header-title p {
    font-size: 11px;
  }
  .steps {
    overflow-x: auto;
    padding-bottom: 5px;
  }
  .step {
    min-width: 78px;
    font-size: 10px;
  }
  .step-circle {
    width: 43px;
    height: 43px;
  }
  .step-line {
    min-width: 30px;
    margin-top: 21px;
  }
  .success-panel {
    align-items: flex-start;
  }
  .medicine-heading,
  .extracted-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .medicine-card {
    padding: 19px;
  }
  .medicine-top {
    align-items: flex-start;
    flex-wrap: wrap;
  }
  .medicine-name {
    min-width: calc(100% - 70px);
  }
  .confidence-badge {
    margin-left: 63px;
  }
  .actions {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 480px) {
  .header-title p {
    display: none;
  }
  .medicine-details,
  .edit-grid {
    grid-template-columns: 1fr;
  }
  .medicine-heading h2,
  .extracted-heading h2 {
    font-size: 22px;
  }
  .confidence-badge {
    margin-left: 0;
  }
}
/* Saved confirmation — custom responsive modal */
.saved-overlay { position: fixed; inset: 0; z-index: 10000; background: rgba(10,35,29,.58); display: flex; align-items: center; justify-content: center; padding: 18px; overflow-y: auto; }
.saved-dialog { width: min(100%, 490px); max-height: min(90vh, 760px); overflow-y: auto; background: #fff; color: #16372e; border-radius: 24px; padding: 30px; box-shadow: 0 22px 70px rgba(0,0,0,.18); text-align: center; }
.saved-icon { width: 66px; height: 66px; border-radius: 50%; margin: 0 auto 12px; display: grid; place-items: center; background: #ddf8ee; color: #009b72; font-size: 40px; }
.saved-eyebrow { color: #008c69; font-size: 10px; font-weight: 800; letter-spacing: 1.4px; }
.saved-dialog h2 { font-size: 27px; font-weight: 800; margin: 7px 0; color: #16372e; }
.saved-subtitle { color: #667e76; font-size: 14px; line-height: 1.55; margin: 0 auto 18px; max-width: 360px; }
.saved-summary { text-align: left; border: 1px solid #e1eee9; border-radius: 16px; padding: 14px; background: #f8fcfa; }
.saved-summary-head { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; margin-bottom: 7px; }
.saved-summary-head strong { background: #ddf8ee; color: #008c69; border-radius: 20px; padding: 3px 9px; }
.saved-medicine { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid #e5efeb; }
.saved-pill-icon { flex: 0 0 34px; height: 34px; border-radius: 10px; background: #e2f7ef; color: #008e6b; display: grid; place-items: center; font-size: 19px; }
.saved-medicine-info { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.saved-medicine-info strong { font-size: 13px; overflow-wrap: anywhere; }
.saved-medicine-info small { font-size: 11px; color: #71847e; }
.saved-quantity { font-size: 11px; font-weight: 700; color: #008d68; white-space: nowrap; }
.saved-note { display: flex; align-items: flex-start; gap: 7px; text-align: left; color: #74857f; font-size: 11px; line-height: 1.5; margin: 13px 0 18px; }
.saved-note ion-icon { flex-shrink: 0; font-size: 16px; color: #009b72; }
.saved-primary, .saved-secondary { width: 100%; min-height: 46px; border-radius: 12px; font-size: 13px; font-weight: 750; cursor: pointer; }
.saved-primary { background: #00966f; color: #fff; display: flex; align-items: center; justify-content: center; gap: 9px; }
.saved-secondary { background: #fff; color: #008b69; border: 1px solid #cce8de; margin-top: 9px; }
@media (max-width: 480px) { .saved-dialog { padding: 23px 17px; border-radius: 20px; } .saved-dialog h2 { font-size: 24px; } .saved-medicine-info strong { font-size: 12px; } }
</style>
