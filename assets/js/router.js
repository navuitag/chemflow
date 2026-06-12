import {
  getState,
  getProfiles,
  resetProgress,
  setSelectedGrade,
  completeOnboarding,
  restartOnboarding,
  updateState,
  createProfile,
  switchProfile,
  renameProfile,
  deleteProfile,
  hasProfiles
} from "./state.js";
import { setRoute, escapeHtml } from "./utils.js";
import { formatChemHtml } from "./chemFormat.js";
import { renderNavbar, renderBottomNav } from "../../components/navbar.js";
import { bindLearnerSwitcher, renderAddLearnerForm, renderLearnerList } from "../../components/learnerSwitcher.js";
import { bindEdtechHub, renderEdtechHubGrid } from "../../components/edtechHub.js";
import { renderAppFooter, renderAuthorCard } from "./author.js";
import { renderLessonCard } from "../../components/lessonCard.js";
import { renderQuizCard } from "../../components/quizCard.js";
import { renderFlashcardPanel } from "../../components/flashcardPanel.js";
import { renderMemoryPanel } from "../../components/memoryPanel.js";
import { showModal } from "../../components/modal.js";
import { renderVisualization, bindVisualizations } from "../../modules/visualization.js";
import { createPracticeModule } from "../../modules/practiceModes.js";
import { createSpecialTopicsModule } from "../../modules/specialTopics.js";
import { completeLesson } from "../../modules/lessonEngine.js";
import { submitAnswer } from "../../modules/quizEngine.js";
import { getGamificationSummary } from "../../modules/gamification.js";
import { getOverallAccuracy, getSkillProgress, getWeakSkills } from "../../modules/progress.js";
import { getStudyTimeSummary } from "./studyTime.js";
import { chapterMindMapHref, createMindMapModule } from "../../modules/mindMap.js";

const MINDMAP_CONFIG = {
  subject: "Hóa học",
  emoji: "⚗️",
  defaultGroupMode: "chapter"
};

let data = {
  skills: [],
  lessons: [],
  questions: [],
  errors: [],
  exercises: []
};

let practice;
let specialTopics;
let mindMap;
let mindMapGroupMode = MINDMAP_CONFIG.defaultGroupMode;

export function configureRouter(appData) {
  data = appData;
  practice = createPracticeModule({
    data,
    getState,
    updateState,
    renderRoute,
    setRoute,
    escapeHtml,
    showModal,
    renderVisualization,
    bindVisualizations,
    renderQuizCard,
    renderFlashcardPanel,
    renderMemoryPanel,
    labelSkill,
    notFound,
    handleAnswer
  });
  specialTopics = createSpecialTopicsModule({
    data,
    notFound,
    escapeHtml,
    subjectLabel: "Hóa học"
  });
  mindMap = createMindMapModule({
    data,
    getState,
    setSelectedGrade,
    renderRoute,
    escapeHtml,
    config: MINDMAP_CONFIG,
    setMindMapMode: (mode) => { mindMapGroupMode = mode; }
  });
  window.addEventListener("hashchange", renderRoute);
}

