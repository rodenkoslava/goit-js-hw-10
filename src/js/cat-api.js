import axios from 'axios';
const BASE_URL = 'https://api.thecatapi.com/v1';
const API_KEY =
  'live_NkThwzPJ7P4qN6BzFpm1H0YBbo0F6UPqOVnACJAZmMU5UttcPoUxzCqSyRsOsaGl';
axios.defaults.headers.common['x-api-key'] = API_KEY;
export function fetchBreeds() {
  return axios.get(`${BASE_URL}/breeds`).then(response => response.data);
}
export function fetchCatByBreed(breedId) {
  return axios
    .get(`${BASE_URL}/images/search?breed_ids=${breedId}`)
    .then(response => response.data[0]);
}
