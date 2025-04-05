// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import CountriesList from "../components/CountriesList.vue";
import CountryDetails from "../components/CountryDetails.vue";

const routes = [
  {
    path: "/",
    redirect: "/list"
  },
  {
    path: "/list",
    name: "list",
    component: CountriesList,
    children: [
      {
        path: ":alpha3Code",
        name: "country",
        component: CountryDetails,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;