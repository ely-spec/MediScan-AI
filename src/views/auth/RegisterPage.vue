<template>
  <ion-page>
    <ion-content :fullscreen="true" class="register-content">
      <div class="register-page">
        <div class="register-container">
          <!-- Design-only navigation: existing login route remains unchanged -->
          <router-link to="/login" class="design-back" aria-label="Back to Sign In">
            <span aria-hidden="true">‹</span>
          </router-link>
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
            <p>Start your journey to safer medication with MediScan AI.</p>
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
            <!-- Visual password guidance; original validation remains unchanged -->
            <div class="password-guidance" aria-label="Password requirements">
              <div class="strength-track">
                <span :class="{ filled: password.length >= 6 }"></span>
                <span :class="{ filled: /[A-Za-z]/.test(password) && /[0-9]/.test(password) }"></span>
                <span :class="{ filled: password.length >= 8 }"></span>
              </div>
              <p :class="{ satisfied: password.length >= 6 }">✓ At least 6 characters</p>
              <p :class="{ satisfied: /[A-Za-z]/.test(password) && /[0-9]/.test(password) }">✓ Include letters and numbers</p>
              <p :class="{ satisfied: password.length >= 8 }">✓ Use a strong password (8+ characters)</p>
            </div>
            <!-- ERROR -->
            <p v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </p>
            <!-- SUCCESS -->
            <p v-if="successMessage" class="success-message" role="status">
              {{ successMessage }}
            </p>
            <!-- CREATE ACCOUNT BUTTON -->
            <button type="submit" class="register-button" :disabled="isLoading">
              {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              <ion-icon :icon="arrowForwardOutline"></ion-icon>
            </button>
          </form>
          <!-- DIVIDER -->
          <div class="divider">
            <span></span>
            <p>or</p>
            <span></span>
          </div>
          <!-- SOCIAL SIGN UP -->
          <div class="social-auth-buttons">
            <button type="button" class="social-auth-button" :disabled="isGoogleLoading || isLoading" @click="handleGoogleSignUp">
              <svg class="google-mark" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.28 5.48-4.83 7.18l7.73 6C44.36 38.03 46.98 31.88 46.98 24.55z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.86 23.86 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              {{ isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google' }}
            </button>
            <button type="button" class="social-auth-button apple-button" disabled title="Apple sign-in is not configured yet">
              <svg viewBox="0 0 24 24" aria-hidden="true" class="apple-mark"><path fill="currentColor" d="M17.05 12.54c.02 2.18 1.91 2.91 1.93 2.92-.02.05-.3 1.05-.99 2.08-.6.89-1.22 1.77-2.2 1.79-.96.02-1.27-.58-2.37-.58-1.1 0-1.45.56-2.36.6-.95.03-1.67-.96-2.27-1.85-1.23-1.78-2.17-5.04-.91-7.24a3.51 3.51 0 0 1 2.96-1.8c.92-.02 1.79.63 2.36.63.57 0 1.64-.78 2.76-.66.47.02 1.79.19 2.64 1.43-.07.05-1.58.92-1.55 2.68zM15.23 6.82c.5-.6.83-1.43.74-2.26-.72.03-1.59.48-2.1 1.08-.46.53-.86 1.37-.75 2.18.8.06 1.62-.41 2.11-1z"/></svg>
              Continue with Apple
            </button>
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
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { useRouter } from 'vue-router';
import { supabase } from '../../utils/supabase';
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
const successMessage = ref('');
const isLoading = ref(false);
const isGoogleLoading = ref(false);

const handleGoogleSignUp = async () => {
  if (isGoogleLoading.value || isLoading.value) return;
  errorMessage.value = '';
  successMessage.value = '';
  isGoogleLoading.value = true;
  try {
    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative
      ? 'io.ionic.starter://auth/callback'
      : `${window.location.origin}${window.location.pathname}?flow=google#/auth/confirm`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: isNative },
    });
    if (error) throw error;
    if (isNative) {
      if (!data.url) throw new Error('Google authorization URL is missing.');
      await Browser.open({ url: data.url, windowName: '_self' });
    }
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
  } finally {
    isGoogleLoading.value = false;
  }
};
const handleRegister = async () => {
  if (isLoading.value) return;
  errorMessage.value = '';
  successMessage.value = '';
  const name = fullName.value.trim();
  const userEmail = email.value.trim().toLowerCase();
  if (!name || !userEmail || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please complete all fields.';
    return;
  }
  if (password.value.length < 6) {
    errorMessage.value = 'Password must contain at least 6 characters.';
    return;
  }
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  isLoading.value = true;
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userEmail,
      password: password.value,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    });
    if (error) {
      errorMessage.value = error.message;
      return;
    }
    // Email confirmation is enabled in this project's Supabase settings.
    if (data.user && !data.session) {
      successMessage.value =
        'Account created! Check your email and click the verification link. After verification, you will return to Sign In. Check your spam folder if needed.';
      password.value = '';
      confirmPassword.value = '';
      return;
    }
    if (data.session) {
      // Handles a future configuration where confirmation is disabled.
      await router.replace('/tabs/home');
      return;
    }
    successMessage.value =
      'If registration is available for this address, check your email for confirmation instructions.';
  } catch (err) {
    errorMessage.value =
      err instanceof Error ? err.message : 'Registration failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
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
.success-message {
  margin: 0 0 15px;
  padding: 12px 13px;
  border-radius: 10px;
  background: #e5f8ef;
  color: #086b4e;
  font-size: 13px;
  line-height: 1.5;
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
.register-button:disabled {
  opacity: 0.7;
  cursor: wait;
}
.register-button:hover:not(:disabled) {
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
/* ============================================================
   MediScan AI — 3D Register Visual Layer
   Original styles and Supabase registration logic retained.
   Shared decorative artwork has NO fake phone status bar.
   ============================================================ */
.register-content {
  --background: #effaf7;
}
.register-page {
  position: relative;
  isolation: isolate;
  min-height: 100%;
  padding: 40px 20px 46px;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(250,255,254,.13), rgba(229,249,244,.32)),
    url('/mediscan/medical-decor-only.webp') center center / cover no-repeat;
}
.register-page::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(ellipse at 50% 44%, rgba(255,255,255,.65), transparent 65%);
  pointer-events: none;
}
.register-container {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 26px 28px 24px;
  border: 1px solid rgba(255,255,255,.86);
  border-radius: 30px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 20px 65px rgba(12,93,77,.12), inset 0 1px rgba(255,255,255,.95);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
}
.design-back {
  width: 37px;
  height: 37px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0 16px;
  border-radius: 50%;
  background: rgba(218,247,239,.96);
  color: #075f53;
  font-size: 31px;
  line-height: 1;
  text-decoration: none;
}
.design-back:focus-visible { outline: 3px solid #008e78; outline-offset: 3px; }
/* Original logo markup stays in the file. Register reference has a back-arrow header instead. */
.brand-section { display: none; }
.register-header { margin-bottom: 20px; }
.register-header h2 {
  font-size: 29px;
  font-weight: 800;
  letter-spacing: -.7px;
  color: #142d39;
}
.register-header p {
  max-width: 300px;
  font-size: 13px;
  line-height: 1.55;
  color: #647b88;
}
.form-group { margin-bottom: 15px; }
.form-group label { margin-bottom: 7px; font-size: 12px; color: #263a48; }
.input-wrapper {
  height: 49px;
  border-radius: 12px;
  background: rgba(255,255,255,.92);
  border-color: #e1e9eb;
}
.input-icon { font-size: 17px; margin-left: 14px; margin-right: 10px; color: #4f7180; }
.input-wrapper input { font-size: 13px; min-width: 0; }
.eye-button { width: 43px; font-size: 18px; }
.password-guidance { margin: 3px 0 17px; }
.strength-track { display: flex; gap: 5px; margin: 0 0 9px; }
.strength-track span {
  height: 4px;
  flex: 1;
  border-radius: 20px;
  background: #e3e9e9;
}
.strength-track span.filled { background: linear-gradient(90deg,#00765f,#17bfa1); }
.password-guidance p {
  margin: 4px 0;
  color: #8a9da2;
  font-size: 11px;
  line-height: 1.35;
}
.password-guidance p.satisfied { color: #078568; }
.register-button {
  height: 52px;
  margin-top: 5px;
  border-radius: 14px;
  background: linear-gradient(105deg,#00594e 0%,#007c6d 55%,#00a98e 100%);
  box-shadow: 0 12px 23px rgba(0,110,91,.20), inset 0 1px rgba(255,255,255,.2);
}
.divider { display: flex; margin: 19px 0 14px; }
.social-auth-buttons { display: grid; grid-template-columns: 1fr; gap: 10px; }
.social-auth-button {
  width: 100%; min-height: 48px; display: flex; align-items: center;
  justify-content: center; gap: 11px; border-radius: 13px;
  border: 1px solid #cbded9; background: rgba(255,255,255,.94);
  color: #18342d; font: 600 13px 'Poppins', sans-serif;
  cursor: pointer;
}
.social-auth-button:disabled { opacity: .58; cursor: not-allowed; }
.google-mark, .apple-mark { width: 20px; height: 20px; flex: 0 0 20px; }
.apple-button { background: rgba(247,250,249,.92); }
.login-section { margin-top: 17px; }
.login-section p { font-size: 12px; }
.disclaimer {
  margin-top: 20px;
  background: rgba(228,248,242,.65);
  border: 1px solid rgba(255,255,255,.8);
}
@media (max-width: 480px) {
  .register-page {
    padding: 22px 15px calc(22px + env(safe-area-inset-bottom));
    align-items: flex-start;
  }
  .register-container { padding: 19px 19px 18px; border-radius: 26px; }
  .register-header h2 { font-size: 25px; }
  .form-group { margin-bottom: 13px; }
  .input-wrapper { height: 47px; }
}
@media (prefers-reduced-motion: reduce) {
  .register-button { transition: none; }
}
</style>