# TÀI LIỆU ĐẶC TẢ KỸ THUẬT
# ỨNG DỤNG WEB HỌC HÓA THCS
## Ý tưởng: “PHÂN TÍCH LỖI SAI” + DẠY HỌC TRỰC QUAN HÓA

# 1. THÔNG TIN DỰ ÁN

| Thuộc tính | Giá trị |
|---|---|
| Tên dự án | ChemInsight THCS |
| Loại ứng dụng | Web SPA (Single Page Application) |
| Nền tảng | HTML5 + CSS3 + JavaScript |
| Backend | Không sử dụng |
| Database | LocalStorage / IndexedDB |
| Đối tượng | Học sinh lớp 6–9 |
| Thiết bị | Desktop + Tablet + Mobile |
| Chế độ | Offline-first |

# 2. MỤC TIÊU HỆ THỐNG

Ứng dụng hỗ trợ học sinh THCS học Hóa học thông qua:
- trực quan hóa kiến thức,
- mô phỏng tương tác,
- phân tích lỗi sai,
- luyện tập thích ứng,
- game hóa học tập.

Ứng dụng KHÔNG chỉ kiểm tra đúng/sai mà phải:
- xác định nguyên nhân sai,
- giải thích trực quan,
- hướng dẫn sửa lỗi từng bước.

# 3. TRIẾT LÝ GIÁO DỤC

## 3.1 Learning by Visualization
Mọi khái niệm phải:
- nhìn thấy được,
- tương tác được,
- mô phỏng được.

## 3.2 Learning by Mistakes
Sai là dữ liệu học tập.

Hệ thống:
- ghi nhận lỗi,
- phân tích mẫu lỗi,
- tạo bài ôn tập phù hợp.

## 3.3 Micro Learning
Bài học ngắn:
- 3–5 phút,
- một mục tiêu duy nhất,
- phản hồi tức thì.

# 4. KIẾN TRÚC TỔNG THỂ

```txt
CLIENT SIDE ONLY

┌──────────────────────┐
│      index.html      │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│      app.js          │
└──────────┬───────────┘
           │
 ┌─────────┼─────────┐
 │         │         │
 ▼         ▼         ▼

Router   State    Storage
Engine   Manager  Manager
```

# 5. MODULE CHỨC NĂNG

## Lesson Module
- Infographic
- Animation
- Mini interaction
- Voice explanation

## Visualization Engine
- Atomic Visualizer
- Molecular Builder
- Reaction Animator
- Error Visualizer

## Error Analysis Engine
- Parser
- Rule Engine
- Error Classifier
- Feedback Generator

## Quiz Engine
- Multiple Choice
- Drag Drop
- Balance Equation
- Classification

## Virtual Lab
- Drag chemical
- Pour liquid
- Heat reaction
- Observe result

# 6. GAMIFICATION

| Hành động | XP |
|---|---|
| Hoàn thành bài | +10 |
| Không sai | +20 |
| Sửa đúng lỗi | +15 |
| Hoàn thành lab | +30 |

# 7. PERFORMANCE REQUIREMENTS

| Tiêu chí | Mục tiêu |
|---|---|
| Load lần đầu | < 3 giây |
| Offline support | Có |
| FPS | 60 FPS |

# 8. KẾT LUẬN

Ứng dụng kết hợp:
- trực quan hóa,
- phân tích lỗi sai,
- game hóa,
- học tập tương tác,
- adaptive learning.
