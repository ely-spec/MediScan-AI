<template>
  <ion-page>
    <ion-content :fullscreen="true" class="scan-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="page-header">
          <button
            class="back-button"
            @click="goBack"
            :disabled="isAnalyzing"
          >
            <ion-icon :icon="arrowBackOutline"></ion-icon>
          </button>

          <div class="header-text">
            <h1>Scan Prescription</h1>
            <p>
              Upload or capture a clear image of your prescription
            </p>
          </div>

          <div class="brand">
            Medi<span>Scan</span> AI
          </div>
        </header>

        <!-- STEPS -->
        <div class="steps">
          <div class="step active">
            <div class="step-number">
              <ion-icon
                v-if="isAnalyzing"
                :icon="checkmarkOutline"
              ></ion-icon>

              <span v-else>1</span>
            </div>

            <span>Upload</span>
          </div>

          <div
            class="step-line"
            :class="{ completed: isAnalyzing }"
          ></div>

          <div
            class="step"
            :class="{ active: isAnalyzing }"
          >
            <div class="step-number">2</div>
            <span>Analyze</span>
          </div>

          <div
            class="step-line"
            :class="{ completed: ocrProgress >= 90 }"
          ></div>

          <div
            class="step"
            :class="{ active: ocrProgress >= 90 }"
          >
            <div class="step-number">3</div>
            <span>Results</span>
          </div>
        </div>

        <!-- NO IMAGE -->
        <template v-if="!imagePreview">
          <section class="upload-card">
            <div class="upload-icon">
              <ion-icon
                :icon="documentTextOutline"
              ></ion-icon>

              <div class="camera-badge">
                <ion-icon :icon="camera"></ion-icon>
              </div>
            </div>

            <h2>Add Your Prescription</h2>

            <p>
              Take a photo or upload an existing image of your
              prescription. Make sure the entire prescription is
              visible and readable.
            </p>

            <div class="action-buttons">
              <button
                class="primary-button"
                @click="openCamera"
              >
                <ion-icon
                  :icon="cameraOutline"
                ></ion-icon>

                <div>
                  <strong>Take Photo</strong>
                  <span>Use your device camera</span>
                </div>

                <ion-icon
                  class="arrow"
                  :icon="chevronForwardOutline"
                ></ion-icon>
              </button>

              <button
                class="secondary-button"
                @click="openFilePicker"
              >
                <ion-icon
                  :icon="cloudUploadOutline"
                ></ion-icon>

                <div>
                  <strong>Upload Image</strong>
                  <span>Choose from your device</span>
                </div>

                <ion-icon
                  class="arrow"
                  :icon="chevronForwardOutline"
                ></ion-icon>
              </button>
            </div>

            <input
              ref="fileInput"
              class="hidden-input"
              type="file"
              accept="image/*"
              @change="handleFile"
            />

            <input
              ref="cameraInput"
              class="hidden-input"
              type="file"
              accept="image/*"
              capture="environment"
              @change="handleFile"
            />
          </section>

          <!-- TIPS -->
          <section class="tips-section">
            <div class="section-heading">
              <h2>Tips for a Clear Scan</h2>
              <p>For better prescription recognition</p>
            </div>

            <div class="tips-grid">
              <div class="tip-card">
                <div class="tip-icon green">
                  <ion-icon
                    :icon="sunnyOutline"
                  ></ion-icon>
                </div>

                <div>
                  <h3>Good Lighting</h3>
                  <p>
                    Capture the prescription in a bright,
                    well-lit area.
                  </p>
                </div>
              </div>

              <div class="tip-card">
                <div class="tip-icon blue">
                  <ion-icon
                    :icon="scanOutline"
                  ></ion-icon>
                </div>

                <div>
                  <h3>Keep It Flat</h3>
                  <p>
                    Place the prescription on a flat surface
                    before scanning.
                  </p>
                </div>
              </div>

              <div class="tip-card">
                <div class="tip-icon orange">
                  <ion-icon
                    :icon="expandOutline"
                  ></ion-icon>
                </div>

                <div>
                  <h3>Capture Everything</h3>
                  <p>
                    Make sure the entire prescription is
                    visible in the image.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </template>

        <!-- IMAGE SELECTED -->
        <template v-else>
          <section class="preview-section">

            <div class="preview-header">
              <div>
                <span class="ready-label">
                  <ion-icon
                    :icon="checkmarkCircle"
                  ></ion-icon>

                  {{
                    isAnalyzing
                      ? 'AI ANALYSIS IN PROGRESS'
                      : 'IMAGE READY'
                  }}
                </span>

                <h2>
                  {{
                    isAnalyzing
                      ? 'Analyzing Prescription'
                      : 'Review Prescription'
                  }}
                </h2>

                <p>
                  {{
                    isAnalyzing
                      ? 'MediScan AI is securely analyzing the prescription image.'
                      : 'Make sure the prescription is clear before continuing.'
                  }}
                </p>
              </div>

              <button
                v-if="!isAnalyzing"
                class="remove-button"
                @click="removeImage"
              >
                <ion-icon
                  :icon="trashOutline"
                ></ion-icon>

                Remove
              </button>
            </div>

            <!-- IMAGE -->
            <div class="image-preview">
              <img
                :src="imagePreview"
                alt="Prescription preview"
              />

              <div
                v-if="!isAnalyzing"
                class="preview-status"
              >
                <ion-icon
                  :icon="checkmarkCircle"
                ></ion-icon>

                Ready to analyze
              </div>

              <!-- ANALYZING OVERLAY -->
              <div
                v-if="isAnalyzing"
                class="analyzing-overlay"
              >
                <div class="analyzing-box">
                  <div class="scanner-icon">
                    <ion-icon
                      :icon="scanOutline"
                    ></ion-icon>
                  </div>

                  <h3>Analyzing Prescription</h3>

                  <p>{{ analysisStatus }}</p>

                  <div class="progress-track">
                    <div
                      class="progress-fill"
                      :style="{
                        width: `${ocrProgress}%`
                      }"
                    ></div>
                  </div>

                  <strong class="progress-percent">
                    {{ ocrProgress }}%
                  </strong>

                  <span class="please-wait">
                    Please keep this page open.
                  </span>
                </div>
              </div>
            </div>

            <!-- FILE INFO -->
            <div class="file-details">
              <div class="file-icon">
                <ion-icon
                  :icon="imageOutline"
                ></ion-icon>
              </div>

              <div class="file-info">
                <strong>
                  {{ selectedFileName }}
                </strong>

                <span>
                  {{ selectedFileSize }}
                </span>
              </div>

              <button
                v-if="!isAnalyzing"
                class="change-button"
                @click="openFilePicker"
              >
                Change Image
              </button>
            </div>

            <!-- AI PROGRESS -->
            <div
              v-if="isAnalyzing"
              class="ocr-progress-card"
            >
              <div class="ocr-progress-top">
                <div>
                  <strong>
                    {{ analysisStatus }}
                  </strong>

                  <span>
                    AI-assisted prescription recognition
                  </span>
                </div>

                <strong class="ocr-number">
                  {{ ocrProgress }}%
                </strong>
              </div>

              <div
                class="progress-track bottom-progress"
              >
                <div
                  class="progress-fill"
                  :style="{
                    width: `${ocrProgress}%`
                  }"
                ></div>
              </div>
            </div>

            <!-- INPUTS -->
            <input
              ref="fileInput"
              class="hidden-input"
              type="file"
              accept="image/*"
              @change="handleFile"
            />

            <input
              ref="cameraInput"
              class="hidden-input"
              type="file"
              accept="image/*"
              capture="environment"
              @change="handleFile"
            />

            <!-- BUTTONS -->
            <div
              v-if="!isAnalyzing"
              class="preview-actions"
            >
              <button
                class="retake-button"
                @click="openCamera"
              >
                <ion-icon
                  :icon="cameraOutline"
                ></ion-icon>

                Take Another Photo
              </button>

              <button
                class="analyze-button"
                @click="analyzePrescription"
              >
                <ion-icon
                  :icon="sparklesOutline"
                ></ion-icon>

                Analyze Prescription

                <ion-icon
                  :icon="arrowForwardOutline"
                ></ion-icon>
              </button>
            </div>

            <button
              v-else
              class="analyze-button analyzing-button"
              disabled
            >
              <span class="button-spinner"></span>

              Analyzing Prescription...

              <strong>
                {{ ocrProgress }}%
              </strong>
            </button>

          </section>
        </template>

        <!-- PRIVACY -->
        <div class="privacy-note">
          <ion-icon
            :icon="shieldCheckmarkOutline"
          ></ion-icon>

          <div>
            <strong>Your privacy matters</strong>

            <p>
  Your prescription image and locally extracted OCR text are
  securely sent to MediScan AI's cloud service for AI-assisted
  prescription recognition. Always review detected information
  against the original prescription before confirming it.
