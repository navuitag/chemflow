import { hasScene3D, renderScene3DPanel, initScene3D, disposeScenes3D } from "./scene3d.js";

export function renderVisualization(config = {}) {
  const type = config.visualization;
  const panel3d = hasScene3D(type) ? renderScene3DPanel(type, config.caption) : "";
  const legacy = renderLegacyVisualization(config);
  if (panel3d) {
    return `
      ${panel3d}
      <details class="viz-2d-alt">
        <summary>Sơ đồ 2D bổ sung</summary>
        ${legacy}
      </details>
    `;
  }
  return legacy;
}

export function bindVisualizations(root = document) {
  disposeScenes3D();
  initScene3D(root);
}

function renderLegacyVisualization(config = {}) {
  const type = config.visualization;
  if (type === "atom") return renderAtomViz(config);
  if (type === "molecule" || type === "ionic" || type === "covalent") return renderMoleculeViz(type);
  if (type === "reaction") return renderReactionViz(config);
  if (type === "equationBalance") return renderEquationBalance(config);
  if (type === "periodic") return renderPeriodicViz(config);
  if (type === "states") return renderStatesViz();
  if (type === "acidbase") return renderAcidBaseViz();
  if (type === "valence") return renderValenceViz();
  if (type === "lab") return renderLabViz();
  if (type === "khtn") return renderKhtnViz();
  if (type === "measure") return renderMeasureViz();
  if (type === "magnifier") return renderMagnifierViz();
  if (type === "microscope") return renderMicroscopeViz();
  if (type === "length") return renderLengthViz();
  if (type === "time") return renderTimeViz();
  if (type === "temperature") return renderTemperatureViz();
  if (type === "substances") return renderSubstancesViz();
  if (type === "oxygen") return renderOxygenViz();
  if (type === "materials" || type === "fuels" || type === "food") return renderMaterialsViz(type);
  if (type === "mixture") return renderMixtureViz();
  if (type === "separation") return renderSeparationViz();
  if (type === "moleculeTypes") return renderMoleculeTypesViz();
  if (type === "bondIntro") return renderBondIntroViz();
  if (type === "mole") return renderMoleViz(config);
  if (type === "solution") return renderSolutionViz();
  if (type === "stoichiometry") return renderStoichiometryViz(config);
  if (type === "catalyst") return renderCatalystViz(config);
  if (type === "acid") return renderAcidViz();
  if (type === "oxide") return renderOxideViz();
  if (type === "salt") return renderSaltViz();
  if (type === "fertilizer") return renderFertilizerViz();
  if (type === "metal") return renderMetalViz();
  if (type === "activitySeries") return renderActivitySeriesViz();
  if (type === "alloy") return renderAlloyViz();
  if (type === "nonmetal") return renderNonmetalViz();
  if (type === "alkane") return renderAlkaneViz();
  if (type === "alkene") return renderAlkeneViz();
  if (type === "alcohol") return renderAlcoholViz();
  if (type === "acetic") return renderAceticViz();
  if (type === "lipid") return renderLipidViz();
  if (type === "glucose") return renderGlucoseViz();
  if (type === "starch") return renderStarchViz();
  if (type === "protein") return renderProteinViz();
  if (type === "polymer") return renderPolymerViz();
  if (type === "earthCrust") return renderEarthCrustViz();
  if (type === "silicate") return renderSilicateViz();
  if (type === "carbonCycle") return renderCarbonCycleViz();
  return renderConceptViz(type);
}

function renderAtomViz(config = {}) {
  const element = config.element || "H";
  const protons = config.protons || 1;
  const neutrons = config.neutrons || 0;
  return `
    <div class="viz atom-viz" aria-label="Mô hình nguyên tử ${element}">
      <div class="atom-core">
        <div class="atom-nucleus">
          <span>p: ${protons}</span>
          <span>n: ${neutrons}</span>
        </div>
        <div class="atom-orbit" title="electron"></div>
      </div>
      <p class="viz-caption">Nguyên tử ${element} — hạt nhân (p, n) và electron quay quanh</p>
    </div>
  `;
}

