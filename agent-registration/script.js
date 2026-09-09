(function () {
  const APPS_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwJJ7KBkraX6XLBCSmHJtNxUiScnldjyPo9zv2HR9dswhm8BkZhpEhM-bC8PqEMDIBUfw/exec";
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
      let response;
      try {
        response = await fetch(APPS_SCRIPT_URL, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });
      } catch (networkErr) {
        throw new Error(
          "Unable to reach the registration service. Please check your connection and try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Registration failed (server returned status " + response.status + "). Please try again."
        );
      }

      let result;
      try {
        result = await response.json();
      } catch (parseErr) {
        throw new Error(
          "Registration may have succeeded, but the server's response could not be read. Please contact support before sharing a link."
        );
      }

      if (result && typeof result === "object" && "status" in result) {
        const resultStatus = String(result.status).toLowerCase();
        if (resultStatus !== "success" && resultStatus !== "ok") {
          throw new Error(result.message || "Registration failed. Please try again.");
        }
      }

      const agentId = result && result.agentId;
      if (!agentId) {
        throw new Error(
          "Registration may have succeeded, but no agent ID was returned. Please contact support before sharing a link."
        );
      }

      const agentLink = PROPOSAL_FORM_BASE + "?agent=" + encodeURIComponent(agentId);

      document.getElementById("agentIdBadge").textContent = "Agent ID: " + agentId;
      document.getElementById("agentLink").value = agentLink;

      formCard.style.display = "none";
      confirmCard.style.display = "block";
    } catch (err) {
      formAlert.textContent = err.message || "Something went wrong submitting your registration. Please try again.";
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
