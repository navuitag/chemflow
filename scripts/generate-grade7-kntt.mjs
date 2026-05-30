import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 7 – Kết nối tri thức (mạch Hóa: Chương I–II, Bài 1–7) */
const lessons = [
  ["g7_b01", "Bài 1. Phương pháp và kĩ năng học tập môn KHTN", "Mở đầu KHTN 7", 1, 1, "Quan sát, đặt giả thuyết, thí nghiệm và rút ra kết luận khi học Hóa.", "khtn"],
  ["g7_b02", "Bài 2. Nguyên tử", "Nguyên tử. Bảng tuần hoàn", 1, 2, "Cấu tạo hạt nhân (p, n) và electron; số hiệu nguyên tử Z.", "atom"],
  ["g7_b03", "Bài 3. Nguyên tố hóa học", "Nguyên tử. Bảng tuần hoàn", 1, 3, "Nguyên tố là tập hợp các nguyên tử cùng Z; đồng vị, nguyên tử khối.", "atom"],
  ["g7_b04", "Bài 4. Sơ lược bảng tuần hoàn các nguyên tố", "Nguyên tử. Bảng tuần hoàn", 1, 4, "Chu kì, nhóm; xu hướng tính chất theo Z và cấu hình electron lớp ngoài.", "periodic"],
  ["g7_b05", "Bài 5. Phân tử – Đơn chất – Hợp chất", "Phân tử. Liên kết hóa học", 2, 5, "Phân biệt nguyên tử, phân tử, đơn chất, hợp chất; công thức hóa học đơn giản.", "moleculeTypes"],
  ["g7_b06", "Bài 6. Giới thiệu liên kết hóa học", "Phân tử. Liên kết hóa học", 2, 6, "Liên kết ion và liên kết cộng hóa trị; ví dụ NaCl, H₂O.", "bondIntro"],
  ["g7_b07", "Bài 7. Hóa trị và công thức hóa học", "Phân tử. Liên kết hóa học", 2, 7, "Hóa trị, quy tắc viết công thức hợp chất ion và cộng hóa trị cơ bản.", "valence"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 7 – Kết nối tri thức với cuộc sống (mạch Hóa), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  return {
    id,
    title,
    grade: 7,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: chapter,
    level: chapterIndex <= 1 ? 1 : 2,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g7_b01: ["Phương pháp khoa học", "Đặt câu hỏi → quan sát → thí nghiệm → kết luận → kiểm tra lại.", "Thí nghiệm đốt magiê trong không khí N₂ khác với trong không khí thường.", "Ghi chép số liệu và mô hình khi học Hóa."],
  g7_b02: ["Mô hình nguyên tử", "Hạt nhân gồm proton (+) và neutron; electron (-) quay quanh.", "Nguyên tử H: 1p, 0n, 1e; nguyên tử trung hòa khi p = e.", "Z = số proton = số electron (nguyên tử trung hòa)."],
  g7_b03: ["Nguyên tố hóa học", "Các nguyên tử cùng Z thuộc một nguyên tố; kí hiệu như O, Fe.", "Đồng vị: cùng Z, khác số neutron (¹²C, ¹⁴C).", "Nguyên tử khối trung bình tính theo tỉ lệ đồng vị."],
  g7_b04: ["Bảng tuần hoàn", "Hàng ngang: chu kì; cột dọc: nhóm; số nguyên tử tăng dần.", "Li, Na, K cùng nhóm I A → 1 e lớp ngoài → tính kim loại.", "Góc trên phải thường là khí hiếm, ít phản ứng."],
  g7_b05: ["Phân tử và hợp chất", "Phân tử gồm hai hay nhiều nguyên tử liên kết; O₂ là đơn chất.", "H₂O là hợp chất (H + O); CO₂ là hợp chất.", "Đơn chất: một nguyên tố; hợp chất: hai nguyên tố trở lên."],
  g7_b06: ["Hai loại liên kết", "Ion: trao electron (NaCl). Cộng hóa trị: dùng chung e⁻ (H₂O).", "Na → Na⁺ + e⁻; Cl + e⁻ → Cl⁻; Na⁺ hút Cl⁻.", "Kim loại + phi kim thường tạo liên kết ion."],
  g7_b07: ["Hóa trị và công thức", "Hóa trị = số electron tham gia liên kết (theo quy ước).", "NaCl: Na(I), Cl(I); Al₂O₃: Al(III), O(II).", "Tổng điện tích ion dương và âm trong hợp chất = 0."]
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  const extra = id === "g7_b02" ? { element: "H", protons: 1, neutrons: 0 } : id === "g7_b03" ? { element: "C", protons: 6, neutrons: 6 } : id === "g7_b04" ? { symbol: "Na" } : {};
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization, ...extra },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g7_b01: [
    ["multiple_choice", "Bước đúng trong phương pháp khoa học?", ["Thí nghiệm kiểm tra giả thuyết", "Kết luận trước khi quan sát", "Bỏ qua số liệu", "Không ghi chép"], "Thí nghiệm kiểm tra giả thuyết", "Khoa học cần bằng chứng."],
    ["multiple_choice", "Khi học Hóa trong KHTN, em nên:", ["Quan sát và mô hình hóa chất", "Chỉ học thuộc không thí nghiệm", "Nhầm Hóa với Vật lí", "Bỏ qua an toàn lab"], "Quan sát và mô hình hóa chất", "Hóa nghiên cứu chất và biến đổi."]
  ],
  g7_b02: [
    ["multiple_choice", "Hạt mang điện tích dương trong nguyên tử là:", ["Proton", "Electron", "Neutron", "Ion"], "Proton", "Proton ở hạt nhân."],
    ["input", "Nguyên tử cacbon có Z = 6. Số proton bằng?", "6", "Z = số proton."]
  ],
  g7_b03: [
    ["multiple_choice", "Nguyên tố hóa học là tập hợp các nguyên tử có:", ["Cùng số proton", "Cùng khối lượng", "Cùng số neutron", "Cùng số electron ion"], "Cùng số proton", "Định nghĩa theo Z."],
    ["multiple_choice", "Đồng vị là các nguyên tử cùng nguyên tố nhưng khác:", ["Số neutron", "Số proton", "Số electron hạt nhân", "Kí hiệu"], "Số neutron", "Cùng Z, khác n."]
  ],
  g7_b04: [
    ["multiple_choice", "Trong bảng tuần hoàn, các nguyên tố cùng nhóm có:", ["Số electron lớp ngoài giống nhau", "Khối lượng giống hệt", "Cùng số proton", "Không liên quan"], "Số electron lớp ngoài giống nhau", "Nhóm = cột."],
    ["multiple_choice", "Nguyên tố ở chu kì 3, nhóm I A (Na) có bao nhiêu electron lớp ngoài?", ["1", "2", "3", "8"], "1", "Cấu hình 2-8-1."]
  ],
  g7_b05: [
    ["multiple_choice", "O₂ (khí oxy) là:", ["Đơn chất", "Hợp chất", "Hỗn hợp", "Ion"], "Đơn chất", "Chỉ một nguyên tố O."],
    ["multiple_choice", "H₂O thuộc loại:", ["Hợp chất", "Đơn chất", "Nguyên tố", "Hỗn hợp không đồng nhất"], "Hợp chất", "Gồm H và O."]
  ],
  g7_b06: [
    ["multiple_choice", "NaCl hình thành nhờ liên kết:", ["Ion", "Cộng hóa trị thuần", "Kim loại", "Không có liên kết"], "Ion", "Na⁺ và Cl⁻."],
    ["multiple_choice", "Phân tử H₂O có liên kết chủ yếu:", ["Cộng hóa trị", "Ion", "Kim loại", "Hiđro giữa phân tử"], "Cộng hóa trị", "O và H dùng chung electron."]
  ],
  g7_b07: [
    ["multiple_choice", "Trong Al₂O₃, hóa trị của nhôm là:", ["III", "II", "I", "VI"], "III", "Al mất 3 electron."],
    ["input", "Hóa trị của oxi trong hợp chất thường là bao nhiêu? (số La Mã hoặc số)", "2", "O thường hóa trị II."]
  ]
};

const errors = [
  ["g7_b02", "electron", "particle_error", "Nhầm vị trí hạt", "Proton ở hạt nhân, electron ở vỏ.", "p⁺ trong nhân, e⁻ ngoài vỏ."],
  ["g7_b03", "khac z", "element_error", "Nhầm nguyên tố và nguyên tử", "Nguyên tố = tập nguyên tử cùng Z.", "Cùng số proton → cùng nguyên tố."],
  ["g7_b04", "78", "periodic_error", "Nhầm % khí với nhóm bảng", "78% là N₂ trong không khí, không phải nhóm bảng.", "Nhóm = cột, chu kì = hàng."],
  ["g7_b05", "o2", "substance_class", "Nhầm O₂ với hợp chất", "O₂ chỉ có nguyên tử O liên kết → đơn chất.", "Hợp chất cần ≥ 2 nguyên tố."],
  ["g7_b06", "nacl2", "formula_error", "Công thức ion sai", "NaCl không có chỉ số 2 sau Cl.", "Hóa trị Na(I) và Cl(I) triệt tiêu."],
  ["g7_b07", "al2", "valence_error", "Hóa trị nhôm chưa đúng", "Al thường hóa trị III trong Al₂O₃.", "Tổng điện tích = 0 khi ghép ion."]
];

function questionObjects([id]) {
  return q[id].map((entry, index) => {
    const [type, question, choicesOrAnswer, answerOrHint, maybeHint] = entry;
    const isChoice = type === "multiple_choice";
    return {
      id: `q_${id}_${index + 1}`,
      skill: id,
      type,
      question,
      ...(isChoice ? { choices: choicesOrAnswer, answer: answerOrHint, hint: maybeHint } : { answer: choicesOrAnswer, hint: answerOrHint })
    };
  });
}

const grade7Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade7Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade7Questions = lessons.flatMap(questionObjects);
const grade7Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
  pattern,
  skill,
  errorType,
  title,
  message,
  hint,
  recommendation: skill
}));

