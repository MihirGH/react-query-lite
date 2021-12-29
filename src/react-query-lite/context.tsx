import { createContext } from "react";

import { QueryClient } from "./QueryClient";

export const QueryClientContext = createContext<QueryClient | null>(null);

export const QueryClientProvider = ({
  children,
  client
}: {
  children: JSX.Element;
  client: QueryClient;
}) => (
  <QueryClientContext.Provider value={client}>
    {children}
  </QueryClientContext.Provider>
);
