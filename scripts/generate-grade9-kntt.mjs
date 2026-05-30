import { readFile, writeFile } from "node:fs/promises";

/**
 * SGK KHTN 9 – Kết nối tri thức (toàn bộ mạch Hóa: Bài 18–35)
 * Chương VI: Kim loại (18–21)
 * Chương VII: Hợp chất hữu cơ – hydrocarbon (22–25)
 * Chương VIII: Ethylic alcohol – acetic acid (26–27)
 * Chương IX: Lipid, carbohydrate, protein, polymer (28–32)
 * Chương X: Tài nguyên vỏ Trái Đất (33–35)
 */
const lessons = [
  ["g9_b18", "Bài 18. Tính chất chung của kim loại", "Kim loại và phi kim", 1, 18, "Dẫn điện, dẫn nhiệt, dẻo, ánh kim; tác dụng với phi kim, nước, axit, muối.", "metal"],
  ["g9_b19", "Bài 19. Dãy hoạt động hóa học", "Kim loại và phi kim", 1, 19, "Thứ tự kim loại theo khả năng mất electron; phản ứng thế với dung dịch muối.", "activitySeries"],
  ["g9_b20", "Bài 20. Tách kim loại và việc sử dụng hợp kim", "Kim loại và phi kim", 1, 20, "Luyện kim, tái chế; hợp kim thép, đồng thau và ứng dụng.", "alloy"],
  ["g9_b21", "Bài 21. Sự khác nhau cơ bản giữa phi kim và kim loại", "Kim loại và phi kim", 1, 21, "So sánh tính chất; vai trò phi kim (C, S, P…) và kim loại trong đời sống.", "nonmetal"],
  ["g9_b22", "Bài 22. Giới thiệu hợp chất hữu cơ", "Hữu cơ và hydrocarbon", 2, 22, "Hữu cơ chứa C (thường kèm H); công thức, mô hình, nguồn dầu mỏ.", "organic"],
  ["g9_b23", "Bài 23. Alkane", "Hữu cơ và hydrocarbon", 2, 23, "Ankan CₙH₂ₙ₊₂; metan, etan; phản ứng cháy.", "alkane"],
  ["g9_b24", "Bài 24. Alkene", "Hữu cơ và hydrocarbon", 2, 24, "Anken có liên kết đôi C=C; etilen và ứng dụng.", "alkene"],
  ["g9_b25", "Bài 25. Nguồn nhiên liệu", "Hữu cơ và hydrocarbon", 2, 25, "Dầu mỏ, than, khí; chế biến và tác động môi trường.", "fuels"],
  ["g9_b26", "Bài 26. Ethylic alcohol", "Ethylic alcohol và acetic acid", 3, 26, "C₂H₅OH: tính chất, ứng dụng, an toàn khi dùng cồn.", "alcohol"],
  ["g9_b27", "Bài 27. Acetic acid", "Ethylic alcohol và acetic acid", 3, 27, "CH₃COOH: axit yếu, giấm, phản ứng với bazơ.", "acetic"],
  ["g9_b28", "Bài 28. Lipid", "Lipid, carbohydrate, protein, polymer", 4, 28, "Chất béo: cấu tạo, vai trò năng lượng và dinh dưỡng.", "lipid"],
  ["g9_b29", "Bài 29. Carbohydrate. Glucose và saccharose", "Lipid, carbohydrate, protein, polymer", 4, 29, "Glucose C₆H₁₂O₆, saccharose; phản ứng đặc trưng với Cu(OH)₂.", "glucose"],
  ["g9_b30", "Bài 30. Tinh bột và cellulose", "Lipid, carbohydrate, protein, polymer", 4, 30, "Polime carbohydrate; tinh bột, xenluloz và ứng dụng.", "starch"],
  ["g9_b31", "Bài 31. Protein", "Lipid, carbohydrate, protein, polymer", 4, 31, "Protein từ amino acid; enzyme và thức ăn giàu đạm.", "protein"],
  ["g9_b32", "Bài 32. Polymer", "Lipid, carbohydrate, protein, polymer", 4, 32, "Polime tổng hợp: PVC, PE; tái chế nhựa.", "polymer"],
  ["g9_b33", "Bài 33. Hóa học vỏ Trái Đất", "Khai thác tài nguyên vỏ Trái Đất", 5, 33, "Thành phần vỏ Trái Đất; khoáng sản và khai thác có trách nhiệm.", "earthCrust"],
  ["g9_b34", "Bài 34. Đá vôi và công nghiệp silicate", "Khai thác tài nguyên vỏ Trái Đất", 5, 34, "CaCO₃, sản xuất xi măng, thủy tinh, gốm sứ.", "silicate"],
  ["g9_b35", "Bài 35. Nhiên liệu hóa thạch và chu trình carbon", "Khai thác tài nguyên vỏ Trái Đất", 5, 35, "Khai thác than dầu; chu trình carbon và biến đổi khí hậu.", "carbonCycle"]
];