const skillsFile = JSON.parse(await readFile("data/skills.json", "utf8"));
const lessonsFile = JSON.parse(await readFile("data/lessons.json", "utf8"));
const questionsFile = JSON.parse(await readFile("data/questions.json", "utf8"));
const errorsFile = JSON.parse(await readFile("data/errors.json", "utf8"));

const grade6 = skillsFile.filter((s) => s.grade === 6);
const upper = skillsFile.filter((s) => s.grade > 7);
const grade6Lessons = lessonsFile.filter((l) => grade6.some((s) => s.id === l.skill));
const upperLessons = lessonsFile.filter((l) => upper.some((s) => s.id === l.skill));
const grade6Questions = questionsFile.filter((q) => grade6.some((s) => s.id === q.skill));
const upperQuestions = questionsFile.filter((q) => upper.some((s) => s.id === q.skill));

const keepErrors = errorsFile.filter((e) => grade6.some((s) => s.id === e.skill) || upper.some((s) => s.id === e.skill));

const skills = [...grade6, ...grade7Skills, ...upper];
const lessonData = [...grade6Lessons, ...grade7Lessons, ...upperLessons];
const questions = [...grade6Questions, ...grade7Questions, ...upperQuestions];
const allErrors = [...keepErrors, ...grade7Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 7 KNTT: ${grade7Skills.length} skills, ${grade7Questions.length} questions. Total: ${skills.length} skills.`);
