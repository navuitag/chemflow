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

- **Lớp 6 (KHTN – Kết nối tri thức):** 13 bài mạch Hóa (Chương I–IV): mở đầu KHTN, an toàn lab, đo khối lượng/nhiệt độ, chất quanh ta, oxy–không khí, vật liệu–nhiên liệu–thực phẩm, hỗn hợp và tách chất.
- **Lớp 7 (KHTN – Kết nối tri thức):** 7 bài Hóa (Bài 1–7): phương pháp KHTN, nguyên tử, nguyên tố, bảng tuần hoàn, phân tử–đơn chất–hợp chất, liên kết, hóa trị.
- **Lớp 8 (KHTN – Kết nối tri thức):** 11 bài Hóa (Bài 2–12): phản ứng, mol, dung dịch, PTHH, tính theo PTHH, xúc tác, axit, bazơ/pH, oxide, muối, phân bón.
- **Lớp 9 (KHTN – Kết nối tri thức):** 18 bài Hóa (Bài 18–35): kim loại, hữu cơ–hydrocarbon, cồn–axit axetic, lipid–protein–polime, tài nguyên vỏ Trái Đất.

Tạo lại nội dung: `node scripts/generate-grade6-kntt.mjs` · `grade7` · `grade8` · `grade9` (các file `scripts/generate-grade*-kntt.mjs`)

Giao diện dùng cùng bảng màu với [MathFlow](../mathflow) (`#20a36b`, nền `#f7fbff`).
