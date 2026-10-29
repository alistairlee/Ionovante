
const CATALOG = {
  trims: {
    base: {
      label: "Base",
      price: 44900,
      copy: "Configurable starting point with separate AWD and long-range upgrade paths.",
      included: {},
    },
    excellence: {
      label: "Excellence",
      price: 51900,
      copy: "Premium Aeros build with the long-range battery included and AWD still selectable.",
      included: { battery: true },
    },
  },
  options: {
    awd: { label: "Dual-motor AWD", price: 4000 },
    battery: { label: "Long-range battery", price: 6000 },
    autonomy: {
      label: "Autonomous / driver-assist package",
      price: 5000,
    },
  },
  paints: {
    "electric-blue": {
      label: "Electric Blue",
      image: "assets/aeros-blue.webp",
    },
    silver: { label: "Silver", image: "assets/aeros-silver.webp" },
    black: { label: "Black", image: "assets/aeros-black.webp" },
    white: { label: "White", image: "assets/aeros-white.webp" },
  },
  specs: {
    "standard-single": {
      hp: 250,
      range: 240,
      sec: 6.4,
      batteryKwh: 68,
      drive: "Single motor",
    },
    "standard-awd": {
      hp: 305,
      range: 235,
      sec: 5.8,
      batteryKwh: 68,
      drive: "Dual motor AWD",
    },
    "long-single": {
      hp: 250,
      range: 285,
      sec: 6.2,
      batteryKwh: 75,
      drive: "Single motor",
    },
    "long-awd": {
      hp: 320,
      range: 280,
      sec: 5.2,
      batteryKwh: 75,
      drive: "Dual motor AWD",
    },
  },
  finance: {
    apr: 0.069,
    termMonths: 60,
    downPaymentPct: 0.1,
    leaseMonths: 36,
    leaseDueAtSigning: 4500,
    acquisitionFee: 995,
    moneyFactor: 0.00268,
    leaseResidual: { base: 0.56, excellence: 0.54 },
  },
};

const DEFAULT_STATE = {
  trim: "base",
  color: "electric-blue",
  selected: {
    awd: false,
    battery: false,
    autonomy: false,
  },
  finance: "purchase",
};

const FINANCE_MODES = new Set(["purchase", "lease", "finance"]);

const els = {
  heroImage: document.getElementById("heroImage"),
  vehicleWrap: document.getElementById("vehicleWrap"),
  heroTrimName: document.getElementById("heroTrimName"),
  heroTrimCopy: document.getElementById("heroTrimCopy"),
  statHp: document.getElementById("statHp"),
  statRange: document.getElementById("statRange"),
  statZeroSixty: document.getElementById("statZeroSixty"),
  statBattery: document.getElementById("statBattery"),
  currentPrice: document.getElementById("currentPrice"),
  currentPriceSub: document.getElementById("currentPriceSub"),
  colorName: document.getElementById("colorName"),
  summaryTitle: document.getElementById("summaryTitle"),
  summarySub: document.getElementById("summarySub"),
  summaryPerf: document.getElementById("summaryPerf"),
  summaryBattery: document.getElementById("summaryBattery"),
  liveTotal: document.getElementById("liveTotal"),
  liveTotalSub: document.getElementById("liveTotalSub"),
  summaryTrim: document.getElementById("summaryTrim"),
  summaryColor: document.getElementById("summaryColor"),
  summaryAwd: document.getElementById("summaryAwd"),
  summaryBatteryOption: document.getElementById("summaryBatteryOption"),
  summaryAutonomy: document.getElementById("summaryAutonomy"),
  awdToggle: document.getElementById("awdToggle"),
  batteryToggle: document.getElementById("batteryToggle"),
  autonomyToggle: document.getElementById("autonomyToggle"),
  awdPrice: document.getElementById("awdPrice"),
  batteryPrice: document.getElementById("batteryPrice"),
  autonomyPrice: document.getElementById("autonomyPrice"),
  awdNote: document.getElementById("awdNote"),
  batteryNote: document.getElementById("batteryNote"),
  awdState: document.getElementById("awdState"),
  batteryState: document.getElementById("batteryState"),
  financeTitleLeft: document.getElementById("financeTitleLeft"),
  financeTitleMid: document.getElementById("financeTitleMid"),
  financeTitleRight: document.getElementById("financeTitleRight"),
  financeLeftValue: document.getElementById("financeLeftValue"),
  financeMidValue: document.getElementById("financeMidValue"),
  financeRightValue: document.getElementById("financeRightValue"),
  financeLeftSub: document.getElementById("financeLeftSub"),
  financeMidSub: document.getElementById("financeMidSub"),
  financeRightSub: document.getElementById("financeRightSub"),
  financeNote: document.getElementById("financeNote"),
};

