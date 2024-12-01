import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/Layout.vue';
import HomePage from '@/pages/HomePage.vue';
import App from '@/App.vue';
import DemandesCongePage from '@/pages/DemandesCongePage.vue';
import DroitCongePage from '@/pages/DroitCongePage.vue';
import TypesCongePage from '@/pages/TypesCongePage.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: HomePage },
      { path: 'app', component: App },
      { path: 'demandes-conge', component: DemandesCongePage },
      { path: 'droit-conge', component: DroitCongePage },
      { path: 'types-conge', component: TypesCongePage },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 