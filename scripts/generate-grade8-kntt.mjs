import { readFile, writeFile } from "node:fs/promises";

/**
 * SGK KHTN 8 – Kết nối tri thức (toàn bộ mạch Hóa: Bài 1–12)
 * Mở đầu: Bài 1 – Thiết bị, hóa chất lab
 * Chương I: Phản ứng hóa học (Bài 2–7)
 * Chương II: Một số hợp chất thông dụng (Bài 8–12)
 */
const lessons = [
  ["g8_b01", "Bài 1. Sử dụng hóa chất và thiết bị phòng thí nghiệm", "Mở đầu KHTN 8", 1, 1, "Nhận biết và sử dụng an toàn một số dụng cụ, hóa chất cơ bản trong lab Hóa.", "lab"],
  ["g8_b02", "Bài 2. Phản ứng hóa học", "Phản ứng hóa học", 2, 2, "Nhận biết PTHH, sản phẩm–chất tham gia; phản ứng hóa hợp, phân hủy, thế, trao đổi.", "reaction"],
  ["g8_b03", "Bài 3. Mol và tỉ khối chất khí", "Phản ứng hóa học", 2, 3, "Mol là đơn vị lượng chất; khối lượng mol, thể tích mol khí ở đktc.", "mole"],
  ["g8_b04", "Bài 4. Dung dịch và nồng độ", "Phản ứng hóa học", 2, 4, "Dung môi, dung dịch; nồng độ C%, nồng độ mol/l.", "solution"],
  ["g8_b05", "Bài 5. Bảo toàn khối lượng và phương trình hóa học", "Phản ứng hóa học", 2, 5, "Định luật bảo toàn khối lượng; cân bằng hệ số trong PTHH.", "equationBalance"],
  ["g8_b06", "Bài 6. Tính theo phương trình hóa học", "Phản ứng hóa học", 2, 6, "Tính khối lượng, thể tích, số mol chất theo tỉ lệ mol trong PTHH.", "stoichiometry"],
  ["g8_b07", "Bài 7. Tốc độ phản ứng và chất xúc tác", "Phản ứng hóa học", 2, 7, "Yếu tố ảnh hưởng tốc độ; vai trò xúc tác (MnO₂ với H₂O₂).", "catalyst"],
  ["g8_b08", "Bài 8. Acid", "Một số hợp chất thông dụng", 3, 8, "Định nghĩa axit Arrhenius; tính chất, ứng dụng axit vô cơ thường gặp.", "acid"],
  ["g8_b09", "Bài 9. Base – thang pH", "Một số hợp chất thông dụng", 3, 9, "Bazơ; thang pH; quan hệ H⁺, OH⁻ và trung hòa.", "acidbase"],
  ["g8_b10", "Bài 10. Oxide", "Một số hợp chất thông dụng", 3, 10, "Oxide axit, oxide bazơ; phản ứng với nước, axit, bazơ.", "oxide"],
  ["g8_b11", "Bài 11. Muối", "Một số hợp chất thông dụng", 3, 11, "Muối; phản ứng trao đổi; điều chế và ứng dụng muối.", "salt"],
  ["g8_b12", "Bài 12. Phân bón hóa học", "Một số hợp chất thông dụng", 3, 12, "Phân bón NPK; vai trò đạm, lân, kali đối với cây trồng.", "fertilizer"]
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
    level: chapterIndex <= 1 ? 1 : chapterIndex <= 2 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g8_b01: [
    "Dụng cụ và hóa chất lab",
    "Ống nghiệm, buret, cốc có vạch chia, giá đỡ, đèn cồn; đọc nhãn hóa chất trước khi dùng.",
    "Pha dung dịch muối ăn: cân muối, đổ nước cất, khuấy đến hòa tan.",
    "Không nếm, không hít trực tiếp; đeo kính và găng khi cần."
  ],
  g8_b02: [
    "Phản ứng hóa học",
    "Chất tham gia → sản phẩm; có thể tỏa nhiệt hoặc thu nhiệt.",
    "2H₂ + O₂ → 2H₂O là phản ứng hóa hợp; 2H₂O₂ → 2H₂O + O₂ là phân hủy.",
    "Viết đúng chất rắn (s), lỏng (l), khí (g), dung dịch (aq) trong PTHH."
  ],
  g8_b03: [
    "Mol và khối lượng mol",
    "1 mol chất chứa 6,02·10²³ thực thể; M(H₂O) ≈ 18 g/mol.",
    "18 g H₂O = 1 mol; 36 g H₂O = 2 mol.",
    "n = m/M; khối lượng mol = tổng khối lượng nguyên tử trong công thức."
  ],
  g8_b04: [
    "Nồng độ dung dịch",
    "C% = (khối lượng chất tan / khối lượng dung dịch) × 100%.",
    "10 g muối + 90 g nước → dung dịch 100 g, C% ≈ 10%.",
    "Phân biệt chất tan, dung môi, dung dịch; nước thường là dung môi."
  ],
  g8_b05: [
    "Bảo toàn và cân bằng",
    "Tổng khối lượng chất tham gia = tổng khối lượng sản phẩm (trong PƯ kín).",
    "2H₂ + O₂ → 2H₂O: 4 g H + 32 g O → 36 g H₂O.",
    "Cân hệ số để mỗi nguyên tố có số nguyên tử bằng nhau hai vế."
  ],
  g8_b06: [
    "Tính theo PTHH",
    "Dùng tỉ lệ mol từ hệ số để tìm khối lượng hoặc thể tích chất khác.",
    "2H₂ + O₂ → 2H₂O: 2 mol H₂ cần 1 mol O₂, tạo 2 mol H₂O.",
    "Bước: mol chất đã biết → mol chất cần tìm → khối lượng (m = n·M)."
  ],
  g8_b07: [
    "Tốc độ và xúc tác",
    "Tăng nồng độ, nhiệt độ, diện tiếp xúc → thường nhanh hơn.",
    "MnO₂ xúc tác phân hủy H₂O₂ thành H₂O và O₂.",
    "Xúc tác tăng tốc, không tiêu hao vĩnh viễn trong phản ứng."
  ],
  g8_b08: [
    "Axit",
    "Axit trong nước tạo ion H⁺; có vị chua, đổi màu quỳ đỏ.",
    "HCl, H₂SO₄ loãng cần cẩn thận khi pha và rửa.",
    "Không đổ nước vào axit đặc — luôn đổ axit vào nước."
  ],
  g8_b09: [
    "Bazơ và pH",
    "Bazơ tạo OH⁻; pH < 7 axit, pH > 7 bazơ, pH = 7 trung tính.",
    "NaOH + HCl → NaCl + H₂O (trung hòa).",
    "Dùng thang pH hoặc quỳ để so sánh độ axit/bazơ."
  ],
  g8_b10: [
    "Oxide",
    "Oxide axit + nước → axit; oxide bazơ + nước → bazơ.",
    "CO₂ + H₂O → H₂CO₃ (oxide axit); CaO + H₂O → Ca(OH)₂ (oxide bazơ).",
    "Phân loại oxide axit / bazơ / trung tính (CO, H₂O)."
  ],
  g8_b11: [
    "Muối",
    "Muối = hợp chất ion kim loại (hoặc NH₄⁺) với gốc axit.",
    "Axit + bazơ → muối + nước; NaCl, CaCO₃, KNO₃ ứng dụng rộng.",
    "Một số muối tạo kết tủa hoặc khí khi trộn dung dịch."
  ],
  g8_b12: [
    "Phân bón",
    "N (đạm), P (lân), K (kali) nuôi cây; NPK ghi % khối lượng.",
    "NPK 16-16-8: 16% N, 16% P₂O₅, 8% K₂O (quy ước trên bao bì).",
    "Bón đúng liều, tránh thải thừa gây ô nhiễm nước."
  ]
};