export function renderRoute() {
  const state = getState();
  const hash = window.location.hash || "#/home";
  const parts = hash.replace("#/", "").split("/").filter(Boolean);
  const route = parts[0] || "home";
  const id = parts[1];
  const sub = parts[2];

  practice?.resetOnLeavePractice(route);

  if (!state.onboarded) {
    render(renderOnboarding(state));
    bindOnboarding();
    return;
  }

  const shell = (content) => `
    ${renderNavbar(state, availableGrades())}
    <main class="app-shell">
      ${content}
    </main>
    ${renderAppFooter()}
    ${renderBottomNav()}
  `;

  let content;
  let after;

  if (route === "lesson") {
    content = renderLesson(id, state);
    after = () => bindLesson(id);
  } else if (route === "practice") {
    if (sub === "flashcards") {
      content = practice.renderPracticeFlashcards(id, state);
      after = () => practice.bindPracticeFlashcards();
    } else if (sub === "memory") {
      content = practice.renderPracticeMemory(id, state);
      after = () => practice.bindPracticeMemory(id);
    } else if (sub === "workbook") {
      content = practice.renderPracticeWorkbook(id, state);
      after = () => practice.bindPracticeWorkbook(id);
    } else {
      content = practice.renderPracticeQuiz(id, state);
      after = () => practice.bindPracticeQuiz(id);
    }
  } else if (route === "mindmap") {
    const mmKind = id;
    const mmParam = sub;
    const mmParam2 = parts[3];
    if (mmKind === "topic" && mmParam) {
      content = mindMap.renderTopicPage(state, mmParam, { groupMode: mindMapGroupMode });
      after = () => mindMap.bindPage(state);
    } else if (mmKind === "lesson" && mmParam) {
      content = mindMap.renderSkillPage(state, mmParam);
      after = () => mindMap.bindPage(state);
    } else if (mmKind === "summer" && mmParam && mmParam2) {
      content = mindMap.renderSummerTopicPage(state, mmParam, mmParam2);
      after = () => mindMap.bindPage(state);
    } else {
      content = mindMap.renderPage(state, { groupMode: mindMapGroupMode });
      after = () => mindMap.bindPage(state);
    }
  } else if (route === "skills") {
    content = renderSkills(state);
    after = bindSkills;
  } else if (route === "special-topic") {
    if (id && (sub === "pdf" || sub === "image")) {
      content = specialTopics.renderTopicViewer(id, sub);
      after = () => specialTopics.bindViewer();
    } else if (id) {
      content = specialTopics.renderTopicViewer(id, "image");
      after = () => specialTopics.bindViewer();
    } else {
      content = specialTopics.renderCatalog();
    }
  } else if (route === "review") {
    content = renderErrors(state);
  } else if (route === "profile") {
    content = renderProfile(state);
    after = bindProfile;
  } else {
    content = renderHome(state);
  }

  render(shell(content));
  bindNavbar();
  if (after) after();
}

function bindNavbar() {
  bindEdtechHub();
  bindLearnerSwitcher({
    onSwitch: (profileId) => {
      switchProfile(profileId);
      renderRoute();
    },
    onAdd: () => setRoute("#/profile")
  });

  const select = document.querySelector("#gradeSelect");
  if (!select) return;
  select.addEventListener("change", () => {
    setSelectedGrade(Number(select.value));
    renderRoute();
  });
}

function renderOnboarding(state) {
  const grades = availableGrades();
  const isNewAccount = !hasProfiles();
  const cards = grades.map((grade) => {
    const count = data.skills.filter((skill) => skill.grade === grade).length;
    const chapters = new Set(data.skills.filter((skill) => skill.grade === grade).map((skill) => skill.chapterIndex)).size;
    return `
      <button class="grade-pick" data-grade="${grade}" type="button">
        <span class="grade-pick-num">Lớp ${grade}</span>
        <span class="grade-pick-meta">${chapters} chương · ${count} bài</span>
      </button>
    `;
  }).join("");

  return `
    <main class="onboarding">
      <section class="onboarding-card">
        <span class="brand-mark">C</span>
        <span class="eyebrow">Chào mừng đến ChemFlow VN</span>
        <h1>${isNewAccount ? "Ai sẽ học hôm nay?" : "Bạn đang học lớp mấy?"}</h1>
        <p>${isNewAccount
    ? "Nhập tên người học và chọn lớp. Mỗi người có tiến độ riêng — phù hợp khi nhiều em cùng dùng một máy."
    : "Chọn lớp để mở đúng lộ trình Hóa THCS. Bạn có thể đổi lớp bất cứ lúc nào trên thanh điều hướng."}</p>
        ${isNewAccount ? `
          <label class="onboarding-name">
            <span>Tên người học</span>
            <input type="text" id="onboardingName" maxlength="40" placeholder="Ví dụ: Minh, Lan..." value="${escapeHtml(state.user.name === "Bạn học nhỏ" ? "" : state.user.name)}" required>
          </label>` : ""}
        <div class="grade-pick-grid">
          ${cards}
        </div>
      </section>
    </main>
  `;
}

