<template>
  <div class="container">
    <div class="row">
      <!-- Countries List (Bootstrap column) -->
      <div class="col-5" style="max-height: 90vh; overflow: scroll">
        <div v-if="isLoading" class="d-flex justify-content-center mt-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-else class="list-group">
          <router-link
            v-for="country in countries"
            :key="country.alpha3Code"
            :to="`/list/${country.alpha3Code}`"
            class="list-group-item list-group-item-action"
            :class="{ active: country.alpha3Code === selectedCountry }"
          >
            <img
              :src="`https://flagpedia.net/data/flags/icon/72x54/${country.alpha2Code.toLowerCase()}.png`"
              alt="country flag"
            />
            <span class="ms-3">{{ country.name.common }}</span>
          </router-link>
        </div>
      </div>

      <!-- Country Details will be rendered here -->
      <router-view :countries="countries" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const countries = ref([]);
const route = useRoute();
const isLoading = ref(true);

const selectedCountry = computed(() => {
  return route.params.alpha3Code;
});

onMounted(async () => {
  try {
    // Try to fetch from API first
    const response = await fetch('https://ih-countries-api.herokuapp.com/countries');
    const data = await response.json();
    countries.value = data;
  } catch (error) {
    console.error('Error fetching countries from API:', error);
    try {
      // Fallback to local JSON if API fails
      const response = await fetch('/countries.json');
      const data = await response.json();
      countries.value = data;
    } catch (fallbackError) {
      console.error('Error fetching local data:', fallbackError);
      countries.value = [];
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.list-group-item {
  display: flex;
  align-items: center;
}

.list-group-item img {
  width: 30px;
  margin-right: 10px;
}
</style>