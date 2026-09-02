const form = document.getElementById("calculator-form");
const currentSalaryInput = document.getElementById("current-salary");
const hikePercentageInput = document.getElementById("hike-percentage");
const result = document.getElementById("result");
const resultValue = document.getElementById("result-value");

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentSalary = parseFloat(currentSalaryInput.value);
  const hikePercentage = parseFloat(hikePercentageInput.value);

  const isValid =
    Number.isFinite(currentSalary) &&
    currentSalary >= 0 &&
    Number.isFinite(hikePercentage) &&
    hikePercentage >= 0;

  result.hidden = false;

  if (!isValid) {
    result.classList.add("card__details--error");
    resultValue.textContent = "Enter a valid salary and hike percentage.";
    return;
  }

  const newSalary = currentSalary * (1 + hikePercentage / 100);

  result.classList.remove("card__details--error");
  resultValue.textContent = currencyFormatter.format(newSalary);
});
