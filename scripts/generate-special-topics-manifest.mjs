/**
 * Quét thư mục special-topic/ và sinh data/special-topics.json
 * Chạy: node scripts/generate-special-topics-manifest.mjs
 */
import { readdir, writeFile } from "node:fs/promises";

const ROOT = "special-topic";

const SLUG_TITLES = {
  "Chat-Nguyen-tu-Phan-tu": "Chất, nguyên tử, phân tử",
  "Nguyen-to-Bang-tuan-hoan": "Nguyên tố, bảng tuần hoàn",
  "Cong-thuc-hoa-hoc-Hoa-tri": "Công thức hóa học, hóa trị",
  "Mol-Khoi-luong-mol-The-tich-mol": "Mol, khối lượng mol, thể tích mol",
  "Phan-ung-hoa-hoc": "Phản ứng hóa học",
  "Phuong-trinh-hoa-hoc": "Phương trình hóa học",
  "Oxi-Hidro-Nuoc": "Oxi, hiđro, nước",
  "Axit-Bazo-Muoi": "Axit, bazơ, muối",
  "Kim-loai": "Kim loại",
  "Phi-kim": "Phi kim",
  "Hop-chat-vo-co": "Hợp chất vô cơ",
  "Tinh-toan-hoa-hoc": "Tính toán hóa học",
  "Nhan-biet-va-Tach-chat": "Nhận biết và tách chất",
  "Chuoi-chuyen-hoa": "Chuỗi chuyển hóa"
};

const CATEGORIES = [
  { id: "basics", title: "Cơ bản", emoji: "🧪", max: 4 },
  { id: "reactions", title: "Phản ứng & hợp chất", emoji: "⚗️", max: 8 },
  { id: "materials", title: "Vật chất", emoji: "🔬", max: 11 },
  { id: "applied", title: "Vận dụng", emoji: "📊", max: 14 }
];

function titleFromSlug(slug) {
  return SLUG_TITLES[slug] || slug.replace(/-/g, " ");
}

function categoryForOrder(order) {
  return CATEGORIES.find((c) => order <= c.max) || CATEGORIES[CATEGORIES.length - 1];
}

async function main() {
  const files = await readdir(ROOT);
  const topics = [];

  for (const file of files.filter((f) => f.endsWith(".png"))) {
    const match = file.match(/^(\d+)\.(.+)\.png$/i);
    if (!match) continue;

    const order = Number(match[1]);
    const slug = match[2];
    const cat = categoryForOrder(order);
    const path = `${ROOT}/${file}`;

    topics.push({
      id: `cd${String(order).padStart(2, "0")}`,
      order,
      code: `CD${String(order).padStart(2, "0")}`,
      title: titleFromSlug(slug),
      slug,
      category: cat.id,
      categoryTitle: cat.title,
      pdf: null,
      image: path
    });
  }

  topics.sort((a, b) => a.order - b.order);

  const payload = {
    meta: {
      title: "Chuyên đề Hóa học",
      subtitle: "14 sơ đồ chuyên đề — xem trực tiếp trên hệ thống",
      topicCount: topics.length,
      source: "Bộ tài liệu chuyên đề trong thư mục special-topic/"
    },
    overviews: [],
    categories: CATEGORIES.map(({ id, title, emoji }) => ({ id, title, emoji })),
    topics
  };

  await writeFile("data/special-topics.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`✓ special-topics.json — ${topics.length} chuyên đề`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
