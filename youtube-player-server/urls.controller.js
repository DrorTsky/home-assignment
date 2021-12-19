class youtubeUrlsController {
  constructor() {
    this.IdCounter = 1;
    this._storage = [];
    this._cache = [];
    this._token = 0;
  }

  _findUrlById(id) {
    const url = this._storage.find((url) => url.id === id);
    if (!url) {
      throw new Error("Url not found.");
    }
    return url;
  }

  getAllUrls(token) {
    if (token === this._token) return this._cache;
    else {
      return { token: this._token, data: this._storage };
    }
  }

  getUrlById(id) {
    return this._findUrlById(id);
  }

  createUrl(urlData) {
    const newUrl = {
      id: this.IdCounter,
      urlData: urlData,
    };
    this._storage.push(newUrl);
    this.IdCounter = this.IdCounter + 1;

    // update cache
    this._token = this._token + 1;
    this._cache = this._storage;
    return newUrl;
  }

  updateUrlIndex(id, prevIndex, newIndex) {
    const urls = Array.from(this._storage);
    const [reorderedUrl] = urls.splice(prevIndex, 1);
    urls.splice(newIndex, 0, reorderedUrl);

    this._storage = urls.slice();

    // update cache
    this._token = this._token + 1;
    this._cache = this._storage;

    return { token: this._token, data: this._storage };
  }

  delUrl(id) {
    const foundUrl = this._findUrlById(id);
    this._storage.splice(this._storage.indexOf(foundUrl), 1);

    // update cache
    this._token = this._token + 1;
    this._cache = this._storage;
  }
}

module.exports = new youtubeUrlsController();
