import { createRouter, createWebHashHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/splash' },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('../views/SplashPage.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/auth/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/RegisterPage.vue')
  },
  {
    path: '/auth/confirm',
    name: 'AuthConfirm',
    component: () => import('../views/AuthConfirmPage.vue')
  },
  {
    path: '/scan-prescription',
    name: 'ScanPrescription',
    component: () => import('../views/ScanPrescriptionPage.vue')
  },
  {
    path: '/prescription-result',
    name: 'PrescriptionResult',
    component: () => import('../views/PrescriptionResultPage.vue')
  },
  {
    path: '/prescription/:id',
    name: 'PrescriptionDetails',
    component: () => import('../views/PrescriptionDetailsPage.vue')
  },
  {
    path: '/identify-medicine',
    name: 'IdentifyMedicine',
    component: () => import('../views/IdentifyMedicinePage.vue')
  },
  {
    path: '/medicine-identification-result',
    name: 'MedicineIdentificationResult',
    component: () => import('../views/MedicineIdentificationResultPage.vue')
  },
  {
    path: '/medicine/:id',
    name: 'MedicineDetails',
    component: () => import('../views/MedicineDetailsPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/tabs/home' },
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/HomePage.vue')
      },
      {
        path: 'medicine',
        name: 'Medicine',
        component: () => import('../views/MedicinePage.vue')
      },
      {
        path: 'pharmacy',
        name: 'Pharmacy',
        component: () => import('../views/PharmacyPage.vue')
      },
      {
        path: 'prescriptions',
        name: 'Prescriptions',
        component: () => import('../views/PrescriptionsPage.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue')
      }
    ]
  },
  { path: '/tabs/tab1', redirect: '/tabs/home' },
  { path: '/tabs/tab2', redirect: '/tabs/medicine' },
  { path: '/tabs/tab3', redirect: '/tabs/prescriptions' },
  { path: '/tabs/tab4', redirect: '/tabs/profile' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
