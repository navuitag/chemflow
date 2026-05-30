import { normalizeChem } from "../assets/js/utils.js";

export function analyzeError(answer, question, errorPatterns) {
  const normalized = normalizeChem(answer);
  const pattern = errorPatterns.find((item) => {
    const sameSkill = !item.skill || item.skill === question.skill;
    return sameSkill && normalized.includes(normalizeChem(item.pattern));
  });

  if (pattern) {
    return pattern;
  }

  if ((question.skill === "equation_balance" || question.skill === "g8_b05") && (normalized.includes("h2o") || normalized.includes("h2o2"))) {
    return {
      skill: question.skill,
      errorType: "E002",
      title: "Số nguyên tử H hai vế chưa khớp",
      message: "Bạn có thể đã cân H hoặc O chưa đồng bộ giữa vế trái và vế phải.",
      hint: question.hint,
      recommendation: question.skill
    };
  }

  if (question.skill.includes("bond") || question.skill.includes("valence")) {
    return {
      skill: question.skill,
      errorType: "valence_error",
      title: "Hóa trị hoặc loại liên kết chưa đúng",
      message: "Kiểm tra số electron lớp ngoài cùng và quy tắc đạt cấu hình bền.",
      hint: question.hint,
      recommendation: question.skill
    };
  }

  return {
    skill: question.skill,
    errorType: "logic_error",
    title: "Cần kiểm tra lại lập luận",
    message: "Đáp án chưa khớp. Hãy đọc lại dữ kiện và thử mô hình trực quan hoặc từng bước.",
    hint: question.hint,
    recommendation: question.skill
  };
}
