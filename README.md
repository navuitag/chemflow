# ChemFlow VN

Ứng dụng web học **Hóa THCS** (lớp 6–9): micro-learning, trực quan hóa (nguyên tử, phân tử, phản ứng) và phân tích lỗi sai. Frontend-only, offline-first.

## Chạy thử

```bash
cd chemflow
python3 -m http.server 8080
```

Mở trình duyệt: `http://localhost:8080`

## Cấu trúc

- `index.html` — shell SPA
- `assets/` — CSS, JS (router, state)
- `components/` — navbar, lesson/quiz card, modal
- `modules/` — lesson, quiz, error, visualization, gamification, progress
- `data/` — `skills.json`, `lessons.json`, `questions.json`, `errors.json`

## Lộ trình

- **Lớp 6 (KHTN – Kết nối tri thức):** 17 bài mạch Hóa (Chương I–IV, Bài 1–17): mở đầu KHTN, an toàn lab, kính lúp–kính hiển vi, đo lường (chiều dài, khối lượng, thời gian, nhiệt độ), chất quanh ta, oxy–không khí, vật liệu–nhiên liệu–thực phẩm, hỗn hợp và tách chất.
- **Lớp 7 (KHTN – Kết nối tri thức):** 7 bài mạch Hóa (Bài 1–7, 2 chương): phương pháp KHTN; nguyên tử, nguyên tố, bảng tuần hoàn; phân tử–đơn chất–hợp chất, liên kết ion/cộng hóa trị, hóa trị và công thức (3–4 câu quiz/bài).
- **Lớp 8 (KHTN – Kết nối tri thức):** 12 bài mạch Hóa (Bài 1–12, 3 chương): thiết bị–hóa chất lab; phản ứng, mol, dung dịch, PTHH, tính theo PTHH, xúc tác; axit, bazơ/pH, oxide, muối, phân bón (3–4 câu quiz/bài).
- **Lớp 9 (KHTN – Kết nối tri thức):** 18 bài mạch Hóa (Bài 18–35, 5 chương): kim loại, hữu cơ–hydrocarbon, cồn–axit axetic, lipid–carbohydrate–protein–polime, tài nguyên vỏ Trái Đất (4 câu quiz/bài).

Tạo lại nội dung: `node scripts/generate-grade6-kntt.mjs` · `grade7` · `grade8` · `grade9` (các file `scripts/generate-grade*-kntt.mjs`)

Giao diện dùng cùng bảng màu với [MathFlow](../mathflow) (`#20a36b`, nền `#f7fbff`).

---

## Tác giả

- **Nguyễn Anh Vũ**
- Email: [navuitag@gmail.com](mailto:navuitag@gmail.com)
- Điện thoại: [0986201079](tel:+84986201079)
