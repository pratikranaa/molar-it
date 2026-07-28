import assert from "node:assert/strict";
import test from "node:test";
import { calculateValue, priceForCycle } from "./pricing.js";

test("pricing returns approved monthly and annual values", () => {
  assert.deepEqual(priceForCycle("starter", "monthly"), {
    displayMonthly: 99,
    displayLabel: "$99",
    charge: 99,
    chargeLabel: "billed monthly",
  });
  assert.deepEqual(priceForCycle("starter", "annual"), {
    displayMonthly: 79,
    displayLabel: "$79",
    charge: 948,
    chargeLabel: "billed $948 annually",
  });
  assert.deepEqual(priceForCycle("team", "annual"), {
    displayMonthly: 319,
    displayLabel: "$319",
    charge: 3828,
    chargeLabel: "billed $3,828 annually",
  });
});

test("developer pricing remains Free in both billing modes", () => {
  assert.deepEqual(priceForCycle("developer", "annual"), {
    displayMonthly: 0,
    displayLabel: "Free",
    charge: 0,
    chargeLabel: "No charge",
  });
});

test("value model uses transparent monthly inputs", () => {
  assert.deepEqual(
    calculateValue({
      manualHours: 8,
      investigationHours: 5,
      maintenanceHours: 4,
      hourlyRate: 75,
      avoidedDefectValue: 0,
      monthlyPlanCost: 399,
    }),
    {
      monthlyValue: 1275,
      planCost: 399,
      netValue: 876,
      ratio: 3.2,
    },
  );
});

test("free plans report value ratio as not applicable", () => {
  assert.equal(
    calculateValue({
      manualHours: 1,
      investigationHours: 0,
      maintenanceHours: 0,
      hourlyRate: 100,
      avoidedDefectValue: 0,
      monthlyPlanCost: 0,
    }).ratio,
    null,
  );
});

test("value model rejects negative or non-finite inputs", () => {
  assert.throws(
    () =>
      calculateValue({
        manualHours: -1,
        investigationHours: 0,
        maintenanceHours: 0,
        hourlyRate: 100,
        avoidedDefectValue: 0,
        monthlyPlanCost: 99,
      }),
    /zero or a positive number/,
  );
});