const SOURCE = "Bám mạch SGK Khoa học tự nhiên 9 – Kết nối tri thức với cuộc sống (mạch Hóa), nội dung tự biên soạn.";

function skillFromLesson(item, index) {
  const [id, title, chapter, chapterIndex, lessonNo, description, visualization] = item;
  return {
    id,
    title,
    grade: 9,
    book: "Kết nối tri thức",
    chapter,
    chapterIndex,
    lessonNo,
    domain: chapter,
    level: chapterIndex <= 2 ? 1 : chapterIndex <= 4 ? 2 : 3,
    prerequisite: index === 0 ? [] : [lessons[index - 1][0]],
    description,
    visualization
  };
}

const core = {
  g9_b18: ["Kim loại", "Dẫn điện, dẫn nhiệt, dẻo, ánh kim; Cu, Al, Fe ứng dụng rộng.", "Fe + O₂ → Fe₂O₃ (gỉ sắt); Al phủ oxide bảo vệ.", "Kim loại + HCl → muối + H₂ (một số KL)."],
  g9_b19: ["Dãy hoạt động", "Kim loại đứng trước thế kim loại đứng sau trong dung dịch muối.", "Zn + CuSO₄ → ZnSO₄ + Cu (màu xanh nhạt dần, Cu bám).", "K, Na không thí nghiệm trực tiếp với nước tự do."],
  g9_b20: ["Hợp kim", "Hợp kim = kim loại + nguyên tố khác; tính chất có thể tối ưu.", "Thép: Fe + C; đồng thau: Cu + Zn; tái chế nhôm tiết kiệm năng lượng.", "Luyện quặng → kim loại thuần → hợp kim."],
  g9_b21: ["Phi kim – kim loại", "Phi kim: C, H, O, N, S…; kim loại: Cu, Fe, Al…", "Than (C) dẫn điện khi có tạp chất; đồng dẫn điện tốt.", "Chọn vật liệu theo tính chất vật lí – hóa học."],
  g9_b22: ["Hữu cơ", "Hợp chất hữu cơ có carbon (thường liên kết C–H).", "Dầu mỏ phân đoạn → xăng, dầu, khí.", "Muối NaCl, nước là vô cơ; CH₄, C₂H₅OH là hữu cơ."],
  g9_b23: ["Alkane", "CₙH₂ₙ₊₂; CH₄ metan, C₂H₆ etan; liên kết đơn.", "CH₄ + 2O₂ → CO₂ + 2H₂O.", "Ankan no, không có liên kết đôi."],
  g9_b24: ["Alkene", "CₙH₂ₙ; liên kết đôi C=C; C₂H₄ etilen.", "Etilen làm chín quả; dùng tổng hợp polime.", "Anken ≠ ankan: thiếu 2H so với ankan tương ứng."],
  g9_b25: ["Nhiên liệu", "Than, dầu, khí thiên nhiên là nguồn hydrocarbon.", "Cháy tạo CO₂, H₂O và năng lượng.", "Tiết kiệm, giảm khí thải, năng lượng tái tạo."],
  g9_b26: ["Ethylic alcohol", "C₂H₅OH tan trong nước; cháy được.", "Cồn y tế sát trùng; rượu có cồn — không uống trong lab.", "Không đổ cồn gần lửa; tránh hít nồng độ cao."],
  g9_b27: ["Acetic acid", "CH₃COOH axit yếu; giấm ăn 4–5%.", "CH₃COOH + NaOH → CH₃COONa + H₂O.", "Axit axetic loãng an toàn hơn axit mạnh HCl đặc."],
  g9_b28: ["Lipid", "Chất béo: este glyxerol + axit béo.", "Dầu ăn, mỡ động vật — nguồn năng lượng dự trữ.", "Không tan nước; tan trong mỡ/dầu."],
  g9_b29: ["Glucose – saccharose", "C₆H₁₂O₆ glucose; C₁₂H₂₂O₁₁ saccharose (đường ăn).", "Glucose phản ứng đặc trưng với Cu(OH)₂ ở nhiệt độ phòng.", "Carbohydrate cung cấp năng lượng nhanh."],
  g9_b30: ["Tinh bột – xenluloz", "Polime lớn từ đơn vị glucose.", "Iodine đổi màu xanh tím với tinh bột; xenluloz trong gỗ, cotton.", "Thủy phân tinh bột → glucose (enzyme)."],
  g9_b31: ["Protein", "Chuỗi amino acid; enzyme là protein xúc tác sinh học.", "Trứng, đậu, thịt giàu protein.", "Nhiệt cao hoặc axit mạnh làm biến tính protein (trứng luộc)."],
  g9_b32: ["Polymer", "Phân tử khổng lồ; PVC, PE, nylon.", "Túi nilon (PE), ống PVC, vải nylon.", "Tái chế nhựa giảm rác và tiết kiệm dầu mỏ."],
  g9_b33: ["Vỏ Trái Đất", "Si, O, Al, Fe… dạng silicate, oxide, quặng.", "Quặng sắt (hematit), bauxit (nhôm).", "Khai thác bền vững, phục hồi môi trường."],
  g9_b34: ["Đá vôi – silicate", "CaCO₃ nung → CaO + CO₂; xi măng, thủy tinh, gốm.", "CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂.", "Công nghiệp silicate: thủy tinh, gốm sứ."],
  g9_b35: ["Carbon và khí hậu", "Chu trình carbon: CO₂ ↔ quang hợp ↔ nhiên liệu.", "Đốt than dầu tăng CO₂ khí quyển → hiệu ứng nhà kính.", "Giảm phát thải, trồng rừng, năng lượng sạch."]
};

