// Types
import { QueryClient } from "./QueryClient";
import { Options, QueryState } from "./types";

export class QueryObserver<T> {
  public notify: () => void;
  public subscribe: (callback: () => void) => void;
  public getState: () => QueryState<T>;

  constructor(client: QueryClient, { queryKey, queryFn }: Options<T>) {
    const query = client.getQuery({ queryKey, queryFn });
    this.getState = () => query.queryState;

    this.subscribe = (callback) => {
      this.notify = callback;

      const unsubscribe = query.subscribe(this);
      query.fetch();

      return unsubscribe;
    };

    return this;
  }
}