</p>
          </div>
        </div>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  IonPage,
  IonContent,
  IonIcon,
  alertController
} from '@ionic/vue';

import {
  arrowBackOutline,
  arrowForwardOutline,
  camera,
  cameraOutline,
  documentTextOutline,
  cloudUploadOutline,
  chevronForwardOutline,
  sunnyOutline,
  scanOutline,
  expandOutline,
  shieldCheckmarkOutline,
  checkmarkCircle,
  checkmarkOutline,
  trashOutline,
  imageOutline,
  sparklesOutline
} from 'ionicons/icons';

import { createWorker } from 'tesseract.js';
import { supabase } from '../utils/supabase';

const router = useRouter();

/* =========================================
   FILE INPUTS
========================================= */

const fileInput =
  ref<HTMLInputElement | null>(null);

const cameraInput =
  ref<HTMLInputElement | null>(null);

/* =========================================
   SELECTED IMAGE
========================================= */

const imagePreview = ref('');

const selectedFileName = ref('');

const selectedFileSize = ref('');

const selectedFile =
  ref<File | null>(null);

/* =========================================
   ANALYSIS STATE
========================================= */

const isAnalyzing = ref(false);

const ocrProgress = ref(0);

const analysisStatus =
  ref('Preparing prescription...');

/* =========================================
   NAVIGATION
========================================= */

