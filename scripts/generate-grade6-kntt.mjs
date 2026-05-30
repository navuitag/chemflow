import { readFile, writeFile } from "node:fs/promises";

/** SGK Khoa học tự nhiên 6 – Kết nối tri thức (toàn bộ mạch Hóa: Bài 1–17, Chương I–IV) */
const lessons = [
  ["g6_b01", "Bài 1. Giới thiệu về Khoa học tự nhiên", "Mở đầu về Khoa học tự nhiên", 1, 1, "Nhận biết ba lĩnh vực KHTN và vai trò Hóa học trong đời sống.", "khtn"],
  ["g6_b02", "Bài 2. An toàn trong phòng thực hành", "Mở đầu về Khoa học tự nhiên", 1, 2, "Tuân thủ quy tắc an toàn khi làm thí nghiệm Hóa – Sinh – Vật lí.", "lab"],
  ["g6_b03", "Bài 3. Sử dụng kính lúp", "Mở đầu về Khoa học tự nhiên", 1, 3, "Dùng kính lúp quan sát mẫu vật nhỏ trong thí nghiệm Hóa – Sinh.", "magnifier"],
  ["g6_b04", "Bài 4. Sử dụng kính hiển vi quang học", "Mở đầu về Khoa học tự nhiên", 1, 4, "Quan sát cấu trúc vi mô bằng kính hiển vi; làm mẫu và điều chỉnh độ phóng đại.", "microscope"],
  ["g6_b05", "Bài 5. Đo chiều dài", "Mở đầu về Khoa học tự nhiên", 1, 5, "Dùng thước kẻ, thước dây; đơn vị m, cm, mm và đọc số liệu.", "length"],
  ["g6_b06", "Bài 6. Đo khối lượng", "Mở đầu về Khoa học tự nhiên", 1, 6, "Dùng cân, đơn vị gam và kilogam khi đo chất trong thí nghiệm.", "measure"],
  ["g6_b07", "Bài 7. Đo thời gian", "Mở đầu về Khoa học tự nhiên", 1, 7, "Dùng đồng hồ, bấm giờ đo thời gian phản ứng và quá trình biến đổi chất.", "time"],
  ["g6_b08", "Bài 8. Đo nhiệt độ", "Mở đầu về Khoa học tự nhiên", 1, 8, "Đọc nhiệt kế, độ C và liên hệ với chuyển thể chất.", "temperature"],
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
  g6_b03: ["Kính lúp", "Phóng đại vài lần; quan sát hạt muối, đường, bề mặt lá.", "So sánh hình dạng tinh thể muối và đường dưới kính lúp.", "Giữ khoảng cách mắt – kính – vật để hình rõ."],
  g6_b04: ["Kính hiển vi", "Phóng đại lớn hơn kính lúp; làm mẫu mỏng trên lam kính.", "Quan sát tế bào thực vật lát mỏng nhuộm màu.", "Điều chỉnh vít tinh/chỉnh và ánh sáng trước khi vẽ hình."],
  g6_b05: ["Thước đo", "Thước kẻ, thước dây; đơn vị m, cm, mm.", "Đo chiều dài ống nghiệm: đọc đến vạch nhỏ nhất.", "1 m = 100 cm = 1000 mm."],
  g6_b06: ["Cân và đơn vị", "Khối lượng đo lượng chất; đơn vị thường dùng: g, kg.", "10 g muối + 5 g đường trong cốc cho tổng khối lượng hỗn hợp rắn 15 g.", "Đặt cân trên mặt phẳng, không rung khi đọc số."],
  g6_b07: ["Đo thời gian", "Đồng hồ, bấm giờ; đơn vị giây, phút, giờ.", "Đo thời gian tan muối trong nước ấm và nước lạnh.", "1 giờ = 60 phút = 3600 giây."],
  g6_b08: ["Nhiệt kế", "Nhiệt độ ảnh hưởng thể chất; nước sôi khoảng 100°C (áp suất thường).", "Nước đá tan ở 0°C là ví dụ chuyển thể khi đủ nhiệt.", "Đọc vạch ngang mực nước hoặc cột thủy ngân."],
  g6_b09: ["Chất quanh ta", "Mỗi chất có tính chất riêng; có chất tinh khiết và hỗn hợp.", "Muối ăn tinh khiết NaCl; nước biển là hỗn hợp muối và nước.", "Tách thử bằng tính chất vật lí hoặc hóa học."],
  g6_b10: ["Ba thể chất", "Rắn, lỏng, khí khác nhau về khoảng cách và chuyển động hạt.", "Nước đá → nước lỏng: nóng chảy; nước lỏng → hơi: hóa hơi.", "Cùng chất, khác thể tùy nhiệt độ và áp suất."],
  g6_b11: ["Oxy và không khí", "Oxy hỗ trợ sự cháy; không khí ~21% O₂, ~78% N₂.", "Nến cháy trong bình kín sẽ tắt khi hết oxy.", "Sự cháy cần oxy, nhiên liệu và nhiệt độ đủ."],
  g6_b12: ["Vật liệu", "Kim loại dẫn điện tốt; nhựa polime cách điện, nhẹ.", "Đồng dùng dây điện; nhựa PVC làm ống nước.", "Chọn vật liệu theo tính chất cần dùng."],
  g6_b13: ["Nguyên liệu", "Nguyên liệu là đầu vào sản xuất: quặng, gỗ, dầu thô.", "Sắt từ quặng hematit; đường từ mía là nguyên liệu thực phẩm.", "Phân biệt nguyên liệu và sản phẩm."],
  g6_b14: ["Nhiên liệu", "Than, dầu, khí đốt chứa năng lượng hóa học.", "Cháy than tỏa nhiệt; khí metan trong bếp gas.", "Tiết kiệm nhiên liệu, tránh cháy nổ."],
  g6_b15: ["Thực phẩm", "Tinh bột, đường, protein, chất béo là nhóm chất chính.", "Gạo nhiều tinh bột; trứng giàu protein.", "Bảo quản khô ráo, mát hoặc lạnh tùy loại."],
  g6_b16: ["Hỗn hợp", "Hỗn hợp gồm hai hay nhiều chất, giữ tính chất từng thành phần.", "Nước muối là dung dịch (hỗn hợp đồng nhất); nước + cát là không đồng nhất.", "Không phải mọi dung dịch đều có thể nhìn thấy hai pha."],
  g6_b17: ["Tách hỗn hợp", "Lọc tách rắn–lỏng; khơi tách chất không hòa tan; chưng cất theo nhiệt độ sôi.", "Tách cát khỏi nước bằng lọc; tách muối từ nước biển bằng cô.", "Chọn phương pháp theo tính chất thành phần."]
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
  g6_b01: [
    ["multiple_choice", "Hóa học nghiên cứu chủ yếu điều gì?", ["Chất và sự biến đổi của chất", "Chỉ chuyển động cơ", "Chỉ tế bào", "Chỉ hành tinh"], "Chất và sự biến đổi của chất", "Hóa học là một nhánh của KHTN."],
    ["multiple_choice", "Khoa học tự nhiên gồm những lĩnh vực nào?", ["Vật lí, Hóa học, Sinh học", "Chỉ Toán", "Chỉ Văn", "Chỉ Địa"], "Vật lí, Hóa học, Sinh học", "Ba lĩnh vực cốt lõi THCS."],
    ["multiple_choice", "Phương pháp nào thường dùng trong KHTN?", ["Quan sát và thí nghiệm", "Chỉ học thuộc lòng", "Chỉ vẽ tranh", "Không cần kiểm chứng"], "Quan sát và thí nghiệm", "KHTN dựa trên bằng chứng."]
  ],
  g6_b02: [
    ["multiple_choice", "Khi làm thí nghiệm với axit, việc nào đúng?", ["Đổ axit chậm vào nước", "Đổ nước vào axit đặc", "Nếm thử dung dịch", "Không đeo kính"], "Đổ axit chậm vào nước", "Tránh bắn axit."],
    ["multiple_choice", "Phát hiện chất lạ bị đổ trong phòng lab, em nên:", ["Báo giáo viên ngay", "Nếm thử", "Đổ ra sàn", "Trộn thử với axit"], "Báo giáo viên ngay", "An toàn là ưu tiên."],
    ["multiple_choice", "Dụng cụ bảo hộ cơ bản khi làm TN Hóa gồm:", ["Kính bảo hộ", "Chỉ dép lê", "Không cần gì", "Chỉ găng tay một bên"], "Kính bảo hộ", "Bảo vệ mắt và da."]
  ],
  g6_b03: [
    ["multiple_choice", "Kính lúp dùng để:", ["Phóng đại vật nhỏ", "Đo khối lượng", "Đo nhiệt độ", "Cân chất rắn"], "Phóng đại vật nhỏ", "Quan sát chi tiết bề mặt."],
    ["multiple_choice", "Khi quan sát bằng kính lúp, nên:", ["Giữ khoảng cách mắt – kính – vật phù hợp", "Dùng kính lúp trong nước", "Nhìn trực tiếp vào Mặt Trời", "Rung mạnh kính"], "Giữ khoảng cách mắt – kính – vật phù hợp", "Hình ảnh mới rõ."],
    ["multiple_choice", "Mẫu nào phù hợp quan sát bằng kính lúp?", ["Hạt muối tinh thể", "Toàn bộ quả cam", "Khối sắt lớn", "Bình chứa axit"], "Hạt muối tinh thể", "Vật nhỏ, an toàn."]
  ],
  g6_b04: [
    ["multiple_choice", "Kính hiển vi quang học phóng đại:", ["Lớn hơn kính lúp", "Nhỏ hơn kính lúp", "Bằng mắt thường", "Không phóng đại"], "Lớn hơn kính lúp", "Nhìn cấu trúc vi mô."],
    ["multiple_choice", "Trước khi quan sát kính hiển vi cần:", ["Làm mẫu mỏng trên lam kính", "Đổ axit lên mắt kính", "Không cần điều chỉnh ánh sáng", "Quan sát mẫu dày không màu"], "Làm mẫu mỏng trên lam kính", "Ánh sáng xuyên qua mẫu."],
    ["multiple_choice", "Kính hiển vi thường dùng quan sát:", ["Tế bào", "Ngọn núi lửa", "Hành tinh", "Sóng âm"], "Tế bào", "Thuộc mảng Sinh – Hóa vi mô."]
  ],
  g6_b05: [
    ["multiple_choice", "1 mét bằng bao nhiêu centimet?", ["100", "10", "1000", "50"], "100", "1 m = 100 cm."],
    ["multiple_choice", "Dụng cụ đo chiều dài con vật cong có thể dùng:", ["Thước dây", "Cân đĩa", "Nhiệt kế", "Buret"], "Thước dây", "Thước dây uốn theo hình."],
    ["input", "Thước đo được 25 cm. Viết số (chỉ số, không đơn vị).", "25", "Đọc vạch chia trên thước."]
  ],
  g6_b06: [
    ["multiple_choice", "Đơn vị nào thường dùng đo khối lượng nhỏ trong lab?", ["gam (g)", "mét (m)", "giây (s)", "độ C"], "gam (g)", "g và kg là đơn vị khối lượng."],
    ["input", "Cân được 250 g muối. Viết số (chỉ số, không đơn vị).", "250", "Đọc thước hoặc màn hình cân."],
    ["multiple_choice", "1 kg bằng bao nhiêu gam?", ["1000", "100", "10", "500"], "1000", "1 kg = 1000 g."]
  ],
  g6_b07: [
    ["multiple_choice", "Đơn vị thời gian trong hệ SI là:", ["Giây (s)", "Phút", "Giờ", "Ngày"], "Giây (s)", "s là đơn vị cơ bản."],
    ["multiple_choice", "1 giờ bằng bao nhiêu phút?", ["60", "100", "30", "24"], "60", "1 h = 60 phút."],
    ["multiple_choice", "Đo thời gian tan muối trong nước dùng:", ["Đồng hồ hoặc bấm giờ", "Cân", "Kính lúp", "pH giấy"], "Đồng hồ hoặc bấm giờ", "Ghi nhận thời gian quá trình."]
  ],
  g6_b08: [
    ["multiple_choice", "Nước sôi ở áp suất thường khoảng bao nhiêu độ C?", ["100", "0", "37", "50"], "100", "Điều kiện chuẩn trong SGK."],
    ["multiple_choice", "Nhiệt độ làm băng tan thành nước lỏng (0°C) gọi là:", ["Nhiệt độ nóng chảy", "Nhiệt độ sôi", "Nhiệt độ sôi của muối", "Nhiệt độ cháy"], "Nhiệt độ nóng chảy", "Chuyển rắn → lỏng."],
    ["multiple_choice", "Đọc nhiệt kế thủy ngân nên:", ["Nhìn ngang vạch mực cột", "Nhìn xiên từ trên", "Lắc mạnh trước khi đọc", "Đo khi nhiệt kế nghiêng"], "Nhìn ngang vạch mực cột", "Tránh sai số parallax."]
  ],
  g6_b09: [
    ["multiple_choice", "Nước biển thuộc loại nào?", ["Hỗn hợp", "Chất tinh khiết", "Nguyên tố", "Hợp chất tinh khiết đơn"], "Hỗn hợp", "Có nhiều muối hòa tan."],
    ["multiple_choice", "Muối ăn tinh khiết NaCl là:", ["Chất tinh khiết", "Hỗn hợp", "Không khí", "Dung dịch"], "Chất tinh khiết", "Một loại chất duy nhất."],
    ["multiple_choice", "Tính chất hóa học của chất là:", ["Khả năng biến đổi thành chất khác", "Màu sắc", "Khối lượng", "Thể tích"], "Khả năng biến đổi thành chất khác", "Phân biệt với tính chất vật lí."]
  ],
  g6_b10: [
    ["multiple_choice", "Ở thể rắn, các hạt thường:", ["Sắp xếp chặt, rung tại vị trí", "Xa nhau hoàn toàn", "Không chuyển động", "Bay tự do như khí"], "Sắp xếp chặt, rung tại vị trí", "Giữ hình dạng và thể tích."],
    ["multiple_choice", "Nước đá tan thành nước lỏng là:", ["Nóng chảy", "Hóa hơi", "Ngưng tụ", "Thăng hoa"], "Nóng chảy", "Rắn → lỏng."],
    ["multiple_choice", "Iodine thăng hoa nghĩa là:", ["Rắn chuyển thẳng thành khí", "Lỏng thành rắn", "Khí thành lỏng", "Cháy tạo tro"], "Rắn chuyển thẳng thành khí", "Thăng hoa: rắn → khí."]
  ],
  g6_b11: [
    ["multiple_choice", "Không khí chứa khoảng bao nhiêu % thể tích oxy?", ["21", "78", "50", "100"], "21", "Thành phần chính của không khí."],
    ["multiple_choice", "Oxy có vai trò gì trong sự cháy?", ["Hỗ trợ sự cháy", "Dập tắt mọi lửa", "Làm chất rắn nguội", "Thay thế nhiên liệu"], "Hỗ trợ sự cháy", "Tam giác cháy: oxy, nhiên liệu, nhiệt."],
    ["multiple_choice", "Khí chiếm ~78% thể tích không khí là:", ["Nitơ (N₂)", "Oxy (O₂)", "CO₂", "H₂"], "Nitơ (N₂)", "Nitơ không hỗ trợ cháy như oxy."]
  ],
  g6_b12: [
    ["multiple_choice", "Vật liệu nào thường dẫn điện tốt?", ["Đồng", "Nhựa PVC", "Gỗ khô", "Thủy tinh"], "Đồng", "Kim loại dẫn điện."],
    ["multiple_choice", "Polime (nhựa) thường có đặc điểm:", ["Cách điện, nhẹ", "Rất nặng như sắt", "Tan trong nước như đường", "Dẫn điện như đồng"], "Cách điện, nhẹ", "Ứng dụng bao bì, ống."],
    ["multiple_choice", "Thủy tinh thường được chọn vì:", ["Trong suốt, cứng", "Dẻo như cao su", "Cháy được", "Tan trong axit loãng"], "Trong suốt, cứng", "Cửa sổ, chai lọ."]
  ],
  g6_b13: [
    ["multiple_choice", "Quặng sắt là:", ["Nguyên liệu", "Sản phẩm cuối", "Dụng cụ đo", "Chất xúc tác"], "Nguyên liệu", "Dùng luyện thép."],
    ["multiple_choice", "Đường mía sau khi ép lấy nước cốt, phần còn lại có thể làm:", ["Nguyên liệu thức ăn gia súc", "Oxy thở", "Kim loại", "Khí noble"], "Nguyên liệu thức ăn gia súc", "Tận dụng phụ phẩm."],
    ["multiple_choice", "Dầu mỏ là nguyên liệu cho:", ["Xăng, dầu, nhựa", "Muối ăn", "Gạo", "Oxy khí"], "Xăng, dầu, nhựa", "Tinh chế trong công nghiệp."]
  ],
  g6_b14: [
    ["multiple_choice", "Than đá, dầu mỏ thuộc nhóm:", ["Nhiên liệu hóa thạch", "Kim loại", "Axit", "Muối ăn"], "Nhiên liệu hóa thạch", "Chứa năng lượng hóa học."],
    ["multiple_choice", "Khí metan (CH₄) cháy tạo ra chủ yếu:", ["CO₂ và H₂O", "Chỉ muối", "Chỉ sắt", "Oxy"], "CO₂ và H₂O", "Phản ứng cháy hoàn toàn đơn giản."],
    ["multiple_choice", "Nhiên liệu sinh học ví dụ:", ["Ethanol sinh học", "Than đá", "Dầu mỏ", "Quặng sắt"], "Ethanol sinh học", "Tái tạo nhanh hơn hóa thạch."]
  ],
  g6_b15: [
    ["multiple_choice", "Gạo tẩm chứa nhiều chất dinh dưỡng nào?", ["Tinh bột", "Protein như thịt", "Kim loại", "Oxy khí"], "Tinh bột", "Carbohydrate chính."],
    ["multiple_choice", "Trứng gà giàu nhất về:", ["Protein", "Than đá", "Khí hiđro", "Muối tinh khiết"], "Protein", "Cần cho cơ thể."],
    ["multiple_choice", "Bảo quản thực phẩm dễ hỏng nên:", ["Để mát/lạnh, khô ráo", "Phơi nắng cả ngày", "Để cạnh hóa chất", "Không cần che đậy"], "Để mát/lạnh, khô ráo", "Hạn chế vi sinh vật."]
  ],
  g6_b16: [
    ["multiple_choice", "Nước muối loãng là hỗn hợp:", ["Đồng nhất", "Không đồng nhất", "Nguyên tố", "Chỉ một chất rắn"], "Đồng nhất", "Nhìn một pha."],
    ["multiple_choice", "Hỗn hợp cát và nước là:", ["Không đồng nhất", "Đồng nhất", "Chất tinh khiết", "Nguyên tử"], "Không đồng nhất", "Hai pha rõ ràng."],
    ["multiple_choice", "Không khí là hỗn hợp:", ["Đồng nhất các khí", "Chỉ một khí", "Chất rắn", "Muối tinh khiết"], "Đồng nhất các khí", "N₂, O₂, CO₂... trộn đều."]
  ],
  g6_b17: [
    ["multiple_choice", "Tách cát khỏi nước dùng phương pháp:", ["Lọc", "Chưng cất", "Thăng hoa iodine", "Lên men"], "Lọc", "Hạt rắn không lọt qua giấy lọc."],
    ["multiple_choice", "Tách muối từ nước biển thường dùng:", ["Cô / để bốc hơi nước", "Lọc giấy", "Hút nam châm", "Quay ly tâm protein"], "Cô / để bốc hơi nước", "Muối không bay hơi ở nhiệt độ sôi nước."],
    ["multiple_choice", "Chưng cất tách được hai chất lỏng khi:", ["Khác nhiệt độ sôi", "Cùng màu", "Cùng khối lượng", "Không hòa tan"], "Khác nhiệt độ sôi", "Chất sôi trước bay hơi trước."]
  ]
};

