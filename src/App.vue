<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted, onUnmounted } from 'vue';
import { App as CapacitorApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { useRouter } from 'vue-router';
import { supabase } from './utils/supabase';
import type { PluginListenerHandle } from '@capacitor/core';

const router = useRouter();
let deepLinkListener: PluginListenerHandle | undefined;

async function handleNativeAuthCallback(callbackUrl: string) {
  if (!callbackUrl.startsWith('io.ionic.starter://auth/callback')) return;
  try {
    const url = new URL(callbackUrl);
    const fragment = new URLSearchParams(url.hash.slice(1));
    const params = fragment.has('access_token') ? fragment : url.searchParams;
    const oauthError = params.get('error_description') || params.get('error');
    if (oauthError) throw new Error(oauthError);

    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (error) throw error;
    } else {
      const code = params.get('code');
      if (!code) throw new Error('No authentication credentials in the Google callback.');
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
    }
    await Browser.close().catch(() => undefined);
    await router.replace('/tabs/home');
  } catch (error) {
    await Browser.close().catch(() => undefined);
    console.error('Google OAuth callback failed:', error);
    await router.replace('/register');
    // Errors remain in the developer console; the register screen is safe to retry.
  }
}

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) return;
  deepLinkListener = await CapacitorApp.addListener('appUrlOpen', ({ url }) => {
    void handleNativeAuthCallback(url);
  });
  const launch = await CapacitorApp.getLaunchUrl();
  if (launch?.url) await handleNativeAuthCallback(launch.url);
});

onUnmounted(() => { void deepLinkListener?.remove(); });
</script>

<style>
/* Phone-sized preview only on desktop browsers.
   Android/iOS Capacitor apps retain their full screen width. */
@media (min-width: 768px) and (pointer: fine) {
  body:not(.capacitor) ion-app {
    width: min(100%, 430px);
    max-width: 430px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    box-shadow: 0 0 36px rgba(18, 54, 44, 0.12);
  }

  body:not(.capacitor) {
    background: #e9f1ee;
  }
}
</style>
