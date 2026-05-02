const fs = require("fs");
const path = require("path");

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const formidableModule = require("formidable");
    const createForm = formidableModule.formidable || formidableModule;
    const form = createForm({
      maxFileSize: 25 * 1024 * 1024,
      multiples: false,
    });

    form.parse(req, (error, fields, files) => {
      if (error) reject(error);
      else resolve({ fields, files });
    });
  });
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function sanitize(value) {
  return String(value || "")
    .replace(/[^\w가-힣.-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 140);
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const { put } = await import("@vercel/blob");
  const { fields, files } = await parseForm(req);
  const caseId = sanitize(first(fields.caseId));
  const taskId = sanitize(first(fields.taskId));
  const person = sanitize(first(fields.person));
  const title = sanitize(first(fields.title));
  const file = first(files.file);

  if (!caseId || !taskId || !file) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Missing upload fields" }));
    return;
  }

  const originalName = file.originalFilename || "document";
  const safeName = sanitize(originalName) || "document";
  const blobPath = `cases/${caseId}/uploads/${taskId}/${Date.now()}-${person}-${title}-${safeName}`;
  const stream = fs.createReadStream(file.filepath);
  const uploaded = await put(blobPath, stream, {
    access: "public",
    addRandomSuffix: true,
    contentType: file.mimetype || "application/octet-stream",
  });

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(
    JSON.stringify({
      file: {
        name: path.basename(originalName),
        url: uploaded.url,
        pathname: uploaded.pathname,
        uploadedAt: new Date().toISOString(),
      },
    }),
  );
};
