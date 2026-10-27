<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
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
