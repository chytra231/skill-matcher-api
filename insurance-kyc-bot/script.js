(function () {
  "use strict";

  var STEPS = [
    {
      id: "fullName",
      section: "Personal Details",
      question: "What is your full name?",
      type: "text",
      placeholder: "e.g. Asha Rao",
    },
    {
      id: "dob",
      section: "Personal Details",
      question: "What is your date of birth?",
      type: "date",
    },
    {
      id: "gender",
      section: "Personal Details",
      question: "How do you identify your gender?",
      type: "choice",
      options: ["Male", "Female", "Other", "Prefer not to say"],
    },
    {
      id: "address",
      section: "Personal Details",
      question: "What is your current residential address?",
      type: "textarea",
      placeholder: "House / Street, City, State, PIN code",
    },
    {
      id: "mobile",
      section: "Personal Details",
      question: "What is your mobile number?",
      type: "tel",
      placeholder: "10-digit mobile number",
    },
    {
      id: "email",
      section: "Personal Details",
      question: "What is your email address?",
      type: "email",
      placeholder: "name@example.com",
    },
    {
      id: "idType",
      section: "ID Proof",
      question: "Which ID proof would you like to submit?",
      type: "select",
      placeholder: "Select an ID type",
      options: ["Aadhaar", "PAN", "Passport", "Voter ID"],
    },
    {
      id: "idNumber",
      section: "ID Proof",
      question: "Please enter your ID number.",
      type: "text",
      placeholder: "ID number as printed on the document",
    },
    {
      id: "planType",
      section: "Insurance Details",
      question: "Which insurance plan are you applying for?",
      type: "select",
      placeholder: "Select a plan type",
      options: [
        "Term Life Insurance",
        "Health Insurance",
        "Endowment Plan",
        "ULIP",
        "Motor Insurance",
        "Other",
      ],
      otherTrigger: "Other",
      otherPlaceholder: "Please specify the plan type",
    },
    {
      id: "sumAssured",
      section: "Insurance Details",
      question: "What sum assured (coverage amount) would you like?",
      type: "text",
      placeholder: "e.g. 1000000",
      prefix: "₹",
    },
    {
      id: "nomineeName",
      section: "Insurance Details",
      question: "Who would you like to name as your nominee?",
      type: "text",
      placeholder: "Nominee's full name",
    },
    {
      id: "nomineeRelationship",
      section: "Insurance Details",
      question: "What is your relationship with the nominee?",
      type: "select",
      placeholder: "Select relationship",
      options: ["Spouse", "Son", "Daughter", "Parent", "Sibling", "Other"],
      otherTrigger: "Other",
      otherPlaceholder: "Please specify the relationship",
    },
    {
      id: "preExisting",
      section: "Health Declaration",
      question: "Do you have any pre-existing medical conditions?",
      type: "choice",
      options: ["Yes", "No"],
      otherTrigger: "Yes",
      otherType: "textarea",
      otherPlaceholder: "Please briefly describe the condition(s)",
    },
    {
      id: "smoker",
      section: "Health Declaration",
      question: "Are you a smoker or tobacco user?",
      type: "choice",
      options: ["Yes", "No"],
    },
  ];

  var chatWindow = document.getElementById("chatWindow");
  var composerField = document.getElementById("composerField");
  var composerForm = document.getElementById("composerForm");
  var backBtn = document.getElementById("backBtn");
  var nextBtn = document.getElementById("nextBtn");
  var progressTrack = document.getElementById("progressTrack");

  var answers = {};
  var extraAnswers = {};
  var pendingChoice = {};
  var stepIndex = 0;
  var phase = "questions"; // 'questions' | 'summary' | 'submitted'

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function addBotBubble(text, showSection) {
    var row = el("div", "bubble-row bot");
    var bubble = el("div", "bubble bot");
    if (showSection) {
      var label = el("span", "section-label", escapeHtml(showSection));
      bubble.appendChild(label);
    }
    bubble.appendChild(document.createTextNode(text));
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    scrollToBottom();
    return row;
  }

  function addUserBubble(text) {
    var row = el("div", "bubble-row user");
    var bubble = el("div", "bubble user", escapeHtml(text));
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    scrollToBottom();
    return row;
  }

  function scrollToBottom() {
    requestAnimationFrame(function () {
      chatWindow.scrollTop = chatWindow.scrollHeight;
    });
  }

  function lastSectionShown() {
    for (var i = stepIndex - 1; i >= 0; i--) {
      if (STEPS[i]) return STEPS[i].section;
    }
    return null;
  }

  function currentAnswerText(step) {
    var val = answers[step.id];
    if (val === undefined || val === null || val === "") return "";
    var text = val;
    if (step.otherTrigger && val === step.otherTrigger && extraAnswers[step.id]) {
      text = val + " — " + extraAnswers[step.id];
    }
    if (step.prefix) {
      text = step.prefix + val;
    }
    return text;
  }

  function renderComposerForStep(step) {
    composerField.innerHTML = "";
    pendingChoice = {};

    var label = el("label", "field-label", escapeHtml(step.question));
    composerField.appendChild(label);

    var existing = answers[step.id] || "";

    if (step.type === "text" || step.type === "tel" || step.type === "email") {
      var input = el("input", "field-input");
      input.type = step.type === "tel" ? "tel" : step.type === "email" ? "email" : "text";
      input.placeholder = step.placeholder || "";
      input.id = "field-" + step.id;
      input.value = existing;
      composerField.appendChild(input);
      addErrorSlot();
      input.focus();
    } else if (step.type === "date") {
      var dateInput = el("input", "field-input");
      dateInput.type = "date";
      dateInput.id = "field-" + step.id;
      dateInput.value = existing;
      dateInput.max = new Date().toISOString().split("T")[0];
      composerField.appendChild(dateInput);
      addErrorSlot();
    } else if (step.type === "textarea") {
      var ta = el("textarea", "field-textarea");
      ta.placeholder = step.placeholder || "";
      ta.id = "field-" + step.id;
      ta.value = existing;
      composerField.appendChild(ta);
      addErrorSlot();
      ta.focus();
    } else if (step.type === "select") {
      var select = el("select", "field-select");
      select.id = "field-" + step.id;
      var placeholderOpt = el("option", "", escapeHtml(step.placeholder || "Select an option"));
      placeholderOpt.value = "";
      select.appendChild(placeholderOpt);
      step.options.forEach(function (opt) {
        var o = el("option", "", escapeHtml(opt));
        o.value = opt;
        if (opt === existing) o.selected = true;
        select.appendChild(o);
      });
      composerField.appendChild(select);
      addErrorSlot();

      if (step.otherTrigger) {
        maybeAddOtherField(step, existing);
        select.addEventListener("change", function () {
          maybeAddOtherField(step, select.value);
        });
      }
    } else if (step.type === "choice") {
      var group = el("div", "choice-group");
      pendingChoice.value = existing || null;
      step.options.forEach(function (opt) {
        var btn = el("button", "choice-btn", escapeHtml(opt));
        btn.type = "button";
        if (opt === existing) btn.classList.add("selected");
        btn.addEventListener("click", function () {
          Array.prototype.forEach.call(group.children, function (c) {
            c.classList.remove("selected");
          });
          btn.classList.add("selected");
          pendingChoice.value = opt;
          if (step.otherTrigger) {
            maybeAddOtherField(step, opt);
          }
          clearError();
        });
        group.appendChild(btn);
      });
      composerField.appendChild(group);
      addErrorSlot();

      if (step.otherTrigger) {
        maybeAddOtherField(step, existing);
      }
    }
  }

  function maybeAddOtherField(step, currentValue) {
    var existingExtra = document.getElementById("field-" + step.id + "-extra");
    if (existingExtra) existingExtra.parentElement.removeChild(existingExtra);

    if (currentValue === step.otherTrigger) {
      var wrap = el("div", "");
      wrap.style.marginTop = "10px";
      var extraLabelText = step.otherPlaceholder || "Please specify";
      var extraLabel = el("label", "field-label", escapeHtml(extraLabelText));
      wrap.appendChild(extraLabel);

      var extraInput;
      if (step.otherType === "textarea") {
        extraInput = el("textarea", "field-textarea");
      } else {
        extraInput = el("input", "field-input");
        extraInput.type = "text";
      }
      extraInput.id = "field-" + step.id + "-extra";
      extraInput.placeholder = extraLabelText;
      extraInput.value = extraAnswers[step.id] || "";
      wrap.appendChild(extraInput);
      composerField.appendChild(wrap);
      extraInput.focus();
    }
  }

  function addErrorSlot() {
    var err = el("div", "field-error");
    err.id = "fieldError";
    composerField.appendChild(err);
  }

  function showError(msg) {
    var err = document.getElementById("fieldError");
    if (err) err.textContent = msg;
  }

  function clearError() {
    var err = document.getElementById("fieldError");
    if (err) err.textContent = "";
  }

  function validateAndCollect(step) {
    var value = "";
    var extraValue = "";

    if (step.type === "choice") {
      value = pendingChoice.value || "";
    } else {
      var fieldEl = document.getElementById("field-" + step.id);
      value = fieldEl ? fieldEl.value.trim() : "";
    }

    if (!value) {
      showError("This field is required.");
      return null;
    }

    if (step.type === "email") {
      var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(value)) {
        showError("Please enter a valid email address.");
        return null;
      }
    }

    if (step.type === "tel") {
      var digits = value.replace(/[^0-9]/g, "");
      if (digits.length < 7 || digits.length > 15) {
        showError("Please enter a valid mobile number.");
        return null;
      }
    }

    if (step.id === "sumAssured") {
      var numeric = value.replace(/[^0-9.]/g, "");
      if (!numeric || isNaN(Number(numeric))) {
        showError("Please enter a valid amount.");
        return null;
      }
      value = numeric;
    }

    if (step.otherTrigger && value === step.otherTrigger) {
      var extraEl = document.getElementById("field-" + step.id + "-extra");
      extraValue = extraEl ? extraEl.value.trim() : "";
      if (!extraValue) {
        showError("Please provide the additional detail above.");
        return null;
      }
    }

    return { value: value, extraValue: extraValue };
  }

  function updateProgress() {
    var total = STEPS.length;
    var pct = phase === "questions" ? Math.round((stepIndex / total) * 100) : 100;
    progressTrack.style.setProperty("--progress", pct + "%");
  }

  function renderCurrentStep() {
    updateProgress();

    if (phase === "questions") {
      var step = STEPS[stepIndex];
      renderComposerForStep(step);
      backBtn.disabled = stepIndex === 0;
      nextBtn.textContent = stepIndex === STEPS.length - 1 ? "Review" : "Next";
      nextBtn.disabled = false;
      composerForm.style.display = "";
    } else if (phase === "summary") {
      composerField.innerHTML = "";
      backBtn.disabled = false;
      backBtn.textContent = "Back";
      nextBtn.textContent = "Submit";
      nextBtn.disabled = false;
      composerForm.style.display = "";
    } else if (phase === "submitted") {
      composerForm.style.display = "none";
    }
  }

  function buildSummaryHtml(submitted) {
    var sections = {};
    var order = [];
    STEPS.forEach(function (step) {
      if (!sections[step.section]) {
        sections[step.section] = [];
        order.push(step.section);
      }
      sections[step.section].push(step);
    });

    var html = el("div", "summary-card");
    var heading = el("h3", "", submitted ? "Submitted KYC Summary" : "Review Your Answers");
    html.appendChild(heading);

    order.forEach(function (sectionName) {
      var sectionWrap = el("div", "summary-section");
      var sectionTitle = el("div", "field-label", escapeHtml(sectionName));
      sectionTitle.style.fontWeight = "600";
      sectionTitle.style.color = "var(--ink-navy)";
      sectionWrap.appendChild(sectionTitle);

      sections[sectionName].forEach(function (step) {
        var row = el("div", "summary-row");
        var k = el("span", "k", escapeHtml(step.question));
        var vText = currentAnswerText(step) || "—";
        var v = el("span", "v", escapeHtml(vText));
        row.appendChild(k);
        row.appendChild(v);
        sectionWrap.appendChild(row);
      });

      html.appendChild(sectionWrap);
    });

    if (submitted) {
      var badge = el(
        "div",
        "submitted-badge",
        "✓ Submitted for review — no data has been saved or sent anywhere."
      );
      html.appendChild(badge);
    }

    return html;
  }

  function showSummaryBubble(submitted) {
    var row = el("div", "bubble-row bot");
    var bubble = el("div", "bubble bot summary");
    bubble.appendChild(buildSummaryHtml(submitted));
    row.appendChild(bubble);
    chatWindow.appendChild(row);
    scrollToBottom();
    return row;
  }

  function goToStep(index) {
    stepIndex = index;
    var step = STEPS[stepIndex];
    var section = step.section;
    var prevSection = lastSectionShown();
    addBotBubble(step.question, section !== prevSection ? section : null);
    renderCurrentStep();
  }

  composerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (phase === "questions") {
      var step = STEPS[stepIndex];
      var result = validateAndCollect(step);
      if (!result) return;

      answers[step.id] = result.value;
      if (result.extraValue) extraAnswers[step.id] = result.extraValue;

      addUserBubble(currentAnswerText(step));

      if (stepIndex === STEPS.length - 1) {
        phase = "summary";
        showSummaryBubble(false);
        renderCurrentStep();
      } else {
        stepIndex += 1;
        var nextStep = STEPS[stepIndex];
        var prevSection = STEPS[stepIndex - 1].section;
        addBotBubble(nextStep.question, nextStep.section !== prevSection ? nextStep.section : null);
        renderCurrentStep();
      }
    } else if (phase === "summary") {
      phase = "submitted";
      removeSummaryRow();
      addBotBubble("Thank you. Here is your submitted KYC summary for this demo session.");
      showSummaryBubble(true);
      renderCurrentStep();
    }
  });

  function removeSummaryRow() {
    var summaryBubble = chatWindow.querySelector(".bubble.summary");
    if (!summaryBubble) return;
    var row = summaryBubble.closest(".bubble-row");
    if (row) chatWindow.removeChild(row);
  }

  backBtn.addEventListener("click", function () {
    if (phase === "summary") {
      phase = "questions";
      removeSummaryRow();
      renderCurrentStep();
      return;
    }

    if (stepIndex === 0) return;

    var currentBotRow = chatWindow.lastElementChild;
    if (currentBotRow) chatWindow.removeChild(currentBotRow);
    var prevUserRow = chatWindow.lastElementChild;
    if (prevUserRow && prevUserRow.classList.contains("bubble-row")) {
      chatWindow.removeChild(prevUserRow);
    }

    stepIndex -= 1;
    renderCurrentStep();
    scrollToBottom();
  });

  function init() {
    addBotBubble(
      "Hello! I'll help you complete your insurance KYC intake. Let's start with your personal details.",
      null
    );
    goToStep(0);
  }

  init();
})();
