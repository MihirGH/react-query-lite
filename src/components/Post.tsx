// Libs
// import { useQuery } from "react-query";
import { useQuery } from "../react-query-lite";

// Utils
import { sleepify } from "../utils/sleepify";

// Types
import type { Post as TPost } from "../types";
import type { QueryFn } from "../react-query-lite/types";

const _fetchPost: QueryFn<TPost> = async ({ queryKey }) => {
  const [_, postId] = Array.isArray(queryKey) ? queryKey : [queryKey];
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  const data = await response.json();
  return data;
};

const fetchPost = sleepify(_fetchPost, 1000);

export const Post = ({
  postId,
  showListView,
}: {
  postId: number;
  showListView: () => void;
}) => {
  const { status, isFetching, data } = useQuery<TPost>(
    ["post", postId],
    fetchPost
  );

  return (
    <>
      <h1>Post</h1>
      {status === "loading" ? (
        <div>
          <span style={{ color: "red" }}>Loading</span>
        </div>
      ) : (
        <>
          <h2>{data!.title}</h2>
          <div>{data!.body}</div>
        </>
      )}
      <button onClick={showListView}>Back</button>
      {isFetching && status !== "loading" ? (
        <div>
          <span style={{ color: "green" }}>Background updating</span>
        </div>
      ) : null}
    </>
  );
};
