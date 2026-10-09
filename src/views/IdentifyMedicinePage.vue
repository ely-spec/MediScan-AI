<template>
  <ion-page>
    <ion-content :fullscreen="true" class="identify-content">
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

            <h1>Identify Medicine</h1>

            <p>
              Take or upload a clear photo to help identify
              medicine information.
            </p>
          </div>
        </header>


        <!-- INTRO -->
        <section class="intro-card">
          <div class="intro-icon">
            <ion-icon :icon="cameraOutline" />
          </div>

          <div class="intro-copy">
            <span>AI MEDICINE IDENTIFICATION</span>

            <h2>Scan your medicine</h2>

            <p>
              For better identification, include readable packaging,
              labels, medicine name, strength, or tablet/capsule
              imprints whenever possible.
            </p>
          </div>
        </section>


        <!-- PHOTO GUIDELINES -->
        <section class="section">
          <div class="section-heading">
            <span>BEFORE YOU SCAN</span>
            <h2>Photo Guidelines</h2>
            <p>
              A clear and complete image can improve the information
              available for review.
            </p>
          </div>

          <div class="guideline-grid">

            <div class="guideline-card">
              <div class="guideline-icon green">
                <ion-icon :icon="sunnyOutline" />
              </div>

              <div>
                <h3>Good Lighting</h3>
                <p>
                  Use bright, even lighting and avoid strong shadows
                  or glare.
                </p>
              </div>
            </div>


            <div class="guideline-card">
              <div class="guideline-icon blue">
                <ion-icon :icon="scanOutline" />
              </div>

              <div>
                <h3>Keep It Clear</h3>
                <p>
                  Keep the medicine or packaging centered and make
                  sure the image is not blurry.
                </p>
              </div>
            </div>


            <div class="guideline-card">
              <div class="guideline-icon purple">
                <ion-icon :icon="textOutline" />
              </div>

              <div>
                <h3>Show Readable Text</h3>
                <p>
                  Include the medicine name, strength, manufacturer,
                  or imprint when available.
                </p>
              </div>
            </div>

          </div>
        </section>


        <!-- UPLOAD AREA -->
        <section class="section">
          <div class="section-heading">
            <span>MEDICINE IMAGE</span>
            <h2>Add a Photo</h2>
            <p>
              Choose an image from your device or take a new photo.
            </p>
          </div>


          <!-- NO IMAGE -->
          <div
            v-if="!imagePreview"
            class="upload-card"
            @dragover.prevent
            @drop.prevent="handleDrop"
          >
            <div class="upload-icon">
              <ion-icon :icon="imageOutline" />
            </div>

            <h3>Upload a medicine photo</h3>

            <p>
              Take a photo or choose a clear JPG, PNG, or WEBP image.
            </p>

            <div class="upload-actions">

              <button
                class="primary-button"
                @click="openCamera"
              >
                <ion-icon :icon="camera" />
                Take Photo
              </button>

              <button
                class="secondary-button"
                @click="openGallery"
              >
                <ion-icon :icon="cloudUploadOutline" />
                Upload Image
              </button>

            </div>

            <span class="upload-note">
              Maximum recommended file size: 10 MB
            </span>
          </div>


          <!-- IMAGE PREVIEW -->
          <div
            v-else
            class="preview-card"
          >
            <div class="preview-header">
              <div>
                <span>IMAGE READY</span>
                <h3>Medicine Photo</h3>
              </div>

              <div class="ready-badge">
                <ion-icon :icon="checkmarkCircle" />
                Ready
              </div>
            </div>


            <div class="image-preview">
              <img
                :src="imagePreview"
                alt="Selected medicine"
              />
            </div>


            <div class="file-information">
              <div>
                <span>File Name</span>
                <strong>
                  {{ selectedFile?.name || 'Medicine image' }}
                </strong>
              </div>

              <div>
                <span>File Size</span>
                <strong>
                  {{ formattedFileSize }}
                </strong>
              </div>
            </div>


            <div class="preview-actions">

              <button
                class="secondary-button"
                @click="openGallery"
              >
                <ion-icon :icon="swapHorizontalOutline" />
                Replace Image
              </button>

              <button
                class="remove-button"
                @click="removeImage"
              >
                <ion-icon :icon="trashOutline" />
                Remove
              </button>

            </div>
          </div>


          <!-- HIDDEN INPUTS -->
          <input
            ref="cameraInput"
            class="hidden-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            @change="handleFileInput"
          />

          <input
            ref="galleryInput"
            class="hidden-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            @change="handleFileInput"
          />
        </section>


        <!-- SAFETY -->
        <section class="safety-card">
          <div class="safety-icon">
            <ion-icon :icon="shieldCheckmarkOutline" />
          </div>

          <div>
            <h3>Identification requires verification</h3>

            <p>
              A photo alone may not uniquely identify a medicine.
              Tablets and capsules can look similar, and packaging or
              labels may vary. MediScan AI should present possible
              identification information for review, not a guarantee
              of identity. Verify the result using the original
              packaging, prescription, pharmacist, or qualified
              healthcare professional.
            </p>
          </div>
        </section>


        <!-- PRIVACY -->
        <section class="privacy-card">
          <ion-icon :icon="lockClosedOutline" />

          <div>
            <strong>Image processing notice</strong>

            <p>
              When AI identification is connected, the selected image
              may be sent securely to MediScan AI's cloud service for
              analysis. Avoid including faces, names, addresses,
              prescription numbers, or other personal information that
              is not needed to identify the medicine.
            </p>
          </div>
        </section>


        <!-- ANALYZE -->
        <div class="bottom-actions">

          <button
            class="secondary-button back-action"
            @click="goBack"
          >
            <ion-icon :icon="arrowBackOutline" />
            Back to Medicine
          </button>

          <button
            class="analyze-button"
            :disabled="!selectedFile || isPreparing"
            @click="prepareIdentification"
          >
            <ion-spinner
              v-if="isPreparing"
              name="crescent"
            />

            <ion-icon
              v-else
              :icon="sparklesOutline"
            />

            {{
              isPreparing
                ? 'Analyzing...'
                : 'Analyze Medicine'
            }}
          </button>

        </div>

      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
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
  arrowBackOutline,
  camera,
  cameraOutline,
  checkmarkCircle,
  cloudUploadOutline,
  imageOutline,
  lockClosedOutline,
  scanOutline,
  shieldCheckmarkOutline,
  sparklesOutline,
  sunnyOutline,
  swapHorizontalOutline,
  textOutline,
  trashOutline
} from 'ionicons/icons';

