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

function fieldValue(value) {
  return String(first(value) || "").trim();
}

function safeBlobSegment(value, fallback) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120) || fallback;
}

function safeBlobFileName(value) {
  const originalName = path.basename(String(value || "document"));
  const extension = path.extname(originalName).replace(/^\./, "");
  const baseName = path.basename(originalName, extension ? `.${extension}` : "");
  const safeBase = safeBlobSegment(baseName, "document");
  const safeExtension = extension ? safeBlobSegment(extension, "") : "";
  return safeExtension ? `${safeBase}.${safeExtension}` : safeBase;
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      sendJson(res, 405, { error: "Method not allowed" });
      return;
    }

    const { put } = await import("@vercel/blob");
    const { fields, files } = await parseForm(req);
    const caseId = fieldValue(fields.caseId);
    const taskId = fieldValue(fields.taskId);
    const file = first(files.file);

    if (!/^[a-zA-Z0-9_-]{8,80}$/.test(caseId) || !/^[a-zA-Z0-9_-]{8,120}$/.test(taskId) || !file) {
      sendJson(res, 400, { error: "Missing upload fields" });
      return;
    }

    if (file.size === 0) {
      sendJson(res, 400, { error: "Empty file" });
      return;
    }

    const originalName = file.originalFilename || "document";
    const safeName = safeBlobFileName(originalName);
    const safeTaskId = safeBlobSegment(taskId, "task");
    const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const blobPath = `cases/${caseId}/uploads/${safeTaskId}/${uniquePart}-${safeName}`;
    const stream = fs.createReadStream(file.filepath);
    const uploaded = await put(blobPath, stream, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.mimetype || "application/octet-stream",
    });

    sendJson(res, 200, {
      file: {
        name: path.basename(originalName),
        url: uploaded.url,
        pathname: uploaded.pathname,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Upload failed", error);
    sendJson(res, 500, {
      error: "Upload failed",
      detail: error instanceof Error ? error.message : "Unknown upload error",
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
