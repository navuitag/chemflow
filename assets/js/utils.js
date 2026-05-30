export const $ = (selector, root = document) => root.querySelector(selector);

export const normalizeChem = (value) =>
  String(value)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[−–—]/g, "-")
    .replace(/\*/g, "")
    .replace(/＝/g, "=")
    .replace(/₂/g, "2")
    .replace(/₃/g, "3")
    .replace(/₄/g, "4")
    .replace(/₅/g, "5")
    .replace(/→/g, "->");

export const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[char]);

export async function loadJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Không tải được dữ liệu: ${path}`);
  }
  return response.json();
}

export function setRoute(route) {
  window.location.hash = route;
}

export function levelFromXp(xp) {
  return Math.floor(xp / 120) + 1;
}

export function masteryLabel(score) {
  if (score >= 61) return "Thành thạo";
  if (score >= 31) return "Đang chắc dần";
  return "Mới bắt đầu";
}

export function percent(value, total) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}
