
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import TabsPage from '../views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },

  // AUTH
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

  // SCAN PRESCRIPTION
  {
    path: '/scan-prescription',
    name: 'ScanPrescription',
    component: () => import('../views/ScanPrescriptionPage.vue')
  },

  // PRESCRIPTION RESULT
  {
    path: '/prescription-result',
    name: 'PrescriptionResult',
    component: () => import('../views/PrescriptionResultPage.vue')
  },

  // PRESCRIPTION DETAILS
  {
    path: '/prescription/:id',
    name: 'PrescriptionDetails',
    component: () => import('../views/PrescriptionDetailsPage.vue')
  },

  // IDENTIFY MEDICINE
  {
    path: '/identify-medicine',
    name: 'IdentifyMedicine',
    component: () => import('../views/IdentifyMedicinePage.vue')
  },

  // MEDICINE IDENTIFICATION RESULT
  {
    path: '/medicine-identification-result',
    name: 'MedicineIdentificationResult',
    component: () => import('../views/MedicineIdentificationResultPage.vue')
  },

  // MEDICINE DETAILS
  {
    path: '/medicine/:id',
    name: 'MedicineDetails',
    component: () => import('../views/MedicineDetailsPage.vue')
  },

  // MAIN APP TABS
  {
    path: '/tabs/',
    component: TabsPage,

    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },

      // HOME
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/HomePage.vue')
      },

      // MEDICINE
      {
        path: 'medicine',
        name: 'Medicine',
        component: () => import('../views/MedicinePage.vue')
      },

      // PHARMACY - NEW
      {
        path: 'pharmacy',
        name: 'Pharmacy',
        component: () => import('../views/PharmacyPage.vue')
      },

      // PRESCRIPTIONS
      {
        path: 'prescriptions',
        name: 'Prescriptions',
        component: () => import('../views/PrescriptionsPage.vue')
      },

      // PROFILE
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/ProfilePage.vue')
      }
    ]
  },

  // OLD ROUTES - KEEP FOR COMPATIBILITY
  {
    path: '/tabs/tab1',
    redirect: '/tabs/home'
  },

  {
    path: '/tabs/tab2',
    redirect: '/tabs/medicine'
  },

  {
    path: '/tabs/tab3',
    redirect: '/tabs/prescriptions'
  },

  {
    path: '/tabs/tab4',
    redirect: '/tabs/profile'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
