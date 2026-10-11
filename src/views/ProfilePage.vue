<template>
  <ion-page>
    <ion-content :fullscreen="true" class="profile-content">
      <main class="page-container">
        <header class="page-header">
          <div>
            <h1>My Profile<span class="title-dot">.</span></h1>
            <p>Manage your account and preferences</p>
          </div>

          <div class="brand-small">Medi<span>Scan</span> AI</div>
        </header>

        <section class="profile-card">
          <div class="profile-avatar" :class="avatarTheme">
            <img
              v-if="avatarPhotoUrl"
              :src="avatarPhotoUrl"
              alt="Profile photo"
              class="avatar-photo"
            /><ion-icon v-else :icon="person" /><button
              class="camera-button"
              aria-label="Change profile photo"
              @click="openPanel('avatar')"
            >
              <ion-icon :icon="cameraOutline" />
            </button>
          </div>

          <div class="profile-info">
            <span class="profile-kicker">WELCOME TO MEDISCAN AI</span>
            <h2>{{ displayName }}</h2>
            <p>{{ userEmail || "Sign in to view your account" }}</p>
            <span class="verified-badge"
              ><ion-icon :icon="checkmarkCircle" />
              {{ userId ? "Connected to Supabase" : "Not signed in" }}</span
            >
          </div>

          <button class="edit-button" @click="openPanel('edit')">
            <ion-icon :icon="createOutline" /> Edit Profile
          </button>
        </section>

        <div class="quick-summary">
          <div class="summary-icon">
            <ion-icon :icon="shieldCheckmarkOutline" />
          </div>
          <div>
            <strong>Your account, your control</strong
            ><span
              >Review your information, security and preferences in one
              place.</span
            >
          </div>
          <ion-icon class="summary-check" :icon="checkmarkCircle" />
        </div>

        <section class="settings-section">
          <div class="section-heading">
            <h2>Account</h2>
            <span>PERSONAL SETTINGS</span>
          </div>
          <div class="settings-card">
            <button class="setting-row" @click="openPanel('personal')">
              <span class="setting-icon green"
                ><ion-icon :icon="personOutline" /></span
              ><span class="setting-info"
                ><strong>Personal Information</strong
                ><small>View and update your account details</small></span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>

            <button class="setting-row" @click="openPanel('security')">
              <span class="setting-icon blue"
                ><ion-icon :icon="lockClosedOutline" /></span
              ><span class="setting-info"
                ><strong>Password & Security</strong
                ><small>Password reset and sign-in information</small></span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-heading">
            <h2>Preferences</h2>
            <span>CUSTOMIZE</span>
          </div>
          <div class="settings-card">
            <div class="setting-row static-row">
              <span class="setting-icon orange"
                ><ion-icon :icon="notificationsOutline" /></span
              ><span class="setting-info"
                ><strong>Notification Preference</strong
                ><small
                  >Save your reminder preference (alerts not active yet)</small
                ></span
              ><ion-toggle
                :checked="notificationsEnabled"
                color="success"
                aria-label="Notification preference"
                @ionChange="setNotifications($event.detail.checked)"
              />
            </div>

            <button class="setting-row" @click="openPanel('language')">
              <span class="setting-icon purple"
                ><ion-icon :icon="languageOutline" /></span
              ><span class="setting-info"
                ><strong>Language</strong
                ><small>Default app language</small></span
              ><span class="value-chip">{{ languageLabel }}</span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>
          </div>
        </section>

        <section class="settings-section">
          <div class="section-heading">
            <h2>Support & Information</h2>
            <span>EXPLORE</span>
          </div>
          <div class="settings-card">
            <button class="setting-row" @click="openPanel('help')">
              <span class="setting-icon cyan"
                ><ion-icon :icon="helpCircleOutline" /></span
              ><span class="setting-info"
                ><strong>Help & Support</strong
                ><small>Frequently asked questions and guidance</small></span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>

            <button class="setting-row" @click="openPanel('privacy')">
              <span class="setting-icon green"
                ><ion-icon :icon="shieldCheckmarkOutline" /></span
              ><span class="setting-info"
                ><strong>Privacy & Security</strong
                ><small>Understand your account and data</small></span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>

            <button class="setting-row" @click="openPanel('about')">
              <span class="setting-icon gray"
                ><ion-icon :icon="informationCircleOutline" /></span
              ><span class="setting-info"
                ><strong>About MediScan AI</strong
                ><small>Project overview, features and limitations</small></span
              ><ion-icon class="arrow" :icon="chevronForward" />
            </button>
          </div>
        </section>

        <button class="logout-button" @click="confirmLogout">
          <ion-icon :icon="logOutOutline" /> Log Out
        </button>

        <div class="medical-note">
          <ion-icon :icon="shieldCheckmarkOutline" />
          <p>
            MediScan AI is an educational project. AI and OCR results may be
            inaccurate. Always verify medicines and prescriptions with a
            qualified healthcare professional.
          </p>
        </div>

        <p class="footer-caption">
          MediScan AI · Your healthcare learning companion
        </p>
      </main>

      <div v-if="activePanel" class="overlay" @click.self="closePanel">
        <section
          class="panel"
          role="dialog"
          aria-modal="true"
          :aria-label="panelTitle"
        >
          <div class="panel-header">
            <div>
              <div class="eyebrow">MEDISCAN AI</div>
              <h2>{{ panelTitle }}</h2>
              <p>{{ panelSubtitle }}</p>
            </div>
            <button class="close-button" aria-label="Close" @click="closePanel">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>

          <div class="panel-body">
            <template
              v-if="activePanel === 'edit' || activePanel === 'personal'"
            >
              <div class="mini-profile">
                <span class="mini-avatar" :class="avatarTheme"
                  ><img
                    v-if="avatarPhotoUrl"
                    :src="avatarPhotoUrl"
                    alt="Profile photo"
                    class="avatar-photo" /><ion-icon v-else :icon="person"
                /></span>
                <div>
                  <strong>{{ displayName }}</strong
                  ><small>{{ userEmail }}</small>
                </div>
              </div>

              <label class="field-label" for="profile-name">Display name</label
              ><input
                id="profile-name"
                v-model="draftName"
                class="form-input"
                maxlength="80"
                placeholder="Enter your name"
                autocomplete="name"
              />

              <label class="field-label">Email address</label>
              <div class="read-only-field">
                <ion-icon :icon="mailOutline" />
                {{ userEmail || "Not signed in" }}
                <ion-icon :icon="lockClosedOutline" />
              </div>

              <p class="field-hint">
                Your email is managed through Supabase Authentication. This form
                updates only your display name.
              </p>

              <div v-if="activePanel === 'personal'" class="info-strip">
                <ion-icon :icon="personCircleOutline" />
                <div>
                  <strong>Account ID</strong
                  ><small class="id-text">{{ userId || "Unavailable" }}</small>
                </div>
              </div>

              <button
                class="primary-action"
                :disabled="busy || !userId"
                @click="saveProfile"
              >
                <ion-icon :icon="checkmarkCircleOutline" />
                {{ busy ? "Saving..." : "Save Changes" }}
              </button>
            </template>

            <template v-else-if="activePanel === 'avatar'">
              <div class="photo-preview" :class="avatarTheme">
                <img
                  v-if="avatarPhotoUrl"
                  :src="avatarPhotoUrl"
                  alt="Your current photo"
                /><ion-icon v-else :icon="person" />
              </div>

              <p class="panel-intro photo-caption">
                Upload your own profile picture (JPG, PNG, or WebP, up to 5 MB).
                Your photo is saved privately in Supabase Storage.
              </p>

              <input
                ref="photoInput"
                class="visually-hidden"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="onPhotoSelected"
              />

              <button
                class="primary-action"
                :disabled="busy || !userId"
                @click="photoInput?.click()"
              >
                <ion-icon :icon="cameraOutline" />
                {{
                  busy
                    ? "Uploading photo..."
                    : avatarPhotoUrl
                      ? "Change Photo"
                      : "Add Profile Photo"
                }}
              </button>

              <button
                v-if="avatarPhotoPath"
                class="secondary-danger"
                :disabled="busy"
                @click="removePhoto"
              >
                <ion-icon :icon="trashOutline" /> Remove Photo
              </button>

              <h3 class="panel-section-title">Or choose an avatar color</h3>

              <div class="avatar-choices">
                <button
                  v-for="theme in avatarThemes"
                  :key="theme"
                  class="avatar-choice"
                  :class="[theme, { selected: avatarTheme === theme }]"
                  :aria-label="'Choose ' + theme"
                  :disabled="busy"
                  @click="saveAvatar(theme)"
                >
                  <ion-icon :icon="person" /><ion-icon
                    v-if="avatarTheme === theme"
                    class="choice-check"
                    :icon="checkmarkCircle"
                  />
                </button>
              </div>

              <div class="info-strip">
                <ion-icon :icon="lockClosedOutline" /><small
                  >Photo is stored in a private bucket. Only the signed-in
                  account should be allowed to access its own photo. Set up the
                  bucket policies using the included SQL file.</small
                >
              </div>
            </template>

            <template v-else-if="activePanel === 'security'"
              ><div class="security-banner">
                <ion-icon :icon="shieldCheckmarkOutline" />
                <div>
                  <strong>Account security</strong
                  ><small>Sign-in is handled by Supabase Authentication.</small>
                </div>
              </div>
              <div class="detail-list">
                <div>
                  <span>Email</span
                  ><strong>{{ userEmail || "Not signed in" }}</strong>
                </div>
                <div>
                  <span>Account status</span
                  ><strong>{{ userId ? "Signed in" : "Signed out" }}</strong>
                </div>
              </div>
              <h3 class="panel-section-title">Reset your password</h3>
              <p class="panel-intro">
                We'll request a password reset email for your account. Follow
                the instructions in the email to continue.
              </p>
              <button
                class="primary-action"
                :disabled="busy || !userEmail"
                @click="sendPasswordReset"
              >
                <ion-icon :icon="mailOutline" />
                {{ busy ? "Sending..." : "Send Password Reset Email" }}
              </button>
              <p class="field-hint">
                The reset link must be configured correctly in Supabase Auth URL
                settings to complete the password change.
              </p></template
            >

            <template v-else-if="activePanel === 'language'"
              ><p class="panel-intro">
                MediScan AI currently uses English as its default interface
                language.
              </p>
              <div class="language-option chosen">
                <span class="language-symbol">EN</span
                ><span
                  ><strong>English</strong
                  ><small>Default interface language</small></span
                ><ion-icon :icon="checkmarkCircle" /></div
            ></template>

            <template v-else-if="activePanel === 'help'"
              ><div class="help-hero">
                <ion-icon :icon="chatbubblesOutline" />
                <div>
                  <strong>How can we help?</strong
                  ><small>Quick answers about MediScan AI</small>
                </div>
              </div>
              <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
                <button
                  @click="expandedFaq = expandedFaq === index ? -1 : index"
                >
                  <strong>{{ faq.q }}</strong
                  ><ion-icon
                    :icon="
                      expandedFaq === index
                        ? chevronUpOutline
                        : chevronDownOutline
                    "
                  />
                </button>
                <p v-if="expandedFaq === index">{{ faq.a }}</p>
              </div>
              <div class="info-strip">
                <ion-icon :icon="alertCircleOutline" /><small
                  >For medical emergencies, contact local emergency services.
                  This app does not provide urgent medical support.</small
                >
              </div></template
            >

            <template v-else-if="activePanel === 'privacy'"
              ><div class="security-banner">
                <ion-icon :icon="lockClosedOutline" />
                <div>
                  <strong>Know where your data goes</strong
                  ><small
                    >Transparency about this project's current setup</small
                  >
                </div>
              </div>
              <div class="privacy-item">
                <ion-icon :icon="personCircleOutline" />
                <div>
                  <strong>Account information</strong>
                  <p>
                    Supabase Authentication manages your sign-in account, email
                    and display name metadata.
                  </p>
                </div>
              </div>
              <div class="privacy-item">
                <ion-icon :icon="documentTextOutline" />
                <div>
                  <strong>Prescription information</strong>
                  <p>
                    Prescription records may be stored in your project's
                    Supabase database. Access restrictions depend on correctly
                    configured Row Level Security policies.
                  </p>
                </div>
              </div>
              <div class="privacy-item">
                <ion-icon :icon="cloudOutline" />
                <div>
                  <strong>OCR and AI processing</strong>
                  <p>
                    Images or extracted text may be sent to configured external
                    services for processing. Avoid uploading information you do
                    not want processed.
                  </p>
                </div>
              </div>
              <div class="privacy-item">
                <ion-icon :icon="settingsOutline" />
                <div>
                  <strong>Local preferences</strong>
                  <p>
                    Notification preferences are saved in this browser, scoped
                    to your account ID. Avatar color and display name use
                    Supabase user metadata.
                  </p>
                </div>
              </div>
              <div class="info-strip warning">
                <ion-icon :icon="alertCircleOutline" /><small
                  >Privacy protection is not guaranteed by this screen. Review
                  database RLS, storage permissions, API keys and retention
                  rules before real-world use.</small
                >
              </div></template
            >

            <template v-else-if="activePanel === 'about'"
              ><div class="about-hero">
                <div class="about-mark"><ion-icon :icon="medkitOutline" /></div>
                <h3>Medi<span>Scan</span> AI</h3>
                <p>Scan · Identify · Stay Safe</p>
                <span class="version-pill"
                  >Student Project · Version 1.0.0</span
                >
              </div>
              <h3 class="panel-section-title">What is MediScan AI?</h3>
              <p class="panel-intro">
                A healthcare learning application designed to help users explore
                medicine information, scan prescriptions and find pharmacies.
              </p>
              <div class="feature-grid">
                <div>
                  <ion-icon :icon="scanOutline" /><strong>Medicine Scan</strong
                  ><small>AI-assisted identification</small>
                </div>
                <div>
                  <ion-icon :icon="documentTextOutline" /><strong
                    >Prescription OCR</strong
                  ><small>Extract and review text</small>
                </div>
                <div>
                  <ion-icon :icon="locationOutline" /><strong
                    >Pharmacy Finder</strong
                  ><small>Explore nearby locations</small>
                </div>
                <div>
                  <ion-icon :icon="pricetagsOutline" /><strong
                    >Price Comparison</strong
                  ><small>Estimated demo prices</small>
                </div>
              </div>
              <div class="info-strip">
                <ion-icon :icon="shieldCheckmarkOutline" /><small
                  >Medicine results require verification. Pharmacy prices and
                  stock shown as demos are not live inventory data.</small
                >
              </div></template
            >
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import { useRouter } from "vue-router";

