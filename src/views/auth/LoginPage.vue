<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-content">
      <div class="login-container">
        <!-- BRAND -->

        <div class="brand-section">
          <img
            class="brand-cross"
            src="/mediscan/medical-3d-cross.png"
            alt="MediScan AI medical cross"
          />

          <h1>Medi<span>Scan</span> AI</h1>

          <p class="tagline">Scan. Identify. Stay Safe.</p>
        </div>

        <div class="medical-login-card">
          <div class="glass-decoration" aria-hidden="true">
            <img
              class="card-art"
              src="/mediscan/login-card-decoration.png"
              alt=""
            />

            <span class="glass-plus plus-one">+</span
            ><span class="glass-plus plus-two">+</span
            ><span class="glass-leaf leaf-one"></span
            ><span class="glass-leaf leaf-two"></span>
          </div>

          <!-- WELCOME -->

          <div class="welcome-section">
            <h2>{{ welcomeHeading }}</h2>

            <p>Sign in to your healthcare companion.</p>
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

            <button type="submit" :disabled="isSigningIn" class="login-button">
              <span class="login-button-label">Sign In</span>

              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </form>

          <!-- REGISTER -->

          <div class="signup-section">
            <p>Don't have an account?</p>

            <button type="button" class="create-account" @click="goToRegister">
              Create Account
            </button>
          </div>
        </div>

        <!-- DISCLAIMER -->

        <div class="safety-note">
          <div class="shield">
            <ion-icon :icon="shieldCheckmarkOutline"></ion-icon>
          </div>

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
import { ref, computed } from "vue";

import { useRouter } from "vue-router";

import { supabase } from "@/utils/supabase";

import { IonPage, IonContent, IonIcon, alertController } from "@ionic/vue";

import {
  mailOutline,
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline,
  arrowForwardOutline,
  shieldCheckmarkOutline,
} from "ionicons/icons";

const router = useRouter();

const email = ref("");

const password = ref("");

const showPassword = ref(false);

// This browser remembers successful sign-ins; new visitors see Welcome.

const hasSignedInBefore = ref(
  localStorage.getItem("mediscan_has_signed_in") === "true" ||
    localStorage.getItem("mediscan_email_verified") === "true",
);

const welcomeHeading = computed(() =>
  hasSignedInBefore.value ? "Welcome Back" : "Welcome",
);

/* =============================



   LOGIN



\============================= */

const isSigningIn = ref(false);

const handleLogin = async () => {
  if (!email.value.trim() || !password.value || isSigningIn.value) return;

  isSigningIn.value = true;

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),

      password: password.value,
    });

    if (error) {
      const alert = await alertController.create({
        header: "Sign In Failed",

        message: error.message,

        buttons: ["OK"],
      });

      await alert.present();

      return;
    }

    localStorage.setItem("mediscan_has_signed_in", "true");

    hasSignedInBefore.value = true;

    password.value = "";

    await router.replace("/tabs/tab1");
  } catch (error) {
    console.error("Sign in error:", error);

    const alert = await alertController.create({
      header: "Connection Error",

      message: "Unable to sign in right now. Please try again.",

      buttons: ["OK"],
    });

    await alert.present();
  } finally {
    isSigningIn.value = false;
  }
};

/* =============================



   REGISTER



\============================= */

const goToRegister = () => {
  router.push("/register");
};

/* =============================



   FORGOT PASSWORD



\============================= */

const handleForgotPassword = async () => {
  const alert = await alertController.create({
    header: "Forgot Password",

    message:
      "Password recovery will be available once authentication is connected.",

    buttons: ["OK"],
  });

  await alert.present();
};
</script>

<style scoped>
.login-content {
  --background: #f0faf7;

  --overflow: hidden;

  overflow: hidden;
}

.login-container {
  box-sizing: border-box;

  position: relative;

  isolation: isolate;

  width: 100%;

  max-width: 480px;

  height: 100%;

  min-height: 0;

  margin: auto;

  padding: clamp(8px, 2.3vh, 24px) clamp(14px, 4vw, 24px);

  display: flex;

  flex-direction: column;

  justify-content: center;

  gap: clamp(7px, 1.5vh, 15px);

  overflow: hidden;

  /* Original full portrait artwork, no zoom or cropping. */

  background: #eaf9f5;

  /* The photo sits behind a soft readability layer. */
}