const goBack = () => {
  if (isAnalyzing.value) {
    return;
  }

  router.back();
};

/* =========================================
   FILE PICKERS
========================================= */

const openFilePicker = () => {
  if (isAnalyzing.value) {
    return;
  }

  fileInput.value?.click();
};

const openCamera = () => {
  if (isAnalyzing.value) {
    return;
  }

  cameraInput.value?.click();
};

/* =========================================
   FILE SIZE
========================================= */

const formatFileSize = (
  bytes: number
) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};

/* =========================================
   HANDLE IMAGE
========================================= */

const handleFile = async (
  event: Event
) => {
  const input =
    event.target as HTMLInputElement;

  const file =
    input.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    const alert =
      await alertController.create({
        header: 'Invalid File',

        message:
          'Please select an image file.',

        buttons: ['OK']
      });

    await alert.present();

    input.value = '';

    return;
  }

  const maxSize =
    10 * 1024 * 1024;

  if (file.size > maxSize) {
    const alert =
      await alertController.create({
        header: 'Image Too Large',

        message:
          'Please select an image smaller than 10 MB.',

        buttons: ['OK']
      });

    await alert.present();

    input.value = '';

    return;
  }

  if (imagePreview.value) {
    URL.revokeObjectURL(
      imagePreview.value
    );
  }

  selectedFile.value = file;

  imagePreview.value =
    URL.createObjectURL(file);

  selectedFileName.value =
    file.name ||
    'Prescription image';

  selectedFileSize.value =
    formatFileSize(
      file.size
    );

  ocrProgress.value = 0;

  analysisStatus.value =
    'Preparing prescription...';

  input.value = '';
};

/* =========================================
   REMOVE IMAGE
========================================= */

const removeImage = () => {
  if (isAnalyzing.value) {
    return;
  }

  if (imagePreview.value) {
    URL.revokeObjectURL(
      imagePreview.value
    );
  }

  imagePreview.value = '';

  selectedFileName.value = '';

  selectedFileSize.value = '';

  selectedFile.value = null;

  ocrProgress.value = 0;

  analysisStatus.value =
    'Preparing prescription...';
};

/* =========================================
   LOAD IMAGE
========================================= */

const loadImage = (
  file: File
): Promise<HTMLImageElement> => {
  return new Promise(
    (resolve, reject) => {
      const image =
        new Image();

      const objectUrl =
        URL.createObjectURL(file);

      image.onload = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        resolve(image);
      };

      image.onerror = () => {
        URL.revokeObjectURL(
          objectUrl
        );

        reject(
          new Error(
            'The prescription image could not be loaded.'
          )
        );
      };

      image.src = objectUrl;
    }
  );
};

/* =========================================
   PREPARE IMAGE

   IMPORTANT:

   This prepared image has TWO purposes:

   1. Local Tesseract OCR
   2. Gemini Vision analysis

   The image is resized to avoid sending an
   unnecessarily huge file to the Edge Function.
========================================= */

const prepareImageForAnalysis = async (
  file: File
): Promise<string> => {
  const image =
    await loadImage(file);

  const originalWidth =
    image.naturalWidth ||
    image.width;

  const originalHeight =
    image.naturalHeight ||
    image.height;

  /*
    Keep enough detail for handwriting while
    avoiding extremely large uploads.
  */

  const maximumDimension = 2200;

  let scale = 1;

  if (
    originalWidth >
      maximumDimension ||
    originalHeight >
      maximumDimension
  ) {
    scale =
      Math.min(
        maximumDimension /
          originalWidth,

        maximumDimension /
          originalHeight
      );
  }

  const width =
    Math.max(
      1,
      Math.round(
        originalWidth *
          scale
      )
    );

  const height =
    Math.max(
      1,
      Math.round(
        originalHeight *
          scale
      )
    );

  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext(
      '2d',
      {
        willReadFrequently: true
      }
    );

  if (!context) {
    throw new Error(
      'Your browser could not prepare the prescription image.'
    );
  }

  context.fillStyle =
    '#ffffff';

  context.fillRect(
    0,
    0,
    width,
    height
  );

  context.imageSmoothingEnabled =
    true;

  context.imageSmoothingQuality =
    'high';

  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );

  /*
    IMPORTANT:

    Do NOT convert this image to grayscale.

    Gemini Vision receives this version, so we
    preserve the original visual information,
    ink colors, handwriting, and document layout.

    Tesseract can also read this prepared image.
  */

  return canvas.toDataURL(
    'image/jpeg',
    0.92
  );
};

/* =========================================
   CLEAN OCR TEXT
========================================= */

