import './sass/main.scss';
import ImagesApiService from './js/apiService';
import imageCardTemplate from './template/image-card.hbs';

import '@pnotify/core/dist/BrightTheme.css';
import { error, alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

const imagesApiService = new ImagesApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  clearImagesGallery();
  imagesApiService.query = e.currentTarget.elements.query.value;
  if (!imagesApiService.query) {
    enterWithoutRequest();
    return;
  }
  imagesApiService.resetPage();
  imagesApiService.fetchImages().then(hits => {
    if (hits.length === 0) {
      errorMessage();
      return;
    }
    appendImagesMarkup(hits);
  });
}

function onLoadMore() {
  imagesApiService.fetchImages().then(hits => {
    appendImagesMarkup(hits);
    const element = document.getElementById('btn-load-more');
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  });
}

function appendImagesMarkup(hits) {
  refs.gallery.insertAdjacentHTML('beforeend', imageCardTemplate(hits));
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function clearImagesGallery() {
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}

function errorMessage() {
  error({
    text: 'Sorry, not accurate input.',
    delay: 5000,
  });
}

function enterWithoutRequest() {
  alert({
    text: 'Please, enter your search query.',
    delay: 5000,
  });
}