.login-container::before {
  content: "";

  position: absolute;

  inset: 0;

  z-index: 0;

  pointer-events: none;

  background-image: url("/mediscan/mediscan-login-bg.png");

  background-position: center top;

  background-size: 100% auto;

  background-repeat: no-repeat;
}

.login-container > *:not(.medical-art) {
  position: relative;

  z-index: 1;

  flex-shrink: 0;
}

.brand-section {
  text-align: center;

  margin: 0;

  line-height: 1.15;

  /* No white panel over the original medical artwork. */

  padding: 0;

  border-radius: 0;

  background: transparent;
}

.brand-cross {
  display: block;

  width: clamp(66px, 11vh, 106px);

  height: clamp(66px, 11vh, 106px);

  object-fit: cover;

  border-radius: 50%;

  margin: 0 auto 2px;

  mix-blend-mode: normal;
}

.brand-section h1 {
  margin: 0;

  color: #0b3b36;

  font-size: clamp(32px, 4.6vh, 40px);

  font-weight: 850;

  letter-spacing: -1.2px;

  text-shadow: 0 1px 9px rgba(240, 255, 251, 0.85);
}

.brand-section h1 span {
  color: #059777;
}

.tagline {
  margin: 4px 0 0;

  color: #467f74;

  font-size: clamp(10px, 1.7vh, 14px);

  font-weight: 800;

  letter-spacing: clamp(1px, 0.4vw, 2px);

  text-transform: uppercase;

  text-shadow: 0 1px 7px rgba(240, 255, 251, 0.9);
}

/* Frosted Mint Glass: only visual styling; no auth logic changed. */