const cleanOcrText = (
  text: string
) => {
  return text
    .replace(
      /\r\n/g,
      '\n'
    )
    .replace(
      /\r/g,
      '\n'
    )
    .replace(
      /[ \t]+/g,
      ' '
    )
    .replace(
      / +\n/g,
      '\n'
    )
    .replace(
      /\n{4,}/g,
      '\n\n\n'
    )
    .trim();
};

/* =========================================
   RUN TESSERACT LOCALLY

   Tesseract is now SUPPORTING OCR.

   Gemini Vision will receive the image itself
   and can inspect handwriting directly.

   If Vision fails, the Edge Function can use
   this OCR text as its fallback.
========================================= */

const runLocalOCR = async (
  preparedImage: string
): Promise<string> => {
  analysisStatus.value =
    'Starting local text recognition...';

  const worker =
    await createWorker(
      'eng',
      1,
      {
        logger: (
          message: any
        ) => {
          if (
            !isAnalyzing.value
          ) {
            return;
          }

          const status =
            typeof message?.status ===
            'string'
              ? message.status
              : '';

          const progress =
            typeof message?.progress ===
            'number'
              ? message.progress
              : 0;

          /*
            Local OCR owns approximately
            10%-60% of UI progress.
          */

          if (
            status ===
            'loading tesseract core'
          ) {
            ocrProgress.value =
              Math.max(
                ocrProgress.value,
                8
              );

            analysisStatus.value =
              'Loading local OCR engine...';
          }

          if (
            status ===
            'initializing tesseract'
          ) {
            ocrProgress.value =
              Math.max(
                ocrProgress.value,
                12
              );

            analysisStatus.value =
              'Initializing text recognition...';
          }

          if (
            status ===
            'loading language traineddata'
          ) {
            ocrProgress.value =
              Math.max(
                ocrProgress.value,
                18
              );

            analysisStatus.value =
              'Loading OCR language data...';
          }

          if (
            status ===
            'initializing api'
          ) {
            ocrProgress.value =
              Math.max(
                ocrProgress.value,
                24
              );

            analysisStatus.value =
              'Preparing prescription reader...';
          }

          if (
            status ===
            'recognizing text'
          ) {
            const mappedProgress =
              25 +
              Math.round(
                progress * 35
              );

            ocrProgress.value =
              Math.max(
                ocrProgress.value,
                Math.min(
                  60,
                  mappedProgress
                )
              );

            analysisStatus.value =
              `Reading prescription text... ${Math.round(
                progress * 100
              )}%`;
          }
        }
      }
    );

  try {
    const result =
      await worker.recognize(
        preparedImage
      );

    const rawText =
      result?.data?.text ||
      '';

    return cleanOcrText(
      rawText
    );
  } finally {
    await worker.terminate();
  }
};

/* =========================================
   READ SUPABASE FUNCTION ERROR
========================================= */

const getFunctionError = async (
  error: any
): Promise<{
  message: string;
  ocrText: string;
}> => {
  let message =
    error?.message ||
    'The AI service could not analyze the prescription.';

  let ocrText = '';

  try {
    const response =
      error?.context;

    if (
      response &&
      typeof response.json ===
        'function'
    ) {
      const body =
        await response.json();

      if (
        typeof body?.ocrText ===
        'string'
      ) {
        ocrText =
          body.ocrText;
      }

      if (body?.details) {
        message =
          body.details;
      } else if (
        body?.error
      ) {
        message =
          body.error;
      }
    }
  } catch {
    /*
      Keep original Supabase error.
    */
  }

  return {
    message,
    ocrText
  };
};

/* =========================================
   SAVE SCAN INFORMATION
========================================= */

const saveScanMetadata = (
  ocrText: string,
  method:
    | 'Gemini Vision + Tesseract'
    | 'Tesseract.js + Gemini AI'
    | 'MediScan AI'
    = 'MediScan AI'
) => {
  sessionStorage.setItem(
    'mediscan_ocr_text',
    ocrText
  );

  sessionStorage.setItem(
    'mediscan_scan_filename',
    selectedFileName.value
  );

  sessionStorage.setItem(
    'mediscan_scan_date',
    new Date().toISOString()
  );

  sessionStorage.setItem(
    'mediscan_ocr_method',
    method
  );
};

/* =========================================
   CLEAR PREVIOUS RESULT
========================================= */

const clearPreviousResults = () => {
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
};

/* =========================================
   ANALYZE PRESCRIPTION

   FINAL HYBRID FLOW:

   Prescription image
          ↓
   Prepare image locally
          ↓
   Local Tesseract OCR
          ↓
   imageDataUrl + ocrText
          ↓
   Supabase Edge Function
          ↓
   Gemini Vision PRIMARY
          ↓
   if Vision fails
          ↓
   Gemini Text + OCR FALLBACK
          ↓
   Structured medicines
          ↓
   Review page
========================================= */

