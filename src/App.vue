<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
}
</script>

<style>
body {
  font-family: Arial, sans-serif;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled):hover {
  background-color: #0056b3;
}

h2 {
  font-size: 24px;
  margin-bottom: 12px;
  color: #333;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #444;
}

p {
  font-size: 16px;
  margin: 6px 0;
  color: #555;
}

b {
  color: #222;
}

</style>
