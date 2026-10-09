<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-content">
      <div class="login-container">

        <!-- BRAND -->
        <div class="brand-section">

          <!-- CAPSULE LOGO -->
          <div class="logo">
            <div class="capsule">
              <div class="capsule-half"></div>
            </div>
          </div>

          <h1>
            Medi<span>Scan</span> AI
          </h1>

          <p class="tagline">
            Scan. Identify. Stay Safe.
          </p>

        </div>

        <!-- WELCOME -->
        <div class="welcome-section">
          <h2>Welcome</h2>
          <p>Sign in to continue</p>
        </div>

        <!-- LOGIN FORM -->
        <form @submit.prevent="handleLogin">

          <!-- EMAIL -->
          <div class="input-group">
            <label>Email Address</label>

            <div class="input-wrapper">
              <ion-icon :icon="mailOutline"></ion-icon>

              <input
                v-model="email"
                type="email"
                placeholder="Enter your email"
                autocomplete="email"
                required
              />
            </div>
          </div>

          <!-- PASSWORD -->
          <div class="input-group">
            <label>Password</label>

            <div class="input-wrapper">
              <ion-icon :icon="lockClosedOutline"></ion-icon>

              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="eye-button"
                @click="showPassword = !showPassword"
                aria-label="Show or hide password"
              >
                <ion-icon
                  :icon="showPassword ? eyeOffOutline : eyeOutline"
                ></ion-icon>
              </button>
            </div>
          </div>

          <!-- FORGOT PASSWORD -->
          <div class="forgot-container">
            <button
              type="button"
              class="forgot-button"
              @click="handleForgotPassword"
            >
              Forgot Password?
            </button>
          </div>

          <!-- SIGN IN -->
          <button
            type="submit"
            class="login-button"
          >
            Sign In

            <ion-icon
              :icon="arrowForwardOutline"
            ></ion-icon>
          </button>

        </form>

        <!-- DIVIDER -->
        <div class="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        <!-- REGISTER -->
        <div class="signup-section">

          <p>Don't have an account?</p>

          <button
            type="button"
            class="create-account"
            @click="goToRegister"
          >
            Create Account
          </button>

        </div>

        <!-- DISCLAIMER -->
        <div class="safety-note">

          <div class="shield">
            <ion-icon
              :icon="shieldCheckmarkOutline"
            ></ion-icon>
          </div>

          <p>
            MediScan AI provides medicine information for
            educational purposes and does not replace
            professional medical advice.
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
  alertController
} from '@ionic/vue';

import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline
} from 'ionicons/icons';


const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);


/* =============================
   LOGIN
============================= */

const handleLogin = () => {

  if (!email.value || !password.value) {
    return;
  }

  /*
    TEMPORARY LOGIN

    For now, any email/password will work.
    Later this will be replaced with
    Supabase authentication.
  */

  console.log('Email:', email.value);

  router.push('/tabs/tab1');

};


/* =============================
   REGISTER
============================= */

const goToRegister = () => {

  router.push('/register');

};


/* =============================
   FORGOT PASSWORD
============================= */

const handleForgotPassword = async () => {

  const alert = await alertController.create({

    header: 'Forgot Password',

    message:
      'Password recovery will be available once authentication is connected.',

    buttons: ['OK']

  });

  await alert.present();

};

</script>


<style scoped>

/* ============================= */
/* PAGE */
/* ============================= */

.login-content {

  --background:
    radial-gradient(
      circle at top left,
      #e1f6ef 0%,
      #f6faf9 35%,
      #f4f8f7 100%
    );

}


/* ============================= */
/* CONTAINER */
/* ============================= */

.login-container {

  width: 100%;
  max-width: 430px;

  min-height: 100%;

  margin: 0 auto;

  padding:
    45px
    28px
    30px;

  display: flex;

  flex-direction: column;

  justify-content: center;

}


/* ============================= */
/* BRAND */
/* ============================= */

.brand-section {

  text-align: center;

  margin-bottom: 34px;

}


/* ============================= */
/* LOGO */
/* ============================= */

.logo {

  width: 82px;
  height: 82px;

  margin:
    0 auto
    16px;

  border-radius: 24px;

  display: flex;

  justify-content: center;
  align-items: center;

  background:
    linear-gradient(
      145deg,
      #e5faf3,
      #ffffff
    );

  box-shadow:
    0 10px 30px
    rgba(5, 117, 85, 0.15);

}


/* ============================= */
/* CAPSULE */
/* ============================= */

.capsule {

  width: 30px;
  height: 58px;

  position: relative;

  overflow: hidden;

  border-radius: 20px;

  transform:
    rotate(45deg);

  background: white;

  border:
    2px solid
    #0a9870;

  box-shadow:
    0 5px 12px
    rgba(8, 127, 91, 0.20);

}


/* GREEN HALF */

.capsule-half {

  position: absolute;

  bottom: 0;
  left: 0;

  width: 100%;
  height: 50%;

  background:
    linear-gradient(
      135deg,
      #087f5b,
      #20c997
    );

}


/* CAPSULE DIVIDER */

.capsule::after {

  content: "";

  position: absolute;

  top: 50%;
  left: 0;

  width: 100%;

  height: 2px;

  background:
    #0a9870;

  transform:
    translateY(-50%);

}


/* ============================= */
/* APP NAME */
/* ============================= */

.brand-section h1 {

  margin: 0;

  color:
    #10231e;

  font-size:
    31px;

  font-weight:
    800;

  letter-spacing:
    -1px;

}


.brand-section h1 span {

  color:
    #0a936c;

}


/* ============================= */
/* TAGLINE */
/* ============================= */

