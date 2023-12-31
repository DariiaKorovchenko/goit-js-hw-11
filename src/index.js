import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SearchApiService from './search-service';

const form = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');
loadMoreBtn.addEventListener('click', onLoadMore);
form.addEventListener('submit', onFormSubmit);
galleryEl.addEventListener('click', onGalleryContainerClick);

const searchService = new SearchApiService();

async function onFormSubmit(event) {
  event.preventDefault();
  loadMoreBtn.classList.add('visually-hidden');
  searchService.searchQuery = event.currentTarget.elements[0].value;
  searchService.resetPage();
  galleryEl.innerHTML = '';
  try {
    const data = await searchService.onFetch();
    onCardRender(data);
  } catch {
    searchService.error();
  }
}

function onCardRender(data) {
  if (data.data.totalHits === 0) {
    loadMoreBtn.classList.add('visually-hidden');
    return searchService.error();
  }
  const markup = data.data.hits
    .map(element => {
      return `
        <div class="gallery__item">
        <a href="${element.largeImageURL}" class="large__image">
<img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" class="gallery__image" width="300"/>
</a>      
<div class="info">
        <p class="info-item">
          <b>Likes</b> ${element.likes}
        </p>
        <p class="info-item">
          <b>Views</b> ${element.views}
        </p>
        <p class="info-item">
          <b>Comments</b> ${element.comments}
        </p>
        <p class="info-item">
          <b>Downloads</b> ${element.downloads}
        </p>
      </div>
    </div>
        `;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.classList.remove('visually-hidden');
}

async function onLoadMore() {
  try {
    const data = await searchService.onFetch();
    onCardRender(data);
    if (
      data.data.hits.length < searchService.pagesAmount ||
      (searchService.page - 1) * searchService.pagesAmount > data.data.totalHits
    ) {
      loadMoreBtn.classList.add('visually-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {
    loadMoreBtn.classList.add('visually-hidden');
    searchService.error();
  }
}

function onGalleryContainerClick(event) {
  event.preventDefault();
  if (!event.target.classList.contains('gallery__image')) {
    return;
  }
  const gallery = new SimpleLightbox('.gallery a');
}