.medical-login-card {
  width: 100%;

  box-sizing: border-box;

  position: relative;

  isolation: isolate;

  overflow: hidden;

  padding: clamp(14px, 2.5vh, 24px) clamp(17px, 5vw, 25px);

  border: 1px solid rgba(255, 255, 255, 0.82);

  border-radius: clamp(21px, 4vh, 29px);

  background: linear-gradient(
    142deg,
    rgba(247, 255, 253, 0.91) 0%,

    rgba(232, 251, 245, 0.83) 48%,

    rgba(246, 255, 253, 0.9) 100%
  );

  -webkit-backdrop-filter: blur(16px) saturate(125%);

  backdrop-filter: blur(16px) saturate(125%);

  box-shadow:
    0 16px 42px rgba(4, 92, 75, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
}

.medical-login-card > :not(.glass-decoration) {
  position: relative;

  z-index: 1;
}

.glass-decoration {
  position: absolute;

  inset: 0;

  pointer-events: none;

  overflow: hidden;

  z-index: 0;
}

.glass-plus {
  position: absolute;

  font-size: 28px;

  font-weight: 800;

  color: rgba(13, 171, 143, 0.14);

  line-height: 1;
}

.plus-one {
  right: 19px;

  top: 12px;
}

.plus-two {
  right: 57px;

  top: 47px;

  font-size: 17px;
}

.glass-orb {
  position: absolute;

  width: 126px;

  height: 126px;

  right: -78px;

  bottom: -62px;

  border: 1px solid rgba(255, 255, 255, 0.45);

  border-radius: 50%;

  background: radial-gradient(
    circle at 30% 30%,

    rgba(255, 255, 255, 0.35),
    rgba(6, 176, 145, 0.12) 70%,

    transparent
  );
}

.welcome-section {
  margin-bottom: clamp(12px, 1.8vh, 20px);
}

.welcome-section h2 {
  margin: 0 0 3px;

  color: #152e30;

  font-size: clamp(23px, 3.4vh, 29px);

  font-weight: 800;
}

.welcome-section p {
  margin: 0;

  color: #7a8b88;

  font-size: clamp(12px, 1.8vh, 15px);
}

.input-group {
  margin-bottom: clamp(10px, 1.8vh, 16px);
}

.input-group label {
  display: block;

  margin-bottom: 5px;

  color: #324841;

  font-size: clamp(12px, 1.7vh, 14px);

  font-weight: 700;
}

.input-wrapper {
  height: clamp(42px, 6vh, 55px);

  box-sizing: border-box;

  display: flex;

  align-items: center;

  padding: 0 13px;

  gap: 10px;

  border: 1px solid #dce7e4;

  border-radius: 13px;

  background: #fbfdfc;
}

.input-wrapper:focus-within {
  border-color: #00a382;

  box-shadow: 0 0 0 3px #00a38216;
}

.input-wrapper > ion-icon {
  font-size: 20px;

  color: #95a49f;

  flex-shrink: 0;
}

.input-wrapper input {
  width: 100%;

  min-width: 0;

  flex: 1;

  border: 0;

  outline: 0;

  background: transparent;

  color: #18362e;

  font: inherit;

  font-size: clamp(13px, 1.9vh, 16px);
}

.input-wrapper input::placeholder {
  color: #a0aca8;
}

.eye-button {
  display: grid;

  place-items: center;

  padding: 6px;

  border: 0;

  background: transparent;

  color: #879791;
}

.eye-button ion-icon {
  font-size: 20px;
}

.forgot-container {
  text-align: right;

  margin: -2px 0 clamp(10px, 1.7vh, 17px);
}

.forgot-button,
.create-account {
  border: 0;

  padding: 0;

  background: transparent;

  color: #078566;

  font-weight: 750;

  font-size: clamp(12px, 1.7vh, 14px);
}

.login-button {
  width: 100%;

  height: clamp(43px, 6vh, 55px);

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 9px;

  border: 0;

  border-radius: 14px;

  background: linear-gradient(110deg, #006f61, #00aa8c, #006c5f);

  box-shadow: 0 8px 18px #087e682a;

  color: #fff;

  font-size: clamp(14px, 2vh, 17px);

  font-weight: 800;
}

.login-button ion-icon {
  font-size: 19px;
}

.login-button:disabled {
  opacity: 0.7;
}

.divider {
  display: flex;

  align-items: center;

  gap: 10px;

  margin: clamp(11px, 2vh, 19px) 0 clamp(9px, 1.4vh, 14px);
}

.divider span {
  height: 1px;

  background: #dbe8e4;

  flex: 1;
}

.divider p {
  margin: 0;

  color: #9ca9a5;

  font-size: 11px;

  white-space: nowrap;
}

.social-preview {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 10px;
}

.social-preview button {
  height: clamp(38px, 5.4vh, 49px);

  border: 1px solid #e0e9e6;

  border-radius: 12px;

  background: #fff;

  opacity: 0.65;
}

.google-g {
  font: bold 22px Arial;

  color: #4285f4;
}

.apple-mark {
  color: #293a36;

  font-size: 21px;
}

.signup-section {
  display: flex;

  justify-content: center;

  align-items: center;

  gap: 5px;

  margin-top: clamp(11px, 1.8vh, 17px);

  white-space: nowrap;
}

.signup-section p {
  margin: 0;

  color: #7c8985;

  font-size: clamp(11px, 1.7vh, 13px);
}

.safety-note {
  display: flex;

  align-items: center;

  gap: 11px;

  padding: clamp(9px, 1.4vh, 13px);

  border: 1px solid #fff;

  border-radius: 16px;

  background: rgba(246, 255, 251, 0.91);
}

.shield {
  width: 35px;

  height: 35px;

  flex-shrink: 0;

  display: grid;

  place-items: center;

  border-radius: 50%;

  background: #d7f4e9;
}

.shield ion-icon {
  color: #0c9272;

  font-size: 21px;
}

.safety-note p {
  margin: 0;

  color: #637a73;

  font-size: clamp(9px, 1.3vh, 11px);

  line-height: 1.4;
}

@media (max-height: 700px) {
  .login-container {
    gap: 5px;

    padding-top: 5px;

    padding-bottom: 5px;
  }

  .brand-cross {
    width: 48px;

    height: 48px;
  }

  .brand-section h1 {
    font-size: 26px;
  }

  .tagline {
    font-size: 9px;

    margin-top: 2px;
  }

  .medical-login-card {
    padding: 10px 16px;
  }

  .welcome-section {
    margin-bottom: 7px;
  }

  .welcome-section h2 {
    font-size: 21px;
  }

  .welcome-section p {
    font-size: 11px;
  }

  .input-group {
    margin-bottom: 7px;
  }

  .input-wrapper {
    height: 38px;
  }

  .forgot-container {
    margin-bottom: 6px;
  }

  .login-button {
    height: 39px;
  }

  .divider {
    margin: 8px 0;
  }

  .social-preview button {
    height: 34px;
  }

  .signup-section {
    margin-top: 7px;
  }

  .safety-note {
    padding: 6px;
  }

  .shield {
    width: 29px;

    height: 29px;
  }
}

@media (max-width: 350px) {
  .login-container {
    padding-left: 11px;

    padding-right: 11px;
  }

  .medical-login-card {
    padding-left: 13px;

    padding-right: 13px;
  }
}

/* Reference-inspired glass card decorations; no image with baked-in text. */

.medical-login-card::after {
  content: "";

  position: absolute;

  inset: auto -35px -45px auto;

  width: 155px;

  height: 155px;

  background: radial-gradient(circle, rgba(4, 166, 137, 0.18), transparent 72%);

  pointer-events: none;

  z-index: 0;
}

.glass-leaf {
  position: absolute;

  width: 72px;

  height: 34px;

  border-radius: 100% 0 100% 0;

  background: linear-gradient(
    120deg,
    rgba(12, 176, 145, 0.24),
    rgba(12, 176, 145, 0.03)
  );

  transform: rotate(-32deg);
}

.leaf-one {
  right: -10px;

  top: 36px;
}

.leaf-two {
  right: 10px;

  bottom: 7px;

  transform: rotate(40deg);
}

.input-wrapper {
  background: rgba(255, 255, 255, 0.76);

  border-color: rgba(174, 212, 204, 0.72);

  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

.social-preview button {
  background: rgba(255, 255, 255, 0.76);
}

.safety-note {
  background: rgba(246, 255, 252, 0.79);

  -webkit-backdrop-filter: blur(12px);

  backdrop-filter: blur(12px);
}

@media (max-height: 760px) {
  .login-container {
    gap: 7px;

    padding-top: 7px;

    padding-bottom: 7px;
  }

  .brand-cross {
    width: 57px;

    height: 57px;
  }

  .medical-login-card {
    padding-top: 13px;

    padding-bottom: 13px;
  }

  .welcome-section {
    margin-bottom: 9px;
  }

  .input-group {
    margin-bottom: 9px;
  }

  .divider {
    margin-top: 9px;

    margin-bottom: 9px;
  }

  .signup-section {
    margin-top: 9px;
  }
}

/* FINAL REFERENCE PROPORTIONS — form only; background and authentication unchanged. */

@media (min-height: 761px) {
  .medical-login-card {
    padding: clamp(20px, 2.8vh, 29px) clamp(22px, 4vw, 31px);

    border-radius: 30px;
  }

  .welcome-section {
    margin-bottom: clamp(17px, 2.5vh, 23px);
  }

  .welcome-section h2 {
    font-size: clamp(29px, 4vh, 35px);

    letter-spacing: -0.8px;

    margin-bottom: 5px;
  }

  .welcome-section p {
    font-size: clamp(14px, 1.95vh, 16px);
  }

  .input-group {
    margin-bottom: clamp(15px, 2.1vh, 20px);
  }

  .input-group label {
    font-size: 15px;

    margin-bottom: 8px;
  }

  .input-wrapper {
    height: clamp(51px, 6.6vh, 60px);

    border-radius: 15px;

    padding: 0 15px;

    gap: 13px;
  }

  .input-wrapper > ion-icon {
    font-size: 22px;
  }

  .input-wrapper input {
    font-size: 16px;
  }

  .eye-button ion-icon {
    font-size: 22px;
  }

  .forgot-container {
    margin: 0 0 clamp(15px, 2vh, 20px);
  }

  .forgot-button,
  .create-account {
    font-size: 14px;
  }

  .login-button {
    height: clamp(51px, 6.8vh, 60px);

    font-size: 18px;

    border-radius: 15px;
  }

  .divider {
    margin: clamp(16px, 2.1vh, 22px) 0 clamp(12px, 1.7vh, 17px);
  }

  .divider p {
    font-size: 13px;
  }

  .social-preview {
    gap: 13px;
  }

  .social-preview button {
    height: clamp(45px, 6vh, 54px);

    border-radius: 14px;
  }

  .signup-section {
    margin-top: clamp(15px, 2vh, 21px);

    gap: 6px;
  }

  .signup-section p {
    font-size: 14px;
  }
}

@media (max-width: 390px) {
  .medical-login-card {
    padding-left: 17px;

    padding-right: 17px;
  }

  .welcome-section h2 {
    font-size: 27px;
  }

  .input-wrapper {
    padding-left: 11px;

    padding-right: 11px;
  }

  .signup-section p {
    font-size: 12px;
  }
}

/* REFERENCE MATCH: preserve full-height background and keep controls usable. */

.login-content {
  --overflow: auto;

  overflow: auto;
}

.login-container {
  width: 100%;

  max-width: 480px;

  height: auto;

  min-height: 100%;

  padding: 25px 22px 24px;

  justify-content: flex-start;

  gap: 17px;

  overflow: visible;
}

.login-container::before {
  background-size: 100% auto;

  background-position: center top;
}

.brand-section {
  padding: 0;

  margin-top: 8px;
}

.brand-cross {
  width: 80px;

  height: 80px;
}

.brand-section h1 {
  font-size: 38px;
}

.tagline {
  font-size: 12px;

  letter-spacing: 2px;
}

.medical-login-card {
  padding: 29px 28px 30px;

  border-radius: 31px;

  background: linear-gradient(
    135deg,
    rgba(248, 255, 253, 0.88) 0%,

    rgba(226, 250, 244, 0.87) 53%,

    rgba(236, 255, 251, 0.88) 100%
  );

  box-shadow:
    0 17px 36px rgba(3, 89, 73, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);

  border: 1.5px solid rgba(255, 255, 255, 0.86);

  -webkit-backdrop-filter: blur(14px);

  backdrop-filter: blur(14px);
}

.card-art {
  position: absolute;

  top: 5px;

  right: -1px;

  width: 142px;

  height: 142px;

  object-fit: contain;

  opacity: 0.88;
}

.glass-plus,
.glass-leaf {
  display: none;
}

.welcome-section {
  margin-bottom: 25px;

  padding-right: 30px;
}

.welcome-section h2 {
  font-size: 34px;

  letter-spacing: -0.9px;

  line-height: 1.12;

  margin-bottom: 9px;
}

.welcome-section p {
  font-size: 15px;

  line-height: 1.35;
}

.input-group {
  margin-bottom: 21px;
}

.input-group label {
  font-size: 15px;

  margin-bottom: 9px;

  font-weight: 800;
}

.input-wrapper {
  height: 58px;

  border-radius: 17px;

  padding: 0 16px;

  gap: 15px;

  border: 1.5px solid rgba(175, 211, 205, 0.8);

  background: rgba(255, 255, 255, 0.8);
}

.input-wrapper > ion-icon {
  font-size: 24px;

  color: #678a86;
}

.input-wrapper input {
  font-size: 16px;

  color: #213e3d;
}

.eye-button ion-icon {
  font-size: 24px;
}

.forgot-container {
  margin: 0 0 23px;
}

.forgot-button,
.create-account {
  font-size: 15px;

  color: #008f78;
}

.login-button {
  height: 60px;

  border-radius: 18px;

  font-size: 20px;

  gap: 16px;

  background: linear-gradient(110deg, #00665b 0%, #00a98e 64%, #008b78 100%);

  box-shadow: 0 10px 24px rgba(0, 114, 95, 0.2);
}

.login-button ion-icon {
  font-size: 24px;
}

.divider {
  margin: 23px 0 19px;
}

.divider p {
  font-size: 13px;

  color: #718c8a;
}

.divider span {
  background: rgba(102, 163, 153, 0.34);
}

.social-preview {
  gap: 14px;
}

.social-preview button {
  height: 56px;

  opacity: 1;

  border-radius: 17px;

  border: 1.5px solid rgba(180, 214, 209, 0.85);

  background: rgba(255, 255, 255, 0.72);

  cursor: not-allowed;
}

.provider-logo {
  display: block;

  width: 27px;

  height: 27px;

  margin: auto;
}

.apple-logo {
  width: 29px;

  height: 29px;
}

.signup-section {
  margin-top: 23px;

  gap: 7px;
}

.signup-section p {
  font-size: 14px;
}

.safety-note {
  padding: 15px;

  border-radius: 19px;

  background: rgba(247, 255, 253, 0.84);
}

.safety-note p {
  font-size: 11px;
}

.shield {
  width: 43px;

  height: 43px;
}

.shield ion-icon {
  font-size: 25px;
}

/* Keep the reference proportions on laptop screens; allow scrolling instead of squashing. */

@media (max-height: 900px) {
  .login-container {
    padding-top: 17px;

    gap: 12px;
  }

  .brand-section {
    margin-top: 0;
  }

  .brand-cross {
    width: 59px;

    height: 59px;
  }

  .brand-section h1 {
    font-size: 34px;
  }

  .tagline {
    font-size: 11px;
  }

  .medical-login-card {
    padding: 23px 26px 24px;
  }

  .welcome-section {
    margin-bottom: 18px;
  }

  .welcome-section h2 {
    font-size: 30px;
  }

  .input-group {
    margin-bottom: 16px;
  }

  .input-wrapper {
    height: 53px;
  }

  .forgot-container {
    margin-bottom: 17px;
  }

  .login-button {
    height: 55px;
  }

  .divider {
    margin: 16px 0 13px;
  }

  .social-preview button {
    height: 49px;
  }

  .signup-section {
    margin-top: 16px;
  }

  .safety-note {
    padding: 11px;
  }
}

@media (max-width: 390px) {
  .login-container {
    padding-left: 12px;

    padding-right: 12px;
  }

  .medical-login-card {
    padding: 23px 19px 25px;
  }

  .welcome-section h2 {
    font-size: 29px;
  }

  .welcome-section p {
    font-size: 13px;
  }

  .input-wrapper {
    padding: 0 12px;
  }

  .input-wrapper input {
    font-size: 14px;
  }

  .signup-section p {
    font-size: 12px;
  }

  .create-account {
    font-size: 13px;
  }
}

/* Image-backed Sign In button: real text stays clickable and accessible. */

.login-button {
  position: relative;

  overflow: hidden;

  isolation: isolate;

  background: #007b6e url("/mediscan/mediscan-signin-leaf.png") center / 100%
    100% no-repeat !important;

  border-radius: 18px;

  box-shadow: 0 9px 22px rgba(0, 104, 90, 0.22);
}

.login-button-label,
.login-button > ion-icon {
  position: relative;

  z-index: 2;

  color: #fff;
}

.login-button::before,
.login-button::after {
  content: none !important;
}

.login-button:active {
  transform: translateY(1px);
}

/* Slightly larger MediScan AI brand and smaller Welcome / Welcome Back. */
.brand-section h1 {
  font-size: clamp(39px, 5vh, 45px);
}
.welcome-section h2 {
  font-size: clamp(24px, 3.1vh, 28px);
}
@media (max-height: 900px) {
  .brand-section h1 {
    font-size: 39px;
  }
  .welcome-section h2 {
    font-size: 27px;
  }
}
@media (max-width: 390px) {
  .brand-section h1 {
    font-size: 37px;
  }
  .welcome-section h2 {
    font-size: 25px;
  }
}
</style>
