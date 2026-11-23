import { CatalogCache } from './CatalogCache';
import { TvMazeClient } from './logic/api/TvMazeClient';
import { paginateShows } from './logic/helpers/paginateShows';
import type { SearchShowsParams, Show } from '../generated/routes.schemas';
import type { CatalogSource, ShowCatalogOptions } from './types';


export class ShowCatalog {
  private searches: CatalogCache<Show[]>;
  private shows: CatalogCache<Show>;
  private api: CatalogSource;

  constructor({ api = new TvMazeClient(), now = Date.now, storage = {} }: ShowCatalogOptions = {}) {
    this.api = api;

    this.searches = new CatalogCache({ entries: (storage.searches ??= {}), now });
    this.shows = new CatalogCache({ entries: (storage.shows ??= {}), now });
  }

  prune() {
    this.searches.prune();
    this.shows.prune();
  }

  byId(id: string) {
    return this.shows.get({ key: 'id:' + id, load: () => this.api.byId(id) });
  }

  async search({ q, genre, page = 1 }: SearchShowsParams) {
    const title = q.trim();
    const shows = await this.searches.get({
      key: 'title:' + title,
      load: async () => {
        const cards = await this.api.search(title);
        for (const card of cards) {
          this.shows.store({ key: 'id:' + card.id, value: card });
        }

        return cards;
      },
    });

    return paginateShows({ shows, genre, page });
  }
}
