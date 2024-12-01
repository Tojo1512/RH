<template>
  <div class="loader-container">
    <div class="loader"></div>
    <p>{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    message: {
      type: String,
      default: 'Chargement...',
    },
  },
}
</script>

<style scoped>
.loader-container {
  text-align: center;
  padding: 20px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #4caf50;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
