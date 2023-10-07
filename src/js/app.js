import { fetchBreeds, fetchCatByBreed } from './cat-api';
import Notiflix from 'notiflix';

// Создаем экземпляр Slim Select
const select = new SlimSelect({
  select: '.breed-select', // Выбираем элемент с классом breed-select
  multiple: true, // Разрешаем выбор нескольких элементов
  placeholder: 'Select a breed...', // Текст-подсказка
  searchText: 'No results found', // Текст, если результаты поиска отсутствуют
  allowDeselect: true, // Разрешаем снятие выбора
  onChange: selected => {
    // Выполняем действия при изменении выбора
    searchCat(selected);
  },
});

function populateBreedsSelect() {
  select.disable(); // Отключаем Slim Select во время загрузки данных
  fetchBreeds()
    .then(breeds => {
      const options = breeds.map(breed => ({
        text: breed.name,
        value: breed.id,
      }));
      select.setData(options); // Устанавливаем данные для Slim Select
    })
    .catch(err => {
      console.error(err);
      Notiflix.Notify.failure('An error occurred while loading cat breeds');
    })
    .finally(() => {
      select.enable(); // Включаем Slim Select после загрузки данных
    });
}

function searchCat(selectedBreeds) {
  if (!selectedBreeds || selectedBreeds.length === 0) {
    return;
  }

  const selectedBreedIds = selectedBreeds.map(breed => breed.value);

  fetchCatByBreed(selectedBreedIds)
    .then(catData => {
      if (catData) {
        // Выводим информацию о коте
        const catInfoTemplate = `
    <div style="display: flex; align-items: center;">
        <img src="${catData.url}" alt="Cat of breed ${catData.breeds[0].name}" class="cat-image" style="max-width: 50%; height: auto;">
        <div class="cat-info-container" style="flex: 1; padding: 20px;">
            <h2>Cat Information</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">Name: ${catData.breeds[0].name}</p>
            <p style="font-size: 16px; margin-bottom: 10px;">Description: ${catData.breeds[0].description}</p>
            <p style="font-size: 16px;">Temperament: ${catData.breeds[0].temperament}</p>
        </div>
    </div>
`;

        document.querySelector('.cat-info').innerHTML = catInfoTemplate;
      } else {
        // Очищаем информацию, если кот не найден
        document.querySelector('.cat-info').innerHTML = '';
        Notiflix.Notify.warning('There is no data on this breed of cat');
      }
    })
    .catch(err => {
      console.error(err);
      Notiflix.Notify.failure('An error occurred while searching for a cat');
    });
}

// Вызываем функцию для загрузки данных в выпадающий список
populateBreedsSelect();
