export async function isAvailable(url: string, env: Env): Promise<boolean> {
	const value = await env.urls.get(url);
	return value;
}

export async function cput(small_url: string, url: string, env: Env): Promise<boolean> {
	const body = {
		full_url: url,
		clicks: 0,
		created_at: Date.now()
	};
	let value = await env.urls.put(small_url, JSON.stringify(body));
	return true;
}