import {
  useRouter
} from 'vue-router';

import {
  supabase
} from '../utils/supabase';


const router = useRouter();


const cameraInput =
  ref<HTMLInputElement | null>(null);

const galleryInput =
  ref<HTMLInputElement | null>(null);


const selectedFile =
  ref<File | null>(null);

const imagePreview =
  ref('');

const isPreparing =
  ref(false);


const MAX_FILE_SIZE =
  10 * 1024 * 1024;


const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp'
];


/* =========================================================
   FILE SIZE
========================================================= */

const formattedFileSize =
  computed(() => {
    if (!selectedFile.value) {
      return '—';
    }

    const bytes =
      selectedFile.value.size;

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  });


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
   OPEN INPUTS
========================================================= */

const openCamera = () => {
  if (isPreparing.value) {
    return;
  }

  cameraInput.value?.click();
};


const openGallery = () => {
  if (isPreparing.value) {
    return;
  }

  galleryInput.value?.click();
};


/* =========================================================
   VALIDATE IMAGE
========================================================= */

const validateImage = async (
  file: File
): Promise<boolean> => {

  if (
    !ALLOWED_TYPES.includes(
      file.type
    )
  ) {
    await showMessage(
      'Unsupported Image',
      'Please select a JPG, PNG, or WEBP image.'
    );

    return false;
  }


  if (
    file.size >
    MAX_FILE_SIZE
  ) {
    await showMessage(
      'Image Too Large',
      'Please select an image smaller than 10 MB.'
    );

    return false;
  }


  return true;
};