function renderMoleculeViz(type) {
  if (type === "ionic") {
    return `
      <div class="viz molecule-viz" aria-label="Liên kết ion NaCl">
        <span class="atom-ball positive">Na⁺</span>
        <span class="bond-line"></span>
        <span class="atom-ball negative">Cl⁻</span>
        <p class="viz-caption">Na trao electron cho Cl → ion dương và ion âm hút nhau</p>
      </div>
    `;
  }
  return `
    <div class="viz molecule-viz" aria-label="Liên kết cộng hóa trị H2O">
      <span class="atom-ball neutral">O</span>
      <span class="bond-line"></span>
      <span class="atom-ball neutral">H</span>
      <span class="bond-line"></span>
      <span class="atom-ball neutral">H</span>
      <p class="viz-caption">H và O dùng chung electron → liên kết cộng hóa trị</p>
    </div>
  `;
}

function renderReactionViz(config = {}) {
  const left = config.reactants || "2H₂ + O₂";
  const right = config.products || "2H₂O";
  return `
    <div class="viz reaction-viz" aria-label="Phản ứng hóa học">
      <div class="reaction-row">
        <span class="reaction-particle">${left}</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">${right}</span>
      </div>
      <p>Phân tử va chạm, liên kết cũ đứt, liên kết mới hình thành.</p>
    </div>
  `;
}

function renderEquationBalance(config = {}) {
  const left = config.left || "2H₂ + O₂";
  const right = config.right || "2H₂O";
  return `
    <div class="viz balance-viz">
      <div class="balance-beam">
        <span>${left}</span>
        <span>${right}</span>
      </div>
      <div class="balance-stand"></div>
      <p>Đếm từng nguyên tố hai vế — số H và O phải bằng nhau sau khi cân.</p>
    </div>
  `;
}

function renderPeriodicViz(config = {}) {
  const highlight = config.symbol || "O";
  const cells = ["H", "He", "Li", "Be", "B", "C", "N", highlight, "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S"]
    .map((sym) => `<div class="periodic-cell${sym === highlight ? " highlight" : ""}">${sym}</div>`)
    .join("");
  return `
    <div class="viz periodic-viz" aria-label="Bảng tuần hoàn rút gọn">
      <div class="periodic-grid">${cells}</div>
      <p class="viz-caption">Cùng cột → tính chất tương tự; cùng hàng → số lớp electron tăng dần</p>
    </div>
  `;
}

function renderStatesViz() {
  return `
    <div class="viz states-viz" aria-label="Ba thể của chất">
      <div class="state-card"><strong>Rắn</strong><span>Hạt sắp xếp chặt</span></div>
      <div class="state-card"><strong>Lỏng</strong><span>Trượt qua nhau</span></div>
      <div class="state-card"><strong>Khí</strong><span>Xa nhau, chuyển động tự do</span></div>
    </div>
  `;
}

function renderAcidBaseViz() {
  return `
    <div class="viz acidbase-viz" aria-label="Thang pH">
      <span>Axit</span>
      <div class="ph-scale"></div>
      <span>Bazơ</span>
      <p class="viz-caption">pH &lt; 7 axit · pH = 7 trung tính · pH &gt; 7 bazơ</p>
    </div>
  `;
}

function renderValenceViz() {
  return `
    <div class="viz valence-viz" aria-label="Hóa trị thường gặp">
      <div class="valence-chips">
        <span>Na: I</span><span>Mg: II</span><span>Al: III</span><span>Cl: I</span><span>O: II</span>
      </div>
      <p class="viz-caption">Hóa trị = số electron trao đổi khi tạo hợp chất ion</p>
    </div>
  `;
}

function renderLabViz() {
  return `
    <div class="viz lab-viz" aria-label="Phòng thí nghiệm ảo">
      <div class="lab-item">Ống nghiệm</div>
      <div class="lab-item">Cốc định lượng</div>
      <div class="lab-item">Đèn cồn</div>
    </div>
  `;
}

function renderKhtnViz() {
  return `
    <div class="viz concept-viz" aria-label="Ba lĩnh vực KHTN">
      <span>KHTN 6</span>
      <div class="khtn-pillars">
        <span>Vật lí</span><span>Hóa học</span><span>Sinh học</span>
      </div>
      <p class="viz-caption">Hóa học nghiên cứu chất và sự biến đổi của chất</p>
    </div>
  `;
}