function cloneDefaultState() {
  return {
    trim: DEFAULT_STATE.trim,
    color: DEFAULT_STATE.color,
    selected: { ...DEFAULT_STATE.selected },
    finance: DEFAULT_STATE.finance,
  };
}

function loadState() {
  try {
    return JSON.parse(
      sessionStorage.getItem("ionovante-aeros-config") || "null",
    );
  } catch (e) {
    return null;
  }
}

function normalizeState(saved) {
  const next = cloneDefaultState();
  if (!saved || typeof saved !== "object") return next;

  if (CATALOG.trims[saved.trim]) next.trim = saved.trim;
  if (CATALOG.paints[saved.color]) next.color = saved.color;
  if (FINANCE_MODES.has(saved.finance)) next.finance = saved.finance;

  const savedSelections =
    saved.selected && typeof saved.selected === "object"
      ? saved.selected
      : saved;
  next.selected.awd = Boolean(savedSelections.awd);
  next.selected.battery = Boolean(savedSelections.battery);
  next.selected.autonomy = Boolean(savedSelections.autonomy);

  return next;
}

const state = normalizeState(loadState());

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function delta(value) {
  return `+${money(value)}`;
}

function calcMonthly(principal, apr, months) {
  const r = apr / 12;
  if (r === 0) return principal / months;
  return principal * (r / (1 - Math.pow(1 + r, -months)));
}

function calcLease(total) {
  const months = CATALOG.finance.leaseMonths;
  const residualPct = CATALOG.finance.leaseResidual[state.trim];
  const moneyFactor = CATALOG.finance.moneyFactor;
  const acquisitionFee = CATALOG.finance.acquisitionFee;
  const capCost = total + acquisitionFee;
  const residual = total * residualPct;
  const payment =
    (capCost - residual) / months + (capCost + residual) * moneyFactor;
  return { payment, months, residualPct, acquisitionFee };
}

function getTrim() {
  return CATALOG.trims[state.trim];
}

function isIncluded(optionKey) {
  return Boolean(getTrim().included[optionKey]);
}

function getEffectiveOptions() {
  return {
    awd: isIncluded("awd") || state.selected.awd,
    battery: isIncluded("battery") || state.selected.battery,
    autonomy: state.selected.autonomy,
  };
}

function getBillableOptions() {
  return {
    awd: !isIncluded("awd") && state.selected.awd,
    battery: !isIncluded("battery") && state.selected.battery,
    autonomy: state.selected.autonomy,
  };
}

function getSpec() {
  const effective = getEffectiveOptions();
  const key = `${effective.battery ? "long" : "standard"}-${effective.awd ? "awd" : "single"}`;
  return { ...CATALOG.specs[key], ...effective };
}

function getTotal() {
  const billable = getBillableOptions();
  let total = getTrim().price;
  Object.keys(billable).forEach((key) => {
    if (billable[key]) total += CATALOG.options[key].price;
  });
  return total;
}

function selectedOptionLabels(billable) {
  return Object.keys(billable)
    .filter((key) => billable[key])
    .map((key) => CATALOG.options[key].label);
}

function persistState() {
  try {
    sessionStorage.setItem(
      "ionovante-aeros-config",
      JSON.stringify(state),
    );
  } catch (e) { }
}