const analyzePrescription =
  async () => {
    if (
      !selectedFile.value ||
      isAnalyzing.value
    ) {
      return;
    }

    isAnalyzing.value = true;

    ocrProgress.value = 2;

    analysisStatus.value =
      'Preparing prescription image...';

    clearPreviousResults();

    let extractedOcrText = '';

    try {
      /* -------------------------------------
         STEP 1 — PREPARE IMAGE
      ------------------------------------- */

      const preparedImage =
        await prepareImageForAnalysis(
          selectedFile.value
        );

      ocrProgress.value =
        Math.max(
          ocrProgress.value,
          7
        );

      analysisStatus.value =
        'Preparing local OCR...';

      /* -------------------------------------
         STEP 2 — LOCAL TESSERACT OCR
      ------------------------------------- */

      extractedOcrText =
        await runLocalOCR(
          preparedImage
        );

      ocrProgress.value = 62;

      analysisStatus.value =
        'Local text extraction complete.';

      /*
        Preserve local OCR immediately.

        Even if Vision/cloud analysis fails,
        the locally extracted text remains.
      */

      saveScanMetadata(
        extractedOcrText,
        'MediScan AI'
      );

      /*
        IMPORTANT CHANGE:

        We DO NOT reject the scan just because
        Tesseract found little or no text.

        Gemini Vision can still inspect the
        actual prescription image directly.

        This is especially important for
        handwritten prescriptions.
      */

      /* -------------------------------------
         STEP 3 — SEND IMAGE + OCR
      ------------------------------------- */

      ocrProgress.value = 68;

      analysisStatus.value =
        'Sending prescription to Vision AI...';

      const {
        data,
        error
      } =
        await supabase
          .functions
          .invoke(
            'analyze-prescription',
            {
              body: {
                imageDataUrl:
                  preparedImage,

                ocrText:
                  extractedOcrText
              }
            }
          );

      ocrProgress.value = 86;

      analysisStatus.value =
        'Organizing prescription information...';

      /* -------------------------------------
         FUNCTION ERROR
      ------------------------------------- */

      if (error) {
        const functionError =
          await getFunctionError(
            error
          );

        if (
          functionError.ocrText
        ) {
          extractedOcrText =
            functionError.ocrText;
        }

        saveScanMetadata(
          extractedOcrText,
          'MediScan AI'
        );

        throw new Error(
          functionError.message
        );
      }

      /* -------------------------------------
         INVALID RESPONSE
      ------------------------------------- */

      if (
        !data ||
        data.success !== true ||
        !data.analysis
      ) {
        throw new Error(
          data?.details ||
          data?.error ||
          'MediScan AI returned an invalid response.'
        );
      }

      const analysis =
        data.analysis;

      /* -------------------------------------
         DETERMINE WHICH AI PATH SUCCEEDED
      ------------------------------------- */

      const responseMode =
        typeof data?.mode === 'string'
          ? data.mode
          : '';

      const usedVision =
        responseMode === 'vision' ||
        data?.provider ===
          'google-gemini-vision';

      const scanMethod =
        usedVision
          ? 'Gemini Vision + Tesseract'
          : 'Tesseract.js + Gemini AI';

      /*
        IMPORTANT:

        For Vision success, keep Gemini's
        conservative visual transcription because
        it may read handwriting that Tesseract
        could not recognize.

        For OCR fallback, use our exact local OCR
        transcription.
      */

      if (!usedVision) {
        analysis.extracted_text =
          extractedOcrText;
      } else if (
        typeof analysis.extracted_text !==
          'string' ||
        !analysis.extracted_text.trim()
      ) {
        analysis.extracted_text =
          extractedOcrText;
      }

      /*
        Store the text shown on the result page.

        For Vision this can contain the visual
        transcription produced by Gemini.

        For fallback it is the Tesseract text.
      */

      const resultText =
        typeof analysis.extracted_text ===
          'string'
          ? analysis.extracted_text
          : extractedOcrText;

      saveScanMetadata(
        resultText,
        scanMethod
      );

      /* -------------------------------------
         SAVE STRUCTURED RESULT
      ------------------------------------- */

      sessionStorage.setItem(
        'mediscan_ai_result',
        JSON.stringify(
          analysis
        )
      );

      /* -------------------------------------
         PRESCRIPTION NOT DETECTED
      ------------------------------------- */

      if (
        analysis.prescription_detected ===
        false
      ) {
        ocrProgress.value = 0;

        analysisStatus.value =
          'Preparing prescription...';

        const alert =
          await alertController.create({
            header:
              'Prescription Not Detected',

            message:
              usedVision
                ? 'MediScan Vision AI inspected the image but could not confidently confirm that it is a prescription. Please check the image and try again.'
                : 'MediScan analyzed the extracted text but could not confidently confirm that it represents a prescription. Please try a clearer image.',

            buttons: [
              {
                text:
                  'View Result',

                handler: () => {
                  router.push(
                    '/prescription-result'
                  );
                }
              },

              {
                text: 'OK',
                role: 'cancel'
              }
            ]
          });

        await alert.present();

        return;
      }

      /* -------------------------------------
         SUCCESS
      ------------------------------------- */

      ocrProgress.value = 94;

      analysisStatus.value =
        usedVision
          ? 'Vision AI analysis complete...'
          : 'OCR fallback analysis complete...';

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            350
          )
      );

      ocrProgress.value = 100;

      analysisStatus.value =
        'Analysis complete!';

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            500
          )
      );

      await router.push(
        '/prescription-result'
      );
    } catch (error) {
      console.error(
        'MediScan analysis failed:',
        error
      );

      if (extractedOcrText) {
        saveScanMetadata(
          extractedOcrText,
          'MediScan AI'
        );
      }

      ocrProgress.value = 0;

      analysisStatus.value =
        'Preparing prescription...';

      let message =
        error instanceof Error
          ? error.message
          : 'The prescription could not be analyzed.';

      const normalized =
        message.toLowerCase();

      if (
        normalized.includes(
          'high demand'
        ) ||
        normalized.includes(
          'temporarily unavailable'
        ) ||
        normalized.includes(
          'timed out'
        ) ||
        normalized.includes(
          'timeout'
        ) ||
        normalized.includes(
          '503'
        )
      ) {
        message =
          extractedOcrText
            ? 'The local OCR completed, but the Vision AI and OCR fallback services are temporarily unavailable. Your extracted text was preserved. Please try again shortly.'
            : 'The AI service is temporarily unavailable. Please try again shortly.';
      }

      if (
        normalized.includes('429') ||
        normalized.includes(
          'rate limit'
        ) ||
        normalized.includes(
          'resource exhausted'
        )
      ) {
        message =
          'The AI service has reached its current request limit. Please wait a moment and try again.';
      }

      if (
        normalized.includes(
          'api key'
        ) ||
        normalized.includes(
          'permission denied'
        ) ||
        normalized.includes('401') ||
        normalized.includes('403')
      ) {
        message =
          'MediScan could not authenticate with the cloud AI service. Check the GEMINI_API_KEY secret in Supabase.';
      }

      const buttons =
        extractedOcrText
          ? [
              {
                text:
                  'View OCR Result',

                handler: () => {
                  router.push(
                    '/prescription-result'
                  );
                }
              },

              {
                text:
                  'Try Again',

                role: 'cancel'
              }
            ]
          : ['OK'];

      const alert =
        await alertController.create({
          header:
            extractedOcrText
              ? 'AI Analysis Unavailable'
              : 'Prescription Scan Failed',

          message,

          buttons
        });

      await alert.present();
    } finally {
      isAnalyzing.value =
        false;
    }
  };
