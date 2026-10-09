<template>
  <ion-page>
    <ion-content :fullscreen="true" class="register-content">
      <div class="register-page">

        <div class="register-container">

          <!-- LOGO -->
          <div class="brand-section">
            <div class="logo-box">
              <div class="capsule">
                <span class="capsule-half"></span>
              </div>
            </div>

            <h1 class="brand-name">
              Medi<span>Scan</span> AI
            </h1>

            <p class="brand-tagline">
              Scan. Identify. Stay Safe.
            </p>
          </div>

          <!-- REGISTER HEADER -->
          <div class="register-header">
            <h2>Create Account</h2>
            <p>Enter your information to get started</p>
          </div>

          <!-- FORM -->
          <form @submit.prevent="handleRegister">

            <!-- FULL NAME -->
            <div class="form-group">
              <label>Full Name</label>

              <div class="input-wrapper">
                <ion-icon
                  :icon="personOutline"
                  class="input-icon"
                ></ion-icon>

                <input
                  v-model="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <!-- EMAIL -->
            <div class="form-group">
              <label>Email Address</label>

              <div class="input-wrapper">
                <ion-icon
                  :icon="mailOutline"
                  class="input-icon"
                ></ion-icon>

                <input
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <!-- PASSWORD -->
            <div class="form-group">
              <label>Password</label>

              <div class="input-wrapper">
                <ion-icon
                  :icon="lockClosedOutline"
                  class="input-icon"
                ></ion-icon>

                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password"
                  required
                />

                <button
                  type="button"
                  class="eye-button"
                  @click="showPassword = !showPassword"
                >
                  <ion-icon
                    :icon="showPassword ? eyeOffOutline : eyeOutline"
                  ></ion-icon>
                </button>
              </div>
            </div>

            <!-- CONFIRM PASSWORD -->
            <div class="form-group">
              <label>Confirm Password</label>

              <div class="input-wrapper">
                <ion-icon
                  :icon="lockClosedOutline"
                  class="input-icon"
                ></ion-icon>

                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  class="eye-button"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <ion-icon
                    :icon="showConfirmPassword ? eyeOffOutline : eyeOutline"
                  ></ion-icon>
                </button>
              </div>
            </div>

            <!-- ERROR -->
            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>

            <!-- CREATE ACCOUNT BUTTON -->
            <button type="submit" class="register-button">
              Create Account
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>

          </form>

          <!-- DIVIDER -->
          <div class="divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>

          <!-- LOGIN -->
          <div class="login-section">
            <p>
              Already have an account?
              <router-link to="/login">
                Sign In
              </router-link>
            </p>
          </div>

          <!-- DISCLAIMER -->
          <div class="disclaimer">
            <div class="shield">
              <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
            </div>

            <p>
              MediScan AI provides medicine information for educational
              purposes and does not replace professional medical advice.
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
  IonIcon
} from '@ionic/vue';