function bindOnboarding() {
  document.querySelectorAll(".grade-pick").forEach((button) => {
    button.addEventListener("click", () => {
      const grade = Number(button.dataset.grade);
      const nameInput = document.querySelector("#onboardingName");
      const name = nameInput?.value?.trim();

      if (nameInput && !name) {
        nameInput.focus();
        return;
      }

      if (!hasProfiles()) {
        createProfile(name || "Bạn học nhỏ");
      }

      completeOnboarding(grade, name);
      if (window.location.hash === "#/home") {
        renderRoute();
      } else {
        setRoute("#/home");
      }
    });
  });
}

function render(content) {
  document.querySelector("#app").innerHTML = content;
}

function renderHome(state) {
  const study = getStudyTimeSummary(state);
  const summary = getGamificationSummary(state);
  const activeGrade = resolveGrade(state);
  const gradeSkills = data.skills.filter((skill) => skill.grade === activeGrade);
  const nextSkill = gradeSkills.find((skill) => !state.completedLessons.includes(skill.id)) || gradeSkills[0] || data.skills[0];
  const questPercent = Math.round((state.dailyQuest.progress / state.dailyQuest.target) * 100);
  const weakSkill = getWeakSkills(state)[0];

  return `
    <section class="summer-banner st-home-banner">
      <div>
        <span class="tag">Chuyên đề · 14 chủ đề</span>
        <h2>Tài liệu chuyên đề Hóa — xem sơ đồ trực tiếp</h2>
        <p>Chất, phản ứng, axit-bazơ, tính toán hóa học… sơ đồ tư duy đầy đủ cho THCS.</p>
      </div>
      <a class="btn secondary" href="#/special-topic">Mở thư viện 📚</a>
    </section>
    <section class="hero-panel">
      <div>
        <span class="eyebrow">Lộ trình hôm nay · ${escapeHtml(state.user.name)} · Lớp ${activeGrade}</span>
        <h1>Học Hóa mỗi ngày, hiểu rõ từng lỗi sai.</h1>
        <p>Hoàn thành một bài ngắn, luyện vài câu và xem ngay vì sao phương trình hoặc mô hình chưa đúng.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/lesson/${nextSkill.id}">Tiếp tục học</a>
          <a class="btn secondary" href="#/practice/${nextSkill.id}">Luyện nhanh</a>
        </div>
      </div>
      <div class="daily-card">
        <span class="tag">Daily Quest</span>
        <h2>${state.dailyQuest.progress}/${state.dailyQuest.target} câu đúng</h2>
        <div class="progress-track"><span style="width:${questPercent}%"></span></div>
        <p>${weakSkill ? `Nên ôn thêm: ${labelSkill(weakSkill.skill)}` : "Bạn chưa có lỗi nổi bật. Khởi động nhẹ thôi."}</p>
      </div>
    </section>
    <section class="stat-grid">
      <article><strong>${study.todayLabel}</strong><span>Học hôm nay</span></article>
      <article><strong>${state.todayXp}</strong><span>XP hôm nay</span></article>
      <article><strong>${state.streak}</strong><span>Chuỗi ngày</span></article>
      <article><strong>${study.totalLabel}</strong><span>Tổng giờ học</span></article>
      <article><strong>${getOverallAccuracy(state)}%</strong><span>Độ chính xác</span></article>
      <article><strong>${summary.level}</strong><span>Cấp độ</span></article>
    </section>
    <section class="section-head">
      <h2>Kỹ năng tiếp theo · Lớp ${activeGrade}</h2>
      <a href="#/mindmap">Sơ đồ tư duy</a> · <a href="#/skills">Cây kỹ năng</a>
    </section>
    <div class="skill-grid">
      ${gradeSkills.slice(0, 3).map((skill) => renderLessonCard(skill, state, data.questions)).join("")}
    </div>
    ${renderEdtechHubGrid()}
  `;
}

function availableGrades() {
  return [...new Set(data.skills.map((skill) => skill.grade))].sort((a, b) => a - b);
}

