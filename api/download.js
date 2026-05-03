function getCaseId(req) {
  const url = new URL(req.url, "http://localhost");
  const id = url.searchParams.get("id");
  if (!id || !/^[a-zA-Z0-9_-]{8,80}$/.test(id)) return null;
  return id;
}

function sanitizeSegment(value, fallback) {
  const cleaned = String(value || "")
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/[^\w가-힣ㄱ-ㅎㅏ-ㅣ .()·-]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-+/g, "-")
    .trim()
    .slice(0, 120);
  return cleaned || fallback;
}

function zipFileName(caseId, state) {
  const title = sanitizeSegment(state?.settings?.title, "tax-documents");
  const taxYear = sanitizeSegment(state?.settings?.taxYear, "");
  const stamp = new Date().toISOString().slice(0, 10);
  return sanitizeSegment(`${title}-${taxYear || caseId}-${stamp}.zip`, `tax-documents-${caseId}.zip`);
}

function uniquePath(basePath, usedPaths) {
  if (!usedPaths.has(basePath)) {
    usedPaths.add(basePath);
    return basePath;
  }

  const dotIndex = basePath.lastIndexOf(".");
  const stem = dotIndex > 0 ? basePath.slice(0, dotIndex) : basePath;
  const ext = dotIndex > 0 ? basePath.slice(dotIndex) : "";
  let index = 2;
  let candidate = `${stem}-${index}${ext}`;

  while (usedPaths.has(candidate)) {
    index += 1;
    candidate = `${stem}-${index}${ext}`;
  }

  usedPaths.add(candidate);
  return candidate;
}

async function loadCaseState(caseId) {
  const { list } = await import("@vercel/blob");
  const statePath = `cases/${caseId}/state.json`;
  const result = await list({ prefix: statePath, limit: 1 });
  const blob = result.blobs.find((item) => item.pathname === statePath);

  if (!blob) return null;
  const response = await fetch(blob.url);
  if (!response.ok) throw new Error("Case state fetch failed");
  return response.json();
}

async function addRemoteFile(zip, zipPath, file) {
  const response = await fetch(file.url);
  if (!response.ok) throw new Error(`File fetch failed: ${file.name}`);
  const bytes = await response.arrayBuffer();
  zip.file(zipPath, Buffer.from(bytes));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  const caseId = getCaseId(req);
  if (!caseId) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid case id" }));
    return;
  }

  const state = await loadCaseState(caseId);
  if (!state || !Array.isArray(state.tasks)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Case not found" }));
    return;
  }

  const JSZip = require("jszip");
  const zip = new JSZip();
  const usedPaths = new Set();
  const failures = [];
  let fileCount = 0;
  const people = Array.isArray(state.people) ? state.people : [];

  const tasks = state.tasks
    .filter((task) => task?.required && Array.isArray(task.files) && task.files.length)
    .sort((a, b) => {
      const personOrder = people.indexOf(a.person) - people.indexOf(b.person);
      if (personOrder) return personOrder;
      return (a.order ?? 999) - (b.order ?? 999) || String(a.title || "").localeCompare(String(b.title || ""), "ko-KR");
    });

  for (const task of tasks) {
    const personFolder = sanitizeSegment(task.person, "대상자");
    const taskFolder = sanitizeSegment(task.title, "서류");

    for (const file of task.files) {
      const fileName = sanitizeSegment(file?.name || file?.pathname || "첨부파일", "첨부파일");
      const zipPath = uniquePath(`${personFolder}/${taskFolder}/${fileName}`, usedPaths);

      if (!file?.url) {
        failures.push(`${zipPath}: 파일 URL 없음`);
        continue;
      }

      try {
        await addRemoteFile(zip, zipPath, file);
        fileCount += 1;
      } catch (error) {
        failures.push(`${zipPath}: ${error.message}`);
      }
    }
  }

  if (!fileCount) {
    zip.file("README.txt", "다운로드할 업로드 파일이 없습니다.\n");
  }

  if (failures.length) {
    zip.file("_download-errors.txt", failures.join("\n"));
  }

  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  const fileName = zipFileName(caseId, state);
  const encodedName = encodeURIComponent(fileName);

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="tax-documents-${caseId}.zip"; filename*=UTF-8''${encodedName}`);
  res.setHeader("Content-Length", String(buffer.length));
  res.end(buffer);
};