.tagline {

  margin:
    7px
    0
    0;

  color:
    #71817c;

  font-size:
    14px;

}


/* ============================= */
/* WELCOME */
/* ============================= */

.welcome-section {

  margin-bottom:
    27px;

}


.welcome-section h2 {

  margin:
    0
    0
    6px;

  font-size:
    27px;

  font-weight:
    800;

  color:
    #172b26;

}


.welcome-section p {

  margin: 0;

  color:
    #83918d;

  font-size:
    14px;

}


/* ============================= */
/* INPUT GROUP */
/* ============================= */

.input-group {

  margin-bottom:
    18px;

}


.input-group label {

  display: block;

  margin-bottom:
    8px;

  color:
    #30433d;

  font-size:
    13px;

  font-weight:
    650;

}


/* ============================= */
/* INPUT */
/* ============================= */

.input-wrapper {

  height:
    55px;

  padding:
    0
    15px;

  display:
    flex;

  align-items:
    center;

  background:
    rgba(
      255,
      255,
      255,
      0.94
    );

  border:
    1.5px solid
    #dce6e2;

  border-radius:
    15px;

  transition:
    0.2s ease;

}


.input-wrapper:focus-within {

  border-color:
    #0a9870;

  box-shadow:
    0 0 0 4px
    rgba(
      10,
      152,
      112,
      0.08
    );

}


.input-wrapper > ion-icon {

  margin-right:
    12px;

  color:
    #91a19c;

  font-size:
    20px;

}


.input-wrapper input {

  flex: 1;

  min-width: 0;

  border: none;

  outline: none;

  background:
    transparent;

  color:
    #172b26;

  font-size:
    14px;

}


.input-wrapper input::placeholder {

  color:
    #a5b1ad;

}


/* ============================= */
/* PASSWORD EYE */
/* ============================= */

.eye-button {

  border:
    none;

  background:
    transparent;

  color:
    #7b8c86;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  padding:
    7px;

  cursor:
    pointer;

}


.eye-button ion-icon {

  font-size:
    21px;

}


/* ============================= */
/* FORGOT PASSWORD */
/* ============================= */

.forgot-container {

  text-align:
    right;

  margin-top:
    -5px;

  margin-bottom:
    22px;

}


.forgot-button {

  border:
    none;

  background:
    transparent;

  color:
    #07855f;

  font-size:
    13px;

  font-weight:
    700;

  cursor:
    pointer;

}


/* ============================= */
/* LOGIN BUTTON */
/* ============================= */

.login-button {

  width:
    100%;

  height:
    55px;

  border:
    none;

  border-radius:
    15px;

  background:
    linear-gradient(
      135deg,
      #087f5b,
      #14b887
    );

  color:
    white;

  font-size:
    15px;

  font-weight:
    750;

  cursor:
    pointer;

  display:
    flex;

  justify-content:
    center;

  align-items:
    center;

  gap:
    9px;

  box-shadow:
    0 10px 24px
    rgba(
      8,
      127,
      91,
      0.20
    );

  transition:
    0.2s ease;

}


.login-button:hover {

  transform:
    translateY(-1px);

  box-shadow:
    0 13px 27px
    rgba(
      8,
      127,
      91,
      0.25
    );

}


.login-button:active {

  transform:
    scale(0.99);

}


.login-button ion-icon {

  font-size:
    19px;

}


/* ============================= */
/* DIVIDER */
/* ============================= */

.divider {

  display:
    flex;

  align-items:
    center;

  gap:
    13px;

  margin:
    28px
    0
    20px;

}


.divider span {

  flex:
    1;

  height:
    1px;

  background:
    #dce5e2;

}


.divider p {

  margin:
    0;

  color:
    #9aa7a3;

  font-size:
    12px;

}


/* ============================= */
/* REGISTER */
/* ============================= */

.signup-section {

  text-align:
    center;

}


.signup-section p {

  display:
    inline;

  margin:
    0;

  color:
    #74817d;

  font-size:
    13px;

}


.create-account {

  margin-left:
    5px;

  padding:
    0;

  border:
    none;

  background:
    transparent;

  color:
    #087f5b;

  font-size:
    13px;

  font-weight:
    750;

  cursor:
    pointer;

}


.create-account:hover {

  color:
    #056f50;

  text-decoration:
    underline;

}


/* ============================= */
/* SAFETY DISCLAIMER */
/* ============================= */

.safety-note {

  margin-top:
    32px;

  padding:
    14px;

  border-radius:
    15px;

  display:
    flex;

  align-items:
    center;

  gap:
    12px;

  background:
    rgba(
      220,
      246,
      237,
      0.65
    );

}


.shield {

  width:
    37px;

  height:
    37px;

  flex-shrink:
    0;

  border-radius:
    50%;

  display:
    flex;

  align-items:
    center;

  justify-content:
    center;

  background:
    #d0f2e6;

}


.shield ion-icon {

  color:
    #078b65;

  font-size:
    21px;

}


.safety-note p {

  margin:
    0;

  color:
    #667771;

  font-size:
    10px;

  line-height:
    1.5;

}


/* ============================= */
/* MOBILE */
/* ============================= */

@media (max-width: 380px) {

  .login-container {

    padding:
      30px
      20px
      24px;

  }

  .brand-section {

    margin-bottom:
      27px;

  }

  .logo {

    width:
      72px;

    height:
      72px;

  }

  .brand-section h1 {

    font-size:
      28px;

  }

}


/* ============================= */
/* DESKTOP */
/* ============================= */

@media (min-width: 900px) {

  .login-container {

    padding-top:
      55px;

    padding-bottom:
      35px;

  }

}

</style>