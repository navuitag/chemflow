# TÀI LIỆU THIẾT KẾ CHI TIẾT (DETAILED DESIGN DOCUMENT)
# ỨNG DỤNG WEB HỌC HÓA THCS
## Ý tưởng: “PHÂN TÍCH LỖI SAI” + TRỰC QUAN HÓA

# 1. TỔNG QUAN KIẾN TRÚC

```txt
┌──────────────────────────────────────┐
│              Browser                 │
└──────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────┐
│              index.html              │
└──────────────────────────────────────┘
```

# 2. THIẾT KẾ THƯ MỤC

```txt
project/
│
├── index.html
├── manifest.json
├── service-worker.js
│
├── assets/
├── css/
├── js/
└── data/
```

# 3. THIẾT KẾ UI/UX

## Màu sắc

| Mục đích | Màu |
|---|---|
| Primary | #3B82F6 |
| Success | #22C55E |
| Warning | #F59E0B |
| Error | #EF4444 |

## Typography

| Thành phần | Font size |
|---|---|
| Title | 32px |
| Heading | 24px |
| Body | 16px |

# 4. CORE ENGINE

## App Engine
- load router
- load state
- render app

## Router Engine

| Route | Module |
|---|---|
| #/ | Dashboard |
| #/lesson | Lesson |
| #/quiz | Quiz |

## State Manager

```javascript
const state = {
   user: {},
   progress: {},
   currentLesson: null
}
```

# 5. VISUALIZATION ENGINE

## Atomic Renderer
- proton
- neutron
- electron orbit

## Molecular Builder
- kéo nguyên tử
- tạo liên kết
- kiểm tra hóa trị

## Reaction Animator
- collision
- break bonds
- create products

# 6. ERROR ANALYSIS ENGINE

## Flow

```txt
Student Input
      ↓
Input Parser
      ↓
Rule Engine
      ↓
Feedback Generator
```

## Example Rule

```javascript
if(left.H !== right.H){
   errors.push("E002");
}
```

# 7. QUIZ ENGINE

## Quiz Flow

```txt
Question
   ↓
Answer
   ↓
Analysis
   ↓
Feedback
```

# 8. STORAGE DESIGN

## LocalStorage Keys
- chem_user
- chem_progress
- chem_settings

## IndexedDB
- lessons
- animations
- history

# 9. OFFLINE-FIRST DESIGN

## Service Worker Cache
- HTML
- CSS
- JS
- Images
- Lessons

# 10. KẾT LUẬN

Thiết kế tập trung vào:
- trực quan hóa mạnh,
- phân tích lỗi sai,
- khả năng mở rộng,
- tối ưu frontend-only.
