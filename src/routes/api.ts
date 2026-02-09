import { createTinyURL } from "../utils/shortener.ts";

export async function handleApiRequest(request: Request, env: Env): Promise<Response> {

    const url = new URL(request.url);
    const endpoint = url.pathname.split("/")[2];
    if (endpoint == "status") {
       return new Response(
            JSON.stringify({status:"healthy"}), 
            { headers : {"Content-Type": "application/json"}
        }); 
    }
    if (endpoint == "create") {
        const body = await request.json();
        const { full_url } = body;
        const shortcode = await createTinyURL(full_url, env);
        console.log(full_url); 
        let tinyurl = "https://smalito.com/" + shortcode;
        return new Response(JSON.stringify({ url : tinyurl}), { headers: {"Content-Type": "application/json"}});
    }
}

async function handleHealthStatus() : Promise<Response> {
    return new Response(
        JSON.stringify({status:"healthy"}), 
        { headers : {"Content-Type": "application/json"}
    });
}