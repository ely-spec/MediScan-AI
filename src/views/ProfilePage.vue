<template>
  <ion-page>
    <ion-content :fullscreen="true" class="profile-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="page-header">
          <div>
            <h1>Profile</h1>
            <p>Manage your account and app preferences</p>
          </div>

          <div class="brand-small">
            Medi<span>Scan</span> AI
          </div>
        </header>

        <!-- PROFILE CARD -->
        <section class="profile-card">
          <div class="profile-avatar">
            <ion-icon :icon="person"></ion-icon>

            <button class="camera-button" @click="changePhoto">
              <ion-icon :icon="camera"></ion-icon>
            </button>
          </div>

          <div class="profile-info">
            <h2>Ely Mabunga</h2>
            <p>elymabunga60@gmail.com</p>

            <span class="verified-badge">
              <ion-icon :icon="checkmarkCircle"></ion-icon>
              Account
            </span>
          </div>

          <button class="edit-button" @click="editProfile">
            <ion-icon :icon="createOutline"></ion-icon>
            Edit Profile
          </button>
        </section>

        <!-- ACCOUNT -->
        <section class="settings-section">
          <h2>Account</h2>

          <div class="settings-card">

            <button class="setting-row" @click="editProfile">
              <div class="setting-icon green">
                <ion-icon :icon="personOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Personal Information</h3>
                <p>Update your name and account details</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

            <button class="setting-row" @click="changePassword">
              <div class="setting-icon blue">
                <ion-icon :icon="lockClosedOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Password & Security</h3>
                <p>Manage your password and security</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

          </div>
        </section>

        <!-- PREFERENCES -->
        <section class="settings-section">
          <h2>Preferences</h2>

          <div class="settings-card">

            <div class="setting-row">
              <div class="setting-icon orange">
                <ion-icon :icon="notificationsOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Notifications</h3>
                <p>Medication reminders and updates</p>
              </div>

              <ion-toggle
                v-model="notificationsEnabled"
                color="success"
              ></ion-toggle>
            </div>

            <button class="setting-row" @click="selectLanguage">
              <div class="setting-icon purple">
                <ion-icon :icon="languageOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Language</h3>
                <p>English</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

          </div>
        </section>

        <!-- SUPPORT -->
        <section class="settings-section">
          <h2>Support & Information</h2>

          <div class="settings-card">

            <button class="setting-row" @click="showHelp">
              <div class="setting-icon cyan">
                <ion-icon :icon="helpCircleOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Help & Support</h3>
                <p>Get help using MediScan AI</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

            <button class="setting-row" @click="showPrivacy">
              <div class="setting-icon green">
                <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>Privacy & Security</h3>
                <p>Learn how your information is protected</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

            <button class="setting-row" @click="showAbout">
              <div class="setting-icon gray">
                <ion-icon :icon="informationCircleOutline"></ion-icon>
              </div>

              <div class="setting-info">
                <h3>About MediScan AI</h3>
                <p>Version 1.0.0</p>
              </div>

              <ion-icon
                class="arrow"
                :icon="chevronForward"
              ></ion-icon>
            </button>

          </div>
        </section>

        <!-- LOGOUT -->
        <button class="logout-button" @click="logout">
          <ion-icon :icon="logOutOutline"></ion-icon>
          Log Out
        </button>

        <!-- MEDICAL DISCLAIMER -->
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import {
  IonPage,
  IonContent,
  IonIcon,
  IonToggle,
  alertController
} from '@ionic/vue';

import {
  person,
  personOutline,
  camera,
  createOutline,
  checkmarkCircle,
  chevronForward,
  lockClosedOutline,
  notificationsOutline,
  languageOutline,
  helpCircleOutline,
  shieldCheckmarkOutline,
  informationCircleOutline,
  logOutOutline
} from 'ionicons/icons';

const router = useRouter();

const notificationsEnabled = ref(true);

const showMessage = async (
  header: string,
  message: string
) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: ['OK']
  });

  await alert.present();
};

const changePhoto = () => {
  showMessage(
    'Profile Photo',
    'Profile photo upload will be connected later.'
  );
};

const editProfile = () => {
  showMessage(
    'Edit Profile',
    'Profile editing will be connected later.'
  );
};

const changePassword = () => {
  showMessage(
    'Password & Security',
    'Password management will be connected once authentication is configured.'
  );
};

const selectLanguage = () => {
  showMessage(
    'Language',
    'Additional languages can be added here.'
  );
};

const showHelp = () => {
  showMessage(
    'Help & Support',
    'MediScan AI help and support section.'
  );
};

const showPrivacy = () => {
  showMessage(
    'Privacy & Security',
    'Privacy and security information will appear here.'
  );
};

const showAbout = () => {
  showMessage(
    'About MediScan AI',
    'MediScan AI Version 1.0.0'
  );
};