function lessonSteps(item) {
  const [id, , , , , description, visualization] = item;
  const [visualTitle, visualContent, example, summary] = core[id];
  return [
    { type: "intro", title: "Mục tiêu vi kỹ năng", content: description },
    { type: "visualization", title: visualTitle, content: visualContent, visualization },
    { type: "example", title: "Ví dụ từ SGK", content: example },
    { type: "summary", title: "Ghi nhớ nhanh", content: summary }
  ];
}

const q = {
  g9_b18: [
    ["multiple_choice", "Tính chất đặc trưng của kim loại?", ["Dẫn điện tốt", "Cách điện hoàn toàn", "Không có ánh kim", "Tan trong nước như đường"], "Dẫn điện tốt", "Kim loại dẫn điện."],
    ["multiple_choice", "Kim loại nào thường dùng làm dây điện?", ["Đồng", "Than", "Nhựa", "Thủy tinh"], "Đồng", "Cu dẫn điện tốt."],
    ["multiple_choice", "Kim loại tác dụng với HCl loãng thường tạo:", ["Muối và khí H₂", "Chỉ O₂", "Chỉ nước", "Không phản ứng"], "Muối và khí H₂", "VD: Zn + 2HCl."],
    ["multiple_choice", "Kim loại dẫn nhiệt tốt nghĩa là:", ["Truyền nhiệt nhanh", "Không nóng lên", "Chỉ dẫn điện", "Tan trong axit"], "Truyền nhiệt nhanh", "Nồi nhôm, đồng."]
  ],
  g9_b19: [
    ["multiple_choice", "Trong dãy hoạt động, Zn đặt trước Cu nghĩa là:", ["Zn mất electron dễ hơn Cu", "Cu mạnh hơn Zn", "Không phản ứng", "Bằng nhau"], "Zn mất electron dễ hơn Cu", "Zn thế Cu trong muối."],
    ["multiple_choice", "Zn + CuSO₄ tạo ra:", ["ZnSO₄ + Cu", "CuSO₄ + ZnO", "Không phản ứng", "Chỉ H2"], "ZnSO₄ + Cu", "Phản ứng thế."],
    ["multiple_choice", "Fe đặt trong CuSO₄ dung dịch, hiện tượng có thể thấy:", ["Lớp đồng bám trên Fe", "Fe tan hoàn toàn ngay", "Không đổi màu", "Chỉ có bọt H2"], "Lớp đồng bám trên Fe", "Fe thế Cu nếu Fe trước Cu."],
    ["multiple_choice", "Kim loại nào KHÔNG nên thí nghiệm trực tiếp với nước tự do?", ["K, Na", "Cu", "Ag", "Au"], "K, Na", "Phản ứng mạnh, nguy hiểm."]
  ],
  g9_b20: [
    ["multiple_choice", "Thép là hợp kim chủ yếu của:", ["Fe và C", "Cu và Zn", "Na và Cl", "Chỉ C"], "Fe và C", "Hợp kim sắt-cacbon."],
    ["multiple_choice", "Hợp kim khác kim loại thuần ở chỗ:", ["Tính chất có thể tối ưu hơn", "Luôn nhẹ hơn nước", "Không dẫn điện", "Không dùng được"], "Tính chất có thể tối ưu hơn", "Ứng dụng đa dạng."],
    ["multiple_choice", "Đồng thau là hợp kim của:", ["Cu và Zn", "Fe và C", "Al và O", "Na và Cl"], "Cu và Zn", "Màu vàng, đúc được."],
    ["multiple_choice", "Tái chế nhôm giúp:", ["Tiết kiệm năng lượng so với luyện mới", "Tăng rác nhựa", "Tạo thêm CO2 vô hạn", "Biến nhôm thành muối"], "Tiết kiệm năng lượng so với luyện mới", "Bảo vệ tài nguyên."]
  ],
  g9_b21: [
    ["multiple_choice", "Chất nào là phi kim?", ["Lưu huỳnh S", "Đồng Cu", "Nhôm Al", "Sắt Fe"], "Lưu huỳnh S", "S không phải kim loại."],
    ["multiple_choice", "Than mỏ chủ yếu là nguyên tố:", ["Cacbon", "Sắt", "Vàng", "Natri"], "Cacbon", "Phi kim C."],
    ["multiple_choice", "Kim loại khác phi kim ở:", ["Dẫn điện tốt, ánh kim", "Luôn là khí", "Không phản ứng", "Chỉ có trong muối"], "Dẫn điện tốt, ánh kim", "Tính chất điển hình KL."],
    ["multiple_choice", "Oxy (O₂) thuộc nhóm:", ["Phi kim", "Kim loại", "Muối", "Hợp kim"], "Phi kim", "Khí phi kim."]
  ],
  g9_b22: [
    ["multiple_choice", "Hợp chất hữu cơ phải có:", ["Cacbon", "Chỉ oxi", "Chỉ natri", "Không có H"], "Cacbon", "Định nghĩa cơ bản."],
    ["input", "Công thức metan là gì?", "CH4", "Ankan đơn giản nhất."],
    ["multiple_choice", "Dầu mỏ chế biến chủ yếu cho:", ["Xăng, dầu, khí", "Chỉ muối", "Chỉ sắt", "Oxy thở"], "Xăng, dầu, khí", "Hydrocarbon."],
    ["multiple_choice", "NaCl thuộc loại:", ["Vô cơ", "Hữu cơ", "Hydrocarbon", "Polime"], "Vô cơ", "Không có C–H điển hình hữu cơ."]
  ],
  g9_b23: [
    ["multiple_choice", "Công thức tổng quát ankan no?", ["CnH2n+2", "CnH2n", "CnH2n-2", "H2O"], "CnH2n+2", "Nhớ ankan."],
    ["multiple_choice", "Phản ứng cháy metan tạo:", ["CO2 và H2O", "Chỉ O2", "NaCl", "Fe"], "CO2 và H2O", "CH4 + 2O2 → CO2 + 2H2O."],
    ["input", "Metan CH4 có bao nhiêu nguyên tử H? (chỉ số)", "4", "Công thức CH4."],
    ["multiple_choice", "Ankan có liên kết:", ["Đơn C–C, C–H", "Đôi C=C", "Ion", "Kim loại"], "Đơn C–C, C–H", "No, bão hòa."]
  ],
  g9_b24: [
    ["multiple_choice", "Alkene có đặc điểm:", ["Liên kết đôi C=C", "Chỉ liên kết đơn", "Không có C", "Là muối"], "Liên kết đôi C=C", "Anken."],
    ["input", "Công thức etilen (C2H4) viết không chỉ số dưới?", "C2H4", "Anken 2C."],
    ["multiple_choice", "Công thức tổng quát anken?", ["CnH2n", "CnH2n+2", "CnH2n-2", "CH4"], "CnH2n", "So với ankan thiếu 2H."],
    ["multiple_choice", "Etilen dùng trong:", ["Làm chín quả, tổng hợp polime", "Làm muối ăn", "Luyện sắt", "Đo pH"], "Làm chín quả, tổng hợp polime", "Ứng dụng thực tế."]
  ],
  g9_b25: [
    ["multiple_choice", "Nhiên liệu hóa thạch gồm:", ["Than, dầu mỏ, khí", "Chỉ nước", "Muối ăn", "Oxy khí"], "Than, dầu mỏ, khí", "Hydrocarbon."],
    ["multiple_choice", "Đốt nhiên liệu chủ yếu tạo:", ["CO2 và H2O", "Chỉ muối", "Chỉ sắt", "Không sản phẩm"], "CO2 và H2O", "Phản ứng cháy."],
    ["multiple_choice", "Phân đoạn dầu mỏ dựa trên:", ["Nhiệt độ sôi các thành phần", "Màu sắc", "Khối lượng riêng duy nhất", "pH"], "Nhiệt độ sôi các thành phần", "Chưng cất dầu."],
    ["multiple_choice", "Giảm phát thải CO2 từ nhiên liệu có thể bằng:", ["Tiết kiệm năng lượng, năng lượng sạch", "Đốt nhiều hơn", "Đổ dầu ra biển", "Không cần làm gì"], "Tiết kiệm năng lượng, năng lượng sạch", "Bảo vệ môi trường."]
  ],
  g9_b26: [
    ["multiple_choice", "Công thức ethylic alcohol là:", ["C2H5OH", "CH3COOH", "NaCl", "H2SO4"], "C2H5OH", "Cồn y tế."],
    ["multiple_choice", "Cồn cháy được vì:", ["Là hợp chất hữu cơ", "Là kim loại", "Là muối", "Không cháy"], "Là hợp chất hữu cơ", "Phản ứng cháy."],
    ["multiple_choice", "C2H5OH tan trong nước vì:", ["Nhóm –OH tạo liên kết H với nước", "Là kim loại", "Là khí", "Không tan"], "Nhóm –OH tạo liên kết H với nước", "Tính tan hòa."],
    ["multiple_choice", "An toàn khi dùng cồn trong lab:", ["Tránh lửa, không uống", "Uống thử", "Đổ lên đèn cồn đang cháy", "Hít nồng độ cao"], "Tránh lửa, không uống", "Quy tắc an toàn."]
  ],
  g9_b27: [
    ["multiple_choice", "Giấm chứa axit:", ["CH3COOH", "HCl", "NaOH", "CaCO3"], "CH3COOH", "Axit axetic."],
    ["multiple_choice", "Axit axetic loãng:", ["Axit yếu", "Axit mạnh như HCl đặc", "Là bazơ", "Là muối"], "Axit yếu", "Có thể dùng trong thực phẩm."],
    ["multiple_choice", "CH3COOH + NaOH tạo:", ["CH3COONa và H2O", "Chỉ CO2", "Chỉ H2", "Không phản ứng"], "CH3COONa và H2O", "Trung hòa axit yếu."],
    ["multiple_choice", "Giấm có mùi chua do:", ["Axit axetic", "Muối NaCl", "Kim loại", "Oxy"], "Axit axetic", "Nhóm chức –COOH."]
  ],
  g9_b28: [
    ["multiple_choice", "Lipid trong cơ thể dùng để:", ["Dự trữ năng lượng", "Dẫn điện", "Làm gốm", "Tạo O2"], "Dự trữ năng lượng", "Chất béo."],
    ["multiple_choice", "Dầu ăn thuộc nhóm:", ["Lipid", "Protein", "Kim loại", "Oxide"], "Lipid", "Một loại lipid."],
    ["multiple_choice", "Lipid tan trong:", ["Dầu, mỡ (dung môi hữu cơ)", "Nước dễ dàng", "Axit HCl đặc", "Không tan gì"], "Dầu, mỡ (dung môi hữu cơ)", "Tính tan hòa."],
    ["multiple_choice", "Mỡ động vật và dầu thực vật đều:", ["Là lipid", "Là protein", "Là kim loại", "Là muối"], "Là lipid", "Nguồn năng lượng."]
  ],
  g9_b29: [
    ["multiple_choice", "Công thức glucose?", ["C6H12O6", "CH4", "NaCl", "H2O"], "C6H12O6", "Đường đơn."],
    ["multiple_choice", "Saccharose (đường ăn) là:", ["C12H22O11", "CH4", "Fe", "O2"], "C12H22O11", "Đường đôi."],
    ["multiple_choice", "Glucose phản ứng đặc trưng với:", ["Cu(OH)2 (phức màu)", "Chỉ NaCl", "Kim loại Fe", "O2 khí"], "Cu(OH)2 (phức màu)", "Thí nghiệm đặc trưng SGK."],
    ["multiple_choice", "Carbohydrate cung cấp:", ["Năng lượng cho cơ thể", "Chỉ kim loại", "Oxy thở", "Axit mạnh"], "Năng lượng cho cơ thể", "Đường, tinh bột."]
  ],
  g9_b30: [
    ["multiple_choice", "Tinh bột thuộc:", ["Carbohydrate (polime)", "Kim loại", "Axit mạnh", "Khí hiếm"], "Carbohydrate (polime)", "Polime lớn."],
    ["multiple_choice", "Xenluloz có trong:", ["Gỗ, cotton", "Chỉ sắt", "Dầu mỏ", "Muối"], "Gỗ, cotton", "Polime carbohydrate."],
    ["multiple_choice", "Iodine đổi màu với:", ["Tinh bột", "Muối NaCl", "Kim loại Cu", "O2"], "Tinh bột", "Thí nghiệm nhận biết."],
    ["multiple_choice", "Tinh bột và xenluloz đều là polime của:", ["Glucose (monomer)", "Protein", "Lipid", "CH4"], "Glucose (monomer)", "Đơn vị lặp lại."]
  ],
  g9_b31: [
    ["multiple_choice", "Protein được tạo từ:", ["Amino acid", "Chỉ glucose", "Chỉ NaCl", "Oxy"], "Amino acid", "Monomer protein."],
    ["multiple_choice", "Enzyme trong cơ thể là:", ["Protein", "Kim loại", "Muối", "Oxide"], "Protein", "Xúc tác sinh học."],
    ["multiple_choice", "Trứng luộc cứng do:", ["Protein biến tính khi nhiệt cao", "Tạo thêm kim loại", "Mất hết nước thành muối", "Oxy hóa"], "Protein biến tính khi nhiệt cao", "Biến tính protein."],
    ["multiple_choice", "Thức ăn giàu protein:", ["Trứng, đậu, thịt", "Chỉ đường", "Chỉ dầu", "Muối ăn"], "Trứng, đậu, thịt", "Xây dựng cơ thể."]
  ],
  g9_b32: [
    ["multiple_choice", "PVC, PE là:", ["Polymer", "Kim loại", "Axit", "Muối"], "Polymer", "Nhựa tổng hợp."],
    ["multiple_choice", "Tái chế nhựa giúp:", ["Giảm rác và tiết kiệm tài nguyên", "Tăng CO2 vô hạn", "Không có lợi", "Biến nhựa thành kim loại"], "Giảm rác và tiết kiệm tài nguyên", "Bảo vệ môi trường."],
    ["multiple_choice", "Polime là:", ["Phân tử khổng lồ từ nhiều monomer", "Nguyên tử đơn", "Chỉ muối", "Kim loại"], "Phân tử khổng lồ từ nhiều monomer", "Định nghĩa polime."],
    ["multiple_choice", "PE (polyethylene) dùng làm:", ["Túi nilon, bọc màng", "Dây điện đồng", "Muối ăn", "Axit"], "Túi nilon, bọc màng", "Ứng dụng nhựa."]
  ],
  g9_b33: [
    ["multiple_choice", "Vỏ Trái Đất chứa nhiều:", ["Silicate và oxide", "Chỉ vàng nguyên chất", "Chỉ khí hiếu", "Muối ăn"], "Silicate và oxide", "Khoáng sản."],
    ["multiple_choice", "Bauxit là quặng của:", ["Nhôm", "Sắt", "Vàng", "Natri"], "Nhôm", "Khai thác Al."],
    ["multiple_choice", "Nguyên tố phổ biến trong vỏ Trái Đất:", ["Oxi, silic", "Chỉ vàng", "Chỉ urani", "Helium"], "Oxi, silic", "SiO2, silicate."],
    ["multiple_choice", "Khai thác khoáng sản cần:", ["Cân bằng kinh tế và phục hồi môi trường", "Khai thác tối đa không giới hạn", "Đổ chất thải xuống sông", "Không cần quy hoạch"], "Cân bằng kinh tế và phục hồi môi trường", "Phát triển bền vững."]
  ],
  g9_b34: [
    ["multiple_choice", "Đá vôi chủ yếu là:", ["CaCO3", "NaCl", "CH4", "O2"], "CaCO3", "Canxi cacbonat."],
    ["multiple_choice", "Xi măng liên quan nung:", ["CaCO3", "Muối", "Khí noble", "Glucose"], "CaCO3", "Sản xuất vôi, xi măng."],
    ["multiple_choice", "CaCO3 + 2HCl tạo:", ["CaCl2 + H2O + CO2", "Chỉ H2", "Chỉ NaCl", "Không phản ứng"], "CaCl2 + H2O + CO2", "Thí nghiệm đá vôi."],
    ["multiple_choice", "Công nghiệp silicate sản xuất:", ["Thủy tinh, gốm sứ", "Chỉ xăng", "Chỉ protein", "Kim loại nguyên chất"], "Thủy tinh, gốm sứ", "Vật liệu xây dựng."]
  ],
  g9_b35: [
    ["multiple_choice", "Chu trình carbon liên quan:", ["CO2 – thực vật – nhiên liệu", "Chỉ NaCl", "Chỉ sắt", "Không có CO2"], "CO2 – thực vật – nhiên liệu", "Vòng carbon."],
    ["multiple_choice", "Đốt nhiên liệu hóa thạch tăng:", ["CO2 khí quyển", "Oxy trong không khí lên 100%", "Không ảnh hưởng", "Giảm nhiệt độ Trái Đất"], "CO2 khí quyển", "Hiệu ứng nhà kính."],
    ["multiple_choice", "Quang hợp giúp:", ["Hấp thụ CO2, tạo sinh khối", "Tăng CO2 vô hạn", "Luyện sắt", "Tạo muối"], "Hấp thụ CO2, tạo sinh khối", "Nhánh chu trình carbon."],
    ["multiple_choice", "Giảm phát thải CO2 có thể bằng:", ["Trồng cây, năng lượng sạch", "Đốt nhiều than hơn", "Phá rừng", "Không tái chế"], "Trồng cây, năng lượng sạch", "Giảm nhà kính."]
  ]
};

