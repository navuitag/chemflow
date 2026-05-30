import { readFile, writeFile } from "node:fs/promises";

/** SGK Khoa học tự nhiên 6 – Kết nối tri thức (mạch Hóa: Chương I–IV) */
const lessons = [
  ["g6_b01", "Bài 1. Giới thiệu về Khoa học tự nhiên", "Mở đầu về Khoa học tự nhiên", 1, 1, "Nhận biết ba lĩnh vực KHTN và vai trò Hóa học trong đời sống.", "khtn"],
  ["g6_b02", "Bài 2. An toàn trong phòng thực hành", "Mở đầu về Khoa học tự nhiên", 1, 2, "Tuân thủ quy tắc an toàn khi làm thí nghiệm Hóa – Sinh – Vật lí.", "lab"],
  ["g6_b06", "Bài 6. Đo khối lượng", "Mở đầu về Khoa học tự nhiên", 1, 6, "Dùng cân, đơn vị gam và kilogam khi đo chất trong thí nghiệm.", "measure"],
  ["g6_b08", "Bài 8. Đo nhiệt độ", "Mở đầu về Khoa học tự nhiên", 1, 8, "Đọc nhiệt kế, đổi độ C và liên hệ với chuyển thể chất.", "temperature"],
  ["g6_b09", "Bài 9. Sự đa dạng của chất", "Chất quanh ta", 2, 9, "Phân biệt chất tinh khiết, hỗn hợp và tính chất vật lí – hóa học cơ bản.", "substances"],
  ["g6_b10", "Bài 10. Các thể của chất và sự chuyển thể", "Chất quanh ta", 2, 10, "Mô tả rắn, lỏng, khí và nóng chảy, hóa hơi, ngưng tụ, thăng hoa.", "states"],
  ["g6_b11", "Bài 11. Oxygen. Không khí", "Chất quanh ta", 2, 11, "Tính chất oxy, thành phần không khí và vai trò trong sự cháy.", "oxygen"],
  ["g6_b12", "Bài 12. Một số vật liệu", "Vật liệu, nguyên liệu, nhiên liệu, thực phẩm", 3, 12, "Phân loại vật liệu: kim loại, phi kim, polime và ứng dụng.", "materials"],
  ["g6_b13", "Bài 13. Một số nguyên liệu", "Vật liệu, nguyên liệu, nhiên liệu, thực phẩm", 3, 13, "Nguyên liệu trong sản xuất: khoáng, dầu mỏ, sinh khối.", "materials"],
  ["g6_b14", "Bài 14. Một số nhiên liệu", "Vật liệu, nguyên liệu, nhiên liệu, thực phẩm", 3, 14, "Nhiên liệu hóa thạch, sinh học; sự cháy và tiết kiệm năng lượng.", "fuels"],
  ["g6_b15", "Bài 15. Một số lương thực, thực phẩm", "Vật liệu, nguyên liệu, nhiên liệu, thực phẩm", 3, 15, "Thành phần dinh dưỡng cơ bản và bảo quản thực phẩm.", "food"],
  ["g6_b16", "Bài 16. Hỗn hợp các chất", "Hỗn hợp. Tách chất ra khỏi hỗn hợp", 4, 16, "Phân biệt hỗn hợp đồng nhất, không đồng nhất; ví dụ dung dịch, không khí.", "mixture"],
  ["g6_b17", "Bài 17. Tách chất khỏi hỗn hợp", "Hỗn hợp. Tách chất ra khỏi hỗn hợp", 4, 17, "Lọc, khơi, chưng cất, thăng hoa và chọn phương pháp phù hợp.", "separation"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 6 – Kết nối tri thức với cuộc sống (mạch Hóa), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  return {
    id,
    title,
    grade: 6,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: chapter,
    level: chapterIndex <= 1 ? 1 : chapterIndex <= 2 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g6_b01: ["Ba lĩnh vực KHTN", "Vật lí, Sinh học, Hóa học cùng dùng quan sát, thí nghiệm và mô hình.", "Nghiên cứu quá trình lên men sữa chua thuộc Sinh học và Hóa học.", "Hóa học tập trung vào chất và sự biến đổi của chất."],
  g6_b02: ["Quy tắc an toàn", "Không nếm, không ngửi trực tiếp; đeo kính bảo hộ; đọc nhãn hóa chất.", "Axit loãng phải đổ chậm vào nước, không đổ ngược.", "Báo ngay giáo viên khi có sự cố."],
  g6_b06: ["Cân và đơn vị", "Khối lượng đo lượng chất; đơn vị thường dùng: g, kg.", "10 g muối + 5 g đường trong cốc cho tổng khối lượng hỗn hợp rắn 15 g.", "Đặt cân trên mặt phẳng, không rung khi đọc số."],
  g6_b08: ["Nhiệt kế", "Nhiệt độ ảnh hưởng thể chất; nước sôi khoảng 100°C (áp suất thường).", "Nước đá tan ở 0°C là ví dụ chuyển thể khi đủ nhiệt.", "Đọc vạch ngang mực nước hoặc cột thủy ngân."],
  g6_b09: ["Chất quanh ta", "Mỗi chất có tính chất riêng; có chất tinh khiết và hỗn hợp.", "Muối ăn tinh khiết NaCl; nước biển là hỗn hợp muối và nước.", "Tách thử bằng tính chất vật lí hoặc hóa học."],
  g6_b10: ["Ba thể chất", "Rắn, lỏng, khí khác nhau về khoảng cách và chuyển động hạt.", "Nước đá → nước lỏng: nóng chảy; nước lỏng → hơi: hóa hơi.", "Cùng chất, khác thể tùy nhiệt độ và áp suất."],
  g6_b11: ["Oxy và không khí", "Oxy hỗ trợ sự chay; không khí ~21% O₂, ~78% N₂.", "Nến cháy trong bình kín sẽ tắt khi hết oxy.", "Sự chay cần oxy, nhiên liệu và nhiệt độ đủ."],
  g6_b12: ["Vật liệu", "Kim loại dẫn điện tốt; nhựa polime cách điện, nhẹ.", "Đồng dùng dây điện; nhựa PVC làm ống nước.", "Chọn vật liệu theo tính chất cần dùng."],
  g6_b13: ["Nguyên liệu", "Nguyên liệu là đầu vào sản xuất: quặng, gỗ, dầu thô.", "Sắt từ quặng hematit; đường từ mía là nguyên liệu thực phẩm.", "Phân biệt nguyên liệu và sản phẩm."],
  g6_b14: ["Nhiên liệu", "Than, dầu, khí đốt chứa năng lượng hóa học.", "Cháy than tỏa nhiệt; khí metan trong bếp gas.", "Tiết kiệm nhiên liệu, tránh cháy nổ."],
  g6_b15: ["Thực phẩm", "Tinh bột, đường, protein, chất béo là nhóm chất chính.", "Gạo nhiều tinh bột; trứng giàu protein.", "Bảo quản khô ráo, mát hoặc lạnh tùy loại."],
  g6_b16: ["Hỗn hợp", "Hỗn hợp gồm hai hay nhiều chất, giữ tính chất từng thành phần.", "Nước muối là dung dịch (hỗn hợp đồng nhất); nước + cát là không đồng nhất.", "Không phải mọi dung dịch đều có thể nhìn thấy hai pha."],
  g6_b17: ["Tách hỗn hợp", "Lọc tách rắn–lỏng; khơi tách chất không hòa tan; chưng cất theo nhiệt độ sôi.", "Tách cát khỏi nước bằng lọc; tách muối từ nước biển bằng cô.", "Chọn phương pháp theo tính chất thành phần."]
};

function lessonSteps(item) {
  const [id, title, chapter, , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g6_b01: [
    ["multiple_choice", "Hóa học nghiên cứu chủ yếu điều gì?", ["Chất và sự biến đổi của chất", "Chỉ chuyển động cơ", "Chỉ tế bào", "Chỉ hành tinh"], "Chất và sự biến đổi của chất", "Hóa học là một nhánh của KHTN."],
    ["multiple_choice", "Khoa học tự nhiên gồm những lĩnh vực nào?", ["Vật lí, Hóa học, Sinh học", "Chỉ Toán", "Chỉ Văn", "Chỉ Địa"], "Vật lí, Hóa học, Sinh học", "Ba lĩnh vực cốt lõi THCS."]
  ],
  g6_b02: [
    ["multiple_choice", "Khi làm thí nghiệm với axit, việc nào đúng?", ["Đổ axit chậm vào nước", "Đổ nước vào axit đặc", "Nếm thử dung dịch", "Không đeo kính"], "Đổ axit chậm vào nước", "Tránh bắn axit."],
    ["multiple_choice", "Phát hiện chất lạ bị đổ trong phòng lab, em nên:", ["Báo giáo viên ngay", "Nếm thử", "Đổ ra sàn", "Trộn thử với axit"], "Báo giáo viên ngay", "An toàn là ưu tiên."]
  ],
  g6_b06: [
    ["multiple_choice", "Đơn vị nào thường dùng đo khối lượng nhỏ trong lab?", ["gam (g)", "mét (m)", "giây (s)", "độ C"], "gam (g)", "g và kg là đơn vị khối lượng."],
    ["input", "Cân được 250 g muối. Viết số (chỉ số, không đơn vị).", "250", "Đọc thước hoặc màn hình cân."]
  ],
  g6_b08: [
    ["multiple_choice", "Nước sôi ở áp suất thường khoảng bao nhiêu độ C?", ["100", "0", "37", "50"], "100", "Điều kiện chuẩn trong SGK."],
    ["multiple_choice", "Nhiệt độ làm băng tan thành nước lỏng (0°C) gọi là:", ["Nhiệt độ nóng chảy", "Nhiệt độ sôi", "Nhiệt độ sôi của muối", "Nhiệt độ cháy"], "Nhiệt độ nóng chảy", "Chuyển rắn → lỏng."]
  ],
  g6_b09: [
    ["multiple_choice", "Nước biển thuộc loại nào?", ["Hỗn hợp", "Chất tinh khiết", "Nguyên tố", "Hợp chất tinh khiết đơn"], "Hỗn hợp", "Có nhiều muối hòa tan."],
    ["multiple_choice", "Muối ăn tinh khiết NaCl là:", ["Chất tinh khiết", "Hỗn hợp", "Không khí", "Dung dịch"], "Chất tinh khiết", "Một loại chất duy nhất."]
  ],
  g6_b10: [
    ["multiple_choice", "Ở thể rắn, các hạt thường:", ["Sắp xếp chặt, rung tại vị trí", "Xa nhau hoàn toàn", "Không chuyển động", "Bay tự do như khí"], "Sắp xếp chặt, rung tại vị trí", "Giữ hình dạng và thể tích."],
    ["multiple_choice", "Nước đá tan thành nước lỏng là:", ["Nóng chảy", "Hóa hơi", "Ngưng tụ", "Thăng hoa"], "Nóng chảy", "Rắn → lỏng."]
  ],
  g6_b11: [
    ["multiple_choice", "Không khí chứa khoảng bao nhiêu % thể tích oxy?", ["21", "78", "50", "100"], "21", "Thành phần chính của không khí."],
    ["multiple_choice", "Oxy có vai trò gì trong sự cháy?", ["Hỗ trợ sự cháy", "Dập tắt mọi lửa", "Làm chất rắn nguội", "Thay thế nhiên liệu"], "Hỗ trợ sự cháy", "Tam giác cháy: oxy, nhiên liệu, nhiệt."]
  ],
  g6_b12: [
    ["multiple_choice", "Vật liệu nào thường dẫn điện tốt?", ["Đồng", "Nhựa PVC", "Gỗ khô", "Thủy tinh"], "Đồng", "Kim loại dẫn điện."],
    ["multiple_choice", "Polime (nhựa) thường có đặc điểm:", ["Cách điện, nhẹ", "Rất nặng như sắt", "Tan trong nước như đường", "Dẫn điện như đồng"], "Cách điện, nhẹ", "Ứng dụng bao bì, ống."]
  ],
  g6_b13: [
    ["multiple_choice", "Quặng sắt là:", ["Nguyên liệu", "Sản phẩm cuối", "Dụng cụ đo", "Chất xúc tác"], "Nguyên liệu", "Dùng luyện thép."],
    ["multiple_choice", "Đường mía sau khi ép lấy nước cốt, phần còn lại có thể làm:", ["Nguyên liệu thức ăn gia súc", "Oxy thở", "Kim loại", "Khí noble"], "Nguyên liệu thức ăn gia súc", "Tận dụng phụ phẩm."]
  ],
  g6_b14: [
    ["multiple_choice", "Than đá, dầu mỏ thuộc nhóm:", ["Nhiên liệu hóa thạch", "Kim loại", "Axit", "Muối ăn"], "Nhiên liệu hóa thạch", "Chứa năng lượng hóa học."],
    ["multiple_choice", "Khí metan (CH₄) cháy tạo ra chủ yếu:", ["CO₂ và H₂O", "Chỉ muối", "Chỉ sắt", "Oxy"], "CO₂ và H₂O", "Phản ứng cháy hoàn toàn đơn giản."]
  ],
  g6_b15: [
    ["multiple_choice", "Gạo tẩm chứa nhiều chất dinh dưỡng nào?", ["Tinh bột", "Protein như thịt", "Kim loại", "Oxy khí"], "Tinh bột", "Carbohydrate chính."],
    ["multiple_choice", "Trứng gà giàu nhất về:", ["Protein", "Than đá", "Khí hiđro", "Muối tinh khiết"], "Protein", "Cần cho cơ thể."]
  ],
  g6_b16: [
    ["multiple_choice", "Nước muối loãng là hỗn hợp:", ["Đồng nhất", "Không đồng nhất", "Nguyên tố", "Chỉ một chất rắn"], "Đồng nhất", "Nhìn một pha."],
    ["multiple_choice", "Hỗn hợp cát và nước là:", ["Không đồng nhất", "Đồng nhất", "Chất tinh khiết", "Nguyên tử"], "Không đồng nhất", "Hai pha rõ ràng."]
  ],
  g6_b17: [
    ["multiple_choice", "Tách cát khỏi nước dùng phương pháp:", ["Lọc", "Chưng cất", "Thăng hoa iodine", "Lên men"], "Lọc", "Hạt rắn không lọt qua giấy lọc."],
    ["multiple_choice", "Tách muối từ nước biển thường dùng:", ["Cô / để bốc hơi nước", "Lọc giấy", "Hút nam châm", "Quay ly tâm protein"], "Cô / để bốc hơi nước", "Muối không bay hơi ở nhiệt độ sôi nước."]
  ]
};

const errors = [
  ["g6_b02", "nuoc vao axit", "safety_error", "Đổ sai thứ tự axit – nước", "Không được đổ nước vào axit đặc.", "Luôn đổ axit loãng chậm vào nước."],
  ["g6_b06", "kg", "unit_error", "Nhầm đơn vị đo", "gam và kilogam đều là khối lượng nhưng khác bậc.", "Đổi 1 kg = 1000 g khi cần."],
  ["g6_b08", "0", "temp_error", "Nhầm nóng chảy và sôi", "0°C là nhiệt độ nóng chảy của nước đá, không phải sôi.", "Sôi của nước khoảng 100°C."],
  ["g6_b09", "tinh khiet", "substance_error", "Nhầm hỗn hợp với chất tinh khiết", "Nước biển có nhiều muối hòa tan.", "Hỏi có mấy loại chất trong mẫu."],
  ["g6_b10", "hoa hoi", "state_error", "Nhầm nóng chảy và hóa hơi", "Đá tan là nóng chảy (rắn→lỏng), không phải hóa hơi.", "Hóa hơi là lỏng→khí."],
  ["g6_b11", "78", "air_error", "Nhầm % oxy và nitơ", "78% là nitơ trong không khí, không phải oxy.", "Oxy khoảng 21%."],
  ["g6_b16", "dong nhat", "mixture_error", "Nhầm loại hỗn hợp", "Cát + nước có hai pha rõ → không đồng nhất.", "Dung dịch muối là đồng nhất."],
  ["g6_b17", "loc", "separation_error", "Chọn sai phương pháp tách", "Lọc không tách muối đã hòa tan trong nước.", "Dùng cô hoặc chưng cất với dung dịch."]
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

const grade6Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade6Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade6Questions = lessons.flatMap(questionObjects);
const grade6Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
  pattern,
  skill,
  errorType,
  title,
  message,
  hint,
  recommendation: skill
}));

const upper = JSON.parse(await readFile("data/skills.json", "utf8")).filter((s) => s.grade > 6);
const upperLessons = JSON.parse(await readFile("data/lessons.json", "utf8")).filter((l) => upper.some((s) => s.id === l.skill));
const upperQuestions = JSON.parse(await readFile("data/questions.json", "utf8")).filter((q) => upper.some((s) => s.id === q.skill));
const upperErrors = JSON.parse(await readFile("data/errors.json", "utf8"));

const skills = [...grade6Skills, ...upper];
const lessonData = [...grade6Lessons, ...upperLessons];
const questions = [...grade6Questions, ...upperQuestions];
const allErrors = [...grade6Errors, ...upperErrors.filter((e) => !grade6Errors.some((g) => g.skill === e.skill && g.pattern === e.pattern))];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 6 KNTT: ${grade6Skills.length} skills, ${grade6Questions.length} questions. Total: ${skills.length} skills.`);