</script>

<style scoped>
.scan-content {
  --background: #f6faf9;
  --color: #13231e;
}

.page-container {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 40px 28px 70px;
  color: #13231e;
}

.page-container h1,
.page-container h2,
.page-container h3,
.page-container strong {
  color: #13231e;
}

/* HEADER */

.page-header {
  display: flex;
  align-items: center;
  gap: 17px;
  margin-bottom: 32px;
}

.back-button {
  width: 46px;
  height: 46px;
  min-width: 46px;
  border: 1px solid #dce6e2;
  border-radius: 14px;
  background: #ffffff;
  color: #24372f;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.back-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-button ion-icon {
  font-size: 22px;
}

.header-text {
  flex: 1;
}

.header-text h1 {
  margin: 0 0 5px;
  font-size: 31px;
  font-weight: 800;
  color: #13231e !important;
}

.header-text p {
  margin: 0;
  color: #7d8985;
  font-size: 14px;
}

.brand {
  font-size: 23px;
  font-weight: 800;
  color: #13231e;
}

.brand span {
  color: #07966e;
}

/* STEPS */

.steps {
  max-width: 600px;
  margin: 0 auto 35px;
  display: flex;
  align-items: flex-start;
}

.step {
  min-width: 70px;
  text-align: center;
  color: #98a49f;
  font-size: 12px;
  font-weight: 700;
}

.step-number {
  width: 34px;
  height: 34px;
  margin: 0 auto 7px;
  border-radius: 50%;
  background: #e8efec;
  color: #61706a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-number ion-icon {
  font-size: 18px;
}

.step.active {
  color: #07966e;
}

.step.active .step-number {
  background: #07966e;
  color: #ffffff;
}

.step-line {
  flex: 1;
  height: 2px;
  margin-top: 16px;
  background: #dfe7e4;
  transition: background 0.3s ease;
}

.step-line.completed {
  background: #07966e;
}

/* UPLOAD */

.upload-card {
  max-width: 780px;
  margin: 0 auto 40px;
  padding: 50px 45px;
  background: #ffffff;
  border: 1px dashed #cbdad5;
  border-radius: 28px;
  text-align: center;
  box-shadow:
    0 8px 30px
    rgba(31, 72, 61, 0.04);
}

.upload-icon {
  width: 92px;
  height: 92px;
  margin: 0 auto 22px;
  border-radius: 28px;
  background: #e2f8f1;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.upload-icon > ion-icon {
  font-size: 44px;
}

.camera-badge {
  position: absolute;
  right: -7px;
  bottom: -5px;
  width: 34px;
  height: 34px;
  border: 4px solid #ffffff;
  border-radius: 50%;
  background: #07966e;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-badge ion-icon {
  font-size: 16px;
}

