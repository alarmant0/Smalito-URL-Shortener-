export async function isAvailable(url: string, env: Env): Promise<boolean> {
	const value = await env.urls.get(url);
	return value === null;
}

export async function cput(small_url: string, url: string, env: Env): Promise<boolean> {
	//console.log(small_url, url);
	//let value = await env.urls.put(small_url, url);
	return true;
}