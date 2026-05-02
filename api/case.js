async function readJson(req) {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function getCaseId(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  if (!id || !/^[a-zA-Z0-9_-]{8,80}$/.test(id)) return null;
  return id;
}

module.exports = async function handler(req, res) {
  const caseId = getCaseId(req);
  if (!caseId) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid case id" }));
    return;
  }

  const { put, list } = await import("@vercel/blob");
  const statePath = `cases/${caseId}/state.json`;

  if (req.method === "GET") {
    const result = await list({ prefix: statePath, limit: 1 });
    const blob = result.blobs.find((item) => item.pathname === statePath);

    if (!blob) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Case not found" }));
      return;
    }

    const response = await fetch(blob.url);
    const state = await response.json();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(state));
    return;
  }

  if (req.method === "PUT") {
    const state = await readJson(req);
    await put(statePath, JSON.stringify(state, null, 2), {
      access: "public",
      allowOverwrite: true,
      contentType: "application/json; charset=utf-8",
    });

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.statusCode = 405;
  res.setHeader("Allow", "GET, PUT");
  res.end(JSON.stringify({ error: "Method not allowed" }));
};