function renderMeasureViz() {
  return `
    <div class="viz measure-viz" aria-label="Đo khối lượng">
      <div class="balance-scale">⚖️ <strong>250 g</strong></div>
      <p>Đơn vị: g, kg · 1 kg = 1000 g</p>
    </div>
  `;
}

function renderMagnifierViz() {
  return `
    <div class="viz magnifier-viz" aria-label="Kính lúp">
      <div class="tool-card"><strong>🔍 Kính lúp</strong><span>Phóng đại vài lần</span></div>
      <p>Quan sát kết cấu bề mặt muối, đường, lá cây · Đặt mắt cách kính phù hợp</p>
    </div>
  `;
}

function renderMicroscopeViz() {
  return `
    <div class="viz microscope-viz" aria-label="Kính hiển vi">
      <div class="tool-card"><strong>🔬 Kính hiển vi</strong><span>Phóng đại hàng trăm lần</span></div>
      <p>Làm mẫu mỏng trên lam kính · Điều chỉnh độ sáng và vít tinh/chỉnh</p>
    </div>
  `;
}

function renderLengthViz() {
  return `
    <div class="viz length-viz" aria-label="Đo chiều dài">
      <div class="ruler-bar">
        <span>0</span><span>10 cm</span><span>20 cm</span><span>30 cm</span>
      </div>
      <p>Thước kẻ, thước dây · 1 m = 100 cm = 1000 mm</p>
    </div>
  `;
}

function renderTimeViz() {
  return `
    <div class="viz time-viz" aria-label="Đo thời gian">
      <div class="valence-chips">
        <span>Đồng hồ</span><span>Bấm giờ</span><span>1 h = 60 phút</span>
      </div>
      <p>Đo thời gian phản ứng, sôi, tan · Ghi đơn vị: s, phút, h</p>
    </div>
  `;
}

function renderTemperatureViz() {
  return `
    <div class="viz temperature-viz" aria-label="Thang nhiệt độ">
      <div class="temp-scale">
        <span>0°C<small>nóng chảy băng</small></span>
        <span>100°C<small>sôi nước</small></span>
      </div>
    </div>
  `;
}

function renderSubstancesViz() {
  return `
    <div class="viz substances-viz" aria-label="Chất tinh khiết và hỗn hợp">
      <div class="substance-row"><strong>NaCl</strong><span>Chất tinh khiết</span></div>
      <div class="substance-row"><strong>Nước biển</strong><span>Hỗn hợp</span></div>
    </div>
  `;
}

function renderOxygenViz() {
  return `
    <div class="viz oxygen-viz" aria-label="Thành phần không khí">
      <div class="air-bar"><span style="width:21%">O₂ 21%</span><span style="width:78%">N₂ 78%</span></div>
      <p>Oxy hỗ trợ sự cháy</p>
    </div>
  `;
}

function renderMaterialsViz(type) {
  const items = {
    materials: ["Đồng", "Nhựa", "Thủy tinh"],
    fuels: ["Than", "Dầu", "Khí"],
    food: ["Tinh bột", "Protein", "Lipid"]
  };
  const chips = (items[type] || items.materials).map((x) => `<span>${x}</span>`).join("");
  return `<div class="viz materials-viz"><div class="valence-chips">${chips}</div></div>`;
}

function renderMixtureViz() {
  return `
    <div class="viz mixture-viz" aria-label="Hỗn hợp">
      <div class="mixture-types">
        <div><strong>Đồng nhất</strong><span>Nước muối</span></div>
        <div><strong>Không đồng nhất</strong><span>Cát + nước</span></div>
      </div>
    </div>
  `;
}

function renderSeparationViz() {
  return `
    <div class="viz separation-viz" aria-label="Tách hỗn hợp">
      <div class="lab-viz">
        <div class="lab-item">Lọc</div>
        <div class="lab-item">Khơi</div>
        <div class="lab-item">Chưng cất</div>
      </div>
    </div>
  `;
}

function renderMoleculeTypesViz() {
  return `
    <div class="viz molecule-types-viz" aria-label="Đơn chất và hợp chất">
      <div class="substance-row"><strong>O₂</strong><span>Đơn chất (1 nguyên tố)</span></div>
      <div class="substance-row"><strong>H₂O</strong><span>Hợp chất (H + O)</span></div>
      <div class="substance-row"><strong>Fe</strong><span>Đơn chất kim loại</span></div>
    </div>
  `;
}