function renderToggle(optionKey, toggleEl, priceEl, stateEl, noteEl) {
  const included = isIncluded(optionKey);
  const selected = state.selected[optionKey];
  const effective = included || selected;

  toggleEl.textContent = included ? "Included" : selected ? "On" : "Off";
  toggleEl.setAttribute("aria-pressed", String(effective));
  toggleEl.disabled = included;
  priceEl.textContent = included
    ? "Included"
    : delta(CATALOG.options[optionKey].price);

  if (stateEl)
    stateEl.textContent = included
      ? "Included in trim"
      : "Selectable upgrade";
  if (!noteEl) return;

  if (included) {
    noteEl.textContent = `Included in ${getTrim().label}`;
  } else if (optionKey === "battery") {
    noteEl.textContent = selected
      ? "Long-range selected"
      : "Standard battery selected";
  } else if (optionKey === "awd") {
    noteEl.textContent = "Available on both trims";
  }
}

function render() {
  const total = getTotal();
  const spec = getSpec();
  const trim = getTrim();
  const trimLabel = trim.label;
  const paint = CATALOG.paints[state.color];
  const colorLabel = paint.label;
  const lease = calcLease(total);
  const amountFinanced = total * (1 - CATALOG.finance.downPaymentPct);
  const financeMonthly = calcMonthly(
    amountFinanced,
    CATALOG.finance.apr,
    CATALOG.finance.termMonths,
  );
  const billable = getBillableOptions();
  const selectedLabels = selectedOptionLabels(billable);
  const optionSummary = selectedLabels.length
    ? selectedLabels.join(", ")
    : "no paid options";

  els.heroImage.src = paint.image;
  els.vehicleWrap.dataset.color = state.color;
  els.heroTrimName.textContent = `${trimLabel} trim`;
  els.heroTrimCopy.textContent = trim.copy;
  els.statHp.textContent = spec.hp.toString();
  els.statRange.textContent = spec.range.toString();
  els.statZeroSixty.textContent = spec.sec.toFixed(1);
  els.statBattery.textContent = spec.batteryKwh.toString();

  els.currentPrice.textContent = money(total);
  els.currentPriceSub.textContent = `${trimLabel} trim, ${optionSummary}`;
  els.colorName.textContent = colorLabel;

  els.summaryTitle.textContent = `Aeros ${trimLabel}`;
  els.summarySub.textContent = `${spec.drive} with ${spec.batteryKwh} kWh ${spec.battery ? "long-range" : "standard"} battery`;
  els.summaryPerf.textContent = `${spec.hp} hp • ${spec.range} mi est. • ${spec.sec.toFixed(1)} sec`;
  els.summaryBattery.textContent = `${spec.batteryKwh} kWh ${spec.battery ? "long-range" : "standard"} battery`;

  els.liveTotal.textContent = money(total);
  els.liveTotalSub.textContent = `${trimLabel} trim with ${optionSummary}`;
  els.summaryTrim.textContent = trimLabel;
  els.summaryColor.textContent = colorLabel;
  els.summaryAwd.textContent = spec.awd
    ? isIncluded("awd")
      ? "Included"
      : "Selected"
    : "Not selected";
  els.summaryBatteryOption.textContent = spec.battery
    ? isIncluded("battery")
      ? "Long-range included"
      : "Long-range selected"
    : "Standard";
  els.summaryAutonomy.textContent = state.selected.autonomy
    ? "Selected"
    : "Not selected";

  // Trim buttons
  document.querySelectorAll(".trim-card").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.trim === state.trim),
    );
  });

  // Color buttons
  document.querySelectorAll(".swatch-btn").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.color === state.color),
    );
  });

  // Toggle buttons
  renderToggle(
    "awd",
    els.awdToggle,
    els.awdPrice,
    els.awdState,
    els.awdNote,
  );
  renderToggle(
    "battery",
    els.batteryToggle,
    els.batteryPrice,
    els.batteryState,
    els.batteryNote,
  );
  els.autonomyToggle.textContent = state.selected.autonomy ? "On" : "Off";
  els.autonomyToggle.setAttribute(
    "aria-pressed",
    String(state.selected.autonomy),
  );
  els.autonomyPrice.textContent = delta(CATALOG.options.autonomy.price);

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.setAttribute(
      "aria-pressed",
      String(btn.dataset.finance === state.finance),
    );
  });

  // Finance section
  if (state.finance === "purchase") {
    els.financeTitleLeft.textContent = "Purchase price";
    els.financeLeftValue.textContent = money(total);
    els.financeLeftSub.textContent =
      "Configured total before taxes, title, and fees";
    els.financeTitleMid.textContent = "Estimated monthly";
    els.financeMidValue.textContent = "—";
    els.financeMidSub.textContent =
      "Switch to Financing or Lease to see payment";
    els.financeTitleRight.textContent = "Details";
    els.financeRightValue.textContent = "—";
    els.financeRightSub.textContent = "Session-based configuration only";
    els.financeNote.textContent =
      "Purchase view shows the configured total. Pricing is illustrative for demonstration purposes.";
  } else if (state.finance === "finance") {
    els.financeTitleLeft.textContent = "Amount financed";
    els.financeLeftValue.textContent = money(amountFinanced);
    els.financeLeftSub.textContent = "Assumes a 10% down payment";
    els.financeTitleMid.textContent = "Estimated monthly";
    els.financeMidValue.textContent = money(financeMonthly);
    els.financeMidSub.textContent = `${CATALOG.finance.termMonths} months at 6.9% APR`;
    els.financeTitleRight.textContent = "Term";
    els.financeRightValue.textContent = `${CATALOG.finance.termMonths} mo`;
    els.financeRightSub.textContent = "Illustrative financing assumption";
    els.financeNote.textContent =
      "Financing view uses a 6.9% APR assumption over 60 months with 10% down. Taxes, title, registration, and dealer fees are not included.";
  } else {
    els.financeTitleLeft.textContent = "Lease estimate";
    els.financeLeftValue.textContent = money(lease.payment);
    els.financeLeftSub.textContent = `${lease.months} months with ${money(CATALOG.finance.leaseDueAtSigning)} due at signing`;
    els.financeTitleMid.textContent = "Mileage";
    els.financeMidValue.textContent = "10k";
    els.financeMidSub.textContent = "annual miles in this estimate";
    els.financeTitleRight.textContent = "Residual";
    els.financeRightValue.textContent = `${Math.round(lease.residualPct * 100)}%`;
    els.financeRightSub.textContent =
      "Illustrative estimate for a compact EV";
    els.financeNote.textContent =
      "Lease view is an illustrative estimate, not an offer. It uses a 36-month term, 10k miles per year, a 54% to 56% residual assumption depending on trim, and a small acquisition fee.";
  }

  // Persist session state
  persistState();
}