const logout = async () => {
  const alert = await alertController.create({
    header: 'Log Out',
    message: 'Are you sure you want to log out?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Log Out',
        role: 'destructive',
        handler: () => {
          router.replace('/login');
        }
      }
    ]
  });

  await alert.present();
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
  color: #13231e;
}

/* HEADER */

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.page-header h1 {
  margin: 0 0 6px;
  font-size: 34px;
  font-weight: 800;
}

.page-header p {
  margin: 0;
  color: #78847f;
  font-size: 15px;
}

.brand-small {
  font-size: 23px;
  font-weight: 800;
}

.brand-small span {
  color: #07966e;
}

/* PROFILE CARD */

.profile-card {
  background: linear-gradient(
    135deg,
    #e4faf4,
    #c8f2e6
  );

  border-radius: 28px;
  padding: 30px;

  display: flex;
  align-items: center;
  gap: 23px;

  margin-bottom: 35px;
}

.profile-avatar {
  width: 100px;
  height: 100px;

  min-width: 100px;

  border-radius: 50%;

  background: white;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  box-shadow:
    0 7px 20px rgba(20, 80, 60, 0.1);
}

.profile-avatar > ion-icon {
  font-size: 58px;
  color: #597069;
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

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
}

.camera-button ion-icon {
  font-size: 17px;
}

.profile-info {
  flex: 1;
}

.profile-info h2 {
  margin: 0 0 5px;
  font-size: 27px;
}

.profile-info p {
  margin: 0 0 11px;
  color: #63736e;
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  padding: 6px 10px;

  background: rgba(255,255,255,.7);

  border-radius: 20px;

  color: #078c68;

  font-size: 12px;
  font-weight: 700;
}

.edit-button {
  border: none;
  border-radius: 13px;

  background: white;
  color: #078d68;

  padding: 12px 17px;

  font-weight: 700;

  display: flex;
  align-items: center;
  gap: 7px;

  cursor: pointer;

  box-shadow:
    0 5px 15px rgba(20,70,60,.07);
}

/* SETTINGS */

.settings-section {
  margin-bottom: 30px;
}

.settings-section > h2 {
  margin: 0 0 13px 5px;

  font-size: 19px;
  font-weight: 750;
}

.settings-card {
  background: white;

  border-radius: 23px;

  padding: 0 22px;

  box-shadow:
    0 5px 20px rgba(30,70,60,.05);
}

.setting-row {
  width: 100%;

  min-height: 88px;

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

.setting-icon {
  width: 48px;
  height: 48px;

  min-width: 48px;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.setting-icon ion-icon {
  font-size: 24px;
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
  flex: 1;
}

.setting-info h3 {
  margin: 0 0 5px;

  font-size: 16px;
  font-weight: 700;
}

.setting-info p {
  margin: 0;

  font-size: 13px;

  color: #89938f;
}

.arrow {
  font-size: 21px;
  color: #9aa6a2;
}

/* LOGOUT */

.logout-button {
  width: 100%;

  height: 58px;

  border: 1px solid #ffd6d6;

  border-radius: 17px;

  background: #fff5f5;

  color: #e34848;

  font-size: 16px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  cursor: pointer;

  transition: .2s;
}

.logout-button:hover {
  background: #ffeaea;
}

.logout-button ion-icon {
  font-size: 22px;
}

/* DISCLAIMER */

.medical-note {
  margin-top: 25px;

  padding: 16px 18px;

  border-radius: 17px;

  background: #e8f8f3;

  display: flex;
  align-items: center;

  gap: 12px;

  color: #66756f;

  font-size: 12px;
}

.medical-note ion-icon {
  font-size: 25px;
  color: #07966e;
}

.medical-note p {
  margin: 0;
}

/* MOBILE */

@media (max-width: 600px) {

  .page-container {
    padding:
      calc(25px + env(safe-area-inset-top))
      18px
      115px;
  }

  .page-header h1 {
    font-size: 28px;
  }

  .page-header p {
    font-size: 13px;
  }

  .brand-small {
    display: none;
  }

  .profile-card {
    padding: 23px 20px;

    align-items: flex-start;

    position: relative;
  }

  .profile-avatar {
    width: 75px;
    height: 75px;

    min-width: 75px;
  }

  .profile-avatar > ion-icon {
    font-size: 43px;
  }

  .profile-info h2 {
    font-size: 20px;
  }

  .profile-info p {
    font-size: 12px;
  }

  .edit-button {
    position: absolute;

    right: 18px;
    bottom: 18px;

    padding: 8px 10px;

    font-size: 11px;
  }

  .settings-card {
    padding: 0 17px;
  }

  .setting-row {
    min-height: 78px;
  }

  .setting-icon {
    width: 43px;
    height: 43px;

    min-width: 43px;
  }

  .setting-info h3 {
    font-size: 14px;
  }

  .setting-info p {
    font-size: 11px;
  }
}
</style>