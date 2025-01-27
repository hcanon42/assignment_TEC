import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MissionPlannerView from '../views/MissionPlannerView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/mission-planner', name: 'MissionPlanner', component: MissionPlannerView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
