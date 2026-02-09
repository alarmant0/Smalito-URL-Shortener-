export async function handleApiRequest(request: Request): Promise<Response> {
    return new Response(
        JSON.stringify({status:"healthy"}), 
        { headers : {"Content-Type": "application/json"}
    });
}