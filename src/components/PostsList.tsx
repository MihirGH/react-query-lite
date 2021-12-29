// Libs
// import { useQuery } from "react-query";
import { useQuery } from "../react-query-lite";

// Utils
import { sleepify } from "../utils/sleepify";

// Types
import type { Post } from "../types";

const _fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data.slice(0, 5);
};

const fetchPosts = sleepify(_fetchPosts, 1000);

export const PostsList = ({
  setActivePostId,
}: {
  setActivePostId: (postId: number) => void;
}) => {
  const { status, isFetching, data } = useQuery<Post[]>("posts", fetchPosts);

  return (
    <>
      <h1>Posts</h1>
      {status === "loading" ? (
        <div>
          <span style={{ color: "red" }}>Loading</span>
        </div>
      ) : (
        <ul>
          {data!.map((post) => (
            <li
              key={post.id}
              onClick={() => setActivePostId(post.id)}
              style={{ cursor: "pointer" }}
            >
              {post.title}
            </li>
          ))}
        </ul>
      )}
      {isFetching && status !== "loading" ? (
        <div>
          <span style={{ color: "green" }}>Background updating</span>
        </div>
      ) : null}
    </>
  );
};
