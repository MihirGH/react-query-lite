// Libs
import { useContext, useEffect, useState } from "react";
import { QueryClientContext } from "./context";

// Builders
import { QueryObserver } from "./QueryObserver";

// Types
import { QueryKey, QueryFn, QueryState, Options } from "./types";

export const useQuery = <T = any>(
  queryKey: QueryKey,
  queryFn: QueryFn<T>,
  options?: Omit<Options<T>, "queryKey" | "queryFn">
): QueryState<T> => {
  const client = useContext(QueryClientContext);

  const [observer] = useState(
    () => new QueryObserver(client, { ...options, queryKey, queryFn })
  );

  const [, setState] = useState(false);

  useEffect(() => {
    const rerender = () => setState((prevState) => !prevState);
    observer.subscribe(rerender);
  }, [observer]);

  return observer.getState();
};