/* =========================================================
   SET IMAGE
========================================================= */

const setImage = async (
  file: File
) => {
  const valid =
    await validateImage(file);

  if (!valid) {
    return;
  }


  if (imagePreview.value) {
    URL.revokeObjectURL(
      imagePreview.value
    );
  }


  selectedFile.value =
    file;

  imagePreview.value =
    URL.createObjectURL(file);


  /*
    Remove any previous identification result
    whenever a new medicine image is selected.
  */

  sessionStorage.removeItem(
    'mediscan_medicine_identification'
  );

  sessionStorage.removeItem(
    'mediscan_medicine_image'
  );
};


/* =========================================================
   FILE INPUT
========================================================= */

const handleFileInput = async (
  event: Event
) => {
  const input =
    event.target as HTMLInputElement;

  const file =
    input.files?.[0];

  if (!file) {
    return;
  }


  await setImage(file);


  /*
    Reset input so the same image can
    be selected again if needed.
  */

  input.value = '';
};


/* =========================================================
   DRAG AND DROP
========================================================= */

const handleDrop = async (
  event: DragEvent
) => {
  if (isPreparing.value) {
    return;
  }

  const file =
    event.dataTransfer
      ?.files?.[0];

  if (!file) {
    return;
  }

  await setImage(file);
};


/* =========================================================
   REMOVE IMAGE
========================================================= */

const removeImage = () => {
  if (isPreparing.value) {
    return;
  }

  if (imagePreview.value) {
    URL.revokeObjectURL(
      imagePreview.value
    );
  }

  imagePreview.value = '';

  selectedFile.value = null;

  sessionStorage.removeItem(
    'mediscan_medicine_identification'
  );

  sessionStorage.removeItem(
    'mediscan_medicine_image'
  );
};


/* =========================================================
   LOAD IMAGE
========================================================= */

const loadImage = (
  file: File
): Promise<HTMLImageElement> => {
  return new Promise(
    (
      resolve,
      reject
    ) => {
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
            'The selected image could not be processed.'
          )
        );
      };

      image.src =
        objectUrl;
    }
  );
};


/* =========================================================
   PREPARE IMAGE FOR AI
========================================================= */

const prepareImageForAI = async (
  file: File
): Promise<{
  imageBase64: string;
  mimeType: string;
  previewDataUrl: string;
}> => {

  const image =
    await loadImage(file);


  /*
    Resize very large camera photos.

    This reduces upload size and makes the
    Edge Function request more reliable while
    preserving enough detail for readable
    medicine labels and packaging.
  */

  const MAX_DIMENSION =
    1800;


  let width =
    image.naturalWidth;

  let height =
    image.naturalHeight;


  if (
    width >
      MAX_DIMENSION ||
    height >
      MAX_DIMENSION
  ) {
    const scale =
      Math.min(
        MAX_DIMENSION / width,
        MAX_DIMENSION / height
      );

    width =
      Math.round(
        width * scale
      );

    height =
      Math.round(
        height * scale
      );
  }


  const canvas =
    document.createElement(
      'canvas'
    );


  canvas.width =
    width;

  canvas.height =
    height;


  const context =
    canvas.getContext(
      '2d'
    );


  if (!context) {
    throw new Error(
      'Image processing is not supported by this browser.'
    );
  }


  context.drawImage(
    image,
    0,
    0,
    width,
    height
  );


  /*
    Convert to JPEG to keep the request size
    manageable.

    0.88 preserves text detail reasonably well
    while reducing large phone-camera images.
  */

  const dataUrl =
    canvas.toDataURL(
      'image/jpeg',
      0.88
    );


  const commaIndex =
    dataUrl.indexOf(',');


  if (commaIndex === -1) {
    throw new Error(
      'Could not prepare the medicine image.'
    );
  }


  const imageBase64 =
    dataUrl.slice(
      commaIndex + 1
    );


  return {
    imageBase64,
    mimeType:
      'image/jpeg',
    previewDataUrl:
      dataUrl
  };
};


