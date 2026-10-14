<template>
  <ion-page>
    <ion-content :fullscreen="true" class="splash-content" :scroll-y="false">
      <div class="splash-screen">
        <div class="splash-art">
          <img
            class="splash-image"
            src="/mediscan/mediscan-splash.png"
            alt="MediScan AI splash screen"
          />
          <!-- Positioned directly on top of the bar printed in the image. -->
          <div class="loading-track" role="progressbar" aria-label="Loading MediScan AI">
            <div class="loading-progress"></div>
          </div>
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
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  timer = setTimeout(() => {
    router.replace('/login');
  }, 5000);
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.splash-content {
  --background: #e9f9f5;
}

.splash-screen {
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.splash-art {
  position: relative;
  width: min(100%, calc(100dvh * 940 / 1672));
  max-height: 100%;
  aspect-ratio: 940 / 1672;
  flex: none;
}

.splash-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Match the original progress bar printed on the 940 x 1672 PNG.
   This covers its static fill and animates in exactly the same place. */
.loading-track {
  position: absolute;
  top: 69.56%;
  left: 27.87%;
  width: 44.26%;
  height: 1.50%;
  border-radius: 999px;
  background: #bce3de;
  overflow: hidden;
}

.loading-progress {
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #006c60, #05c6a6);
  animation: splash-load 5s linear forwards;
}

@keyframes splash-load {
  to { width: 100%; }
}
</style>
