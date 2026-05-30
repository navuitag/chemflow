import { readFile, writeFile } from "node:fs/promises";

/** SGK KHTN 8 – Kết nối tri thức (mạch Hóa: Chương 1–2, Bài 2–12) */
const lessons = [
  ["g8_b02", "Bài 2. Phản ứng hóa học", "Phản ứng hóa học", 1, 2, "Nhận biết PTHH, sản phẩm–chất tham gia; phản ứng hóa hợp, phân hủy, thế, trao đổi.", "reaction"],
  ["g8_b03", "Bài 3. Mol và tỉ khối chất khí", "Phản ứng hóa học", 1, 3, "Mol là đơn vị lượng chất; khối lượng mol, thể tích mol khí ở đktc.", "mole"],
  ["g8_b04", "Bài 4. Dung dịch và nồng độ", "Phản ứng hóa học", 1, 4, "Dung môi, dung dịch; nồng độ C%, nồng độ mol/l.", "solution"],
  ["g8_b05", "Bài 5. Bảo toàn khối lượng và phương trình hóa học", "Phản ứng hóa học", 1, 5, "Định luật bảo toàn khối lượng; cân bằng hệ số trong PTHH.", "equationBalance"],
  ["g8_b06", "Bài 6. Tính theo phương trình hóa học", "Phản ứng hóa học", 1, 6, "Tính khối lượng, thể tích, số mol chất theo tỉ lệ mol trong PTHH.", "stoichiometry"],
  ["g8_b07", "Bài 7. Tốc độ phản ứng và chất xúc tác", "Phản ứng hóa học", 1, 7, "Yếu tố ảnh hưởng tốc độ; vai trò xúc tác (MnO₂ với H₂O₂).", "catalyst"],
  ["g8_b08", "Bài 8. Acid", "Một số hợp chất thông dụng", 2, 8, "Định nghĩa axit Arrhenius; tính chất, ứng dụng axit vô cơ thường gặp.", "acid"],
  ["g8_b09", "Bài 9. Base – thang pH", "Một số hợp chất thông dụng", 2, 9, "Bazơ; thang pH; quan hệ H⁺, OH⁻ và trung hòa.", "acidbase"],
  ["g8_b10", "Bài 10. Oxide", "Một số hợp chất thông dụng", 2, 10, "Oxide axit, oxide bazơ; phản ứng với nước, axit, bazơ.", "oxide"],
  ["g8_b11", "Bài 11. Muối", "Một số hợp chất thông dụng", 2, 11, "Muối; phản ứng trao đổi; điều chế và ứng dụng muối.", "salt"],
  ["g8_b12", "Bài 12. Phân bón hóa học", "Một số hợp chất thông dụng", 2, 12, "Phân bón NPK; vai trò đạm, lân, kali đối với cây trồng.", "fertilizer"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 8 – Kết nối tri thức với cuộc sống (mạch Hóa), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  return {
    id,
    title,
    grade: 8,
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
  g8_b02: ["Phản ứng hóa học", "Chất tham gia → sản phẩm; có thể tỏa nhiệt hoặc cần nhiệt.", "2H₂ + O₂ → 2H₂O là phản ứng hóa hợp.", "Viết đúng chất rắn, lỏng, khí trong PTHH."],
  g8_b03: ["Mol và khối lượng mol", "1 mol H₂O có 6,02·10²³ phân tử; M(H₂O) ≈ 18 g/mol.", "18 g H₂O = 1 mol; 36 g = 2 mol.", "n = m/M; khối lượng mol đọc từ bảng TH."],
  g8_b04: ["Nồng độ dung dịch", "C% = khối lượng chất tan / khối lượng dung dịch × 100%.", "10 g muối + 90 g nước → C% ≈ 10%.", "Phân biệt chất tan, dung môi, dung dịch."],
  g8_b05: ["Bảo toàn và cân bằng", "Tổng khối lượng reactant = tổng khối lượng product (kín).", "2H₂ + O₂ → 2H₂O: 4g H + 32g O → 36g H₂O.", "Cân hệ số để mỗi nguyên tố bằng nhau hai vế."],
  g8_b06: ["Tính theo PTHH", "Dùng tỉ lệ mol từ hệ số để tìm khối lượng chất khác.", "2H₂ + O₂ → 2H₂O: 2 mol H₂ cần 1 mol O₂.", "Bước: mol chất đã biết → mol chất cần tìm → khối lượng."],
  g8_b07: ["Tốc độ và xúc tác", "Tăng nồng độ, nhiệt độ, diện tiếp xúc → nhanh hơn.", "MnO₂ xúc tác phân hủy H₂O₂.", "Xúc tác tăng tốc, không tiêu hao vĩnh viễn."],
  g8_b08: ["Axit", "Axit trong nước tạo H⁺; có vị chua, đổi màu quỳ đỏ.", "HCl, H₂SO₄ loãng cần cẩn thận khi pha.", "Không đổ nước vào axit đặc."],
  g8_b09: ["Bazơ và pH", "Bazơ tạo OH⁻; pH < 7 axit, pH > 7 bazơ, pH = 7 trung tính.", "NaOH + HCl → NaCl + H₂O.", "Dùng thang pH để so sánh độ axit/bazơ."],
  g8_b10: ["Oxide", "Oxide + nước → axit hoặc bazơ tùy loại.", "CO₂ + H₂O → H₂CO₃ (oxide axit); CaO + H₂O → Ca(OH)₂.", "Phân loại oxide axit / bazơ."],
  g8_b11: ["Muối", "Axit + bazơ → muối + nước; muối có ion kim loại và acid.", "NaCl, CaCO₃, KNO₃ ứng dụng rộng.", "Kiểm tra sự hình thành kết tủa hoặc khí."],
  g8_b12: ["Phân bón", "N (đạm), P (lân), K (kali) nuôi cây.", "NPK 16-16-8: % khối lượng N, P₂O₅, K₂O.", "Bón đúng liều, tránh ô nhiễm nước."]
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  const extra =
    id === "g8_b05" ? { left: "2H₂ + O₂", right: "2H₂O" } :
    id === "g8_b02" || id === "g8_b07" ? { reactants: "2H₂O₂", products: "2H₂O + O₂" } :
    id === "g8_b06" ? { left: "2H₂ + O₂", right: "2H₂O" } : {};
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization, ...extra },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g8_b02: [
    ["multiple_choice", "Phản ứng 2H₂ + O₂ → 2H₂O thuộc loại:", ["Hóa hợp", "Phân hủy", "Thế", "Trái đổi ion"], "Hóa hợp", "Nhiều chất tạo một sản phẩm."],
    ["multiple_choice", "Trong PTHH, hệ số đặt trước chất để:", ["Cân nguyên tử các nguyên tố", "Tăng khối lượng", "Đổi tên chất", "Tạo xúc tác"], "Cân nguyên tử các nguyên tố", "Bảo toàn nguyên tử."]
  ],
  g8_b03: [
    ["multiple_choice", "Khối lượng mol của H₂O (H=1, O=16) gần bằng:", ["18 g/mol", "16 g/mol", "2 g/mol", "32 g/mol"], "18 g/mol", "M = 1·2 + 16."],
    ["input", "18 g H₂O tương ứng bao nhiêu mol? (số thập phân, dùng dấu chấm)", "1", "n = m/M = 18/18."]
  ],
  g8_b04: [
    ["multiple_choice", "Dung dịch 10% NaCl nghĩa là:", ["10 g NaCl trong 100 g dung dịch", "10 g nước", "10 mol NaCl", "10% thể tích nước"], "10 g NaCl trong 100 g dung dịch", "C% theo khối lượng."],
    ["multiple_choice", "Chất tan trong dung dịch muối loãng là:", ["NaCl", "Nước", "Không khí", "Cát"], "NaCl", "Nước là dung môi."]
  ],
  g8_b05: [
    ["multiple_choice", "Định luật bảo toàn khối lượng phát biểu:", ["Khối lượng bảo toàn trong PƯ kín", "Khối lượng tăng mãi", "Chỉ bảo toàn thể tích", "Không áp dụng cho khí"], "Khối lượng bảo toàn trong PƯ kín", "Tổng KL reactant = product."],
    ["input", "Hệ số trước H₂O khi cân: H₂ + O₂ → ?H₂O là?", "2", "Cân O: 2H₂ + O₂ → 2H₂O."]
  ],
  g8_b06: [
    ["multiple_choice", "Theo 2H₂ + O₂ → 2H₂O, 4 mol H₂ cần bao nhiêu mol O₂?", ["2", "4", "1", "8"], "2", "Tỉ 2 : 1 : 2."],
    ["input", "1 mol H₂ (M=2) có khối lượng bao nhiêu gam?", "2", "m = n·M."]
  ],
  g8_b07: [
    ["multiple_choice", "Yếu tố nào thường làm tăng tốc độ phản ứng?", ["Tăng nhiệt độ", "Giảm nồng độ", "Loại bỏ xúc tác", "Làm lạnh mạnh"], "Tăng nhiệt độ", "Hạt va chạm hiệu quả hơn."],
    ["multiple_choice", "Chất xúc tác khi tham gia phản ứng:", ["Tăng tốc, hầu như không tiêu hao", "Bị mất hết", "Làm chậm", "Thay sản phẩm"], "Tăng tốc, hầu như không tiêu hao", "MnO₂ với H₂O₂."]
  ],
  g8_b08: [
    ["multiple_choice", "Dung dịch axit có pH thường:", ["< 7", "> 7", "= 14", "= 0 luôn"], "< 7", "Thang pH."],
    ["multiple_choice", "Axit HCl trong nước tạo ion:", ["H+", "OH-", "Na+", "Cl2"], "H+", "Định nghĩa Arrhenius."]
  ],
  g8_b09: [
    ["multiple_choice", "Dung dịch NaOH thuộc loại:", ["Bazơ", "Axit", "Muối", "Oxide"], "Bazơ", "Tạo OH⁻."],
    ["multiple_choice", "Phản ứng trung hòa HCl + NaOH tạo:", ["NaCl và H2O", "Chỉ H2", "Chỉ O2", "Không phản ứng"], "NaCl và H2O", "Axit + bazơ → muối + nước."]
  ],
  g8_b10: [
    ["multiple_choice", "CO₂ là oxide loại:", ["Axit", "Bazơ", "Trung tính", "Kim loại"], "Axit", "CO₂ + H₂O → axit yếu."],
    ["multiple_choice", "CaO (vôi sống) + H₂O tạo:", ["Ca(OH)2", "HCl", "CO2", "NaCl"], "Ca(OH)2", "Oxide bazơ."]
  ],
  g8_b11: [
    ["multiple_choice", "NaCl thuộc nhóm chất:", ["Muối", "Axit", "Bazơ", "Oxide axit"], "Muối", "Hợp chất ion."],
    ["multiple_choice", "Phản ứng axit + bazơ tạo ra:", ["Muối và nước", "Chỉ khí O2", "Chỉ kim loại", "Không sản phẩm"], "Muối và nước", "Trung hòa."]
  ],
  g8_b12: [
    ["multiple_choice", "Ký hiệu N trong NPK chỉ:", ["Đạm (nitơ)", "Lân", "Kali", "Nước"], "Đạm (nitơ)", "Nuôi lá, sinh trưởng."],
    ["multiple_choice", "Bón phân quá mức có thể gây:", ["Ô nhiễm nước", "Tăng oxy vô hạn", "Không ảnh hưởng", "Chỉ tăng pH = 14"], "Ô nhiễm nước", "Bảo vệ môi trường."]
  ]
};

const errors = [
  ["g8_b03", "16", "molar_mass_error", "Nhầm khối lượng mol H2O", "H2O: M ≈ 18, không phải 16.", "Cộng khối lượng nguyên tử trong công thức."],
  ["g8_b04", "90", "concentration_error", "Nhầm C% dung dịch", "10% là 10g tan / 100g dung dịch, không phải 90g tan.", "Xác định mẫu số đúng."],
  ["g8_b05", "h2o", "E002", "Chưa cân đủ H hoặc O", "Đếm nguyên tử hai vế sau khi đặt hệ số.", "Cân O sau khi cân H."],
  ["g8_b06", "4", "stoich_error", "Sai tỉ mol trong PTHH", "2H2 + O2 → 2H2O có tỉ mol 2:1:2.", "Dùng hệ số làm tỉ mol."],
  ["g8_b08", "7", "ph_error", "Nhầm pH axit", "pH < 7 là axit.", "pH = 7 trung tính."],
  ["g8_b09", "hcl", "neutral_error", "Nhầm sản phẩm trung hòa", "HCl + NaOH → NaCl + H2O.", "Không còn H+ và OH- dư."],
  ["g8_b10", "cao", "oxide_error", "Nhầm loại oxide", "CaO là oxide bazơ, CO2 là oxide axit.", "Thử với nước hoặc axit/bazơ."],
  ["g8_b11", "naoh", "salt_error", "Nhầm muối và bazơ", "NaOH là bazơ, NaCl là muối.", "Sau trung hòa mới có muối."]
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

const grade8Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade8Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade8Questions = lessons.flatMap(questionObjects);
const grade8Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
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

const lower = skillsFile.filter((s) => s.grade < 8);
const upper = skillsFile.filter((s) => s.grade > 8);
const lowerLessons = lessonsFile.filter((l) => lower.some((s) => s.id === l.skill));
const upperLessons = lessonsFile.filter((l) => upper.some((s) => s.id === l.skill));
const lowerQuestions = questionsFile.filter((q) => lower.some((s) => s.id === q.skill));
const upperQuestions = questionsFile.filter((q) => upper.some((s) => s.id === q.skill));
const keepErrors = errorsFile.filter((e) => lower.some((s) => s.id === e.skill) || upper.some((s) => s.id === e.skill));

const skills = [...lower, ...grade8Skills, ...upper];
const lessonData = [...lowerLessons, ...grade8Lessons, ...upperLessons];
const questions = [...lowerQuestions, ...grade8Questions, ...upperQuestions];
const allErrors = [...keepErrors, ...grade8Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 8 KNTT: ${grade8Skills.length} skills, ${grade8Questions.length} questions. Total: ${skills.length} skills.`);
