export async function createUser(request: Request, env: Env): Promise<Response> {
  let info: any;

  try {
    info = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const email = (info?.username || "").trim().toLowerCase();
  const password = (info?.password || "").trim();

  console.log("createUser payload:", { email, passwordLen: password.length });

  if (!email || !email.includes("@")) return json({ error: "Invalid email" }, 400);
  if (password.length < 8) return json({ error: "Password must be at least 8 characters" }, 400);

  const exists = await checkUserExists(email, env);
  console.log("user exists?", exists);

  if (exists) return json({ error: "User already exists" }, 409);

  // TODO: replace with real hashing (bcrypt/argon) later
  const passwordHash = `dev:${password}`;

  const userId = crypto.randomUUID();
  await addUserOnDB(userId, email, passwordHash, env);

  return json({ ok: true, userId }, 201);
}

async function addUserOnDB(id: string, email: string, passwordHash: string, env: Env) {
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(id, email, passwordHash, now)
    .run();
}

async function checkUserExists(email: string, env: Env): Promise<boolean> {
  const user = await env.DB
    .prepare("SELECT id FROM users WHERE email = ?")
    .bind(email)
    .first<{ id: string }>();

  console.log("checkUserExists:", email, user);
  return !!user;
}

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
