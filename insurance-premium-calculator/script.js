// Illustrative premium/benefit model for practice purposes only.
// It is not derived from LIC or any insurer's actual rate tables.
//
// Annual premium = mortality component + savings component
//   - mortality component: a per-1000-of-sum-assured charge that rises with age,
//     highest for Term (pure risk), lower for Endowment and Money Back since
//     part of their cost buys back the maturity/payout benefit rather than
//     pure protection
//   - savings component: for plans that return money at or before maturity
//     (Endowment, Money Back), roughly sum assured / term
//
// Maturity/payout values assume a simple reversionary bonus that accrues
// on the full sum assured every year of the term:
//   bonus = sum assured * bonusRatePerYear * policy term
//   - Endowment: the full sum assured plus bonus is paid at maturity
//   - Money Back: a fixed fraction of the sum assured is paid out at
//     regular intervals during the term, and the remaining sum assured
//     plus the full accrued bonus is paid as a smaller final maturity value

const PLAN_CONFIG = {
  term: {
    label: "Term Plan",
    mortalityBaseRate: 1.5,
    mortalityAgeRate: 0.05,
    savingsLoadFactor: 0,
    hasMaturity: false,
    hasPayouts: false,
  },
  endowment: {
    label: "Endowment Plan",
    mortalityBaseRate: 1.0,
    mortalityAgeRate: 0.03,
    savingsLoadFactor: 1.0,
    hasMaturity: true,
    hasPayouts: false,
    bonusRatePerYear: 0.02,
  },
  moneyback: {
    label: "Money Back Plan",
    mortalityBaseRate: 1.0,
    mortalityAgeRate: 0.03,
    savingsLoadFactor: 0.85,
    hasMaturity: true,
    hasPayouts: true,
    bonusRatePerYear: 0.02,
    payoutIntervalYears: 5,
    payoutFractionOfSumAssured: 0.2,
  },
};

const BASE_AGE = 18;

const form = document.getElementById("calculator-form");
const planTypeInput = document.getElementById("plan-type");
const ageInput = document.getElementById("age");
const sumAssuredInput = document.getElementById("sum-assured");
const policyTermInput = document.getElementById("policy-term");

const result = document.getElementById("result");
const annualPremiumOutput = document.getElementById("annual-premium");
const monthlyPremiumOutput = document.getElementById("monthly-premium");
const maturityRow = document.getElementById("maturity-row");
const maturityValueOutput = document.getElementById("maturity-value");
const payoutRow = document.getElementById("payout-row");
const payoutValueOutput = document.getElementById("payout-value");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function estimateAnnualPremium(config, age, sumAssured, policyTerm) {
  const mortalityRatePerThousand =
    config.mortalityBaseRate + Math.max(0, age - BASE_AGE) * config.mortalityAgeRate;
  const mortalityComponent = (sumAssured / 1000) * mortalityRatePerThousand;

  const savingsComponent =
    config.savingsLoadFactor > 0
      ? (sumAssured / policyTerm) * config.savingsLoadFactor
      : 0;

  return mortalityComponent + savingsComponent;
}

function estimateBenefits(config, sumAssured, policyTerm) {
  const bonus = sumAssured * config.bonusRatePerYear * policyTerm;

  if (!config.hasPayouts) {
    return {
      maturityValue: sumAssured + bonus,
      payoutAmount: null,
      payoutCount: 0,
    };
  }

  const payoutCount = Math.max(
    0,
    Math.floor(policyTerm / config.payoutIntervalYears) - 1
  );
  const payoutAmount = sumAssured * config.payoutFractionOfSumAssured;
  const payoutTotal = payoutAmount * payoutCount;

  return {
    maturityValue: sumAssured - payoutTotal + bonus,
    payoutAmount,
    payoutCount,
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const config = PLAN_CONFIG[planTypeInput.value];
  const age = parseFloat(ageInput.value);
  const sumAssured = parseFloat(sumAssuredInput.value);
  const policyTerm = parseFloat(policyTermInput.value);

  const isValid =
    config &&
    Number.isFinite(age) &&
    age >= 18 &&
    Number.isFinite(sumAssured) &&
    sumAssured > 0 &&
    Number.isFinite(policyTerm) &&
    policyTerm > 0;

  result.hidden = false;
  maturityRow.hidden = true;
  payoutRow.hidden = true;

  if (!isValid) {
    result.classList.add("card__details--error");
    annualPremiumOutput.textContent = "Enter valid age, sum assured, and policy term.";
    monthlyPremiumOutput.textContent = "";
    return;
  }

  result.classList.remove("card__details--error");

  const annualPremium = estimateAnnualPremium(config, age, sumAssured, policyTerm);
  const monthlyPremium = annualPremium / 12;

  annualPremiumOutput.textContent = currencyFormatter.format(annualPremium);
  monthlyPremiumOutput.textContent = currencyFormatter.format(monthlyPremium);

  if (!config.hasMaturity) {
    return;
  }

  const { maturityValue, payoutAmount, payoutCount } = estimateBenefits(
    config,
    sumAssured,
    policyTerm
  );

  maturityRow.hidden = false;
  maturityValueOutput.textContent = currencyFormatter.format(maturityValue);

  if (config.hasPayouts && payoutCount > 0) {
    payoutRow.hidden = false;
    payoutValueOutput.textContent = `${currencyFormatter.format(payoutAmount)} every ${config.payoutIntervalYears} years (${payoutCount} payout${payoutCount === 1 ? "" : "s"})`;
  }
});