import {
  IonPage,
  IonContent,
  IonIcon,
  IonToggle,
  alertController,
  onIonViewWillEnter,
} from "@ionic/vue";

import {
  person,
  personOutline,
  createOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  chevronForward,
  chevronUpOutline,
  chevronDownOutline,
  lockClosedOutline,
  notificationsOutline,
  languageOutline,
  helpCircleOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  logOutOutline,
  cameraOutline,
  trashOutline,
  sparklesOutline,
  closeOutline,
  mailOutline,
  chatbubblesOutline,
  alertCircleOutline,
  personCircleOutline,
  documentTextOutline,
  cloudOutline,
  settingsOutline,
  medkitOutline,
  scanOutline,
  locationOutline,
  pricetagsOutline,
} from "ionicons/icons";

import { supabase } from "../utils/supabase";

type Panel =
  | "edit"
  | "personal"
  | "avatar"
  | "security"
  | "language"
  | "help"
  | "privacy"
  | "about";

type AvatarTheme = "mint" | "sky" | "lavender" | "peach";

const router = useRouter();

const activePanel = ref<Panel | null>(null);

const busy = ref(false);

const displayName = ref("Loading...");

const userEmail = ref("");

const userId = ref<string | null>(null);

const draftName = ref("");

const avatarTheme = ref<AvatarTheme>("mint");