function renderMoleViz(config = {}) {
  const formula = config.formula || "H₂O";
  const mass = config.molarMass || "18 g/mol";
  return `
    <div class="viz mole-viz" aria-label="Mol và khối lượng mol">
      <div class="mole-card"><strong>${formula}</strong><span>M ≈ ${mass}</span></div>
      <p>1 mol = 6,02·10²³ thực thể · n = m/M</p>
    </div>
  `;
}

function renderSolutionViz() {
  return `
    <div class="viz solution-viz" aria-label="Nồng độ dung dịch">
      <div class="solution-beaker">Dung dịch 10%</div>
      <p>C% = (khối lượng chất tan / khối lượng dung dịch) × 100</p>
    </div>
  `;
}

function renderStoichiometryViz(config = {}) {
  const left = config.left || "2H₂ + O₂";
  const right = config.right || "2H₂O";
  return `
    <div class="viz stoich-viz" aria-label="Tỉ mol trong PTHH">
      <div class="reaction-row">
        <span class="reaction-particle">${left}</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">${right}</span>
      </div>
      <p class="viz-caption">Tỉ mol 2 : 1 : 2 theo hệ số</p>
    </div>
  `;
}

function renderCatalystViz(config = {}) {
  const left = config.reactants || "2H₂O₂";
  const right = config.products || "2H₂O + O₂";
  return `
    <div class="viz catalyst-viz" aria-label="Xúc tác">
      <div class="reaction-row">
        <span class="reaction-particle">${left}</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">${right}</span>
      </div>
      <p><strong>MnO₂</strong> (xúc tác) — tăng tốc, không tiêu hao vĩnh viễn</p>
    </div>
  `;
}

function renderAcidViz() {
  return `
    <div class="viz acid-viz" aria-label="Axit">
      <span class="tag">pH &lt; 7</span>
      <p>Axit → H⁺ trong dung dịch · Quỳ đỏ hóa đỏ</p>
    </div>
  `;
}

function renderOxideViz() {
  return `
    <div class="viz oxide-viz" aria-label="Oxide">
      <div class="substance-row"><strong>CO₂</strong><span>Oxide axit</span></div>
      <div class="substance-row"><strong>CaO</strong><span>Oxide bazơ</span></div>
    </div>
  `;
}

function renderSaltViz() {
  return `
    <div class="viz salt-viz" aria-label="Muối">
      <div class="reaction-row">
        <span class="reaction-particle">HCl + NaOH</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">NaCl + H₂O</span>
      </div>
    </div>
  `;
}

function renderFertilizerViz() {
  return `
    <div class="viz fertilizer-viz" aria-label="Phân bón NPK">
      <div class="valence-chips">
        <span>N – Đạm</span><span>P – Lân</span><span>K – Kali</span>
      </div>
      <p>Ví dụ NPK 16-16-8: % khối lượng các thành phần</p>
    </div>
  `;
}

function renderMetalViz() {
  return `
    <div class="viz metal-viz" aria-label="Kim loại">
      <div class="valence-chips"><span>Cu</span><span>Al</span><span>Fe</span></div>
      <p>Dẫn điện · dẫn nhiệt · có ánh kim</p>
    </div>
  `;
}

function renderActivitySeriesViz() {
  return `
    <div class="viz activity-viz" aria-label="Dãy hoạt động">
      <p class="viz-caption">… Zn &gt; Fe &gt; … &gt; Cu &gt; Ag …</p>
      <div class="reaction-row">
        <span class="reaction-particle">Zn + CuSO₄</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">ZnSO₄ + Cu</span>
      </div>
    </div>
  `;
}

function renderAlloyViz() {
  return `
    <div class="viz alloy-viz" aria-label="Hợp kim">
      <div class="substance-row"><strong>Thép</strong><span>Fe + C</span></div>
      <div class="substance-row"><strong>Đồng thau</strong><span>Cu + Zn</span></div>
    </div>
  `;
}

function renderNonmetalViz() {
  return `
    <div class="viz nonmetal-viz" aria-label="Phi kim">
      <div class="valence-chips"><span>C</span><span>S</span><span>O</span><span>N</span></div>
      <p>Phi kim: không có tính kim loại điển hình</p>
    </div>
  `;
}