function resolveGrade(state) {
  const grades = availableGrades();
  return grades.includes(state.selectedGrade) ? state.selectedGrade : grades[0];
}

function groupByChapter(skills) {
  const groups = new Map();
  skills
    .slice()
    .sort((a, b) => (a.chapterIndex - b.chapterIndex) || (a.lessonNo - b.lessonNo))
    .forEach((skill) => {
      const key = `${skill.chapterIndex}|${skill.chapter}`;
      if (!groups.has(key)) {
        groups.set(key, { chapter: skill.chapter, chapterIndex: skill.chapterIndex, book: skill.book, items: [] });
      }
      groups.get(key).items.push(skill);
    });
  return [...groups.values()];
}

function renderSkills(state) {
  const grades = availableGrades();
  const activeGrade = resolveGrade(state);
  const gradeSkills = data.skills.filter((skill) => skill.grade === activeGrade);
  const completedCount = gradeSkills.filter((skill) => state.completedLessons.includes(skill.id)).length;
  const chapters = groupByChapter(gradeSkills);

  const tabs = grades.map((grade) => {
    const count = data.skills.filter((skill) => skill.grade === grade).length;
    const isActive = grade === activeGrade ? " active" : "";
    return `<button class="grade-tab${isActive}" data-grade="${grade}" aria-pressed="${grade === activeGrade}">
      <strong>Lớp ${grade}</strong>
      <span>${count} bài</span>
    </button>`;
  }).join("");

  const chapterSections = chapters.map((group) => `
    <section class="chapter-group">
      <header class="chapter-head">
        <span class="tag">Chương ${group.chapterIndex} · ${group.book}</span>
        <h2>${group.chapter}</h2>
        <a class="chapter-mm-link" href="${chapterMindMapHref(group.items[0], mindMapGroupMode)}">🧠 Sơ đồ chủ đề</a>
      </header>
      <div class="skill-path">
        ${group.items.map((skill) => renderLessonCard(skill, state, data.questions)).join("")}
      </div>
    </section>
  `).join("");

  return `
    <section class="page-title">
      <span class="eyebrow">Skill Tree</span>
      <h1>Cây kỹ năng Hóa THCS</h1>
      <p>Chọn lớp để bắt đầu. Mỗi nút là một vi kỹ năng; hoàn thành bài trước để mở khóa bài tiếp theo.</p>
    </section>
    <div class="grade-tabs" role="group" aria-label="Chọn lớp">
      ${tabs}
    </div>
    <div class="grade-summary">
      <span>Lớp ${activeGrade} · ${chapters.length} chương · ${gradeSkills.length} bài</span>
      <span>${completedCount}/${gradeSkills.length} bài đã hoàn thành</span>
    </div>
    ${chapterSections}
  `;
}

