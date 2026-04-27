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

export const updatePostTitle = async (
	id: number,
	title: string,
): Promise<Post> => {
	const res = await fetch(`${BASE_URL}/posts/${id}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ title }),
	});
	if (!res.ok) throw new Error("Failed to update post");
	return res.json() as Promise<Post>;
};

export const deletePost = async (id: number): Promise<void> => {
	const res = await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
	if (!res.ok) throw new Error("Failed to delete post");
};