const avatarPhotoUrl = ref("");

const avatarPhotoPath = ref("");

const photoInput = ref<HTMLInputElement | null>(null);

const PHOTO_BUCKET = "profile-photos";

const avatarThemes: AvatarTheme[] = ["mint", "sky", "lavender", "peach"];

const notificationsEnabled = ref(false);

const language = ref<"en">("en");

const expandedFaq = ref<number>(0);

const languageLabel = computed(() => "English");

const titles: Record<Panel, string> = {
  edit: "Edit Profile",
  personal: "Personal Information",
  avatar: "Avatar Style",
  security: "Password & Security",
  language: "Language Preferences",
  help: "Help & Support",
  privacy: "Privacy & Security",
  about: "About MediScan AI",
};

const subtitles: Record<Panel, string> = {
  edit: "Make your profile yours",
  personal: "Your connected account details",
  avatar: "Choose your profile look",
  security: "Keep your account protected",
  language: "Select your preferred language",
  help: "Answers to common questions",
  privacy: "Understand your data",
  about: "Get to know the app",
};

const panelTitle = computed(() =>
  activePanel.value ? titles[activePanel.value] : "",
);

const panelSubtitle = computed(() =>
  activePanel.value ? subtitles[activePanel.value] : "",
);

const faqs = [
  {
    q: "How do I scan a prescription?",
    a: "Open the Prescriptions tab, select Scan Prescription, upload or capture a clear image, and review all extracted details before confirming.",
  },

  {
    q: "Can I trust the AI medicine results?",
    a: "AI and OCR may make mistakes. Always compare results with the original label or prescription and ask a pharmacist or doctor if unsure.",
  },

  {
    q: "Are pharmacy prices and stock live?",
    a: "No. Prices and availability in the current demo are estimates or sample values, not verified real-time pharmacy inventory.",
  },

  {
    q: "How can I change my account name?",
    a: "Choose Edit Profile or Personal Information, update your display name and select Save Changes.",
  },

  {
    q: "What if I forget my password?",
    a: "Use Password & Security to request a reset email. The reset flow also needs a correctly configured Supabase redirect URL.",
  },
];

