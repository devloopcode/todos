export type Post = {
	id: number;
	userId: number;
	title: string;
	body: string;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

export const POSTS_QUERY_KEY = ["posts"] as const;
export const postQueryKey = (id: number) => ["posts", id] as const;

export const fetchPosts = async (): Promise<Post[]> => {
	const res = await fetch(`${BASE_URL}/posts`);
	if (!res.ok) throw new Error("Failed to fetch posts");
	return res.json() as Promise<Post[]>;
};

export const fetchPost = async (id: number): Promise<Post> => {
	const res = await fetch(`${BASE_URL}/posts/${id}`);
	if (!res.ok) throw new Error("Failed to fetch post");
	return res.json() as Promise<Post>;
};
