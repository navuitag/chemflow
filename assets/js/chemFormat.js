import { escapeHtml } from "./utils.js";

const FRAC_RE = /(\d+)\/(\d+)/g;
const EXP_RE = /(\([^)]+\)|\d+(?:[,.]\d+)?|[a-zA-Z])(\^(\([^)]+\)|\{[^}]+\}|\d+|[a-zA-Z]+))/g;
const SUB_RE = /([a-zA-Z])(_\{([^}]+)\}|_(\d+|[a-zA-Z]+))/g;
const SQRT_PAREN_RE = /√\(([^)]+)\)/g;
const SQRT_NUM_RE = /√(\d+)/g;
const CHEM_FORMULA_RE = /\d*(?:[A-Z][a-z]?\d*|\([A-Za-z0-9]+\)\d*)+(?:·\d*(?:[A-Z][a-z]?\d*|\([A-Za-z0-9]+\)\d*)+)*(?:\d*[+-])?/g;
const HYDROCARBON_RE = /\bCnH2n([+-]\d+)?\b/g;

function wrapFrac(num, den) {
  return `<span class="math-frac" aria-label="${num}/${den}"><span class="math-num">${num}</span><span class="math-den">${den}</span></span>`;
}

function wrapSup(base, exp) {
  return `<span class="math-inline"><span class="math-base">${base}</span><sup class="math-sup">${exp}</sup></span>`;
}

function wrapSub(base, sub) {
  return `<span class="math-inline"><span class="math-base">${base}</span><sub class="math-sub">${sub}</sub></span>`;
}

function subDigits(text) {
  return text.replace(/([A-Z][a-z]?)(\d+)/g, (_, el, count) => `${el}<sub class="math-sub">${count}</sub>`);
}

function replaceFractions(text) {
  return text.replace(FRAC_RE, (_, num, den) => wrapFrac(num, den));
}

function replaceExponents(text) {
  return text.replace(EXP_RE, (_, base, __, exp) => {
    const clean = exp.replace(/^\{|\}$/g, "").replace(/^\(|\)$/g, "");
    return wrapSup(base, clean);
  });
}

function replaceSubscripts(text) {
  return text.replace(SUB_RE, (_, base, __, sub) => wrapSub(base, sub.replace(/^\{|\}$/g, "")));
}

function replaceSqrt(text) {
  return text
    .replace(SQRT_PAREN_RE, (_, inner) => `<span class="math-sqrt"><span class="math-sqrt-sign">√</span><span class="math-sqrt-body">${inner}</span></span>`)
    .replace(SQRT_NUM_RE, (_, n) => `<span class="math-sqrt">√<span class="math-sqrt-body">${n}</span></span>`);
}

function replaceOperators(text) {
  return text
    .replace(/(\d)\*(\d)/g, "$1·$2")
    .replace(/\)\*(\d)/g, ")·$1")
    .replace(/(\d)\*\(/g, "$1·(")
    .replace(/(\d)\*([a-zA-Z])/g, "$1·$2")
    .replace(/([a-zA-Z])\*(\d)/g, "$1·$2")
    .replace(/(\d)\/(\d)\s*\*\s*(\d)/g, "$1/$2 · $3")
    .replace(/\s*\*\s*(?=[A-Z(])/g, " · ")
    .replace(/\s*\*\s*/g, " · ");
}

function replaceReactionArrows(text) {
  return text
    .replace(/<=>|<->/g, "⇌")
    .replace(/->/g, "→");
}

function replaceHydrocarbonGenerics(text) {
  return text.replace(HYDROCARBON_RE, (_, tail) => {
    const suffix = tail || "";
    return `${wrapSub("C", "n")}${wrapSub("H", `2n${suffix}`)}`;
  });
}

function isValidChemMatch(match, offset, whole) {
  const prev = whole[offset - 1] || "";
  if (/[a-zA-Zà-ỹ]/.test(prev)) return false;
  if (!/[\d(+·]/.test(match) && !/^(?:\d*[A-Z][a-z]?){2,}$/.test(match) && !/\d*[+-]$/.test(match)) {
    return false;
  }
  return match.length > 1 || /^[A-Z][a-z]?[+-]$/.test(match);
}

function formatChemBody(body) {
  return body.split("·").map((part) => {
    let p = part;
    p = p.replace(/\(([A-Za-z0-9]+)\)(\d+)/g, (_, inner, count) => `(${subDigits(inner)})<sub class="math-sub">${count}</sub>`);
    return subDigits(p);
  }).join("·");
}

function formatChemSegment(segment) {
  const chargeMatch = segment.match(/^(.+?)(\d*)([+-])$/);
  if (chargeMatch && /[A-Za-z)]/.test(chargeMatch[1])) {
    const [, body, magnitude, sign] = chargeMatch;
    const label = magnitude ? `${magnitude}${sign}` : sign;
    return `<span class="chem-formula">${formatChemBody(body)}<sup class="chem-charge">${label}</sup></span>`;
  }
  return `<span class="chem-formula">${formatChemBody(segment)}</span>`;
}

function replaceChemFormulas(text) {
  return text.replace(CHEM_FORMULA_RE, (match, offset, whole) => (
    isValidChemMatch(match, offset, whole) ? formatChemSegment(match) : match
  ));
}

/** Hiển thị công thức hóa học, phản ứng và ký hiệu toán học THCS. */
export function formatChemHtml(value) {
  if (value == null || value === "") return "";
  let text = String(value);

  text = replaceReactionArrows(text);
  text = escapeHtml(text);
  text = text.replace(/(^|[\s(+])e-(?=([\s+)])|$)/g, "$1e⁻").replace(/(^|[\s(+])e\+(?=([\s+)])|$)/g, "$1e⁺");
  text = replaceHydrocarbonGenerics(text);
  text = replaceChemFormulas(text);
  text = replaceSqrt(text);
  text = replaceOperators(text);
  text = replaceExponents(text);
  text = replaceSubscripts(text);
  text = replaceFractions(text);

  return text;
}

export const formatMathHtml = formatChemHtml;

export function bindChemContent(root = document) {
  root.querySelectorAll(".chem-content, .math-content").forEach((el) => {
    el.dataset.chemBound = "1";
  });
}
