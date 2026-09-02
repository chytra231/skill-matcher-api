// Illustrative premium model for practice purposes only.
// It is not derived from LIC or any insurer's actual rate tables.
//
// Annual premium = mortality component + savings component
//   - mortality component: a per-1000-of-sum-assured charge that rises with age
//     and is higher for plans with more risk cover (Term > Money Back > Endowment)
//   - savings component: for plans that return the sum assured at maturity
//     (Endowment, Money Back), roughly sum assured / term, scaled by how much
//     of that maturity value is paid out at the end vs. along the way

const PLAN_CONFIG = {
  term: {
    label: "Term Plan",
    mortalityBaseRate: 1.5,
    mortalityAgeRate: 0.05,
    savingsLoadFactor: 0,
  },
  endowment: {
    label: "Endowment Plan",
    mortalityBaseRate: 1.0,
    mortalityAgeRate: 0.03,
    savingsLoadFactor: 1.0,
  },
  moneyback: {
    label: "Money Back Plan",
    mortalityBaseRate: 1.2,
    mortalityAgeRate: 0.035,
    savingsLoadFactor: 0.85,
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

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function estimateAnnualPremium(planType, age, sumAssured, policyTerm) {
  const config = PLAN_CONFIG[planType];

  const mortalityRatePerThousand =
    config.mortalityBaseRate + Math.max(0, age - BASE_AGE) * config.mortalityAgeRate;
  const mortalityComponent = (sumAssured / 1000) * mortalityRatePerThousand;

  const savingsComponent =
    config.savingsLoadFactor > 0
      ? (sumAssured / policyTerm) * config.savingsLoadFactor
      : 0;

  return mortalityComponent + savingsComponent;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const planType = planTypeInput.value;
  const age = parseFloat(ageInput.value);
  const sumAssured = parseFloat(sumAssuredInput.value);
  const policyTerm = parseFloat(policyTermInput.value);

  const isValid =
    PLAN_CONFIG[planType] &&
    Number.isFinite(age) &&
    age >= 18 &&
    Number.isFinite(sumAssured) &&
    sumAssured > 0 &&
    Number.isFinite(policyTerm) &&
    policyTerm > 0;

  result.hidden = false;

  if (!isValid) {
    result.classList.add("card__details--error");
    annualPremiumOutput.textContent = "Enter valid age, sum assured, and policy term.";
    monthlyPremiumOutput.textContent = "";
    return;
  }

  const annualPremium = estimateAnnualPremium(planType, age, sumAssured, policyTerm);
  const monthlyPremium = annualPremium / 12;

  result.classList.remove("card__details--error");
  annualPremiumOutput.textContent = currencyFormatter.format(annualPremium);
  monthlyPremiumOutput.textContent = currencyFormatter.format(monthlyPremium);
});
