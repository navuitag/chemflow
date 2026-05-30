import { levelFromXp } from "../assets/js/utils.js";

export function getGamificationSummary(state) {
  const level = levelFromXp(state.xp);
  const currentLevelXp = state.xp % 120;
  const badges = [];

  if (state.completedLessons.includes("g6_b01") || state.completedLessons.includes("chem_intro")) badges.push("Khởi đầu Hóa học");
  if (state.completedLessons.includes("g6_b17")) badges.push("Thợ tách hỗn hợp");
  if (state.completedLessons.includes("g7_b07") || state.completedLessons.includes("covalent_bond")) badges.push("Bậc thầy công thức");
  if (state.completedLessons.includes("g8_b05") || state.completedLessons.includes("equation_balance")) badges.push("Thợ cân phương trình");
  if (state.completedLessons.includes("g8_b12")) badges.push("Nông dân hóa học");
  if (state.completedLessons.includes("g9_b22") || state.completedLessons.includes("organic_intro")) badges.push("Khởi đầu hữu cơ");
  if (state.completedLessons.includes("g9_b35")) badges.push("Hiểu chu trình carbon");
  if (state.completedLessons.length >= 3) badges.push("Nhịp học đều");
  if (state.streak >= 7) badges.push("7 ngày liên tiếp");
  if (state.answers.filter((answer) => answer.correct).length >= 10) badges.push("Mười câu chắc tay");

  return {
    level,
    currentLevelXp,
    nextLevelXp: 120,
    badges
  };
}

export function xpForAnswer(correct) {
  return correct ? 10 : 0;
}