function renderAlkaneViz() {
  return `
    <div class="viz alkane-viz" aria-label="Alkane">
      <div class="mole-card"><strong>CH₄</strong><span>CₙH₂ₙ₊₂</span></div>
      <p>Metan · etan · liên kết đơn</p>
    </div>
  `;
}

function renderAlkeneViz() {
  return `
    <div class="viz alkene-viz" aria-label="Alkene">
      <div class="mole-card"><strong>C₂H₄</strong><span>C=C</span></div>
      <p>Etilen · liên kết đôi</p>
    </div>
  `;
}

function renderAlcoholViz() {
  return `
    <div class="viz alcohol-viz" aria-label="Ethylic alcohol">
      <div class="mole-card"><strong>C₂H₅OH</strong><span>Cồn</span></div>
    </div>
  `;
}

function renderAceticViz() {
  return `
    <div class="viz acetic-viz" aria-label="Acetic acid">
      <div class="mole-card"><strong>CH₃COOH</strong><span>Giấm</span></div>
    </div>
  `;
}

function renderLipidViz() {
  return `<div class="viz lipid-viz"><div class="valence-chips"><span>Dầu</span><span>Mỡ</span></div><p>Lipid – chất béo</p></div>`;
}

function renderGlucoseViz() {
  return `<div class="viz glucose-viz"><div class="mole-card"><strong>C₆H₁₂O₆</strong><span>Glucose</span></div></div>`;
}

function renderStarchViz() {
  return `<div class="viz starch-viz"><div class="valence-chips"><span>Tinh bột</span><span>Xenluloz</span></div><p>Polime carbohydrate</p></div>`;
}

function renderProteinViz() {
  return `<div class="viz protein-viz"><div class="mole-card"><strong>Protein</strong><span>Amino acid</span></div></div>`;
}

function renderPolymerViz() {
  return `<div class="viz polymer-viz"><div class="valence-chips"><span>PVC</span><span>PE</span><span>Nylon</span></div></div>`;
}

function renderEarthCrustViz() {
  return `<div class="viz earth-viz"><div class="valence-chips"><span>Si</span><span>O</span><span>Al</span><span>Fe</span></div><p>Vỏ Trái Đất – khoáng sản</p></div>`;
}

function renderSilicateViz() {
  return `<div class="viz silicate-viz"><div class="substance-row"><strong>CaCO₃</strong><span>Đá vôi</span></div><div class="substance-row"><strong>Xi măng</strong><span>Silicate</span></div></div>`;
}

function renderCarbonCycleViz() {
  return `
    <div class="viz carbon-viz" aria-label="Chu trình carbon">
      <div class="reaction-row">
        <span class="reaction-particle">CO₂</span>
        <span class="reaction-arrow">⇄</span>
        <span class="reaction-particle">Sinh khối</span>
        <span class="reaction-arrow">→</span>
        <span class="reaction-particle">Nhiên liệu</span>
      </div>
    </div>
  `;
}

function renderBondIntroViz() {
  return `
    <div class="viz bond-intro-viz" aria-label="Liên kết ion và cộng hóa trị">
      <div class="molecule-viz">
        <span class="atom-ball positive">Na⁺</span>
        <span class="bond-line"></span>
        <span class="atom-ball negative">Cl⁻</span>
      </div>
      <p class="viz-caption">Liên kết ion · NaCl</p>
      <div class="molecule-viz">
        <span class="atom-ball neutral">O</span>
        <span class="bond-line"></span>
        <span class="atom-ball neutral">H</span>
        <span class="bond-line"></span>
        <span class="atom-ball neutral">H</span>
      </div>
      <p class="viz-caption">Liên kết cộng hóa trị · H₂O</p>
    </div>
  `;
}

function renderConceptViz(type = "concept") {
  const labels = {
    chem_intro: "Hóa học",
    g6_b01: "KHTN",
    redox: "Oxi hóa – Khử",
    organic: "Hữu cơ",
    rate: "Tốc độ PƯ",
    g9_b22: "Hữu cơ",
    metal: "Kim loại",
    polymer: "Polime"
  };
  return `
    <div class="viz concept-viz">
      <span>${labels[type] || type || "Hóa học"}</span>
      <div class="concept-grid">
        <i></i><i></i><i></i>
        <i></i><i></i><i></i>
      </div>
    </div>
  `;
}
