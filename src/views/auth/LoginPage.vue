<template>
  <ion-page>
    <ion-content :fullscreen="true" class="login-content">
      <div class="login-container">
        <!-- PREMIUM 3D MEDICAL BACKGROUND: decorative only -->
        <div class="medical-art" aria-hidden="true">
          <div class="medical-art__glow medical-art__glow--top"></div>
          <div class="medical-art__glow medical-art__glow--bottom"></div>
          <div class="medical-art__orb medical-art__orb--top"></div>
          <div class="medical-art__orb medical-art__orb--bottom"></div>
          <div class="medical-art__pill medical-art__pill--left"><span></span></div>
          <div class="medical-art__pill medical-art__pill--right"><span></span></div>
          <div class="medical-art__cross"><span></span></div>
        </div>
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
        <div class="medical-login-card">
        <!-- WELCOME -->
        <div class="welcome-section">
          <h2>Welcome Back</h2>
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
          <button
            type="submit"
              :disabled="isSigningIn"
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
          <p>or continue with</p>
          <span></span>
        </div>
        <!-- Visual placeholders only: OAuth providers are not configured. -->
        <div class="social-preview" aria-label="Social sign in not yet available">
          <button type="button" disabled title="Google sign in coming soon" aria-label="Google sign in not available yet">
            <span class="google-g">G</span>
          </button>
          <button type="button" disabled title="Apple sign in coming soon" aria-label="Apple sign in not available yet">
            <span class="apple-mark">●</span>
          </button>
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
import { supabase } from '@/utils/supabase';
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
const isSigningIn = ref(false);
const handleLogin = async () => {
  if (!email.value.trim() || !password.value || isSigningIn.value) return;
  isSigningIn.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value
    });
    if (error) {
      const alert = await alertController.create({
        header: 'Sign In Failed',
        message: error.message,
        buttons: ['OK']
      });
      await alert.present();
      return;
    }
    password.value = '';
    await router.replace('/tabs/tab1');
  } catch (error) {
    console.error('Sign in error:', error);
    const alert = await alertController.create({
      header: 'Connection Error',
      message: 'Unable to sign in right now. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
  } finally {
    isSigningIn.value = false;
  }
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
/* ============================================================
   MEDISCAN AI — PREMIUM 3D VISUAL REDESIGN
   Additive design layer: all original styles and logic retained.
   ============================================================ */
.login-content {
  --background: #effaf7;
}
.login-container {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  max-width: 480px;
  min-height: 100%;
  padding: 48px 30px 35px;
  background:
    radial-gradient(ellipse at 93% 5%, rgba(40, 208, 186, .23), transparent 38%),
    radial-gradient(ellipse at 5% 96%, rgba(0, 168, 128, .18), transparent 40%),
    linear-gradient(155deg, #f9fffe 0%, #edf9f6 55%, #f7fffc 100%);
}
.login-container > :not(.medical-art) {
  position: relative;
  z-index: 1;
}
.medical-art {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.medical-art__glow {
  position: absolute;
  width: 290px;
  height: 290px;
  border-radius: 50%;
  filter: blur(42px);
  opacity: .56;
}
.medical-art__glow--top {
  top: -145px;
  right: -135px;
  background: #77e4d4;
}
.medical-art__glow--bottom {
  bottom: -165px;
  left: -135px;
  background: #9debd7;
}
.medical-art__orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 24%, #ffffff 4%, #e8fffc 19%, #9fe9e0 52%, rgba(3, 147, 127, .22) 76%, rgba(255, 255, 255, .6) 100%);
  border: 1px solid rgba(255, 255, 255, .85);
  box-shadow: inset -12px -14px 22px rgba(0, 117, 109, .16), inset 9px 10px 19px rgba(255, 255, 255, .9), 0 16px 38px rgba(11, 112, 103, .15);
  opacity: .68;
}
.medical-art__orb--top {
  width: 100px;
  height: 100px;
  top: 32px;
  right: -44px;
}
.medical-art__orb--bottom {
  width: 118px;
  height: 118px;
  bottom: -44px;
  left: -54px;
}
.medical-art__pill {
  position: absolute;
  width: 55px;
  height: 105px;
  border-radius: 35px;
  transform: rotate(37deg);
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff, #e5f4f1 55%, #ffffff);
  border: 2px solid rgba(255, 255, 255, .9);
  box-shadow: inset 7px 0 12px rgba(255, 255, 255, .92), inset -8px -4px 15px rgba(2, 90, 81, .16), 9px 16px 24px rgba(0, 104, 90, .18);
  opacity: .82;
}
.medical-art__pill span {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 51%;
  background: linear-gradient(125deg, #00d6ad, #007f71 75%, #005c5b);
  border-top: 2px solid rgba(255, 255, 255, .9);
  box-shadow: inset 8px 0 10px rgba(255, 255, 255, .25);
}
.medical-art__pill--left {
  top: 65px;
  left: -30px;
  transform: rotate(-38deg) scale(.78);
}
.medical-art__pill--right {
  right: -25px;
  bottom: 70px;
  transform: rotate(48deg) scale(.9);
}
.medical-art__cross {
  position: absolute;
  top: 215px;
  right: -18px;
  width: 62px;
  height: 62px;
  transform: rotate(-16deg);
  opacity: .32;
  filter: drop-shadow(4px 9px 6px rgba(0, 105, 95, .2));
}
.medical-art__cross::before,
.medical-art__cross::after {
  content: '';
  position: absolute;
  background: linear-gradient(140deg, #9bf9e4, #009a82);
  border: 1px solid rgba(255, 255, 255, .7);
  border-radius: 7px;
}
.medical-art__cross::before {
  width: 23px;
  height: 62px;
  left: 19px;
}
.medical-art__cross::after {
  width: 62px;
  height: 23px;
  top: 19px;
}
.brand-section {
  margin-bottom: 25px;
}
.logo {
  width: 88px;
  height: 88px;
  border: 1px solid rgba(255, 255, 255, .92);
  background: linear-gradient(145deg, rgba(255, 255, 255, .94), rgba(183, 244, 226, .65));
  box-shadow: 0 12px 28px rgba(0, 122, 103, .15), inset 0 2px 10px rgba(255, 255, 255, .95);
}
.brand-section h1 {
  color: #083c3a;
  letter-spacing: -1.1px;
}
.brand-section h1 span {
  color: #008d79;
}
.tagline {
  color: #4b7c73;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}
.welcome-section,
.login-container form,
.divider,
.signup-section {
  position: relative;
}
.welcome-section {
  margin-bottom: 18px;
  padding: 0 6px;
}
.welcome-section h2 {
  color: #102c35;
}
.input-wrapper {
  background: rgba(255, 255, 255, .95);
  border: 1px solid #dceae6;
  box-shadow: 0 3px 10px rgba(12, 84, 74, .035);
}
.input-wrapper:focus-within {
  border-color: #00a78a;
  box-shadow: 0 0 0 4px rgba(0, 165, 138, .10);
}
.login-button {
  background: linear-gradient(110deg, #00685e, #00ad91 60%, #007b6e);
  box-shadow: 0 10px 25px rgba(0, 125, 106, .25), inset 0 1px 1px rgba(255, 255, 255, .28);
}
.safety-note {
  border: 1px solid rgba(255, 255, 255, .8);
  background: rgba(223, 249, 240, .76);
  backdrop-filter: blur(9px);
}
@media (max-width: 380px) {
  .login-container {
    padding: 32px 20px 26px;
  }
  .medical-art__pill--left {
    left: -42px;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .medical-art__orb--top {
    animation: medFloat 8s ease-in-out infinite;
  }
  .medical-art__pill--right {
    animation: medPillFloat 9s ease-in-out infinite;
  }
}
@keyframes medFloat {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 11px; }
}
@keyframes medPillFloat {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
/* ==============================================================
   EXACT-REFERENCE INSPIRED VISUAL LAYER — ADDITIVE ONLY
   All original script, form controls, navigation and CSS retained.
   Image assets go into public/mediscan/ in the Ionic Vue project.
   ============================================================== */
.login-content {
  --background: #edf9f6;
}
.login-container {
  width: 100%;
  max-width: 480px;
  min-height: 100%;
  padding: 38px 24px 32px;
  justify-content: center;
  background: #f4fcfa url('/mediscan/medical-3d-background.webp') center / cover no-repeat;
}
/* The older CSS-only decorations are replaced visually by actual image artwork. */
.medical-art { display: none; }
.brand-section { margin-bottom: 22px; }
.brand-section .logo {
  width: 94px;
  height: 94px;
  margin-bottom: 12px;
  border: 0;
  border-radius: 30px;
  background: url('/mediscan/medical-3d-cross.png') center / contain no-repeat;
  box-shadow: none;
}
.brand-section .logo .capsule { opacity: 0; }
.brand-section h1 { font-size: 32px; line-height: 1.15; }
.brand-section .tagline { margin-top: 6px; letter-spacing: 2px; font-size: 10px; }
.medical-login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 27px 22px 25px;
  border: 1px solid rgba(255,255,255,.95);
  border-radius: 28px;
  background: rgba(255,255,255,.90);
  box-shadow: 0 24px 64px rgba(11,102,91,.13), inset 0 1px 0 rgba(255,255,255,.98);
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
}
.medical-login-card .welcome-section { margin-bottom: 23px; padding: 0; }
.medical-login-card .welcome-section h2 { font-size: 27px; color: #102b37; }
.medical-login-card .welcome-section p { color: #697e88; }
.medical-login-card .input-wrapper {
  border: 1px solid #dce7e8;
  border-radius: 12px;
  background: rgba(250,253,253,.94);
}
.medical-login-card .login-button {
  border-radius: 14px;
  background: linear-gradient(120deg,#006e64,#009c85 54%,#005d55);
  box-shadow: 0 12px 24px rgba(0,113,99,.22), inset 0 1px 1px rgba(255,255,255,.35);
}
.medical-login-card .divider { margin-top: 22px; }
.medical-login-card .signup-section { margin-bottom: 0; }
.safety-note { margin-top: 22px; background: rgba(248,255,253,.72); }
@media (max-width: 380px) {
  .login-container { padding: 24px 16px; }
  .medical-login-card { padding: 23px 17px; }
  .brand-section .logo { width: 76px; height: 76px; }
  .brand-section h1 { font-size: 28px; }
}
@media (min-width: 900px) {
  .login-container { max-width: 480px; padding: 40px 24px; }
}
/* ==============================================================
   MEDISCAN REFERENCE MATCH — DECORATIVE OVERRIDES ONLY
   No status bar, no text, and no screenshot inside background asset.
   Original Vue script, form controls and navigation remain unchanged.
   ============================================================== */
.login-content { --background: #effaf7; }
.login-container {
  width: 100%; max-width: 430px; min-height: 100%;
  padding: 26px 17px 28px; justify-content: flex-start;
  background: #f5fcfa url('/mediscan/medical-decor-only.webp') center center / cover no-repeat;
}
.brand-section { margin: 0 auto 17px; padding-top: 12px; }
.brand-section .logo { width: 69px; height: 69px; margin: 0 auto 9px; border-radius: 20px; }
.brand-section h1 { font-size: 29px; line-height: 1.16; }
.brand-section .tagline { margin-top: 6px; font-size: 9px; letter-spacing: 2.3px; }
.medical-login-card {
  width: 100%; padding: 29px 24px 23px; border-radius: 30px;
  background: rgba(255,255,255,.95);
  border: 1px solid rgba(255,255,255,.99);
  box-shadow: 0 15px 42px rgba(26,104,95,.11);
}
.medical-login-card .welcome-section { margin-bottom: 20px; }
.medical-login-card .welcome-section h2 { font-size: 26px; }
.medical-login-card .welcome-section p { font-size: 13px; }
.medical-login-card .input-group { margin-bottom: 17px; }
.medical-login-card .input-wrapper { background: #fcfdfd; }
.medical-login-card .login-button {
  background: linear-gradient(110deg,#006b5d 0%,#00a88d 55%,#006658 100%);
  border-radius: 15px;
}
.medical-login-card .divider { margin-top: 19px; margin-bottom: 13px; }
.medical-login-card .divider p { white-space: nowrap; font-size: 11px; }
.social-preview { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 0 0 17px; }
.social-preview button {
  height: 49px; border: 1px solid #dae5e8; border-radius: 12px;
  background: rgba(255,255,255,.94); display: flex; align-items: center;
  justify-content: center; cursor: not-allowed; opacity: .62;
}
.google-g { font: 800 23px Arial,sans-serif; color: #4285f4; }
.apple-mark { font-size: 21px; color: #172d32; }
.medical-login-card .signup-section { margin-top: 4px; }
.safety-note { margin: 19px auto 0; max-width: 100%; }
@media (max-width: 390px) {
  .login-container { padding: 22px 15px 26px; }
  .medical-login-card { padding: 24px 18px 21px; }
  .brand-section .logo { width: 62px; height: 62px; }
}
@media (min-width: 900px) {
  .login-container { max-width: 430px; padding: 26px 17px 28px; }
}
</style>
