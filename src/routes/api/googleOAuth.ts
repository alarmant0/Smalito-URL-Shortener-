type GoogleTokenInfo = {
  aud?: string;
  iss?: string;
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  picture?: string;
  exp?: string;
};

export async function handleGoogleOAuth(request: Request, env: Env): Promise<Response> {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json().catch(() => null) as { credential?: string } | null;
    const credential = body?.credential;

    if (!credential) {
      return new Response(JSON.stringify({ error: "Missing credential" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );

    if (!verifyRes.ok) {
      return new Response(JSON.stringify({ error: "Invalid Google token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const payload = (await verifyRes.json()) as GoogleTokenInfo;

    const audOk = payload.aud === env.GOOGLE_CLIENT_ID;
    const issOk =
      payload.iss === "accounts.google.com" || payload.iss === "https://accounts.google.com";
    const emailVerified =
      payload.email_verified === true || payload.email_verified === "true";

    if (!audOk) {
      return new Response(JSON.stringify({ error: "Invalid token audience" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!issOk) {
      return new Response(JSON.stringify({ error: "Invalid token issuer" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!emailVerified) {
      return new Response(JSON.stringify({ error: "Email not verified" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!payload.sub || !payload.email) {
      return new Response(JSON.stringify({ error: "Missing user data" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ At this point the user is verified.
    // TODO: store/find user in DB/KV here
    // Example key: users:google:<sub>
    const userKey = `users:google:${payload.sub}`;
    await env.URLS.put(userKey, JSON.stringify({
      provider: "google",
      sub: payload.sub,
      email: payload.email,
      name: payload.name ?? "",
      picture: payload.picture ?? "",
      created_at: Date.now(),
    }));

    // ✅ Minimal session cookie (NOT secure long-term, but works)
    // Better: sign a JWT or use Workers Sessions / Durable Object session store.
    const sessionValue = btoa(JSON.stringify({ sub: payload.sub, email: payload.email }));
    const cookie = `smalito_session=${sessionValue}; Path=/; HttpOnly; SameSite=Lax; Secure`;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "OAuth error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