const showMessage = async (header: string, message: string) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: ["OK"],
  });

  await alert.present();
};

const preferencesKey = (id: string) => `mediscan-profile-prefs:${id}`;

const loadPreferences = (id: string) => {
  notificationsEnabled.value = false;

  language.value = "en";

  try {
    const raw = localStorage.getItem(preferencesKey(id));

    if (raw) {
      const prefs = JSON.parse(raw) as {
        notifications?: boolean;
        language?: string;
      };

      notificationsEnabled.value = prefs.notifications === true;

      language.value = "en";
    }
  } catch {
    /* Keep safe defaults if browser storage is unavailable */
  }
};

const persistPreferences = () => {
  if (!userId.value) return;

  try {
    localStorage.setItem(
      preferencesKey(userId.value),
      JSON.stringify({
        notifications: notificationsEnabled.value,
        language: language.value,
      }),
    );
  } catch {
    void showMessage(
      "Not Saved",
      "Browser storage is unavailable. Your preference may not persist.",
    );
  }
};

const setNotifications = (value: boolean) => {
  notificationsEnabled.value = value;
  persistPreferences();
};

const loadProfile = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    userId.value = null;
    userEmail.value = "";
    displayName.value = "Not signed in";
    avatarPhotoUrl.value = "";
    avatarPhotoPath.value = "";

    notificationsEnabled.value = false;
    language.value = "en";
    return;
  }

  const user = data.user;

  if (userId.value !== user.id) loadPreferences(user.id);

  userId.value = user.id;

  userEmail.value = user.email ?? "";

  const meta = user.user_metadata ?? {};

  const name = meta.full_name || meta.display_name || meta.name;

  displayName.value =
    typeof name === "string" && name.trim()
      ? name.trim()
      : (user.email?.split("@")[0] ?? "MediScan User");

  avatarTheme.value = avatarThemes.includes(meta.avatar_theme)
    ? (meta.avatar_theme as AvatarTheme)
    : "mint";

  avatarPhotoUrl.value = "";

  avatarPhotoPath.value = "";

  // Never use an arbitrary metadata path to access another user's photo.

  const storedPath =
    typeof meta.avatar_path === "string" ? meta.avatar_path : "";

  if (storedPath.startsWith(`${user.id}/`)) {
    avatarPhotoPath.value = storedPath;

    const { data: signed, error: photoError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrl(storedPath, 3600);

    if (!photoError && signed?.signedUrl)
      avatarPhotoUrl.value = signed.signedUrl;
  }
};

onMounted(() => {
  void loadProfile();
});

onIonViewWillEnter(() => {
  void loadProfile();
});

const { data: authListener } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    // Avoid calling Supabase Auth methods synchronously inside the callback.

    if (!session?.user) {
      userId.value = null;
      userEmail.value = "";
      displayName.value = "Not signed in";
      avatarPhotoUrl.value = "";
      avatarPhotoPath.value = "";
    } else {
      if (userId.value !== session.user.id) loadPreferences(session.user.id);
      userId.value = session.user.id;
      userEmail.value = session.user.email ?? "";
    }
  },
);

onUnmounted(() => authListener.subscription.unsubscribe());

const openPanel = (panel: Panel) => {
  draftName.value = displayName.value;
  expandedFaq.value = 0;
  activePanel.value = panel;
};

