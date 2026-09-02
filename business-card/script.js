const toggleButton = document.getElementById("contact-toggle");
const contactDetails = document.getElementById("contact-details");

toggleButton.addEventListener("click", () => {
  const isHidden = contactDetails.hidden;

  contactDetails.hidden = !isHidden;
  toggleButton.setAttribute("aria-expanded", String(isHidden));
  toggleButton.textContent = isHidden ? "Hide Contact Details" : "Show Contact Details";
});