import {
  personOutline,
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';

const router = useRouter();

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errorMessage = ref('');

const handleRegister = () => {
  errorMessage.value = '';

  if (
    !fullName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please complete all fields.';
    return;
  }

  if (password.value.length < 6) {
    errorMessage.value =
      'Password must contain at least 6 characters.';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }

  /*
    TEMPORARY REGISTRATION

    Later, this will be connected to our
    database / authentication backend.
  */

  console.log({
    fullName: fullName.value,
    email: email.value
  });

  router.push('/login');
};
</script>

<style scoped>
.register-content {
  --background:
    radial-gradient(
      circle at 10% 10%,
      rgba(21, 190, 145, 0.08),
      transparent 30%
    ),
    #f8fbfa;
}

.register-page {
  min-height: 100%;
  display: flex;
  justify-content: center;
  padding: 45px 20px;
}

.register-container {
  width: 100%;
  max-width: 430px;
}

/* BRAND */

.brand-section {
  text-align: center;
  margin-bottom: 36px;
}

.logo-box {
  width: 76px;
  height: 76px;
  margin: 0 auto 16px;

  border-radius: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(255, 255, 255, 0.85);

  box-shadow:
    0 12px 35px rgba(13, 148, 110, 0.13);
}

/* CAPSULE LOGO */

.capsule {
  width: 45px;
  height: 22px;

  border: 2px solid #0b9b72;

  border-radius: 30px;

  position: relative;

  overflow: hidden;

  transform: rotate(-45deg);

  background: white;
}

.capsule-half {
  position: absolute;

  left: 0;
  top: 0;

  width: 50%;
  height: 100%;

  background: linear-gradient(
    135deg,
    #07956c,
    #22c79a
  );
}

.brand-name {
  margin: 0;

  font-size: 34px;

  font-weight: 800;

  color: #12241f;

  letter-spacing: -1px;
}

.brand-name span {
  color: #0c946d;
}

.brand-tagline {
  margin: 6px 0 0;

  color: #71827d;

  font-size: 14px;
}

/* HEADER */

.register-header {
  margin-bottom: 28px;
}

.register-header h2 {
  margin: 0 0 6px;

  color: #13251f;

  font-size: 29px;

  font-weight: 800;
}

.register-header p {
  margin: 0;

  color: #7a8b86;

  font-size: 15px;
}

/* FORM */

.form-group {
  margin-bottom: 19px;
}

.form-group label {
  display: block;

  margin-bottom: 9px;

  color: #263a34;

  font-size: 14px;

  font-weight: 700;
}

.input-wrapper {
  height: 58px;

  display: flex;
  align-items: center;

  border: 1px solid #d9e3df;

  border-radius: 16px;

  background: rgba(255, 255, 255, 0.9);

  transition: 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #10a77c;

  box-shadow:
    0 0 0 3px rgba(16, 167, 124, 0.08);
}

.input-icon {
  margin-left: 17px;
  margin-right: 13px;

  color: #8ca09a;

  font-size: 21px;
}

.input-wrapper input {
  width: 100%;
  height: 100%;

  border: none;
  outline: none;

  background: transparent;

  color: #182823;

  font-size: 15px;
}

.input-wrapper input::placeholder {
  color: #a2afab;
}

.eye-button {
  width: 50px;
  height: 100%;

  border: none;

  display: flex;
  align-items: center;
  justify-content: center;

  background: transparent;

  cursor: pointer;

  color: #81948e;

  font-size: 21px;
}

/* ERROR */

.error-message {
  margin: -5px 0 15px;

  padding: 10px 13px;

  border-radius: 10px;

  background: #fff1f1;

  color: #d63c3c;

  font-size: 13px;
}

/* BUTTON */

.register-button {
  width: 100%;
  height: 59px;

  margin-top: 8px;

  border: none;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  background: linear-gradient(
    90deg,
    #078a65,
    #17bd8c
  );

  color: white;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  box-shadow:
    0 14px 30px rgba(12, 157, 116, 0.19);

  transition: 0.2s ease;
}

.register-button:hover {
  transform: translateY(-1px);

  box-shadow:
    0 17px 34px rgba(12, 157, 116, 0.25);
}

.register-button:active {
  transform: scale(0.99);
}

/* DIVIDER */

.divider {
  display: flex;
  align-items: center;

  gap: 15px;

  margin: 28px 0 20px;
}

.divider span {
  height: 1px;

  flex: 1;

  background: #dbe4e1;
}

.divider p {
  margin: 0;

  color: #8b9a96;

  font-size: 13px;
}

/* LOGIN */

.login-section {
  text-align: center;
}

.login-section p {
  color: #71817d;

  font-size: 14px;
}

.login-section a {
  margin-left: 4px;

  color: #078962;

  font-weight: 700;

  text-decoration: none;
}

/* DISCLAIMER */

.disclaimer {
  margin-top: 34px;

  padding: 14px 16px;

  display: flex;
  align-items: center;

  gap: 12px;

  border-radius: 16px;

  background: rgba(209, 245, 234, 0.62);
}

.shield {
  min-width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #c4f1e3;

  color: #07946c;

  font-size: 21px;
}

.disclaimer p {
  margin: 0;

  color: #667a74;

  font-size: 11px;

  line-height: 1.45;
}

/* MOBILE */

@media (max-width: 480px) {

  .register-page {
    padding:
      30px 22px
      calc(30px + env(safe-area-inset-bottom));
  }

  .brand-section {
    margin-bottom: 30px;
  }

  .brand-name {
    font-size: 30px;
  }

  .register-header h2 {
    font-size: 27px;
  }

}
</style>