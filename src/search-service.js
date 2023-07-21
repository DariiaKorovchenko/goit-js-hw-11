import axios from 'axios';

export default class SearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pagesAmount = 40;
  }

  onFetch() {
    const API_KEY = '38325031-07abeaa9a45e557a48162dc21';
    return axios
      .get(
        `https://pixabay.com/api/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.pagesAmount}&page=${this.page}`
      )
      .then(data => {
        this.page += 1;
        return data;
      });
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
}
