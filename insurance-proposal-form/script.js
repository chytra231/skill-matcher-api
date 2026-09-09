(function () {
  "use strict";

  var SUBMIT_URL =
    "https://script.google.com/macros/s/AKfycbygmQWTN8LEG9z23HibkFirrYTpXQj5ThYxIPTFVMq-15rmrA6cehAwNSp-z-e2zWBo/exec";

  function isMinorNominee(a) {
    var age = parseInt(a.nomineeAge, 10);
    return !isNaN(age) && age < 18;
  }

  function isFemaleClient(a) {
    return a.clientGender === "Female";
  }

  function isMinorProposal(a) {
    return a.isMinorProposal === "Yes";
  }

  var STEPS = [
    // Section 1: Agent / Development Officer Details
    {
      id: "agentName",
      section: "Agent / Development Officer Details",
      question: "What is the Agent's Name?",
      type: "text",
      placeholder: "e.g. Priya Menon",
    },
    {
      id: "agentCode",
      section: "Agent / Development Officer Details",
      question: "What is the Agent Code No.?",
      type: "text",
      placeholder: "e.g. AG-10234",
    },
    {
      id: "doName",
      section: "Agent / Development Officer Details",
      question: "What is the Development Officer's (DO) Name?",
      type: "text",
    },
    {
      id: "doOfficeContact",
      section: "Agent / Development Officer Details",
      question: "What is the DO's Office Contact Number?",
      type: "tel",
      placeholder: "Office contact number",
    },
    {
      id: "doMobile",
      section: "Agent / Development Officer Details",
      question: "What is the DO's Mobile Number?",
      type: "tel",
      placeholder: "10-digit mobile number",
    },

    // Section 2: Basic Plan Details
    {
      id: "clientFullName",
      section: "Basic Plan Details",
      question: "What is the Client's Full Name?",
      type: "text",
      placeholder: "e.g. Asha Rao",
    },
    {
      id: "planName",
      section: "Basic Plan Details",
      question: "Which Plan is being proposed?",
      type: "text",
      placeholder: "e.g. New Endowment Plan",
    },
    {
      id: "term",
      section: "Basic Plan Details",
      question: "What is the Term (in years)?",
      type: "text",
      placeholder: "e.g. 20",
    },
    {
      id: "sumAssured",
      section: "Basic Plan Details",
      question: "What is the Sum Assured?",
      type: "text",
      placeholder: "e.g. 500000",
      prefix: "₹",
    },
    {
      id: "sumProposed",
      section: "Basic Plan Details",
      question: "What is the Sum Proposed?",
      type: "text",
      placeholder: "e.g. 500000",
      prefix: "₹",
    },

    // Section 3: Identity Documents
    {
      id: "aadharNumber",
      section: "Identity Documents",
      question: "What is the Aadhar Number?",
      type: "text",
      placeholder: "XXXX XXXX XXXX",
      mask: true,
    },
    {
      id: "aadharMobile",
      section: "Identity Documents",
      question: "What is the Aadhar-linked Mobile Number?",
      type: "tel",
      placeholder: "10-digit mobile number",
    },
    {
      id: "aadharVirtualId",
      section: "Identity Documents",
      question: "What is the Aadhar Virtual ID?",
      type: "text",
      optional: true,
    },
    {
      id: "panNumber",
      section: "Identity Documents",
      question: "What is the PAN Number?",
      type: "text",
      placeholder: "e.g. ABCDE1234F",
      mask: true,
    },

    // Section 4: Personal Information
    {
      id: "clientGender",
      section: "Personal Information",
      question: "What is the Client's Gender?",
      type: "choice",
      options: ["Male", "Female", "Other"],
    },
    {
      id: "dob",
      section: "Personal Information",
      question: "What is the Date of Birth?",
      type: "date",
    },
    {
      id: "age",
      section: "Personal Information",
      question: "What is the Age?",
      type: "text",
      placeholder: "e.g. 32",
    },
    {
      id: "placeOfBirth",
      section: "Personal Information",
      question: "What is the Place of Birth?",
      type: "text",
    },
    {
      id: "fatherName",
      section: "Personal Information",
      question: "What is the Father's Name?",
      type: "text",
    },
    {
      id: "motherName",
      section: "Personal Information",
      question: "What is the Mother's Name?",
      type: "text",
    },
    {
      id: "maritalStatus",
      section: "Personal Information",
      question: "What is the Marital Status?",
      type: "choice",
      options: ["Single", "Married", "Widowed", "Divorced"],
    },
    {
      id: "spouseName",
      section: "Personal Information",
      question: "What is the Spouse's Name?",
      type: "text",
      optional: true,
    },
    {
      id: "educationalQualification",
      section: "Personal Information",
      question: "What is the Educational Qualification?",
      type: "text",
    },

    // Section 5: Contact Details
    {
      id: "commAddress",
      section: "Contact Details",
      question: "What is the Full Communication Address?",
      type: "textarea",
      placeholder: "House / Street, City, State, PIN code",
    },
    {
      id: "pinCode",
      section: "Contact Details",
      question: "What is the PIN Code?",
      type: "text",
      placeholder: "6-digit PIN code",
    },
    {
      id: "emailId",
      section: "Contact Details",
      question: "What is the Email ID?",
      type: "email",
      placeholder: "name@example.com",
    },
    {
      id: "mobileNumber",
      section: "Contact Details",
      question: "What is the Mobile Number?",
      type: "tel",
      placeholder: "10-digit mobile number",
    },

    // Section 6: Employment and Income
    {
      id: "occupation",
      section: "Employment and Income",
      question: "What is the Occupation?",
      type: "text",
    },
    {
      id: "natureOfDuty",
      section: "Employment and Income",
      question: "What is the Nature of Duty?",
      type: "text",
    },
    {
      id: "annualIncome",
      section: "Employment and Income",
      question: "What is the Annual Income?",
      type: "text",
      placeholder: "e.g. 600000",
      prefix: "₹",
    },
    {
      id: "employerName",
      section: "Employment and Income",
      question: "What is the Name of the Employer?",
      type: "text",
    },
    {
      id: "employerAddress",
      section: "Employment and Income",
      question: "What is the Employer Address?",
      type: "textarea",
    },
    {
      id: "yearsOfService",
      section: "Employment and Income",
      question: "What is the Number of Years of Service?",
      type: "text",
      placeholder: "e.g. 5",
    },
    {
      id: "gstNumber",
      section: "Employment and Income",
      question: "What is the GST Number?",
      type: "text",
      optional: true,
    },

    // Section 7: Previous Policy Details
    {
      id: "previousPolicyNumbers",
      section: "Previous Policy Details",
      question: "What are the Previous Policy Number(s)?",
      type: "text",
      optional: true,
    },
    {
      id: "servicingBranch",
      section: "Previous Policy Details",
      question: "What is the Servicing Branch?",
      type: "text",
      optional: true,
    },
    {
      id: "planTerm",
      section: "Previous Policy Details",
      question: "What is the Plan-Term of the previous policy?",
      type: "text",
      optional: true,
    },
    {
      id: "previousModeOfPayment",
      section: "Previous Policy Details",
      question: "What was the Mode of Payment?",
      type: "text",
      optional: true,
    },
    {
      id: "previousSumAssured",
      section: "Previous Policy Details",
      question: "What was the Sum Assured on the previous policy?",
      type: "text",
      prefix: "₹",
      optional: true,
    },
    {
      id: "dateOfIssue",
      section: "Previous Policy Details",
      question: "What was the Date of Issue?",
      type: "date",
      optional: true,
    },

    // Section 8: Family Health History
    {
      id: "fatherHealthHistory",
      section: "Family Health History",
      question: "Father: Living Age, or Age at Death and Cause?",
      type: "textarea",
    },
    {
      id: "motherHealthHistory",
      section: "Family Health History",
      question: "Mother: Living Age, or Age at Death and Cause?",
      type: "textarea",
    },
    {
      id: "brothersHealthHistory",
      section: "Family Health History",
      question: "Brother(s): Living Age(s), or Age at Death and Cause?",
      type: "textarea",
      optional: true,
    },
    {
      id: "sistersHealthHistory",
      section: "Family Health History",
      question: "Sister(s): Living Age(s), or Age at Death and Cause?",
      type: "textarea",
      optional: true,
    },
    {
      id: "spouseHealthHistory",
      section: "Family Health History",
      question: "Spouse: Living Age, or Age at Death and Cause?",
      type: "textarea",
      optional: true,
    },
    {
      id: "childrenHealthHistory",
      section: "Family Health History",
      question: "Children: Living Age(s), or Age at Death and Cause?",
      type: "textarea",
      optional: true,
    },

    // Section 9: Health and Physical Details
    {
      id: "stateOfHealth",
      section: "Health and Physical Details",
      question: "What is the State of Health?",
      type: "text",
    },
    {
      id: "height",
      section: "Health and Physical Details",
      question: "What is the Height (cms)?",
      type: "text",
    },
    {
      id: "weight",
      section: "Health and Physical Details",
      question: "What is the Weight (kgs)?",
      type: "text",
    },
    {
      id: "chestExpiration",
      section: "Health and Physical Details",
      question: "What is the Chest Expiration (cms)?",
      type: "text",
      optional: true,
    },
    {
      id: "chestInspiration",
      section: "Health and Physical Details",
      question: "What is the Chest Inspiration (cms)?",
      type: "text",
      optional: true,
    },
    {
      id: "abdomen",
      section: "Health and Physical Details",
      question: "What is the Abdomen (cms)?",
      type: "text",
      optional: true,
    },
    {
      id: "marksOfIdentification",
      section: "Health and Physical Details",
      question: "What are the Marks of Identification?",
      type: "text",
    },
    {
      id: "operationsDeformity",
      section: "Health and Physical Details",
      question: "Any Operations / Deformity / Missing Teeth?",
      type: "textarea",
      optional: true,
    },

    // Section 10: Banking Details
    {
      id: "bankAccountType",
      section: "Banking Details",
      question: "What is the Bank Account Type?",
      type: "choice",
      options: ["SB", "CA"],
    },
    {
      id: "bankAccountName",
      section: "Banking Details",
      question: "What is the Name in the Bank Account?",
      type: "text",
    },
    {
      id: "bankName",
      section: "Banking Details",
      question: "What is the Bank Name?",
      type: "text",
    },
    {
      id: "bankAccountNumber",
      section: "Banking Details",
      question: "What is the A/C Number?",
      type: "text",
      mask: true,
    },
    {
      id: "ifscCode",
      section: "Banking Details",
      question: "What is the IFSC Code?",
      type: "text",
    },
    {
      id: "micrCode",
      section: "Banking Details",
      question: "What is the MICR Code?",
      type: "text",
      optional: true,
    },

    // Section 11: Nominee Details
    {
      id: "nomineeNameAddress",
      section: "Nominee Details",
      question: "What is the Nominee's Full Name and Address?",
      type: "textarea",
    },
    {
      id: "nomineeAge",
      section: "Nominee Details",
      question: "What is the Nominee's Age?",
      type: "text",
      placeholder: "e.g. 12",
    },
    {
      id: "nomineeRelationship",
      section: "Nominee Details",
      question: "What is your Relationship to the Nominee?",
      type: "text",
    },

    // Section 12: Appointee Details (if Minor Nominee)
    {
      id: "appointeeName",
      section: "Appointee Details (if Minor Nominee)",
      question: "What is the Appointee's Name?",
      type: "text",
      condition: isMinorNominee,
    },
    {
      id: "appointeeAge",
      section: "Appointee Details (if Minor Nominee)",
      question: "What is the Appointee's Age?",
      type: "text",
      condition: isMinorNominee,
    },
    {
      id: "appointeeRelationship",
      section: "Appointee Details (if Minor Nominee)",
      question: "What is the Appointee's Relationship to the Nominee?",
      type: "text",
      condition: isMinorNominee,
    },
    {
      id: "appointeeMobile",
      section: "Appointee Details (if Minor Nominee)",
      question: "What is the Appointee's Mobile Number?",
      type: "tel",
      condition: isMinorNominee,
    },
    {
      id: "appointeeAadhar",
      section: "Appointee Details (if Minor Nominee)",
      question: "What is the Appointee's Aadhar Number?",
      type: "text",
      condition: isMinorNominee,
    },

    // Section 13: For Female Lives Only
    {
      id: "husbandName",
      section: "For Female Lives Only",
      question: "What is the Husband's Full Name?",
      type: "text",
      condition: isFemaleClient,
    },
    {
      id: "husbandOccupation",
      section: "For Female Lives Only",
      question: "What is the Husband's Occupation?",
      type: "text",
      condition: isFemaleClient,
    },
    {
      id: "husbandAnnualIncome",
      section: "For Female Lives Only",
      question: "What is the Husband's Annual Income?",
      type: "text",
      prefix: "₹",
      condition: isFemaleClient,
    },
    {
      id: "isPregnantNow",
      section: "For Female Lives Only",
      question: "Are you Pregnant Now?",
      type: "choice",
      options: ["Yes", "No"],
      condition: isFemaleClient,
    },
    {
      id: "dateOfLastDelivery",
      section: "For Female Lives Only",
      question: "What is the Date of Last Delivery?",
      type: "date",
      condition: isFemaleClient,
      optional: true,
    },
    {
      id: "miscarriageAbortionCaesarean",
      section: "For Female Lives Only",
      question: "Any Miscarriage / Abortion / Caesarean?",
      type: "textarea",
      condition: isFemaleClient,
      optional: true,
    },
    {
      id: "dateOfLastMenstruation",
      section: "For Female Lives Only",
      question: "What is the Date of Last Menstruation?",
      type: "date",
      condition: isFemaleClient,
      optional: true,
    },
    {
      id: "gynaecAilment",
      section: "For Female Lives Only",
      question: "Any Gynaec Ailment?",
      type: "text",
      condition: isFemaleClient,
      optional: true,
    },

    // Section 14: For Minor Proposal (if applicable)
    {
      id: "isMinorProposal",
      section: "For Minor Proposal",
      question: "Is this proposal for a minor?",
      type: "choice",
      options: ["Yes", "No"],
    },
    {
      id: "childName",
      section: "For Minor Proposal",
      question: "What is the Child's Name?",
      type: "text",
      condition: isMinorProposal,
    },
    {
      id: "childDob",
      section: "For Minor Proposal",
      question: "What is the Child's Date of Birth?",
      type: "date",
      condition: isMinorProposal,
    },
    {
      id: "childPlaceOfBirth",
      section: "For Minor Proposal",
      question: "What is the Child's Place of Birth?",
      type: "text",
      condition: isMinorProposal,
    },
    {
      id: "childStdClass",
      section: "For Minor Proposal",
      question: "Which Std/Class is the Child in?",
      type: "text",
      condition: isMinorProposal,
    },
    {
      id: "childHeight",
      section: "For Minor Proposal",
      question: "What is the Child's Height?",
      type: "text",
      condition: isMinorProposal,
    },
    {
      id: "childWeight",
      section: "For Minor Proposal",
      question: "What is the Child's Weight?",
      type: "text",
      condition: isMinorProposal,
    },
    {
      id: "childSchoolAddress",
      section: "For Minor Proposal",
      question: "What is the School Name and Address?",
      type: "textarea",
      condition: isMinorProposal,
    },

    // Section 15: Premium and Payment Details
    {
      id: "premiumWaiverRequired",
      section: "Premium and Payment Details",
      question: "Is Premium Waiver Benefit required?",
      type: "choice",
      options: ["Yes", "No"],
    },
    {
      id: "modeOfPayment",
      section: "Premium and Payment Details",
      question: "What is the Mode of Payment?",
      type: "choice",
      options: ["Yearly", "Half-Yearly", "Quarterly", "SSS", "Monthly-ECS"],
    },
    {
      id: "premiumAmount",
      section: "Premium and Payment Details",
      question: "What is the Premium Amount?",
      type: "text",
      prefix: "₹",
    },

    // Section 16: Agent Checklist
    {
      id: "documentsCollected",
      section: "Agent Checklist",
      question: "Which documents have been collected?",
      type: "checkbox-group",
      options: [
        "Age Proof",
        "ID Proof",
        "Address Proof",
        "Photos for minors",
        "School Certificate",
        "Appointee's Signature",
      ],
      optional: true,
    },
  ];

  var chatWindow = document.getElementById("chatWindow");
  var composerField = document.getElementById("composerField");
  var composerForm = document.getElementById("composerForm");
  var backBtn = document.getElementById("backBtn");
  var nextBtn = document.getElementById("nextBtn");
  var progressTrack = document.getElementById("progressTrack");

  composerForm.noValidate = true;

  var answers = {};
  var extraAnswers = {};
  var pendingChoice = {};
  var stepIndex = 0;
  var phase = "questions"; // 'questions' | 'summary' | 'submitting' | 'submitted'

  function getVisibleSteps() {
    return STEPS.filter(function (step) {
      return !step.condition || step.condition(answers);
    });
  }

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
    var bubble = el("div", "bubble user", escapeHtml(text || "(skipped)"));
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

  function lastSectionShown(visSteps, idx) {
    for (var i = idx - 1; i >= 0; i--) {
      if (visSteps[i]) return visSteps[i].section;
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

  function maskIdNumber(value) {
    var str = String(value || "");
    var alnumIndices = [];
    for (var i = 0; i < str.length; i++) {
      if (/[a-zA-Z0-9]/.test(str[i])) alnumIndices.push(i);
    }
    var keepFromIndex = alnumIndices.length > 4 ? alnumIndices[alnumIndices.length - 4] : -1;
    var result = "";
    for (var j = 0; j < str.length; j++) {
      var ch = str[j];
      if (/[a-zA-Z0-9]/.test(ch)) {
        result += j >= keepFromIndex ? ch : "X";
      } else {
        result += ch;
      }
    }
    return result;
  }

  function summaryAnswerText(step) {
    var text = currentAnswerText(step);
    if (step.mask && text) {
      return maskIdNumber(text);
    }
    return text;
  }

  function buildSubmissionPayload() {
    var payload = {};
    STEPS.forEach(function (step) {
      var raw = answers[step.id] || "";
      payload[step.id] = step.mask ? maskIdNumber(raw) : raw;
    });
    return payload;
  }

  function renderComposerForStep(step) {
    composerField.innerHTML = "";
    pendingChoice = {};

    var label = el("label", "field-label", escapeHtml(step.question));
    composerField.appendChild(label);

    if (step.optional) {
      composerField.appendChild(
        el("span", "field-hint", "Optional — leave blank if not applicable.")
      );
    }

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
    } else if (step.type === "checkbox-group") {
      var groupWrap = el("div", "checkbox-group");
      groupWrap.id = "field-" + step.id;
      var existingArr = existing ? existing.split(", ").filter(Boolean) : [];
      step.options.forEach(function (opt) {
        var optLabel = el("label", "checkbox-option");
        var cb = document.createElement("input");
        cb.type = "checkbox";
        cb.value = opt;
        cb.checked = existingArr.indexOf(opt) !== -1;
        optLabel.appendChild(cb);
        optLabel.appendChild(document.createTextNode(opt));
        groupWrap.appendChild(optLabel);
      });
      composerField.appendChild(groupWrap);
      addErrorSlot();
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
    } else if (step.type === "checkbox-group") {
      var groupEl = document.getElementById("field-" + step.id);
      var checked = groupEl
        ? Array.prototype.slice.call(groupEl.querySelectorAll("input[type='checkbox']:checked"))
        : [];
      value = checked.map(function (c) { return c.value; }).join(", ");
    } else {
      var fieldEl = document.getElementById("field-" + step.id);
      value = fieldEl ? fieldEl.value.trim() : "";
    }

    if (!value) {
      if (step.optional) {
        return { value: "", extraValue: "" };
      }
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

  function updateProgress(visSteps) {
    var total = visSteps.length;
    var pct = phase === "questions" ? Math.round((stepIndex / total) * 100) : 100;
    progressTrack.style.setProperty("--progress", pct + "%");
  }

  function renderCurrentStep() {
    var visSteps = getVisibleSteps();
    updateProgress(visSteps);

    if (phase === "questions") {
      var step = visSteps[stepIndex];
      renderComposerForStep(step);
      backBtn.disabled = stepIndex === 0;
      nextBtn.textContent = stepIndex === visSteps.length - 1 ? "Review" : "Next";
      nextBtn.disabled = false;
      composerForm.style.display = "";
    } else if (phase === "summary") {
      composerField.innerHTML = "";
      backBtn.disabled = false;
      backBtn.textContent = "Back";
      nextBtn.textContent = "Submit";
      nextBtn.disabled = false;
      composerForm.style.display = "";
    } else if (phase === "submitting") {
      composerField.innerHTML = "";
      backBtn.disabled = true;
      nextBtn.disabled = true;
      nextBtn.textContent = "Submitting…";
      composerForm.style.display = "";
    } else if (phase === "submitted") {
      composerForm.style.display = "none";
    }
  }

  function buildSummaryHtml(submitted) {
    var visSteps = getVisibleSteps();
    var sections = {};
    var order = [];
    visSteps.forEach(function (step) {
      if (!sections[step.section]) {
        sections[step.section] = [];
        order.push(step.section);
      }
      sections[step.section].push(step);
    });

    var html = el("div", "summary-card");
    var heading = el("h3", "", submitted ? "Submitted Proposal Summary" : "Review Your Answers");
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
        var vText = summaryAnswerText(step) || "—";
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
        "✓ Your details have been submitted successfully."
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
    var visSteps = getVisibleSteps();
    stepIndex = index;
    var step = visSteps[stepIndex];
    var section = step.section;
    var prevSection = lastSectionShown(visSteps, stepIndex);
    addBotBubble(step.question, section !== prevSection ? section : null);
    renderCurrentStep();
  }

  composerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (phase === "questions") {
      var visStepsBefore = getVisibleSteps();
      var step = visStepsBefore[stepIndex];
      var result = validateAndCollect(step);
      if (!result) return;

      answers[step.id] = result.value;
      if (result.extraValue) extraAnswers[step.id] = result.extraValue;

      addUserBubble(currentAnswerText(step));

      var visStepsAfter = getVisibleSteps();
      if (stepIndex === visStepsAfter.length - 1) {
        phase = "summary";
        showSummaryBubble(false);
        renderCurrentStep();
      } else {
        stepIndex += 1;
        var nextStep = visStepsAfter[stepIndex];
        var prevSection = visStepsAfter[stepIndex - 1].section;
        addBotBubble(nextStep.question, nextStep.section !== prevSection ? nextStep.section : null);
        renderCurrentStep();
      }
    } else if (phase === "summary") {
      submitToServer();
    }
  });

  function submitToServer() {
    phase = "submitting";
    renderCurrentStep();

    var payload = buildSubmissionPayload();

    fetch(SUBMIT_URL, {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed with status " + response.status);
        }
        phase = "submitted";
        removeSummaryRow();
        addBotBubble("Your details have been submitted successfully.");
        showSummaryBubble(true);
        renderCurrentStep();
      })
      .catch(function () {
        phase = "summary";
        addBotBubble(
          "We couldn't submit your details. Please check your connection and try again."
        );
        renderCurrentStep();
      });
  }

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
      "Hello! I'll help you complete this insurance proposal form. Let's start with the agent and development officer details.",
      null
    );
    goToStep(0);
  }

  init();
})();
