<template>
  <div class="col-7">
    <div v-if="isLoading" class="d-flex justify-content-center mt-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <div v-else-if="country">
      <img
        :src="`https://flagpedia.net/data/flags/icon/72x54/${country.alpha2Code.toLowerCase()}.png`"
        alt="country flag"
        style="width: 200px"
      />
      <h1>{{ country.name.common }}</h1>
      <table class="table">
        <tbody>
          <tr>
            <td style="width: 30%">Capital</td>
            <td>{{ country.capital[0] }}</td>
          </tr>
          <tr>
            <td>Area</td>
            <td>
              {{ country.area }} km<sup>2</sup>
            </td>
          </tr>
          <tr>
            <td>Borders</td>
            <td>
              <ul v-if="country.borders && country.borders.length > 0">
                <li v-for="border in borderCountries" :key="border.alpha3Code">
                  <router-link :to="`/list/${border.alpha3Code}`">
                    {{ border.name.common }}
                  </router-link>
                </li>
              </ul>
              <p v-else>This country has no borders</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="mt-5 text-center">
      <p>Select a country to see details</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  countries: {
    type: Array,
    required: true
  }
});

const route = useRoute();
const countryData = ref(null);
const isLoading = ref(false);

// For initial load and fallback
const country = computed(() => {
  if (countryData.value) return countryData.value;
  return props.countries.find(c => c.alpha3Code === route.params.alpha3Code);
});

const borderCountries = computed(() => {
  if (!country.value || !country.value.borders) return [];

  return country.value.borders.map(borderCode => {
    return props.countries.find(c => c.alpha3Code === borderCode);
  }).filter(Boolean); // Filter out any undefined values
});

const fetchCountryData = async (alpha3Code) => {
  if (!alpha3Code) return;

  isLoading.value = true;
  try {
    const response = await fetch(`https://ih-countries-api.herokuapp.com/countries/${alpha3Code}`);
    const data = await response.json();
    countryData.value = data;
  } catch (error) {
    console.error('Error fetching country details:', error);
    // Fallback to the countries prop
    countryData.value = null;
  } finally {
    isLoading.value = false;
  }
};

// Watch for route changes to fetch new country data
watch(() => route.params.alpha3Code, (newAlpha3Code) => {
  fetchCountryData(newAlpha3Code);
}, { immediate: true });

onMounted(() => {
  if (route.params.alpha3Code) {
    fetchCountryData(route.params.alpha3Code);
  }
});
</script>