.upload-card h2 {
  margin: 0 0 9px;
  font-size: 25px;
  color: #13231e !important;
}

.upload-card > p {
  max-width: 560px;
  margin: 0 auto 28px;
  color: #74817c;
  line-height: 1.6;
  font-size: 14px;
}

.action-buttons {
  max-width: 600px;
  margin: 0 auto;
  display: grid;
  grid-template-columns:
    1fr 1fr;
  gap: 14px;
}

.primary-button,
.secondary-button {
  min-height: 78px;
  border-radius: 18px;
  padding: 14px 17px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-align: left;
  cursor: pointer;
}

.primary-button {
  border: none;
  background: #07966e;
  color: #ffffff;
}

.secondary-button {
  border: 1px solid #d9e5e1;
  background: #ffffff;
  color: #173027;
}

.primary-button > ion-icon,
.secondary-button > ion-icon {
  font-size: 27px;
  min-width: 27px;
}

.primary-button div,
.secondary-button div {
  flex: 1;
}

.primary-button strong,
.secondary-button strong {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}

.primary-button strong {
  color: #ffffff !important;
}

.secondary-button strong {
  color: #173027 !important;
}

.primary-button span,
.secondary-button span {
  display: block;
  font-size: 11px;
}

.primary-button span {
  color:
    rgba(
      255,
      255,
      255,
      0.78
    );
}

.secondary-button span {
  color: #89958f;
}

.arrow {
  font-size: 18px !important;
  min-width: auto !important;
}

.hidden-input {
  display: none;
}

/* TIPS */

.tips-section {
  margin-bottom: 38px;
}

.section-heading {
  margin-bottom: 16px;
}

.section-heading h2 {
  margin: 0 0 5px;
  font-size: 21px;
  color: #13231e !important;
}

.section-heading p {
  margin: 0;
  color: #83908b;
  font-size: 13px;
}

.tips-grid {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 14px;
}

.tip-card {
  min-height: 115px;
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  display: flex;
  align-items: flex-start;
  gap: 13px;
  box-shadow:
    0 5px 18px
    rgba(30, 70, 60, 0.04);
}

.tip-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tip-icon ion-icon {
  font-size: 22px;
}

.green {
  background: #def7ef;
  color: #07966e;
}

.blue {
  background: #e4f2ff;
  color: #3589cd;
}

.orange {
  background: #fff0df;
  color: #df7927;
}

.tip-card h3 {
  margin: 2px 0 6px;
  font-size: 14px;
  color: #13231e !important;
}

.tip-card p {
  margin: 0;
  color: #83908b;
  font-size: 11px;
  line-height: 1.5;
}

/* PREVIEW */

.preview-section {
  max-width: 780px;
  margin: 0 auto 35px;
  padding: 28px;
  border-radius: 27px;
  background: #ffffff;
  color: #13231e;
  box-shadow:
    0 8px 28px
    rgba(30, 70, 60, 0.05);
}

.preview-header {
  display: flex;
  justify-content:
    space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 22px;
}

.ready-label {
  color: #07966e;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.preview-header h2 {
  margin: 7px 0 5px;
  font-size: 23px;
  color: #13231e !important;
}

.preview-header p {
  margin: 0;
  color: #81908a;
  font-size: 13px;
  line-height: 1.5;
}

.remove-button {
  border:
    1px solid #ffd4d4;
  border-radius: 12px;
  padding: 10px 13px;
  background: #fff7f7;
  color: #e84b4b;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  cursor: pointer;
}

/* IMAGE */

.image-preview {
  min-height: 350px;
  max-height: 520px;
  border-radius: 20px;
  overflow: hidden;
  background: #eef3f1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  max-height: 520px;
  object-fit: contain;
  display: block;
}

.preview-status {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 8px 12px;
  border-radius: 20px;
  background:
    rgba(
      9,
      126,
      94,
      0.92
    );
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ANALYZING */

.analyzing-overlay {
  position: absolute;
  inset: 0;
  padding: 20px;
  background:
    rgba(
      12,
      36,
      29,
      0.78
    );
  backdrop-filter:
    blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.analyzing-box {
  width:
    min(100%, 360px);
  padding: 27px 24px;
  border-radius: 22px;
  background:
    rgba(
      255,
      255,
      255,
      0.97
    );
  text-align: center;
  box-shadow:
    0 15px 45px
    rgba(0, 0, 0, 0.15);
}

.scanner-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 14px;
  border-radius: 18px;
  background: #e1f8f1;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
  animation:
    scannerPulse
    1.4s ease-in-out
    infinite;
}

.scanner-icon ion-icon {
  font-size: 31px;
}

.analyzing-box h3 {
  margin: 0 0 6px;
  font-size: 18px;
  color: #13231e !important;
}

.analyzing-box p {
  margin: 0 0 17px;
  color: #72817b;
  font-size: 12px;
}

.progress-track {
  width: 100%;
  height: 9px;
  border-radius: 999px;
  overflow: hidden;
  background: #e4eeea;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #07966e;
  transition:
    width 0.25s ease;
}

.progress-percent {
  display: block;
  margin-top: 10px;
  color: #07966e !important;
  font-size: 20px;
}

.please-wait {
  display: block;
  margin-top: 4px;
  color: #99a49f;
  font-size: 10px;
}

@keyframes scannerPulse {
  0%,
  100% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(1.08);
  }
}

