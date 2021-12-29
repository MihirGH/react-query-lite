// Builders
import { QueryClient } from "./QueryClient";

// Types
import { Options, QueryState, QueryKey, QueryFn } from "./types";

const getInitialState = <T>(): QueryState<T> => ({
  status: "loading",
  isFetching: false,
  data: undefined,
  error: undefined
});

export class Query<T = any> {
  public queryClient: QueryClient;
  public queryPromise: Promise<T | undefined>;
  public queryState: QueryState<T>;

  public subscribers: { notify: () => void }[];

  public queryKey: QueryKey | Array<QueryKey>;
  public queryKeyHash: string;
  public queryFn: QueryFn<T>;

  public gcDelay: number;
  public gcTimeoutId: ReturnType<typeof setTimeout> | null;

  constructor(
    queryClient: QueryClient,
    { queryKey, queryFn, cacheTime = 5 * 60 * 1000 }: Options<T>
  ) {
    this.queryPromise = null;
    this.queryClient = queryClient;
    this.queryState = getInitialState();

    this.subscribers = [];

    this.queryKey = queryKey;
    this.queryKeyHash = JSON.stringify(queryKey);
    this.queryFn = queryFn;

    this.gcTimeoutId = null;
    this.gcDelay = cacheTime;

    return this;
  }

  subscribe = (subscribeFn: { notify: () => void }): (() => void) => {
    this.subscribers.push(subscribeFn);
    this.unscheduleGC();

    return () => {
      this.subscribers.filter((d) => d !== subscribeFn);
      if (this.subscribers.length === 0) {
        this.scheduleGC();
      }
    };
  };

  scheduleGC = () => {
    this.gcTimeoutId = setTimeout(() => {
      this.queryClient.removeQuery(this.queryKeyHash);
    }, this.gcDelay);
  };

  unscheduleGC = () => {
    if (!this.gcTimeoutId) return;

    clearTimeout(this.gcTimeoutId);
    this.gcTimeoutId = null;
  };

  setState = (updaterFn: (prevQuery: QueryState<T>) => QueryState<T>) => {
    this.queryState = updaterFn(this.queryState);
    this.subscribers.forEach((subscriber) => subscriber.notify());
  };

  tryFetchData = async () => {
    try {
      const data = await this.queryFn({ queryKey: this.queryKey });
      this.setState((prevQueryState) => ({
        ...prevQueryState,
        status: "success",
        isFetching: false,
        data
      }));
      return data;
    } catch (error) {
      this.setState((prevQueryState) => ({
        ...prevQueryState,
        status: "error",
        isFetching: false,
        error
      }));
    } finally {
      this.queryPromise = null;
      return undefined;
    }
  };

  fetch = async () => {
    if (this.queryPromise) return;
    this.setState((prevQueryState) => ({
      ...prevQueryState,
      isFetching: true,
      error: undefined
    }));
    this.queryPromise = this.tryFetchData();
  };
}
