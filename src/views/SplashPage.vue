<template>
  <ion-page>
    <ion-content :fullscreen="true" :scroll-y="false" class="splash-content">
      <div class="splash-screen">
        <img
          class="splash-image"
          src="/mediscan/mediscan-splash.png"
          alt="MediScan AI Splash"
        />

        <div class="loading-track" role="progressbar" aria-label="Loading MediScan AI">
          <div class="loading-progress"></div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted } from 'vue';

const router = useRouter();
let splashTimer: ReturnType<typeof setTimeout> | undefined;
let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  splashTimer = setTimeout(() => {
    // Keep the existing Ionic/Vue navigation. If it fails, use a full
    // navigation as a fallback instead of leaving the user on the splash.
    void router.replace('/login').catch((error) => {
      console.error('Splash router navigation failed:', error);
      window.location.replace('/login');
    });

    // A navigation can also remain pending without throwing an error.
    fallbackTimer = setTimeout(() => {
      if (router.currentRoute.value.path === '/splash') {
        console.warn('Splash navigation did not finish; trying direct navigation.');
        window.location.replace('/login');
      }
    }, 2000);
  }, 3000);
});

onUnmounted(() => {
  if (splashTimer !== undefined) clearTimeout(splashTimer);
  if (fallbackTimer !== undefined) clearTimeout(fallbackTimer);
});
</script>

<style scoped>
.splash-content {
  --background: #e9f9f5;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 0;
  --padding-end: 0;
}

.splash-screen {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #e9f9f5;
}

.splash-image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.loading-track {
  position: absolute;
  top: 69.56%;
  left: 27.87%;
  width: 44.26%;
  height: 1.5%;
  border-radius: 999px;
  background: #bce3de;
  overflow: hidden;
}

.loading-progress {
  width: 0;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #006c60, #05c6a6);
  animation: splash-load 3s linear forwards;
}

@keyframes splash-load {
  from { width: 0; }
  to { width: 100%; }
}
</style>