const closePanel = () => {
  if (!busy.value) activePanel.value = null;
};

const saveProfile = async () => {
  const name = draftName.value.trim();

  if (!userId.value)
    return void showMessage("Sign In Required", "Please sign in first.");

  if (!name)
    return void showMessage("Name Required", "Please enter a display name.");

  busy.value = true;

  try {
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name, display_name: name },
    });

    if (error) throw error;

    displayName.value = name;
    activePanel.value = null;

    await showMessage(
      "Saved Successfully",
      "Your display name was updated in Supabase Authentication.",
    );
  } catch (error) {
    await showMessage(
      "Unable to Save",
      error instanceof Error ? error.message : "Please try again.",
    );
  } finally {
    busy.value = false;
  }
};

const saveAvatar = async (theme: AvatarTheme) => {
  if (!userId.value)
    return void showMessage("Sign In Required", "Please sign in first.");

  busy.value = true;

  const { error } = await supabase.auth.updateUser({
    data: { avatar_theme: theme },
  });

  busy.value = false;

  if (error) return void showMessage("Unable to Save", error.message);

  avatarTheme.value = theme;
};

const onPhotoSelected = async (event: Event) => {
  const input = event.target as HTMLInputElement;

  const file = input.files?.[0];

  input.value = "";

  if (!file) return;

  if (!userId.value)
    return void showMessage(
      "Sign In Required",
      "Please sign in to upload a photo.",
    );

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return void showMessage(
      "Unsupported File",
      "Choose a JPG, PNG, or WebP image.",
    );

  if (file.size > 5 * 1024 * 1024)
    return void showMessage(
      "Photo Too Large",
      "Choose an image smaller than 5 MB.",
    );

  busy.value = true;

  const id = userId.value;

  const previousPath = avatarPhotoPath.value;

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  const path = `${id}/${crypto.randomUUID()}.${extension}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const { error: metadataError } = await supabase.auth.updateUser({
      data: { avatar_path: path },
    });

    if (metadataError) {
      await supabase.storage.from(PHOTO_BUCKET).remove([path]);

      throw metadataError;
    }

    const { data: signed, error: signedError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .createSignedUrl(path, 3600);

    avatarPhotoPath.value = path;

    avatarPhotoUrl.value = signedError ? "" : (signed?.signedUrl ?? "");

    if (
      previousPath &&
      previousPath !== path &&
      previousPath.startsWith(`${id}/`)
    ) {
      await supabase.storage.from(PHOTO_BUCKET).remove([previousPath]);
    }

    await showMessage(
      "Photo Updated",
      "Your profile photo was saved to your Supabase account.",
    );
  } catch (error) {
    await showMessage(
      "Upload Failed",
      error instanceof Error
        ? error.message
        : "Check your Supabase Storage bucket and policies.",
    );
  } finally {
    busy.value = false;
  }
};

const removePhoto = async () => {
  if (!userId.value || !avatarPhotoPath.value || busy.value) return;

  const path = avatarPhotoPath.value;

  if (!path.startsWith(`${userId.value}/`)) return;

  busy.value = true;

  try {
    const { error: metaError } = await supabase.auth.updateUser({
      data: { avatar_path: null },
    });

    if (metaError) throw metaError;

    avatarPhotoPath.value = "";

    avatarPhotoUrl.value = "";

    const { error: removeError } = await supabase.storage
      .from(PHOTO_BUCKET)
      .remove([path]);

    if (removeError)
      await showMessage(
        "Photo Hidden",
        "Photo removed from your profile, but deleting the stored file failed: " +
          removeError.message,
      );
    else
      await showMessage(
        "Photo Removed",
        "Your profile photo has been removed.",
      );
  } catch (error) {
    await showMessage(
      "Unable to Remove Photo",
      error instanceof Error ? error.message : "Please try again.",
    );
  } finally {
    busy.value = false;
  }
};

const sendPasswordReset = async () => {
  if (!userEmail.value) return;

  busy.value = true;

  const { error } = await supabase.auth.resetPasswordForEmail(userEmail.value);

  busy.value = false;

  if (error) return void showMessage("Request Failed", error.message);

  await showMessage(
    "Check Your Email",
    "If the email can receive password reset messages, a link should arrive shortly. Check your inbox and spam folder.",
  );
};

const confirmLogout = async () => {
  const alert = await alertController.create({
    header: "Log Out?",
    message: "You will need to sign in again to access your account.",
    buttons: [
      { text: "Cancel", role: "cancel" },
      {
        text: "Log Out",
        role: "destructive",
        handler: () => {
          void signOut();
        },
      },
    ],
  });

  await alert.present();
};

const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) return void showMessage("Log Out Failed", error.message);

  activePanel.value = null;
  userId.value = null;
  userEmail.value = "";
  displayName.value = "Not signed in";
  avatarPhotoUrl.value = "";
  avatarPhotoPath.value = "";

  await router.replace("/login");
};
</script>

<style scoped>
.profile-content {
  --background: #f6faf9;
}

.page-container {
  width: min(100%, 1000px);
  margin: 0 auto;
  padding: 40px 28px 120px;
  color: #14251f;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
}

.eyebrow {
  color: #078f6b;
  font-size: 10px;
  font-weight: 850;
  letter-spacing: 1.9px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 9px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 36px;
  font-weight: 850;
  letter-spacing: -1.4px;
}

.title-dot,
.brand-small span,
.about-hero h3 span {
  color: #07966e;
}

.page-header p {
  margin: 0;
  color: #798a83;
  font-size: 14px;
}

.brand-small {
  font-size: 23px;
  font-weight: 850;
  white-space: nowrap;
}

.profile-card {
  position: relative;
  background: linear-gradient(118deg, #e3faf3 0%, #c9f3e6 100%);
  border: 1px solid #d6f4e9;
  border-radius: 28px;
  padding: 29px 31px;
  display: flex;
  align-items: center;
  gap: 23px;
  box-shadow: 0 12px 30px rgba(13, 121, 87, 0.045);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  min-width: 100px;
  border-radius: 50%;
  background: white;
  display: grid;
  place-items: center;
  position: relative;
  box-shadow: 0 7px 20px rgba(20, 80, 60, 0.1);
}

.profile-avatar > ion-icon {
  font-size: 58px;
  color: #597069;
}

.profile-avatar.sky,
.mini-avatar.sky,
.avatar-choice.sky {
  background: #dbeeff;
  color: #3579bd;
}

.profile-avatar.lavender,
.mini-avatar.lavender,
.avatar-choice.lavender {
  background: #eee5ff;
  color: #7553b4;
}

.profile-avatar.peach,
.mini-avatar.peach,
.avatar-choice.peach {
  background: #ffeadf;
  color: #ba6a45;
}

.profile-avatar.mint,
.mini-avatar.mint,
.avatar-choice.mint {
  background: #e5fff4;
  color: #0d9270;
}

.profile-avatar.sky > ion-icon,
.profile-avatar.lavender > ion-icon,
.profile-avatar.peach > ion-icon,
.profile-avatar.mint > ion-icon {
  color: inherit;
}

.camera-button {
  position: absolute;
  width: 35px;
  height: 35px;
  right: -2px;
  bottom: 2px;
  border: 3px solid #d5f5ec;
  border-radius: 50%;
  background: #07966e;
  color: white;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.camera-button ion-icon {
  font-size: 16px;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-kicker {
  color: #118d6d;
  font-size: 10px;
  letter-spacing: 1.5px;
  font-weight: 800;
}

.profile-info h2 {
  margin: 5px 0;
  font-size: clamp(19px, 2.5vw, 27px);
  overflow-wrap: anywhere;
  letter-spacing: -0.6px;
}

.profile-info p {
  margin: 0 0 10px;
  color: #62776f;
  overflow-wrap: anywhere;
  font-size: 14px;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 11px;
  background: rgba(255, 255, 255, 0.76);
  border-radius: 20px;
  color: #078c68;
  font-size: 11px;
  font-weight: 750;
}

.edit-button {
  border: none;
  border-radius: 13px;
  background: white;
  color: #078d68;
  padding: 12px 17px;
  font-weight: 750;
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(20, 70, 60, 0.07);
  white-space: nowrap;
}

.quick-summary {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 16px 19px;
  margin: 17px 0 30px;
  background: #fff;
  border: 1px solid #e8f2ed;
  border-radius: 17px;
}

.summary-icon {
  display: grid;
  place-items: center;
  background: #e5f9f1;
  color: #07966e;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  font-size: 22px;
  flex-shrink: 0;
}

.quick-summary div:nth-child(2) {
  flex: 1;
  display: grid;
  gap: 3px;
}

.quick-summary strong {
  font-size: 13px;
}

.quick-summary span {
  font-size: 12px;
  color: #809089;
}

.summary-check {
  color: #0b9a74;
  font-size: 20px;
}

.settings-section {
  margin-bottom: 29px;
}

.section-heading {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 5px 12px;
  gap: 10px;
}

.section-heading h2 {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
}

.section-heading span {
  color: #a2aea9;
  font-size: 10px;
  letter-spacing: 1.3px;
  font-weight: 800;
}

.settings-card {
  background: white;
  border: 1px solid #f0f5f2;
  border-radius: 23px;
  padding: 0 22px;
  box-shadow: 0 5px 20px rgba(30, 70, 60, 0.04);
}

.setting-row {
  width: 100%;
  min-height: 86px;
  border: none;
  border-bottom: 1px solid #edf1ef;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  text-align: left;
  color: #14241f;
  cursor: pointer;
}

.setting-row:last-child {
  border-bottom: none;
}

.static-row {
  cursor: default;
}

.setting-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 15px;
  display: grid;
  place-items: center;
}

.setting-icon ion-icon {
  font-size: 23px;
}

.green {
  background: #dff7ef;
  color: #07966e;
}
.blue {
  background: #e5f2ff;
  color: #3387ce;
}
.orange {
  background: #fff0e5;
  color: #e77427;
}
.purple {
  background: #eeeeff;
  color: #6661c8;
}
.cyan {
  background: #e3f8f8;
  color: #24999c;
}
.gray {
  background: #eef1f0;
  color: #66736f;
}

.setting-info {
  display: grid;
  gap: 5px;
  flex: 1;
  min-width: 0;
}

.setting-info strong {
  font-size: 15px;
  font-weight: 750;
}

.setting-info small {
  color: #89938f;
  font-size: 12px;
  line-height: 1.4;
}

.arrow {
  font-size: 20px;
  color: #9aa6a2;
  flex-shrink: 0;
}

.value-chip {
  padding: 5px 8px;
  border-radius: 8px;
  background: #f0faf6;
  color: #078c68;
  font-size: 11px;
  font-weight: 750;
}

.logout-button {
  width: 100%;
  height: 58px;
  border: 1px solid #ffd6d6;
  border-radius: 17px;
  background: #fff5f5;
  color: #dc4b4b;
  font-size: 15px;
  font-weight: 750;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  cursor: pointer;
}

.logout-button ion-icon {
  font-size: 20px;
}

.medical-note {
  margin-top: 23px;
  padding: 16px 18px;
  border-radius: 17px;
  background: #e8f8f3;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: #66756f;
  font-size: 12px;
  line-height: 1.6;
}

.medical-note ion-icon {
  font-size: 23px;
  color: #07966e;
  flex-shrink: 0;
}
.medical-note p {
  margin: 0;
}
.footer-caption {
  text-align: center;
  font-size: 11px;
  color: #a3b1aa;
  margin-top: 22px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(13, 33, 27, 0.52);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  backdrop-filter: blur(3px);
}

.panel {
  width: min(100%, 520px);
  max-height: min(85vh, 780px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2);
  color: #14251f;
}

.panel-header {
  padding: 24px 26px 19px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #edf3f0;
  background: linear-gradient(120deg, #f2fdf8, #fff);
}

.panel-header h2 {
  margin: 0 0 6px;
  font-size: 23px;
  letter-spacing: -0.7px;
}
.panel-header p {
  margin: 0;
  font-size: 12px;
  color: #84938d;
}

.close-button {
  border: none;
  background: #eaf6f1;
  color: #257f65;
  border-radius: 11px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  font-size: 21px;
  cursor: pointer;
  flex-shrink: 0;
}

.panel-body {
  padding: 23px 26px 28px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.mini-profile {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
  background: #f3fbf7;
  border-radius: 16px;
  margin-bottom: 22px;
}

.mini-avatar {
  display: grid;
  place-items: center;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  font-size: 27px;
}

.mini-profile div {
  display: grid;
  gap: 3px;
  min-width: 0;
}
.mini-profile strong {
  font-size: 14px;
}
.mini-profile small {
  color: #7d8f86;
  overflow-wrap: anywhere;
}

.field-label {
  display: block;
  font-weight: 750;
  font-size: 12px;
  margin: 15px 0 8px;
}

.form-input,
.read-only-field {
  width: 100%;
  min-height: 47px;
  border: 1px solid #dcece5;
  background: #fff;
  border-radius: 12px;
  padding: 12px 13px;
  font: inherit;
  font-size: 14px;
  color: #203b30;
  box-sizing: border-box;
}

.form-input:focus {
  outline: 2px solid #a1e5cc;
  border-color: #0b9d72;
}
.read-only-field {
  background: #f7faf9;
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-wrap: anywhere;
}
.read-only-field ion-icon:last-child {
  margin-left: auto;
  color: #94a49d;
}

.field-hint {
  font-size: 11px;
  color: #89958e;
  line-height: 1.6;
  margin: 12px 0;
}

.primary-action {
  width: 100%;
  min-height: 49px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #008d6a;
  color: white;
  border: none;
  border-radius: 13px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  margin-top: 22px;
}
.primary-action:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.info-strip {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  background: #eff9f5;
  color: #56736a;
  border-radius: 13px;
  padding: 13px 14px;
  margin-top: 17px;
  font-size: 12px;
  line-height: 1.5;
}
.info-strip > ion-icon {
  color: #0b9772;
  font-size: 21px;
  flex-shrink: 0;
}
.info-strip div {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.info-strip small {
  font-size: 11px;
  line-height: 1.6;
}
.id-text {
  overflow-wrap: anywhere;
}
.info-strip.warning {
  background: #fff8ed;
}
.info-strip.warning > ion-icon {
  color: #dc9140;
}

.panel-intro {
  color: #74847d;
  font-size: 13px;
  line-height: 1.7;
  margin: 0 0 17px;
}
.panel-section-title {
  font-size: 15px;
  margin: 24px 0 9px;
}

.avatar-choices {
  display: flex;
  justify-content: space-between;
  gap: 9px;
}
.avatar-choice {
  position: relative;
  display: grid;
  place-items: center;
  border: 2px solid transparent;
  width: 70px;
  height: 70px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 35px;
}
.avatar-choice.selected {
  border-color: #0b9974;
}
.choice-check {
  position: absolute;
  right: 3px;
  bottom: 3px;
  font-size: 17px;
  color: #0a9872;
}

.security-banner,
.help-hero {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 17px;
  border-radius: 15px;
  background: #eaf9f2;
  margin-bottom: 20px;
}
.security-banner > ion-icon,
.help-hero > ion-icon {
  color: #0a9771;
  font-size: 30px;
  flex-shrink: 0;
}
.security-banner div,
.help-hero div {
  display: grid;
  gap: 4px;
}
.security-banner strong,
.help-hero strong {
  font-size: 14px;
}
.security-banner small,
.help-hero small {
  color: #6e8a7e;
  font-size: 12px;
}

.detail-list {
  border: 1px solid #edf3f0;
  border-radius: 14px;
  overflow: hidden;
}
.detail-list > div {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 14px;
  font-size: 12px;
  border-bottom: 1px solid #edf3f0;
}
.detail-list > div:last-child {
  border-bottom: none;
}
.detail-list span {
  color: #89968e;
}
.detail-list strong {
  text-align: right;
  overflow-wrap: anywhere;
}

.language-option {
  width: 100%;
  border: 1px solid #e6f0ea;
  background: white;
  border-radius: 14px;
  padding: 13px;
  display: flex;
  align-items: center;
  gap: 13px;
  text-align: left;
  margin-bottom: 10px;
  cursor: pointer;
}
.language-option.chosen {
  background: #f0fbf5;
  border-color: #70d6b0;
}
.language-symbol {
  display: grid;
  place-items: center;
  background: #e1f7ed;
  color: #088d6a;
  border-radius: 10px;
  width: 45px;
  height: 42px;
  font-size: 12px;
  font-weight: 850;
}
.language-option > span:nth-child(2) {
  display: grid;
  flex: 1;
  gap: 3px;
}
.language-option strong {
  font-size: 13px;
}
.language-option small {
  color: #89968e;
  font-size: 11px;
}
.language-option > ion-icon {
  color: #0a9b74;
  font-size: 22px;
}

.faq-item {
  border-bottom: 1px solid #edf3f0;
}
.faq-item button {
  border: none;
  background: transparent;
  width: 100%;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  color: #1b3027;
  cursor: pointer;
}
.faq-item button strong {
  font-size: 13px;
}
.faq-item button ion-icon {
  color: #0b9973;
  flex-shrink: 0;
}
.faq-item p {
  margin: -2px 0 17px;
  color: #71827a;
  font-size: 12px;
  line-height: 1.7;
}

.privacy-item {
  display: flex;
  gap: 13px;
  padding: 15px 0;
  border-bottom: 1px solid #edf3f0;
}
.privacy-item > ion-icon {
  flex-shrink: 0;
  font-size: 22px;
  color: #0a9974;
}
.privacy-item strong {
  font-size: 13px;
}
.privacy-item p {
  font-size: 12px;
  line-height: 1.7;
  color: #78877f;
  margin: 5px 0 0;
}

.about-hero {
  background: linear-gradient(145deg, #e7fbf2, #f8fffb);
  border-radius: 20px;
  padding: 26px 15px;
  text-align: center;
}
.about-mark {
  width: 62px;
  height: 62px;
  background: #fff;
  border-radius: 18px;
  display: grid;
  place-items: center;
  margin: 0 auto 11px;
  font-size: 35px;
  color: #069570;
  box-shadow: 0 5px 18px rgba(6, 120, 80, 0.1);
}
.about-hero h3 {
  font-size: 26px;
  margin: 0;
}
.about-hero p {
  margin: 5px 0 14px;
  color: #70867b;
  letter-spacing: 1px;
  font-size: 10px;
  text-transform: uppercase;
}
.version-pill {
  background: white;
  border: 1px solid #d8eee3;
  border-radius: 20px;
  padding: 6px 11px;
  color: #0b8f6b;
  font-size: 11px;
  font-weight: 750;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.feature-grid > div {
  background: #f6fbf8;
  border: 1px solid #e7f1ea;
  border-radius: 13px;
  padding: 15px 12px;
  display: grid;
  gap: 7px;
}
.feature-grid ion-icon {
  color: #0b9872;
  font-size: 23px;
}
.feature-grid strong {
  font-size: 12px;
}
.feature-grid small {
  color: #89978f;
  font-size: 10px;
}

@media (max-width: 600px) {
  .page-container {
    padding: calc(25px + env(safe-area-inset-top)) 17px 115px;
  }
  .page-header h1 {
    font-size: 30px;
  }
  .page-header p {
    font-size: 12px;
  }
  .brand-small {
    display: none;
  }
  .profile-card {
    padding: 21px 18px 67px;
    gap: 14px;
    align-items: flex-start;
    border-radius: 22px;
  }
  .profile-avatar {
    width: 70px;
    height: 70px;
    min-width: 70px;
  }
  .profile-avatar > ion-icon {
    font-size: 42px;
  }
  .profile-info h2 {
    font-size: 20px;
  }
  .profile-info p {
    font-size: 12px;
  }
  .profile-kicker {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .edit-button {
    position: absolute;
    right: 17px;
    bottom: 17px;
    font-size: 12px;
    padding: 9px 12px;
  }
  .quick-summary {
    margin-bottom: 26px;
  }
  .settings-card {
    padding: 0 16px;
  }
  .setting-row {
    min-height: 78px;
    gap: 12px;
  }
  .setting-icon {
    width: 43px;
    height: 43px;
    min-width: 43px;
  }
  .setting-info strong {
    font-size: 13px;
  }
  .setting-info small {
    font-size: 11px;
  }
  .value-chip {
    display: none;
  }
  .overlay {
    align-items: flex-end;
    padding: 0;
  }
  .panel {
    border-radius: 24px 24px 0 0;
    max-height: 88vh;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .panel-header {
    padding: 21px 20px 17px;
  }
  .panel-body {
    padding: 20px;
  }
  .panel-header h2 {
    font-size: 21px;
  }
}

.avatar-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.profile-avatar > .avatar-photo {
  position: absolute;
  inset: 0;
}

.photo-preview {
  width: 122px;
  height: 122px;
  border-radius: 50%;
  margin: 0 auto 15px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #e5fff4;
  color: #0a906a;
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.07);
}

.photo-preview > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-preview > ion-icon {
  font-size: 68px;
}

.photo-caption {
  text-align: center;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.secondary-danger {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #fff3f3;
  color: #c83d3d;
  border: 1px solid #ffd9d9;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.secondary-danger:disabled {
  opacity: 0.5;
}
</style>