/* =========================================================
   VALIDATE AI RESPONSE
========================================================= */

const validateAnalysis = (
  analysis: any
) => {

  if (
    !analysis ||
    typeof analysis !==
      'object'
  ) {
    throw new Error(
      'The AI service returned an invalid medicine result.'
    );
  }


  const allowedStatuses = [
    'identified',
    'possible_match',
    'insufficient_information'
  ];


  if (
    !allowedStatuses.includes(
      analysis
        .identification_status
    )
  ) {
    throw new Error(
      'The AI service returned an unexpected identification status.'
    );
  }


  const confidence =
    Number(
      analysis.confidence
    );


  analysis.confidence =
    Number.isFinite(
      confidence
    )
      ? Math.max(
          0,
          Math.min(
            100,
            confidence
          )
        )
      : 0;


  /*
    Identification from a photo must remain
    reviewable. Insufficient-information
    results are always marked for verification.
  */

  if (
    analysis
      .identification_status ===
    'insufficient_information'
  ) {
    analysis.needs_verification =
      true;

    analysis.confidence =
      Math.min(
        analysis.confidence,
        40
      );
  }


  return analysis;
};


/* =========================================================
   ANALYZE MEDICINE
========================================================= */

const prepareIdentification =
  async () => {

    if (
      !selectedFile.value
    ) {
      await showMessage(
        'Medicine Photo Required',
        'Take or upload a medicine photo before continuing.'
      );

      return;
    }


    if (isPreparing.value) {
      return;
    }


    isPreparing.value =
      true;


    try {

      /*
        STEP 1:
        Resize/compress the selected image.
      */

      const preparedImage =
        await prepareImageForAI(
          selectedFile.value
        );


      /*
        STEP 2:
        Send the image to our Supabase
        identify-medicine Edge Function.

        GEMINI_API_KEY remains on the server.
        It is never exposed here.
      */

      const {
        data,
        error
      } =
        await supabase
          .functions
          .invoke(
            'identify-medicine',
            {
              body: {
                imageBase64:
                  preparedImage
                    .imageBase64,

                mimeType:
                  preparedImage
                    .mimeType
              }
            }
          );


      /*
        Network/function-level error.
      */

      if (error) {
        console.error(
          'identify-medicine invoke error:',
          error
        );

        throw new Error(
          error.message ||
          'Could not connect to the medicine identification service.'
        );
      }


      /*
        Edge Function returned its own error.
      */

      if (
        !data ||
        data.success !== true
      ) {
        console.error(
          'identify-medicine response:',
          data
        );

        throw new Error(
          data?.details ||
          data?.error ||
          'Medicine identification could not be completed.'
        );
      }


      /*
        STEP 3:
        Validate and normalize Gemini result.
      */

      const analysis =
        validateAnalysis(
          data.analysis
        );


      /*
        STEP 4:
        Save the result temporarily.

        The result page will read this from
        sessionStorage.

        We intentionally do NOT save this to
        Supabase database yet because the user
        still needs to review the identification.
      */

      const resultPayload = {
        analysis,

        model:
          data.model ||
          null,

        analyzed_at:
          new Date()
            .toISOString(),

        original_file_name:
          selectedFile
            .value
            ?.name ||
          'Medicine image'
      };


      sessionStorage.setItem(
        'mediscan_medicine_identification',
        JSON.stringify(
          resultPayload
        )
      );


      /*
        Store the compressed preview rather than
        the original large camera image.
      */

      try {
        sessionStorage.setItem(
          'mediscan_medicine_image',
          preparedImage
            .previewDataUrl
        );
      } catch (
        storageError
      ) {
        /*
          Some browsers have a small
          sessionStorage quota.

          The identification result can still
          continue even if the image preview
          cannot be stored.
        */

        console.warn(
          'Medicine preview could not be stored:',
          storageError
        );

        sessionStorage.removeItem(
          'mediscan_medicine_image'
        );
      }


      /*
        STEP 5:
        Go to the AI result page.
      */

      await router.push(
        '/medicine-identification-result'
      );

    } catch (error) {

      console.error(
        'Medicine identification error:',
        error
      );


      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while analyzing the medicine image.';


      await showMessage(
        'Identification Failed',
        `${message} Please check your connection and try again.`
      );

    } finally {

      isPreparing.value =
        false;

    }
  };


