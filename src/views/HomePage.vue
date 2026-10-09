<template>
  <ion-page>
    <ion-content :fullscreen="true" class="home-content">
      <div class="page-container">

        <!-- HEADER -->
        <header class="top-header">
          <div class="brand">
            <div class="brand-icon">
              <ion-icon :icon="medicalOutline"></ion-icon>
            </div>

            <div>
              <h1>
                Medi<span>Scan</span> AI
              </h1>
              <p>Scan. Identify. Stay Safe.</p>
            </div>
          </div>

          <div class="user-area">
            <div class="greeting">
              <span>Good morning,</span>
              <strong>{{ userName }}!</strong>
            </div>

            <div class="profile-circle" @click="goToProfile">
              <ion-icon :icon="person"></ion-icon>
              <span class="online-dot"></span>
            </div>
          </div>
        </header>

        <!-- HERO -->
        <section class="hero">
          <div class="hero-text">
            <h2>
              Your Health,<br />
              <span>Made Easier</span>
            </h2>

            <p>
              Scan your prescription, identify medicines, and get important
              safety information — all in one app.
            </p>
          </div>

          <div class="hero-art">
            <div class="phone">
              <div class="phone-speaker"></div>
              <div class="rx">Rx</div>
              <div class="line long"></div>
              <div class="line"></div>
              <div class="line medium"></div>
              <div class="line short"></div>
            </div>

            <div class="shield">
              <ion-icon :icon="shieldCheckmark"></ion-icon>
            </div>

            <div class="pill pill-one"></div>
            <div class="pill pill-two"></div>
          </div>
        </section>

        <!-- ACTION CARDS -->
        <section class="action-grid">

          <button class="action-card scan-card" @click="scanPrescription">
            <div class="action-icon scan-icon">
              <ion-icon :icon="camera"></ion-icon>
            </div>

            <div class="action-info">
              <h3>Scan Prescription</h3>
              <p>Take a photo or upload an image</p>
            </div>

            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>

          <button class="action-card" @click="goToMedicine">
            <div class="action-icon green-icon">
              <ion-icon :icon="search"></ion-icon>
            </div>

            <div class="action-info">
              <h3>Search Medicine</h3>
              <p>Find medicine information</p>
            </div>

            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>

          <button
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

          <button class="action-card reminder-card" @click="showReminder">
            <div class="action-icon orange-icon">
              <ion-icon :icon="notifications"></ion-icon>
            </div>

            <div class="action-info">
              <h3>Medication Reminders</h3>
              <p>Manage your schedule</p>
            </div>

            <ion-icon class="arrow" :icon="chevronForward"></ion-icon>
          </button>

        </section>

        <!-- UPCOMING MEDICATIONS -->
        <section class="section-block">
          <div class="section-heading">
            <h2>Upcoming Medications</h2>

            <button @click="showAllMedications">
              See All
              <ion-icon :icon="chevronForward"></ion-icon>
            </button>
          </div>

          <div class="medication-list">

            <div
              v-for="medicine in medicines"
              :key="medicine.name"
              class="medicine-row"
            >
              <div
                class="medicine-pill"
                :class="medicine.color"
              ></div>

              <div class="medicine-details">
                <h3>{{ medicine.name }}</h3>
                <p>{{ medicine.instructions }}</p>
              </div>

              <div
                class="medicine-time"
                :class="medicine.timeColor"
              >
                <ion-icon :icon="timeOutline"></ion-icon>
                {{ medicine.time }}
              </div>

              <ion-icon
                class="medicine-arrow"
                :icon="chevronForward"
              ></ion-icon>
            </div>

          </div>
        </section>

        <!-- RECENT PRESCRIPTIONS -->
        <section class="section-block recent-section">
          <div class="section-heading">
            <h2>Recent Prescriptions</h2>

            <button @click="goToPrescriptions">
              See All
              <ion-icon :icon="chevronForward"></ion-icon>
            </button>
          </div>

          <div class="recent-grid">

            <button
              class="recent-card"
              @click="goToPrescriptions"
            >
              <div class="rx-preview">Rx</div>

              <div>
                <span>Oct 2, 2026</span>
                <h3>Sample Prescription</h3>
                <p>3 medicines</p>
              </div>
            </button>

            <button
              class="recent-card"
              @click="goToPrescriptions"
            >
              <div class="rx-preview">Rx</div>

              <div>
                <span>Sep 15, 2026</span>
                <h3>Sample Prescription</h3>
                <p>2 medicines</p>
              </div>
            </button>

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
import {
  IonPage,
  IonContent,
  IonIcon,
  alertController
} from '@ionic/vue';

import {
  camera,
  search,
  documentText,
  notifications,
  person,
  chevronForward,
  timeOutline,
  shieldCheckmark,
  shieldCheckmarkOutline,
  medicalOutline
} from 'ionicons/icons';

import { useRouter } from 'vue-router';

const router = useRouter();

const userName = 'Ely';

const medicines = [
  {
    name: 'Sample Medicine A',
    instructions: 'Demo medication schedule',
    time: '7:00 AM',
    color: 'red-pill',
    timeColor: 'red-time'
  },
  {
    name: 'Sample Medicine B',
    instructions: 'Demo medication schedule',
    time: '3:00 PM',
    color: 'white-pill',
    timeColor: 'green-time'
  },
  {
    name: 'Sample Medicine C',
    instructions: 'Demo medication schedule',
    time: '11:00 PM',
    color: 'yellow-pill',
    timeColor: 'blue-time'
  }
];

/* SCAN PRESCRIPTION */
const scanPrescription = () => {
  router.push('/scan-prescription');
};

/* MEDICINE TAB */
const goToMedicine = () => {
  router.push('/tabs/medicine');
};

/* PRESCRIPTIONS TAB */
const goToPrescriptions = () => {
  router.push('/tabs/prescriptions');
};

/* PROFILE TAB */
const goToProfile = () => {
  router.push('/tabs/profile');
};

/* REMINDER - TEMPORARY */
const showReminder = async () => {
  const alert = await alertController.create({
    header: 'Medication Reminders',
    message:
      'Medication reminder feature will be added next.',
    buttons: ['OK']
  });

  await alert.present();
};

/* UPCOMING MEDICATIONS - TEMPORARY */
const showAllMedications = async () => {
  const alert = await alertController.create({
    header: 'Upcoming Medications',
    message:
      'The complete medication schedule will be added next.',
    buttons: ['OK']
  });

  await alert.present();
};
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
</style>