/* FILE INFO */

.file-details {
  margin-top: 15px;
  padding: 14px;
  border-radius: 15px;
  background: #f6faf8;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 12px;
  background: #def7ef;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-icon ion-icon {
  font-size: 22px;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-info strong,
.file-info span {
  display: block;
}

.file-info strong {
  overflow: hidden;
  text-overflow:
    ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #13231e !important;
}

.file-info span {
  margin-top: 3px;
  color: #84908c;
  font-size: 11px;
}

.change-button {
  border: none;
  background: transparent;
  color: #07966e;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

/* PROGRESS CARD */

.ocr-progress-card {
  margin-top: 14px;
  padding: 16px;
  border:
    1px solid #dcece7;
  border-radius: 16px;
  background: #f3fbf8;
}

.ocr-progress-top {
  display: flex;
  align-items: center;
  gap: 15px;
}

.ocr-progress-top > div {
  flex: 1;
}

.ocr-progress-top strong,
.ocr-progress-top span {
  display: block;
}

.ocr-progress-top strong {
  font-size: 12px;
  color: #13231e !important;
}

.ocr-progress-top span {
  margin-top: 3px;
  color: #7e8c87;
  font-size: 10px;
}

.ocr-number {
  color: #07966e !important;
  font-size: 17px !important;
}

.bottom-progress {
  margin-top: 12px;
  height: 7px;
}

/* BUTTONS */

.preview-actions {
  display: grid;
  grid-template-columns:
    1fr 1.4fr;
  gap: 12px;
  margin-top: 20px;
}

.retake-button,
.analyze-button {
  min-height: 55px;
  border-radius: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.retake-button {
  border:
    1px solid #d9e4e0;
  background: #ffffff;
  color: #263a32;
}

.analyze-button {
  border: none;
  background: #07966e;
  color: #ffffff;
}

.analyze-button ion-icon {
  font-size: 18px;
}

.analyzing-button {
  width: 100%;
  margin-top: 20px;
  cursor: not-allowed;
  opacity: 0.9;
}

.analyzing-button strong {
  color: #ffffff !important;
}

.button-spinner {
  width: 18px;
  height: 18px;
  border:
    2px solid
    rgba(
      255,
      255,
      255,
      0.35
    );
  border-top-color:
    #ffffff;
  border-radius: 50%;
  animation:
    spin 0.8s
    linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* PRIVACY */

.privacy-note {
  max-width: 780px;
  margin: 0 auto;
  padding: 17px 19px;
  border-radius: 17px;
  background: #e8f8f3;
  display: flex;
  align-items: flex-start;
  gap: 13px;
}

.privacy-note > ion-icon {
  min-width: 25px;
  font-size: 25px;
  color: #07966e;
}

.privacy-note strong {
  font-size: 13px;
  color: #13231e !important;
}

.privacy-note p {
  margin: 4px 0 0;
  color: #65756f;
  font-size: 11px;
  line-height: 1.5;
}

/* MOBILE */

@media (max-width: 700px) {
  .page-container {
    padding:
      calc(
        22px +
        env(
          safe-area-inset-top
        )
      )
      17px
      calc(
        30px +
        env(
          safe-area-inset-bottom
        )
      );
  }

  .page-header {
    align-items:
      flex-start;
    margin-bottom: 27px;
  }

  .header-text h1 {
    font-size: 24px;
  }

  .header-text p {
    font-size: 12px;
    line-height: 1.4;
  }

  .brand {
    display: none;
  }

  .steps {
    margin-bottom: 27px;
  }

  .upload-card {
    padding: 35px 20px;
  }

  .upload-card h2 {
    font-size: 22px;
  }

  .action-buttons {
    grid-template-columns:
      1fr;
  }

  .tips-grid {
    grid-template-columns:
      1fr;
  }

  .tip-card {
    min-height: auto;
  }

  .preview-section {
    padding: 20px;
  }

  .preview-header {
    flex-direction:
      column;
  }

  .remove-button {
    align-self:
      flex-end;
  }

  .image-preview {
    min-height: 280px;
  }

  .preview-actions {
    grid-template-columns:
      1fr;
  }

  .analyzing-box {
    padding:
      22px 17px;
  }
}

@media (max-width: 380px) {
  .back-button {
    width: 42px;
    height: 42px;
    min-width: 42px;
  }

  .header-text h1 {
    font-size: 21px;
  }

  .step {
    min-width: 55px;
  }

  .file-details {
    flex-wrap: wrap;
  }

  .change-button {
    width: 100%;
    text-align: right;
  }

  .ocr-progress-top {
    align-items:
      flex-start;
  }
}
</style>