const vizExtra = {
  g8_b02: { reactants: "2H₂ + O₂", products: "2H₂O" },
  g8_b03: { formula: "H₂O", molarMass: "18 g/mol" },
  g8_b05: { left: "2H₂ + O₂", right: "2H₂O" },
  g8_b06: { left: "2H₂ + O₂", right: "2H₂O" },
  g8_b07: { reactants: "2H₂O₂", products: "2H₂O + O₂" }
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization, ...(vizExtra[id] || {}) },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g8_b01: [
    ["multiple_choice", "Trước khi dùng hóa chất trong lab, em nên:", ["Đọc nhãn và hướng dẫn an toàn", "Nếm thử để biết mùi", "Trộn bừa các chai", "Bỏ qua kính bảo hộ"], "Đọc nhãn và hướng dẫn an toàn", "An toàn là ưu tiên."],
    ["multiple_choice", "Dụng cụ nào dùng đo thể tích chính xác?", ["Buret", "Ống nghiệm không vạch", "Giá đỡ", "Đèn cồn"], "Buret", "Buret có vạch chia mm."],
    ["multiple_choice", "Cốc thủy tinh có vạch chia dùng để:", ["Đo thể tích gần đúng", "Cân khối lượng", "Đo pH", "Làm nguồn nhiệt"], "Đo thể tích gần đúng", "Cốc định lượng vs buret."]
  ],
  g8_b02: [
    ["multiple_choice", "Phản ứng 2H₂ + O₂ → 2H₂O thuộc loại:", ["Hóa hợp", "Phân hủy", "Thế", "Tráo đổi ion"], "Hóa hợp", "Nhiều chất → một sản phẩm."],
    ["multiple_choice", "2H₂O₂ → 2H₂O + O₂ thuộc loại:", ["Phân hủy", "Hóa hợp", "Thế", "Tráo đổi"], "Phân hủy", "Một chất → nhiều chất."],
    ["multiple_choice", "Trong PTHH, hệ số đặt trước chất để:", ["Cân nguyên tử các nguyên tố", "Tăng khối lượng", "Đổi tên chất", "Tạo xúc tác"], "Cân nguyên tử các nguyên tố", "Bảo toàn nguyên tử."],
    ["multiple_choice", "Phản ứng thế là khi:", ["Nguyên tử của một nguyên tố thay nguyên tử nguyên tố khác", "Hai chất hòa tan", "Chỉ đổi thể", "Không có sản phẩm"], "Nguyên tử của một nguyên tố thay nguyên tử nguyên tố khác", "VD: Zn + CuSO₄."]
  ],
  g8_b03: [
    ["multiple_choice", "Khối lượng mol của H₂O (H=1, O=16) gần bằng:", ["18 g/mol", "16 g/mol", "2 g/mol", "32 g/mol"], "18 g/mol", "M = 1·2 + 16."],
    ["input", "18 g H₂O tương ứng bao nhiêu mol? (số thập phân, dùng dấu chấm)", "1", "n = m/M = 18/18."],
    ["multiple_choice", "1 mol khí bất kỳ ở đktc có thể tích khoảng:", ["22,4 L", "1 L", "100 L", "0 L"], "22,4 L", "Quy tắc mol khí (SGK)."],
    ["multiple_choice", "Số Avogadro gần bằng:", ["6,02·10²³", "6,02·10²", "10²³", "1"], "6,02·10²³", "Số thực thể trong 1 mol."]
  ],
  g8_b04: [
    ["multiple_choice", "Dung dịch 10% NaCl nghĩa là:", ["10 g NaCl trong 100 g dung dịch", "10 g nước", "10 mol NaCl", "10% thể tích nước"], "10 g NaCl trong 100 g dung dịch", "C% theo khối lượng."],
    ["multiple_choice", "Chất tan trong dung dịch muối loãng là:", ["NaCl", "Nước", "Không khí", "Cát"], "NaCl", "Nước là dung môi."],
    ["multiple_choice", "Pha loãng axit an toàn:", ["Đổ axit chậm vào nước", "Đổ nước vào axit đặc", "Trộn nhanh không khuấy", "Không cần kính"], "Đổ axit chậm vào nước", "Tránh bắn axit."],
    ["input", "10 g muối tan trong 90 g nước. C% dung dịch? (chỉ số)", "10", "mẫu số = 10 + 90 = 100 g."]
  ],
  g8_b05: [
    ["multiple_choice", "Định luật bảo toàn khối lượng phát biểu:", ["Khối lượng bảo toàn trong PƯ kín", "Khối lượng tăng mãi", "Chỉ bảo toàn thể tích", "Không áp dụng cho khí"], "Khối lượng bảo toàn trong PƯ kín", "Tổng KL reactant = product."],
    ["input", "Hệ số trước H₂O khi cân: H₂ + O₂ → ?H₂O là?", "2", "Cân O: 2H₂ + O₂ → 2H₂O."],
    ["multiple_choice", "Khi cân PTHH, nên cân nguyên tố nào trước thường gặp?", ["O và H sau cùng phức tạp; bắt đầu từ nguyên tố hiếm", "Chỉ cân H", "Bỏ qua O", "Chỉ cân khí"], "O và H sau cùng phức tạp; bắt đầu từ nguyên tố hiếm", "Chiến lược cân PTHH."],
    ["multiple_choice", "PTHH chỉ thể hiện:", ["Tỉ lượng mol các chất", "Tốc độ phản ứng", "Màu sắc", "pH"], "Tỉ lượng mol các chất", "Không ghi trạng thái điều kiện đầy đủ."]
  ],
  g8_b06: [
    ["multiple_choice", "Theo 2H₂ + O₂ → 2H₂O, 4 mol H₂ cần bao nhiêu mol O₂?", ["2", "4", "1", "8"], "2", "Tỉ 2 : 1 : 2."],
    ["input", "1 mol H₂ (M=2) có khối lượng bao nhiêu gam?", "2", "m = n·M."],
    ["multiple_choice", "Muốn tính khối lượng sản phẩm từ PTHH, bước đầu là:", ["Tính mol chất đã biết", "Đo pH", "Cân xúc tác", "Đo thể tích nước"], "Tính mol chất đã biết", "n = m/M trước."],
    ["input", "2 mol H₂O (M=18) có khối lượng bao nhiêu gam?", "36", "m = 2 × 18 = 36 g."]
  ],
  g8_b07: [
    ["multiple_choice", "Yếu tố nào thường làm tăng tốc độ phản ứng?", ["Tăng nhiệt độ", "Giảm nồng độ", "Loại bỏ xúc tác", "Làm lạnh mạnh"], "Tăng nhiệt độ", "Hạt va chạm hiệu quả hơn."],
    ["multiple_choice", "Chất xúc tác khi tham gia phản ứng:", ["Tăng tốc, hầu như không tiêu hao", "Bị mất hết", "Làm chậm", "Thay sản phẩm"], "Tăng tốc, hầu như không tiêu hao", "MnO₂ với H₂O₂."],
    ["multiple_choice", "Nghiền nhỏ chất rắn tham gia PƯ thường:", ["Tăng diện tiếp xúc, tăng tốc độ", "Giảm tốc độ", "Không ảnh hưởng", "Dừng phản ứng"], "Tăng diện tiếp xúc, tăng tốc độ", "Bề mặt lớn hơn."],
    ["multiple_choice", "Enzyme trong cơ thể đóng vai trò:", ["Xúc tác sinh học", "Axit mạnh", "Muối vô cơ", "Oxide"], "Xúc tác sinh học", "Tăng tốc chuyển hóa."]
  ],
  g8_b08: [
    ["multiple_choice", "Dung dịch axit có pH thường:", ["< 7", "> 7", "= 14", "= 0 luôn"], "< 7", "Thang pH."],
    ["multiple_choice", "Axit HCl trong nước tạo ion:", ["H+", "OH-", "Na+", "Cl2"], "H+", "Định nghĩa Arrhenius."],
    ["multiple_choice", "Giấy quỳ đỏ ngâm trong axit loãng thường:", ["Hóa đỏ", "Hóa xanh", "Không đổi", "Tan ra"], "Hóa đỏ", "Chỉ báo axit."],
    ["multiple_choice", "Axit sunfuric loãng và axit clohidric đều:", ["Có tính axit, cần cẩn thận", "Là bazơ", "Là muối", "Không tan nước"], "Có tính axit, cần cẩn thận", "Axit vô cơ thường gặp."]
  ],
  g8_b09: [
    ["multiple_choice", "Dung dịch NaOH thuộc loại:", ["Bazơ", "Axit", "Muối", "Oxide"], "Bazơ", "Tạo OH⁻."],
    ["multiple_choice", "Phản ứng trung hòa HCl + NaOH tạo:", ["NaCl và H2O", "Chỉ H2", "Chỉ O2", "Không phản ứng"], "NaCl và H2O", "Axit + bazơ → muối + nước."],
    ["multiple_choice", "Dung dịch bazơ có pH:", ["> 7", "< 7", "= 0", "= 14 luôn"], "> 7", "Thang pH 0–14."],
    ["multiple_choice", "Quỳ tím trong dung dịch bazơ mạnh thường:", ["Chuyển xanh", "Chuyển đỏ", "Không đổi", "Mất màu ngay"], "Chuyển xanh", "Chỉ báo pH."]
  ],
  g8_b10: [
    ["multiple_choice", "CO₂ là oxide loại:", ["Axit", "Bazơ", "Trung tính", "Kim loại"], "Axit", "CO₂ + H₂O → axit yếu."],
    ["multiple_choice", "CaO (vôi sống) + H₂O tạo:", ["Ca(OH)2", "HCl", "CO2", "NaCl"], "Ca(OH)2", "Oxide bazơ."],
    ["multiple_choice", "Oxide bazơ + axit thường tạo:", ["Muối và nước", "Chỉ khí H2", "Chỉ kim loại", "Không phản ứng"], "Muối và nước", "VD: CaO + 2HCl."],
    ["multiple_choice", "CO (carbon monoxide) là oxide:", ["Trung tính", "Axit", "Bazơ", "Muối"], "Trung tính", "Không tạo axit/bazơ điển hình với nước."]
  ],
  g8_b11: [
    ["multiple_choice", "NaCl thuộc nhóm chất:", ["Muối", "Axit", "Bazơ", "Oxide axit"], "Muối", "Hợp chất ion."],
    ["multiple_choice", "Phản ứng axit + bazơ tạo ra:", ["Muối và nước", "Chỉ khí O2", "Chỉ kim loại", "Không sản phẩm"], "Muối và nước", "Trung hòa."],
    ["multiple_choice", "CaCO₃ (đá vôi) là:", ["Muối", "Axit", "Bazơ", "Kim loại"], "Muối", "Gốc CO₃²⁻."],
    ["multiple_choice", "Muối ăn NaCl dùng để:", ["Gia vị, bảo quản", "Làm axit", "Chỉ làm phân bón", "Làm xúc tác duy nhất"], "Gia vị, bảo quản", "Ứng dụng đời sống."]
  ],
  g8_b12: [
    ["multiple_choice", "Ký hiệu N trong NPK chỉ:", ["Đạm (nitơ)", "Lân", "Kali", "Nước"], "Đạm (nitơ)", "Nuôi lá, sinh trưởng."],
    ["multiple_choice", "Bón phân quá mức có thể gây:", ["Ô nhiễm nước", "Tăng oxy vô hạn", "Không ảnh hưởng", "Chỉ tăng pH = 14"], "Ô nhiễm nước", "Bảo vệ môi trường."],
    ["multiple_choice", "Kali (K) trong phân bón giúp cây:", ["Củ quả, chống chịu", "Chỉ có lá xanh", "Không cần nước", "Tạo axit"], "Củ quả, chống chịu", "Vai trò K trong NPK."],
    ["multiple_choice", "Phân lân (P) chủ yếu hỗ trợ:", ["Rễ và hoa", "Chỉ thân gỗ", "Chỉ làm muối", "Khí oxy"], "Rễ và hoa", "Vai trò lân."]
  ]
};

