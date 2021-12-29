// Builders
import { Query } from "./Query";

// Types
import { Options } from "./types";

export class QueryClient {
  public queries: Query[];

  constructor() {
    this.queries = [];
  }

  getQuery = <T = any>(options: Options<T>) => {
    const queryKeyHash = JSON.stringify(options.queryKey);
    const query = this.queries.find(
      (_query) => _query.queryKeyHash === queryKeyHash
    );
    if (query) return query;

    const newQuery = new Query<T>(this, options);
    this.queries.push(newQuery);

    return newQuery;
  };

  removeQuery = (queryKeyHash: string) => {
    this.queries = this.queries.filter(
      (query) => query.queryKeyHash !== queryKeyHash
    );
  };
}
