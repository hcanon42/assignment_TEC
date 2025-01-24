<template>
  <div>
    <h2>Plan Route</h2>
    <ul>
      <li
        v-for="planet in planets"
        :key="planet.name"
        @click="addToRoute(planet)"
        class="cursor-pointer hover:underline"
      >
        {{ planet.name }} (Distance: {{ planet.distance }} km)
      </li>
    </ul>
    <p>Current Route: {{ route.map((p) => p.name).join(' → ') }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const planets = computed(() => store.state.planets);
    const route = computed(() => store.state.route);

    const addToRoute = (planet) => {
      store.commit('addPlanetToRoute', planet);
    };

    return { planets, route, addToRoute };
  },
};
</script>