function bindSkills() {
  document.querySelectorAll(".grade-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      setSelectedGrade(Number(tab.dataset.grade));
      renderRoute();
      document.querySelector(".grade-tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function renderLesson(id, state) {
  const lesson = data.lessons.find((item) => item.id === id);
  if (!lesson) return notFound("Không tìm thấy bài học.");
  const skillProgress = getSkillProgress({ id: lesson.skill }, state, data.questions);

  return `
    <section class="lesson-layout">
      <aside class="lesson-sidebar">
        <a class="back-link" href="#/skills">← Kỹ năng</a>
        <a class="lesson-mm-link" href="#/mindmap/lesson/${id}">🧠 Sơ đồ bài học</a>
        <h1>${lesson.title}</h1>
        <p>${skillProgress.mastery}% mastery</p>
        <div class="progress-track"><span style="width:${skillProgress.mastery}%"></span></div>
      </aside>
      <div class="lesson-steps">
        ${lesson.steps.map((step, index) => `
          <article class="lesson-step">
            <span class="step-count">${index + 1}</span>
            <div>
              <h2>${step.title}</h2>
              <p class="chem-content">${formatChemHtml(step.content)}</p>
              ${step.type === "visualization" ? renderVisualization(step) : ""}
            </div>
          </article>
        `).join("")}
        <div class="completion-panel">
          <div>
            <h2>Sẵn sàng luyện tập?</h2>
            <p>Hoàn thành bài để nhận ${lesson.xp} XP rồi làm mini quiz.</p>
          </div>
          <button class="btn primary" id="completeLesson">Hoàn thành</button>
        </div>
      </div>
    </section>
  `;
}

function bindLesson(id) {
  bindVisualizations();
  const lesson = data.lessons.find((item) => item.id === id);
  const button = document.querySelector("#completeLesson");
  if (!lesson || !button) return;
  button.addEventListener("click", () => {
    completeLesson(lesson);
    showModal({
      title: "Bài học đã hoàn thành",
      body: `Bạn nhận ${lesson.xp} XP. Giờ mình chuyển sang phần luyện tập nhé.`,
      actionLabel: "Luyện ngay"
    });
    setTimeout(() => setRoute(`#/practice/${lesson.skill}`), 500);
  });
}

function handleAnswer(answer, question, skillId) {
  const result = submitAnswer(answer, question, data.errors);
  const panel = document.querySelector(".feedback-panel");
  const card = document.querySelector(".quiz-card");
  card.classList.remove("is-correct", "is-wrong");
  card.classList.add(result.correct ? "is-correct" : "is-wrong");
  const isWorkbook = String(question.id || "").startsWith("ex_");

  if (result.correct) {
    const completed = isWorkbook
      ? practice.onWorkbookAnswerCorrect(skillId)
      : practice.onPracticeAnswerCorrect(skillId);
    panel.innerHTML = `
      <strong>Chính xác! +${result.xp} XP</strong>
      <p>${completed ? "Bạn đã trả lời đúng tất cả câu hỏi của bài này." : "Câu tiếp theo sẽ xuất hiện sau một nhịp."}</p>
    `;
    return;
  }

  panel.innerHTML = `
    <strong>${escapeHtml(result.error.title)}</strong>
    <p class="chem-content">${formatChemHtml(result.error.message)}</p>
    <p class="chem-content"><b>Gợi ý:</b> ${formatChemHtml(result.error.hint)}</p>
    <a class="btn quiet" href="#/lesson/${result.error.recommendation}">Ôn lại bài liên quan</a>
  `;
}

function renderErrors(state) {
  const weakSkills = getWeakSkills(state);
  return `
    <section class="page-title">
      <span class="eyebrow">Error Review</span>
      <h1>Sổ tay lỗi sai</h1>
      <p>Ứng dụng lưu lỗi gần đây để gợi ý bài cần ôn — đặc biệt khi cân bằng phương trình hoặc nhầm hóa trị.</p>
    </section>
    <div class="review-grid">
      <article class="review-summary">
        <h2>Kỹ năng cần chú ý</h2>
        ${weakSkills.length ? weakSkills.map((item) => `
          <div class="weak-row">
            <span>${labelSkill(item.skill)}</span>
            <strong>${item.count} lỗi</strong>
          </div>
        `).join("") : "<p>Chưa có lỗi nào được ghi nhận.</p>"}
      </article>
      <div class="error-list">
        ${state.errors.length ? state.errors.map((error) => `
          <article class="error-card">
            <span class="tag">${labelSkill(error.skill)}</span>
            <h2>${escapeHtml(error.title)}</h2>
            <p class="chem-content">${formatChemHtml(error.message)}</p>
            <p class="chem-content"><b>Gợi ý:</b> ${formatChemHtml(error.hint)}</p>
            <a class="btn quiet" href="#/practice/${error.recommendation}">Luyện lại</a>
          </article>
        `).join("") : "<article class='empty-state'>Làm vài câu quiz để sổ tay bắt đầu ghi nhận lỗi nhé.</article>"}
      </div>
    </div>
  `;
}

function renderProfile(state) {
  const study = getStudyTimeSummary(state);
  const summary = getGamificationSummary(state);
  const profiles = getProfiles();

  return `
    <section class="page-title">
      <span class="eyebrow">Hồ sơ</span>
      <h1>${escapeHtml(state.user.name)}</h1>
      <p>Đang học Lớp ${resolveGrade(state)} · Level ${summary.level} · ${state.xp} XP</p>
    </section>
    <section class="profile-grid">
      <article>
        <h2>Thời gian học</h2>
        <p>Hôm nay: <strong>${study.todayLabel}</strong> · Tổng: <strong>${study.totalLabel}</strong></p>
        <p class="text-muted">Tự động ghi nhận khi em mở app và học (tab đang hiển thị).</p>
      </article>
      <article>
        <h2>Huy hiệu</h2>
        <div class="badge-list">
          ${summary.badges.length ? summary.badges.map((badge) => `<span>${badge}</span>`).join("") : "<p>Hoàn thành bài đầu tiên để nhận huy hiệu.</p>"}
        </div>
      </article>
      <article>
        <h2>Tiến độ cấp độ</h2>
        <div class="progress-track"><span style="width:${Math.round((summary.currentLevelXp / summary.nextLevelXp) * 100)}%"></span></div>
        <p>${summary.currentLevelXp}/${summary.nextLevelXp} XP tới level tiếp theo</p>
      </article>
      <article>
        <h2>Lớp đang học</h2>
        <p>Bạn đang theo lộ trình Lớp ${resolveGrade(state)}. Đổi lớp sẽ mở lại màn hình chọn lớp (tiến độ được giữ nguyên).</p>
        <button class="btn secondary" id="changeGrade">Đổi lớp</button>
      </article>
      <article>
        <h2>Dữ liệu người học này</h2>
        <p>Xóa tiến độ chỉ ảnh hưởng hồ sơ <strong>${escapeHtml(state.user.name)}</strong>, không ảnh hưởng người học khác.</p>
        <button class="btn danger" id="resetProgress">Xóa tiến độ người này</button>
      </article>
    </section>
    <section class="section-head">
      <h2>Người học trên máy này</h2>
      <p>Mỗi người có XP, bài hoàn thành và lỗi sai riêng.</p>
    </section>
    <div class="learner-list">
      ${renderLearnerList(state, profiles)}
    </div>
    <section class="add-learner-panel">
      <h2>Thêm người học mới</h2>
      ${renderAddLearnerForm()}
    </section>
    ${renderAuthorCard()}
  `;
}

function bindProfile() {
  const reset = document.querySelector("#resetProgress");
  if (reset) {
    reset.addEventListener("click", () => {
      if (!window.confirm(`Xóa toàn bộ tiến độ của ${getState().user.name}?`)) return;
      resetProgress();
      setRoute("#/home");
    });
  }

  const changeGrade = document.querySelector("#changeGrade");
  if (changeGrade) {
    changeGrade.addEventListener("click", () => {
      restartOnboarding();
      renderRoute();
    });
  }

  document.querySelectorAll("[data-switch-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      switchProfile(button.dataset.switchProfile);
      renderRoute();
    });
  });

  document.querySelectorAll("[data-rename-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = getProfiles().find((item) => item.id === button.dataset.renameProfile);
      if (!profile) return;
      const nextName = window.prompt("Tên mới:", profile.name);
      if (!nextName?.trim()) return;
      renameProfile(profile.id, nextName.trim());
      renderRoute();
    });
  });

  document.querySelectorAll("[data-delete-profile]").forEach((button) => {
    button.addEventListener("click", () => {
      const profile = getProfiles().find((item) => item.id === button.dataset.deleteProfile);
      if (!profile) return;
      if (!window.confirm(`Xóa hồ sơ "${profile.name}" và toàn bộ tiến độ?`)) return;
      deleteProfile(profile.id);
      renderRoute();
    });
  });

  document.querySelector("#addLearnerForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(event.target).get("name")?.toString().trim();
    if (!name) return;
    createProfile(name);
    restartOnboarding();
    renderRoute();
  });
}

function labelSkill(id) {
  return data.skills.find((skill) => skill.id === id)?.title || id;
}

function notFound(message) {
  return `<section class="empty-state">${message}<br><a class="btn primary" href="#/home">Về trang chính</a></section>`;
}