const errors = [
  ["g8_b01", "nem", "safety_error", "Nếm hóa chất", "Không bao giờ nếm hóa chất trong lab.", "Đọc nhãn, dùng chỉ báo."],
  ["g8_b02", "phan huy", "reaction_error", "Nhầm loại phản ứng", "2H₂ + O₂ → 2H₂O là hóa hợp, không phải phân hủy.", "Hóa hợp: nhiều → một."],
  ["g8_b03", "16", "molar_mass_error", "Nhầm khối lượng mol H2O", "H2O: M ≈ 18, không phải 16.", "Cộng khối lượng nguyên tử trong công thức."],
  ["g8_b03", "m/m", "formula_error", "Nhầm công thức mol", "n = m/M, không phải m/M².", "Mol = khối lượng / khối lượng mol."],
  ["g8_b04", "90", "concentration_error", "Nhầm C% dung dịch", "10% là 10g tan / 100g dung dịch, không phải 90g tan.", "Xác định mẫu số đúng."],
  ["g8_b04", "nuoc vao axit", "safety_error", "Pha loãng sai", "Không đổ nước vào axit đặc.", "Axit chậm vào nước."],
  ["g8_b05", "h2o", "E002", "Chưa cân đủ H hoặc O", "Đếm nguyên tử hai vế sau khi đặt hệ số.", "Cân O sau khi cân H."],
  ["g8_b05", "1", "balance_error", "Hệ số H2O sai", "H₂ + O₂ → 2H₂O cần hệ số 2 trước H₂O.", "Cân nguyên tử O trước."],
  ["g8_b06", "4", "stoich_error", "Sai tỉ mol trong PTHH", "2H2 + O2 → 2H2O có tỉ mol 2:1:2.", "Dùng hệ số làm tỉ mol."],
  ["g8_b06", "18", "stoich_error", "Nhầm 1 mol và 2 mol H2O", "2 mol H2O = 36 g, không phải 18 g.", "m = n × M."],
  ["g8_b07", "cham", "rate_error", "Nhầm yếu tố tốc độ", "Giảm nhiệt độ thường làm chậm phản ứng.", "Tăng T, nồng độ, tiếp xúc → nhanh hơn."],
  ["g8_b08", "7", "ph_error", "Nhầm pH axit", "pH < 7 là axit.", "pH = 7 trung tính."],
  ["g8_b09", "hcl", "neutral_error", "Nhầm sản phẩm trung hòa", "HCl + NaOH → NaCl + H2O.", "Không còn H+ và OH- dư."],
  ["g8_b10", "cao", "oxide_error", "Nhầm loại oxide", "CaO là oxide bazơ, CO2 là oxide axit.", "Thử với nước hoặc axit/bazơ."],
  ["g8_b11", "naoh", "salt_error", "Nhầm muối và bazơ", "NaOH là bazơ, NaCl là muối.", "Sau trung hòa mới có muối."],
  ["g8_b12", "p", "fertilizer_error", "Nhầm ký hiệu NPK", "N = đạm (nitơ), P = lân, K = kali.", "Đọc bảng thành phần trên bao."]
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
const lowerQuestions = questionsFile.filter((qItem) => lower.some((s) => s.id === qItem.skill));
const upperQuestions = questionsFile.filter((qItem) => upper.some((s) => s.id === qItem.skill));
const keepErrors = errorsFile.filter(
  (e) => lower.some((s) => s.id === e.skill) || upper.some((s) => s.id === e.skill)
);

const skills = [...lower, ...grade8Skills, ...upper];
const lessonData = [...lowerLessons, ...grade8Lessons, ...upperLessons];
const questions = [...lowerQuestions, ...grade8Questions, ...upperQuestions];
const allErrors = [...keepErrors, ...grade8Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 8 KNTT: ${grade8Skills.length} skills, ${grade8Questions.length} questions, ${grade8Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
