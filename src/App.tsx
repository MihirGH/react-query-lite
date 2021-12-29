// Libs
import { useState } from "react";
// import { QueryClient, QueryClientProvider } from "react-query";
import { QueryClient, QueryClientProvider } from "./react-query-lite";

// Components
import { Post } from "./components/Post";
import { PostsList } from "./components/PostsList";

const queryClient = new QueryClient();

export default function App() {
  const [activePostId, setActivePostId] = useState(-1);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        {activePostId === -1 ? (
          <PostsList setActivePostId={setActivePostId} />
        ) : (
          <Post
            postId={activePostId}
            showListView={() => setActivePostId(-1)}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}