// Trim selection
document.querySelectorAll(".trim-card").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.trim = btn.dataset.trim;
    render();
  });
});

// Color selection
document.querySelectorAll(".swatch-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.color = btn.dataset.color;
    render();
  });
});

// Toggle controls
els.awdToggle.addEventListener("click", () => {
  if (isIncluded("awd")) return;
  state.selected.awd = !state.selected.awd;
  render();
});
els.batteryToggle.addEventListener("click", () => {
  if (isIncluded("battery")) return;
  state.selected.battery = !state.selected.battery;
  render();
});
els.autonomyToggle.addEventListener("click", () => {
  state.selected.autonomy = !state.selected.autonomy;
  render();
});

// Finance tabs
document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.finance = btn.dataset.finance;
    render();
  });
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const next = cloneDefaultState();
  state.trim = next.trim;
  state.color = next.color;
  state.selected = next.selected;
  state.finance = next.finance;
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("saveBtn").addEventListener("click", async () => {
  persistState();
  const btn = document.getElementById("saveBtn");
  const old = btn.textContent;
  btn.textContent = "Saved for session";
  setTimeout(() => (btn.textContent = old), 1300);
});

// Embed mode support
const params = new URLSearchParams(location.search);
const embed = params.get("embed");
if (embed === "1" || embed === "true") {
  document.body.classList.add("embed");
}

render();