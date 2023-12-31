import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';
import { refs } from './refs';

function breedsList() {
  refs.loaderRef.style.display = 'block';
  refs.breedSelectRef.style.display = 'none';
  refs.errorRef.style.display = 'none';

  fetchBreeds()
    .then(breeds => {
      let options = '';
      breeds.forEach(breed => {
        options += `<option value="${breed.id}">${breed.name}</option>`;
      });
      refs.breedSelectRef.innerHTML = options;
      refs.breedSelectRef.addEventListener('change', searchCat);
      refs.breedSelectRef.style.display = 'block';
    })
    .catch(err => {
      refs.errorRef.style.display = 'block';
      console.error(err);
      Notiflix.Notify.failure(
        'OOOPS! An error occurred while loading cat breeds'
      );
      hideBreedSelect();
    })
    .finally(() => {
      refs.loaderRef.style.display = 'none';
    });
}

function searchCat() {
  refs.loaderRef.style.display = 'block';
  refs.errorRef.style.display = 'none';
  const selectedBreedId = refs.breedSelectRef.value;

  if (!selectedBreedId) {
    refs.catInfoRef.innerHTML = '';
    refs.loaderRef.style.display = 'none';
    return;
  }

  hideBreedSelect();

  fetchCatByBreed(selectedBreedId)
    .then(catData => {
      if (catData) {
        const catInfoTemplate = `
          <div style="display: flex; align-items: center;">
            <img src="${catData.url}" alt="Cat of breed ${catData.breeds[0].name}" class="cat-image">
            <div class="cat-info-container">
              <h2>Cat Information</h2>
              <p>Name: ${catData.breeds[0].name}</p>
              <p>Description: ${catData.breeds[0].description}</p>
              <p>Temperament: ${catData.breeds[0].temperament}</p>
            </div>
          </div>`;
        refs.catInfoRef.innerHTML = catInfoTemplate;
      } else {
        refs.catInfoRef.innerHTML = '';
        Notiflix.Notify.warning(
          'WARNING! There is no data on this breed of cat'
        );
      }
    })
    .catch(err => {
      refs.errorRef.style.display = 'block';
      console.error(err);
      Notiflix.Notify.failure(
        'Oops! Something went wrong! Try reloading the page!'
      );
    })
    .finally(() => {
      refs.loaderRef.style.display = 'none';
      showBreedSelect();
    });
}

function hideBreedSelect() {
  refs.breedSelectRef.style.display = 'none';
}

function showBreedSelect() {
  refs.breedSelectRef.style.display = 'block';
}

breedsList();