/* =========================================================
   NAVIGATION
========================================================= */

const goBack = () => {
  if (isPreparing.value) {
    return;
  }

  router.push(
    '/tabs/medicine'
  );
};


/* =========================================================
   CLEANUP
========================================================= */

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(
      imagePreview.value
    );
  }
});
</script>


<style scoped>
.identify-content {
  --background: #f5faf8;
}

.page-container {
  width: min(100%, 1050px);
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


/* INTRO */

.intro-card {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 38px;
  padding: 27px;
  border-radius: 25px;
  background:
    linear-gradient(
      135deg,
      #dff8f1,
      #c9f2e7
    );
}

.intro-icon {
  width: 78px;
  height: 78px;
  min-width: 78px;
  border-radius: 22px;
  background: white;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.intro-icon ion-icon {
  font-size: 37px;
}

.intro-copy span,
.section-heading > span,
.preview-header span {
  color: #078c67;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.intro-copy h2 {
  margin: 6px 0 7px;
  font-size: 23px;
}

.intro-copy p {
  max-width: 700px;
  margin: 0;
  color: #61756e;
  font-size: 13px;
  line-height: 1.6;
}


/* SECTION */

.section {
  margin-bottom: 38px;
}

.section-heading {
  margin-bottom: 17px;
}

.section-heading h2 {
  margin: 5px 0;
  font-size: 25px;
}

.section-heading p {
  margin: 0;
  color: #7c8a85;
  font-size: 13px;
  line-height: 1.5;
}


/* GUIDELINES */

.guideline-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.guideline-card {
  min-height: 150px;
  padding: 20px;
  border: 1px solid #e0e9e6;
  border-radius: 20px;
  background: white;
}

.guideline-icon {
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.guideline-icon ion-icon {
  font-size: 21px;
}

.guideline-card h3 {
  margin: 0 0 6px;
  font-size: 15px;
}

.guideline-card p {
  margin: 0;
  color: #7b8984;
  font-size: 12px;
  line-height: 1.55;
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


/* UPLOAD */

.upload-card {
  min-height: 350px;
  padding: 42px 25px;
  border:
    2px dashed #b9d9cf;
  border-radius: 25px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: 0.2s;
}

.upload-card:hover {
  border-color: #07966e;
  background: #fbfefd;
}

.upload-icon {
  width: 73px;
  height: 73px;
  border-radius: 21px;
  background: #e1f7f0;
  color: #07966e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-icon ion-icon {
  font-size: 34px;
}

.upload-card h3 {
  margin: 18px 0 7px;
  font-size: 20px;
}

.upload-card > p {
  margin: 0;
  color: #7b8984;
  font-size: 13px;
}

.upload-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.upload-note {
  margin-top: 16px;
  color: #98a39f;
  font-size: 11px;
}

.hidden-input {
  display: none;
}


/* PREVIEW */

.preview-card {
  padding: 22px;
  border: 1px solid #dfe9e5;
  border-radius: 24px;
  background: white;
  box-shadow:
    0 10px 28px
    rgba(30, 70, 60, 0.05);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 17px;
}

.preview-header h3 {
  margin: 4px 0 0;
  font-size: 18px;
}

.ready-badge {
  padding: 7px 11px;
  border-radius: 999px;
  background: #dcf7ee;
  color: #078662;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 5px;
}

.image-preview {
  min-height: 300px;
  max-height: 560px;
  border-radius: 18px;
  overflow: hidden;
  background: #edf3f1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  width: 100%;
  max-height: 560px;
  object-fit: contain;
  display: block;
}

.file-information {
  display: grid;
  grid-template-columns:
    1fr 1fr;
  gap: 10px;
  margin-top: 14px;
}

.file-information > div {
  min-width: 0;
  padding: 13px 15px;
  border-radius: 14px;
  background: #f4f8f6;
}

.file-information span {
  display: block;
  margin-bottom: 4px;
  color: #87938f;
  font-size: 10px;
}

.file-information strong {
  display: block;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}


/* SAFETY */

.safety-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 15px;
  padding: 20px;
  border: 1px solid #efd18a;
  border-radius: 19px;
  background: #fff8e8;
}

.safety-icon {
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

.safety-icon ion-icon {
  font-size: 23px;
}

.safety-card h3 {
  margin: 1px 0 6px;
  font-size: 15px;
}

.safety-card p {
  margin: 0;
  color: #806a3a;
  font-size: 12px;
  line-height: 1.65;
}


/* PRIVACY */

.privacy-card {
  display: flex;
  align-items: flex-start;
  gap: 13px;
  margin-bottom: 28px;
  padding: 18px 20px;
  border: 1px solid #cbe5dc;
  border-radius: 18px;
  background: #eef9f6;
}

.privacy-card > ion-icon {
  min-width: 22px;
  margin-top: 1px;
  color: #07966e;
  font-size: 22px;
}

.privacy-card strong {
  font-size: 13px;
}

.privacy-card p {
  margin: 5px 0 0;
  color: #64766f;
  font-size: 12px;
  line-height: 1.6;
}


/* BUTTONS */

.primary-button,
.secondary-button,
.remove-button,
.analyze-button {
  min-height: 51px;
  padding: 0 18px;
  border-radius: 15px;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

.primary-button,
.analyze-button {
  border: none;
  background: #07966e;
  color: white;
  box-shadow:
    0 9px 22px
    rgba(7, 150, 110, 0.17);
}

.secondary-button {
  border: 1px solid #a9d9ca;
  background: white;
  color: #078662;
}

.remove-button {
  border: 1px solid #f0c6c6;
  background: #fffafa;
  color: #bd4c4c;
}

.bottom-actions {
  display: grid;
  grid-template-columns:
    1fr 1.3fr;
  gap: 13px;
}

.analyze-button {
  min-height: 57px;
  font-size: 14px;
}

.analyze-button:disabled {
  background: #b8c9c3;
  box-shadow: none;
  cursor: not-allowed;
}

.analyze-button ion-spinner {
  width: 19px;
  height: 19px;
  color: white;
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

  .intro-card {
    align-items: flex-start;
    padding: 21px;
  }

  .intro-icon {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }

  .intro-icon ion-icon {
    font-size: 29px;
  }

  .guideline-grid {
    grid-template-columns: 1fr;
  }

  .upload-actions {
    width: 100%;
    flex-direction: column;
  }

  .upload-actions button {
    width: 100%;
  }

  .file-information {
    grid-template-columns: 1fr;
  }

  .preview-actions {
    flex-direction: column;
  }

  .preview-actions button {
    width: 100%;
  }

  .bottom-actions {
    grid-template-columns: 1fr;
  }

  .back-action {
    order: 2;
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

  .intro-card {
    flex-direction: column;
  }

  .upload-card {
    min-height: 320px;
    padding: 32px 18px;
  }

  .safety-card {
    padding: 16px;
  }
}
</style>