(function () {
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbygmQWTN8LEG9z23HibkFirrYTpXQj5ThYxIPTFVMq-15rmrA6cehAwNSp-z-e2zWBo/exec";
  const PROPOSAL_FORM_BASE =
    "https://chytra231.github.io/skill-matcher-api/insurance-proposal-form/";

  const form = document.getElementById("registrationForm");
  const submitBtn = document.getElementById("submitBtn");
  const formAlert = document.getElementById("formAlert");
  const formCard = document.getElementById("formCard");
  const confirmCard = document.getElementById("confirmCard");

  function setFieldError(fieldId, hasError) {
    document.getElementById("field-" + fieldId).classList.toggle("invalid", hasError);
  }

  function generateAgentId(email) {
    const cleaned = email.toLowerCase().replace(/[^a-z0-9]/g, "");
    return cleaned.substring(0, 8) || "agent";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    formAlert.style.display = "none";

    const agentName = document.getElementById("agentName").value.trim();
    const agentEmail = document.getElementById("agentEmail").value.trim();
    const agentCode = document.getElementById("agentCode").value.trim();
    const doName = document.getElementById("doName").value.trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentEmail);

    setFieldError("agentName", !agentName);
    setFieldError("agentEmail", !agentEmail || !emailValid);

    if (!agentName || !agentEmail || !emailValid) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Registering...";

    const payload = {
      formType: "agentRegistration",
      agentName: agentName,
      agentEmail: agentEmail,
      agentCode: agentCode,
      doName: doName,
    };

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      const agentId = generateAgentId(agentEmail);
      const agentLink = PROPOSAL_FORM_BASE + "?agent=" + agentId;

      document.getElementById("agentIdBadge").textContent = "Agent ID: " + agentId;
      document.getElementById("agentLink").value = agentLink;

      formCard.style.display = "none";
      confirmCard.style.display = "block";
    } catch (err) {
      formAlert.textContent =
        "Something went wrong submitting your registration. Please check your connection and try again.";
      formAlert.style.display = "block";
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });

  document.getElementById("copyBtn").addEventListener("click", function () {
    const linkInput = document.getElementById("agentLink");
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);

    function finish() {
      const btn = document.getElementById("copyBtn");
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(function () {
        btn.textContent = "Copy Link";
        btn.classList.remove("copied");
      }, 1800);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(linkInput.value)
        .then(finish)
        .catch(function () {
          document.execCommand("copy");
          finish();
        });
    } else {
      document.execCommand("copy");
      finish();
    }
  });

  document.getElementById("newRegLink").addEventListener("click", function () {
    form.reset();
    setFieldError("agentName", false);
    setFieldError("agentEmail", false);
    formCard.style.display = "block";
    confirmCard.style.display = "none";
    submitBtn.disabled = false;
    submitBtn.textContent = "Register";
  });
})();
