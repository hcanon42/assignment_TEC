import { createRouter, createWebHistory } from 'vue-router'
import MissionPlannerView from '../views/MissionPlannerView.vue'

const routes = [
  { path: '/', name: 'MissionPlanner', component: MissionPlannerView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
