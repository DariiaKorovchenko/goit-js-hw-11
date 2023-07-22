import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class SearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pagesAmount = 40;
  }

  async onFetch() {
    const API_KEY = '38325031-07abeaa9a45e557a48162dc21';
    try {
      const response = await axios.get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.pagesAmount}&page=${this.page}`
      );
      this.page += 1;
      return response;
    } catch {
      this.error();
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 1;
  }

  error() {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
