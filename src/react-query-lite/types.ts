export type QueryKey = string | number | Object | Array<QueryKey>;

export type QueryState<T> = {
  status: "loading" | "success" | "error";
  isFetching: boolean;
  data: T | undefined;
  error: string | undefined;
};

export type QueryFn<T = any> = ({
  queryKey
}: {
  queryKey: QueryKey;
}) => Promise<T>;

export type Options<T = any> = {
  queryKey: QueryKey;
  queryFn: QueryFn<T>;
  cacheTime?: number;
};
