export const PRICES = Object.freeze({
  developer: Object.freeze({ monthly: 0, annualMonthly: 0, annualCharge: 0 }),
  starter: Object.freeze({ monthly: 99, annualMonthly: 79, annualCharge: 948 }),
  team: Object.freeze({ monthly: 399, annualMonthly: 319, annualCharge: 3828 }),
});

export function priceForCycle(plan, cycle) {
  const price = PRICES[plan];
  if (!price) throw new TypeError(`Unknown plan: ${plan}`);
  if (cycle !== "monthly" && cycle !== "annual") {
    throw new TypeError(`Unknown cycle: ${cycle}`);
  }
  if (plan === "developer") {
    return {
      displayMonthly: 0,
      displayLabel: "Free",
      charge: 0,
      chargeLabel: "No charge",
    };
  }
  if (cycle === "monthly") {
    return {
      displayMonthly: price.monthly,
      displayLabel: `$${price.monthly}`,
      charge: price.monthly,
      chargeLabel: "billed monthly",
    };
  }
  return {
    displayMonthly: price.annualMonthly,
    displayLabel: `$${price.annualMonthly}`,
    charge: price.annualCharge,
    chargeLabel: `billed $${price.annualCharge.toLocaleString("en-US")} annually`,
  };
}

export function calculateValue(input) {
  const fields = [
    "manualHours",
    "investigationHours",
    "maintenanceHours",
    "hourlyRate",
    "avoidedDefectValue",
    "monthlyPlanCost",
  ];
  for (const field of fields) {
    if (!Number.isFinite(input[field]) || input[field] < 0) {
      throw new TypeError(`${field} must be zero or a positive number.`);
    }
  }

  const savedHours =
    input.manualHours + input.investigationHours + input.maintenanceHours;
  const monthlyValue = Math.round(
    savedHours * input.hourlyRate + input.avoidedDefectValue,
  );
  const planCost = input.monthlyPlanCost;
  const netValue = monthlyValue - planCost;
  const ratio =
    planCost > 0
      ? Math.round((monthlyValue / planCost) * 10) / 10
      : null;
  return { monthlyValue, planCost, netValue, ratio };
}

export function initPricingPage(doc) {
  const controls = [...doc.querySelectorAll("[data-billing-cycle]")];
  const live = doc.querySelector("[data-pricing-live]");
  const valueForm = doc.querySelector("[data-value-form]");

  const renderValue = () => {
    if (!valueForm) return;
    const fields = [...valueForm.querySelectorAll("[data-value-input]")];
    const values = {};
    let valid = true;

    for (const field of fields) {
      const value = Number(field.value);
      const message =
        Number.isFinite(value) && value >= 0
          ? ""
          : "Enter zero or a positive number.";
      field.setCustomValidity(message);
      values[field.name] = value;
      valid = valid && !message;
    }
    if (!valid) return;

    const result = calculateValue(values);
    for (const key of ["monthlyValue", "planCost", "netValue"]) {
      const output = valueForm.querySelector(`[data-value-output="${key}"]`);
      if (output) {
        output.textContent = `$${result[key].toLocaleString("en-US")}`;
      }
    }
    const ratio = valueForm.querySelector('[data-value-output="ratio"]');
    if (ratio) ratio.textContent = result.ratio === null ? "N/A" : `${result.ratio}×`;
    const status = valueForm.querySelector("[data-value-status]");
    if (status) {
      status.textContent =
        result.ratio === null
          ? "Value calculated. Ratio is not applicable to the free plan."
          : `Estimated value-to-cost ratio is ${result.ratio} to one.`;
    }
  };

  const applyCycle = (cycle) => {
    for (const priceNode of doc.querySelectorAll("[data-plan-price]")) {
      const plan = priceNode.dataset.planPrice;
      const price = priceForCycle(plan, cycle);
      priceNode.textContent = price.displayLabel;
      const charge = doc.querySelector(`[data-plan-charge="${plan}"]`);
      if (charge) charge.textContent = price.chargeLabel;
    }

    const planSelect = valueForm?.querySelector("[data-plan-select]");
    if (planSelect) {
      for (const option of planSelect.options) {
        if (!option.dataset.plan) continue;
        option.value = String(priceForCycle(option.dataset.plan, cycle).displayMonthly);
      }
    }
    if (live) live.textContent = `Showing ${cycle} pricing.`;
    renderValue();
  };

  for (const control of controls) {
    control.addEventListener("change", () => {
      if (control.checked) applyCycle(control.value);
    });
  }

  for (const toggle of doc.querySelectorAll("[data-matrix-toggle]")) {
    toggle.addEventListener("click", () => {
      const group = doc.getElementById(toggle.getAttribute("aria-controls"));
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      if (group) group.hidden = expanded;
    });
  }

  valueForm?.addEventListener("input", renderValue);
  applyCycle(controls.find((control) => control.checked)?.value ?? "monthly");
  doc.documentElement.classList.add("pricing-ready");
}

if (typeof document !== "undefined") initPricingPage(document);