const errors = [
  ["g6_b02", "nuoc vao axit", "safety_error", "Đổ sai thứ tự axit – nước", "Không được đổ nước vào axit đặc.", "Luôn đổ axit loãng chậm vào nước."],
  ["g6_b03", "can", "tool_error", "Nhầm dụng cụ quan sát", "Kính lúp không dùng để cân khối lượng.", "Kính lúp để phóng đại hình ảnh."],
  ["g6_b04", "lup", "tool_error", "Nhầm kính lúp và kính hiển vi", "Kính hiển vi phóng đại mạnh hơn kính lúp.", "Làm mẫu mỏng trên lam kính."],
  ["g6_b05", "1000 cm", "unit_error", "Nhầm đổi m và cm", "1 m = 100 cm, không phải 1000 cm.", "1 m = 100 cm = 1000 mm."],
  ["g6_b06", "kg", "unit_error", "Nhầm đơn vị đo", "gam và kilogam đều là khối lượng nhưng khác bậc.", "Đổi 1 kg = 1000 g khi cần."],
  ["g6_b07", "3600 phut", "unit_error", "Nhầm đổi giờ và phút", "1 giờ = 60 phút, không phải 3600 phút.", "3600 giây = 1 giờ."],
  ["g6_b08", "0", "temp_error", "Nhầm nóng chảy và sôi", "0°C là nhiệt độ nóng chảy của nước đá, không phải sôi.", "Sôi của nước khoảng 100°C."],
  ["g6_b09", "tinh khiet", "substance_error", "Nhầm hỗn hợp với chất tinh khiết", "Nước biển có nhiều muối hòa tan.", "Hỏi có mấy loại chất trong mẫu."],
  ["g6_b10", "hoa hoi", "state_error", "Nhầm nóng chảy và hóa hơi", "Đá tan là nóng chảy (rắn→lỏng), không phải hóa hơi.", "Hóa hơi là lỏng→khí."],
  ["g6_b11", "78", "air_error", "Nhầm % oxy và nitơ", "78% là nitơ trong không khí, không phải oxy.", "Oxy khoảng 21%."],
  ["g6_b12", "go", "material_error", "Nhầm vật liệu dẫn điện", "Gỗ khô thường cách điện, không như đồng.", "Kim loại dẫn điện tốt."],
  ["g6_b14", "oxy", "fuel_error", "Nhầm nhiên liệu và chất hỗ trợ cháy", "Oxy hỗ trợ cháy, không phải nhiên liệu chính.", "Nhiên liệu: than, dầu, khí..."],
  ["g6_b15", "tinh bot", "food_error", "Nhầm thành phần dinh dưỡng", "Trứng giàu protein hơn tinh bột.", "Gạo nhiều tinh bột; trứng nhiều protein."],
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
const upperQuestions = JSON.parse(await readFile("data/questions.json", "utf8")).filter((qItem) => upper.some((s) => s.id === qItem.skill));
const upperErrors = JSON.parse(await readFile("data/errors.json", "utf8")).filter((e) => e.skill && !e.skill.startsWith("g6_"));

const skills = [...grade6Skills, ...upper];
const lessonData = [...grade6Lessons, ...upperLessons];
const questions = [...grade6Questions, ...upperQuestions];
const allErrors = [...grade6Errors, ...upperErrors];

await writeFile("data/skills.json", `${JSON.stringify(skills, null, 2)}\n`);
await writeFile("data/lessons.json", `${JSON.stringify(lessonData, null, 2)}\n`);
await writeFile("data/questions.json", `${JSON.stringify(questions, null, 2)}\n`);
await writeFile("data/errors.json", `${JSON.stringify(allErrors, null, 2)}\n`);

console.log(`Grade 6 KNTT: ${grade6Skills.length} skills, ${grade6Questions.length} questions, ${grade6Errors.length} error patterns.`);
console.log(`Total app: ${skills.length} skills, ${questions.length} questions.`);
