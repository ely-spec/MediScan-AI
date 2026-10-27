<template>
  <ion-page>
    <ion-content :fullscreen="true" class="confirm-content">
      <div class="confirm-panel">
        <div class="cross">✚</div>
        <h1>Medi<span>Scan</span> AI</h1>
        <h2>{{ heading }}</h2>
        <p>{{ message }}</p>
        <button v-if="finished" @click="router.replace('/login')">Go to Sign In →</button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent } from '@ionic/vue';
import { supabase } from '@/utils/supabase';

const router = useRouter();
const heading = ref('Verifying your email...');
const message = ref('Please wait while we confirm your MediScan AI account.');
const finished = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | undefined;

onMounted(async () => {
  const url = new URL(window.location.href);
  // In a hash-history Vue app, Supabase can append query values either
  // before or after #/auth/confirm. Read both locations.
  const hashQuery = url.hash.includes('?') ? url.hash.slice(url.hash.indexOf('?') + 1) : '';
  const hashParams = new URLSearchParams(hashQuery);
  const getParam = (key: string) => url.searchParams.get(key) ?? hashParams.get(key);
  const googleFlow = getParam('flow') === 'google';
  const errorDescription = getParam('error_description');

  if (errorDescription) {
    heading.value = googleFlow ? 'Google sign-in error' : 'Verification link error';
    message.value = errorDescription.replace(/\+/g, ' ');
    finished.value = true;
    return;
  }

  try {
    const tokenHash = getParam('token_hash');
    const type = getParam('type');
    const code = getParam('code');
    const hasImplicitToken = window.location.hash.includes('access_token=');

    if (!googleFlow && !tokenHash && !code && !hasImplicitToken) {
      throw new Error('No verification link was found. Please open the link from your email.');
    }

    heading.value = googleFlow ? 'Signing in with Google...' : 'Verifying your email...';
    message.value = googleFlow
      ? 'Please wait while we securely sign you in.'
      : 'Please wait while we confirm your MediScan AI account.';

    if (tokenHash && type === 'signup') {
      const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'signup' });
      if (error) throw error;
    } else if (code) {
      // The Supabase client may already have consumed the OAuth PKCE code.
      const existingSession = (await supabase.auth.getSession()).data.session;
      if (!existingSession) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
      }
    }

    let session = (await supabase.auth.getSession()).data.session;
    for (let attempt = 0; !session && attempt < 10; attempt++) {
      await new Promise<void>((resolve) => {
        timeoutId = setTimeout(resolve, 500);
      });
      session = (await supabase.auth.getSession()).data.session;
    }

    if (!session?.user) {
      throw new Error('No active authentication session was found. Please try again.');
    }

    if (googleFlow) {
      // Google OAuth is a sign-in. Do NOT sign out the authenticated user.
      heading.value = 'Google sign-in successful!';
      message.value = 'Welcome to MediScan AI. Redirecting to Home...';
      await router.replace('/tabs/home');
      return;
    }

    if (!session.user.email_confirmed_at) {
      throw new Error('We could not confirm this link. Please try the verification link in your email again.');
    }

    localStorage.setItem('mediscan_email_verified', 'true');
    // Preserve existing email-verification behavior: require a fresh sign-in.
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    heading.value = 'Email verified!';
    message.value = 'Your account is confirmed. You can now sign in to MediScan AI.';
    finished.value = true;
    await router.replace('/login');
  } catch (error) {
    heading.value = googleFlow ? 'Unable to sign in with Google' : 'Unable to verify email';
    message.value = error instanceof Error ? error.message : 'Please try again.';
    finished.value = true;
  }
});

onUnmounted(() => { if (timeoutId) clearTimeout(timeoutId); });
</script>

<style scoped>
.confirm-content { --background: #eaf9f5; }
.confirm-panel { max-width: 420px; margin: min(18vh, 150px) auto 0; padding: 36px 26px; text-align: center; border: 1px solid #fff; border-radius: 28px; background: rgba(255,255,255,.85); box-shadow: 0 20px 55px #086e5720; }
.cross { font-size: 72px; color: #00a78a; text-shadow: 0 4px 24px #00a78a66; }
h1 { margin: 5px 0 30px; color: #0c3934; font-size: 30px; } h1 span { color: #00a78a; }
h2 { color: #133e37; font-size: 23px; } p { color: #5e8178; line-height: 1.6; }
button { margin-top: 20px; padding: 14px 25px; border: 0; border-radius: 14px; color: #fff; font-weight: 750; background: linear-gradient(110deg,#006f61,#00a98e); }
</style>
