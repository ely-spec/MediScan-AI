<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom" class="mediscan-tab-bar">
        <ion-tab-button tab="home" href="/tabs/home"><ion-icon :icon="homeOutline" /><ion-label>Home</ion-label></ion-tab-button>
        <ion-tab-button tab="medicine" href="/tabs/medicine"><ion-icon :icon="medicalOutline" /><ion-label>Medicine</ion-label></ion-tab-button>
        <ion-tab-button tab="pharmacy" href="/tabs/pharmacy"><ion-icon :icon="locationOutline" /><ion-label>Pharmacy</ion-label></ion-tab-button>
        <ion-tab-button tab="prescriptions" href="/tabs/prescriptions"><ion-icon :icon="documentTextOutline" /><ion-label>Prescriptions</ion-label></ion-tab-button>
        <ion-tab-button tab="profile" href="/tabs/profile"><ion-icon :icon="personOutline" /><ion-label>Profile</ion-label></ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue';
import { homeOutline, medicalOutline, locationOutline, documentTextOutline, personOutline } from 'ionicons/icons';
</script>
<style scoped>
.mediscan-tab-bar {
  --background: #fff;
  height: 70px; min-height: 70px;
  border-top: 1px solid #e7efec;
  box-shadow: 0 -4px 16px rgba(20,60,50,.05);
  padding-top: 5px; padding-bottom: env(safe-area-inset-bottom);
}
ion-tab-button {
  --color: #8b9995; --color-selected: #07966e;
  --background: transparent; --background-focused: transparent;
  --ripple-color: rgba(7,150,110,.12);
  position: relative; min-width: 0;
  font-family: 'Poppins', sans-serif; font-weight: 600;
}
ion-tab-button ion-icon { font-size: 23px; margin-bottom: 3px; }
ion-tab-button ion-label { font-family: 'Poppins', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: -.2px; white-space: nowrap; }
ion-tab-button.tab-selected { --color: #07966e; }
/* Ionic centers tab-button content in shadow DOM; this line is centered relative to each tab button. */
ion-tab-button.tab-selected::before {
  content: ''; position: absolute; top: 0; left: 50%;
  transform: translateX(-50%); width: 25px; height: 3px;
  border-radius: 0 0 5px 5px; background: #07966e;
  pointer-events: none;
}
@media (max-width: 380px) {
  .mediscan-tab-bar { height: 68px; min-height: 68px; }
  ion-tab-button ion-icon { font-size: 21px; }
  ion-tab-button ion-label { font-size: 11px; letter-spacing: -.3px; }
}
</style>
