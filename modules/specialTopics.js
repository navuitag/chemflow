import { escapeHtml } from "../assets/js/utils.js";

function getCatalog(ctx) {
  return ctx.data.specialTopics || { meta: {}, overviews: [], categories: [], topics: [] };
}

function getTopic(catalog, topicId) {
  return catalog.topics.find((t) => t.id === topicId) || null;
}

function topicIndex(catalog, topicId) {
  return catalog.topics.findIndex((t) => t.id === topicId);
}

function encodeAssetPath(path) {
  return path.split("/").map((part) => encodeURIComponent(part)).join("/");
}

export function createSpecialTopicsModule(ctx) {
  const subjectLabel = ctx.subjectLabel || "Hóa học";

  function renderCatalog() {
    const catalog = getCatalog(ctx);
    const { meta, categories, topics } = catalog;
    const hasPdf = topics.some((t) => t.pdf);

    const sections = categories.map((cat) => {
      const items = topics.filter((t) => t.category === cat.id);
      if (!items.length) return "";
      return `
        <section class="st-section">
          <h2>${cat.emoji} ${escapeHtml(cat.title)}</h2>
          <div class="st-topic-grid">
            ${items.map((topic) => renderTopicCard(topic)).join("")}
          </div>
        </section>
      `;
    }).join("");

    return `
      <section class="st-hero">
        <a class="back-link" href="#/home">← Trang chủ</a>
        <span class="eyebrow">Tài liệu · Chuyên đề</span>
        <h1>${escapeHtml(meta.title || `Chuyên đề ${subjectLabel}`)}</h1>
        <p>${escapeHtml(meta.subtitle || "")}</p>
        <div class="st-hero-stats">
          <span>${topics.length} chuyên đề</span>
          <span>${hasPdf ? "PDF + sơ đồ" : "Sơ đồ tư duy"}</span>
          <span>Xem trực tiếp</span>
        </div>
      </section>
      ${sections}
    `;
  }

  function renderTopicCard(topic) {
    const href = topic.pdf
      ? `#/special-topic/${topic.id}/pdf`
      : `#/special-topic/${topic.id}/image`;
    const thumb = topic.image
      ? `<img class="st-topic-thumb" src="${encodeAssetPath(topic.image)}" alt="" loading="lazy">`
      : "";
    return `
      <a class="st-topic-card card-panel${topic.image ? " st-topic-card--thumb" : ""}" href="${href}">
        ${thumb}
        <div class="st-topic-card-body">
          <span class="st-topic-code">${escapeHtml(topic.code)}</span>
          <h3>${escapeHtml(topic.title)}</h3>
          <div class="st-topic-meta">
            ${topic.pdf ? "<span>PDF</span>" : ""}
            ${topic.image ? "<span>Sơ đồ</span>" : ""}
          </div>
        </div>
      </a>
    `;
  }

  function renderTopicViewer(topicId, tab = "image") {
    const catalog = getCatalog(ctx);
    const topic = getTopic(catalog, topicId);
    if (!topic) return ctx.notFound("Không tìm thấy chuyên đề.");

    const idx = topicIndex(catalog, topicId);
    const prev = idx > 0 ? catalog.topics[idx - 1] : null;
    const next = idx < catalog.topics.length - 1 ? catalog.topics[idx + 1] : null;

    const activeTab = tab === "pdf" && topic.pdf ? "pdf" : "image";
    const showTabs = topic.pdf && topic.image;
    const tabs = showTabs ? `
      <div class="st-tabs" role="tablist">
        <a class="st-tab${activeTab === "pdf" ? " active" : ""}" href="#/special-topic/${topic.id}/pdf" role="tab">📄 PDF</a>
        <a class="st-tab${activeTab === "image" ? " active" : ""}" href="#/special-topic/${topic.id}/image" role="tab">🗺️ Sơ đồ</a>
      </div>
    ` : "";

    let body = "";
    if (activeTab === "pdf" && topic.pdf) {
      const src = encodeAssetPath(topic.pdf);
      body = `
        <div class="st-pdf-wrap">
          <iframe class="st-pdf-frame" src="${src}" title="${escapeHtml(topic.title)}"></iframe>
        </div>
        <div class="st-viewer-actions">
          <a class="btn secondary" href="${src}" target="_blank" rel="noopener">Mở tab mới</a>
          <a class="btn secondary" href="${src}" download>Tải PDF</a>
        </div>
      `;
    } else if (topic.image) {
      const src = encodeAssetPath(topic.image);
      body = `
        <div class="st-viewer-body">
          <img class="st-doc-image" src="${src}" alt="${escapeHtml(topic.title)}">
        </div>
        <div class="st-viewer-actions">
          <a class="btn secondary" href="${src}" target="_blank" rel="noopener">Mở ảnh gốc</a>
          <a class="btn secondary" href="${src}" download>Tải sơ đồ</a>
        </div>
      `;
    } else {
      body = `<div class="empty-state">Chuyên đề này chưa có tệp xem trực tiếp.</div>`;
    }

    return `
      <section class="st-viewer">
        ${renderViewerHeader({
          title: `${topic.code} — ${topic.title}`,
          subtitle: topic.categoryTitle,
          backHref: "#/special-topic",
          backLabel: "Danh sách chuyên đề"
        })}
        ${tabs}
        ${body}
        ${renderTopicNav(prev, next, activeTab)}
      </section>
    `;
  }

  function renderViewerHeader({ title, subtitle, backHref, backLabel }) {
    return `
      <header class="st-viewer-head">
        <a class="back-link" href="${backHref}">← ${escapeHtml(backLabel)}</a>
        ${subtitle ? `<span class="tag">${escapeHtml(subtitle)}</span>` : ""}
        <h1>${escapeHtml(title)}</h1>
      </header>
    `;
  }

  function renderTopicNav(prev, next, tab) {
    const tabSuffix = tab === "pdf" ? "/pdf" : "/image";
    return `
      <nav class="st-topic-nav" aria-label="Chuyên đề trước/sau">
        ${prev
          ? `<a class="st-nav-btn" href="#/special-topic/${prev.id}${tabSuffix}">← ${escapeHtml(prev.code)}</a>`
          : "<span></span>"}
        ${next
          ? `<a class="st-nav-btn" href="#/special-topic/${next.id}${tabSuffix}">${escapeHtml(next.code)} →</a>`
          : "<span></span>"}
      </nav>
    `;
  }

  function bindViewer() {
    document.querySelector(".st-pdf-frame")?.addEventListener("load", () => {
      document.querySelector(".st-pdf-wrap")?.classList.add("is-loaded");
    });
  }

  return {
    renderCatalog,
    renderTopicViewer,
    bindViewer
  };
}