const errors = [
  ["g9_b18", "au", "metal_error", "Nhầm tính chất kim loại", "Vàng (Au) ít phản ứng với O2 ở điều kiện thường.", "Một số KL bền với không khí."],
  ["g9_b19", "cu truoc", "activity_error", "Sai thứ tự dãy hoạt động", "Kim loại đứng trước mới thế kim loại đứng sau.", "Zn trước Cu, Fe trước Cu…"],
  ["g9_b19", "k", "activity_error", "Thí nghiệm K, Na nguy hiểm", "K, Na phản ứng mạnh với nước — không tự thí nghiệm.", "Dùng mô hình, video SGK."],
  ["g9_b20", "cu va c", "alloy_error", "Nhầm thành phần hợp kim", "Thép là Fe + C, không phải Cu + C.", "Đồng thau: Cu + Zn."],
  ["g9_b21", "cu", "nonmetal_error", "Nhầm phi kim và kim loại", "Đồng Cu là kim loại, lưu huỳnh S là phi kim.", "KL: dẫn điện, ánh kim."],
  ["g9_b22", "co2", "organic_error", "Nhầm hữu cơ", "CO2 có C nhưng thường xét hợp chất hữu cơ là hydrocarbon, este…", "CH4, C2H5OH là hữu cơ."],
  ["g9_b23", "cnh2n", "alkane_error", "Nhầm ankan và anken", "Ankan CnH2n+2, anken CnH2n.", "Metan CH4 là ankan."],
  ["g9_b23", "ch3", "formula_error", "Sai công thức metan", "Metan là CH4, không phải CH3.", "Ankan đơn giản nhất."],
  ["g9_b24", "cnh2n+2", "alkene_error", "Nhầm công thức anken", "Anken CnH2n, không phải CnH2n+2.", "C2H4 là etilen."],
  ["g9_b25", "nuoc", "fuel_error", "Nhầm nhiên liệu", "Nước không phải nhiên liệu hóa thạch.", "Than, dầu, khí."],
  ["g9_b26", "ch3cooh", "alcohol_error", "Nhầm cồn và giấm", "C2H5OH là cồn, CH3COOH là axit axetic.", "Đọc đúng nhóm chức."],
  ["g9_b27", "hcl", "acid_error", "Nhầm axit axetic và HCl", "Giấm là CH3COOH yếu, không phải HCl mạnh.", "Axit yếu trong thực phẩm."],
  ["g9_b29", "c12h22o11", "sugar_error", "Nhầm glucose và saccharose", "Glucose C6H12O6, saccharose C12H22O11.", "Đường đơn vs đôi."],
  ["g9_b29", "c6h12o6", "sugar_error", "Nhầm saccharose với glucose", "Đường ăn saccharose là C12H22O11.", "Glucose là đường đơn."],
  ["g9_b30", "protein", "starch_error", "Nhầm tinh bột và protein", "Tinh bột là polime glucose, không phải protein.", "Iodine với tinh bột."],
  ["g9_b31", "glucose", "protein_error", "Nhầm protein và carbohydrate", "Protein từ amino acid, không phải glucose.", "Enzyme là protein."],
  ["g9_b32", "fe", "polymer_error", "Nhầm polymer và kim loại", "PVC, PE là polime; Fe là kim loại.", "Nhựa ≠ kim loại."],
  ["g9_b33", "vang", "resource_error", "Nhầm thành phần vỏ Trái Đất", "Vỏ Trái Đất chủ yếu O, Si, Al, Fe… không phải vàng nguyên chất.", "Silicate, oxide."],
  ["g9_b34", "nacl", "limestone_error", "Nhầm đá vôi", "Đá vôi là CaCO3, không phải NaCl.", "CaCO3 + HCl → CO2."],
  ["g9_b35", "o2", "carbon_error", "Nhầm chu trình carbon", "Chu trình carbon xoay quanh CO2, không phải tăng O2 vô hạn.", "CO2 ↔ sinh khối ↔ nhiên liệu."]
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

const grade9Skills = lessons.map((item, index) => skillFromLesson(item, index));
const grade9Lessons = lessons.map((item) => ({
  id: item[0],
  title: item[1],
  skill: item[0],
  chapter: item[2],
  source: SOURCE,
  xp: 50,
  steps: lessonSteps(item)
}));
const grade9Questions = lessons.flatMap(questionObjects);
const grade9Errors = errors.map(([skill, pattern, errorType, title, message, hint]) => ({
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

const lower = skillsFile.filter((s) => s.grade < 9);
const lowerLessons = lessonsFile.filter((l) => lower.some((s) => s.id === l.skill));
const lowerQuestions = questionsFile.filter((qItem) => lower.some((s) => s.id === qItem.skill));
const keepErrors = errorsFile.filter((e) => lower.some((s) => s.id === e.skill));

const skills = [...lower, ...grade9Skills];
const lessonData = [...lowerLessons, ...grade9Lessons];
const questions = [...lowerQuestions, ...grade9Questions];
const allErrors = [...keepErrors, ...grade9Errors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 9 KNTT: ${grade9Skills.length} skills, ${grade9Questions.length} questions, ${grade9Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
