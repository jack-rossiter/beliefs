/**
 * Belief Elicitation Tool
 * Single-page app: walks respondent through Modules A–D,
 * collects slider-based probability allocations, and exports JSON.
 */

(function () {
  "use strict";

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  const TOTAL = CONFIG.totalPoints;
  const main = $("#main-content");
  const footer = $("#nav-footer");
  const btnBack = $("#btn-back");
  const btnNext = $("#btn-next");
  const progressText = $("#progress-text");

  const responses = { meta: {}, calibration: {}, outcomes: {}, heterogeneity: {}, nonLinearity: {}, policyRelevance: {} };
  const pageState = {};
  let pages = [];
  let currentPage = 0;

  /* ──────────────────────────────────────────────────────
     Page definitions
     ────────────────────────────────────────────────────── */

  function buildPages() {
    pages = [];

    pages.push({
      id: "consent", render: renderConsent,
      validate: () => true, collect: () => {}
    });

    pages.push({
      id: "background", render: renderBackground,
      validate: validateBackground, collect: collectBackground,
      saveState: saveBackgroundState, restoreState: restoreBackgroundState
    });

    pages.push({
      id: "tutorial", render: renderTutorial,
      validate: () => true, collect: () => {}
    });

    pages.push({
      id: "practice",
      render: () => renderSliderPage({
        title: "Practice question",
        preamble: CONFIG.moduleA.tutorial.practiceQuestion.prompt,
        bins: CONFIG.moduleA.tutorial.practiceQuestion.bins
      }),
      validate: () => validateSliders("practice"),
      collect: () => {},
      saveState: () => saveSliderState("practice"),
      restoreState: () => restoreSliderState("practice", CONFIG.moduleA.tutorial.practiceQuestion.bins.length)
    });

    pages.push({
      id: "practice-feedback",
      render: renderPracticeFeedback,
      validate: () => true, collect: () => {}
    });

    pages.push({
      id: "context", render: renderContext,
      validate: () => true, collect: () => {}
    });

    CONFIG.moduleB.forEach((q, i) => {
      pages.push({
        id: q.id,
        render: () => renderSliderPage({
          title: "Calibration question " + (i + 1) + " of " + CONFIG.moduleB.length,
          preamble: (i === 0 ? '<p class="calibration-intro">' + CONFIG.calibrationIntro + "</p>" : "") + q.prompt,
          bins: q.bins,
          dataKey: q.id
        }),
        validate: () => validateSliders(q.id),
        collect: () => collectSliders(q.id, "calibration"),
        saveState: () => saveSliderState(q.id),
        restoreState: () => restoreSliderState(q.id, q.bins.length)
      });
    });

    pages.push({
      id: "vignette", render: renderVignette,
      validate: () => true, collect: () => {}
    });

    CONFIG.moduleC.forEach((q, i) => {
      pages.push({
        id: q.id,
        render: () => renderOutcomePage(q, i),
        validate: () => validateSliders(q.id),
        collect: () => collectSliders(q.id, "outcomes"),
        saveState: () => saveSliderState(q.id),
        restoreState: () => restoreSliderState(q.id, q.bins.length)
      });
    });

    CONFIG.moduleD.hetero.forEach((q) => {
      pages.push({
        id: q.id,
        render: () => renderHeteroPage(q),
        validate: () => validateSliders(q.id),
        collect: () => collectSliders(q.id, "heterogeneity"),
        saveState: () => saveSliderState(q.id),
        restoreState: () => restoreSliderState(q.id, q.bins.length)
      });
    });

    pages.push({
      id: "nonlinearity", render: renderNonLinearity,
      validate: validateNonLinearity, collect: collectNonLinearity,
      saveState: saveNonLinearityState, restoreState: restoreNonLinearityState
    });

    pages.push({
      id: "policy-relevance",
      render: renderPolicyRelevance,
      validate: validatePolicyRelevance,
      collect: collectPolicyRelevance,
      saveState: savePolicyRelevanceState,
      restoreState: restorePolicyRelevanceState
    });

    pages.push({
      id: "finish", render: renderFinish,
      validate: () => true, collect: () => {}
    });
  }

  /* ──────────────────────────────────────────────────────
     State persistence
     ────────────────────────────────────────────────────── */

  function saveSliderState(key) {
    var vals = getSliderValues(key);
    if (vals.length > 0) pageState[key] = vals;
  }

  function restoreSliderState(key, n) {
    var saved = pageState[key];
    if (!saved || saved.length !== n) return;
    for (var i = 0; i < n; i++) {
      var sl = $("#sl_" + key + "_" + i);
      var inp = $("#sv_" + key + "_" + i);
      if (sl) sl.value = saved[i];
      if (inp) inp.value = saved[i];
    }
    updateSliderDisplay(key, n);
  }

  function savePolicyRelevanceState() {
    var el = $("#policy_threshold");
    pageState.policyRelevance = el ? el.value : "";
  }

  function restorePolicyRelevanceState() {
    var saved = pageState.policyRelevance;
    var el = $("#policy_threshold");
    if (saved !== undefined && el) el.value = saved;
  }

  function saveBackgroundState() {
    var bg = {};
    CONFIG.moduleA.background.fields.forEach(function (f) {
      if (f.type === "radio") {
        var checked = $('input[name="' + f.id + '"]:checked');
        bg[f.id] = checked ? checked.value : null;
      } else {
        var el = $("#" + f.id);
        bg[f.id] = el ? el.value : "";
      }
    });
    pageState.background = bg;
  }

  function restoreBackgroundState() {
    var bg = pageState.background;
    if (!bg) return;
    CONFIG.moduleA.background.fields.forEach(function (f) {
      if (f.type === "radio" && bg[f.id]) {
        var radio = $('input[name="' + f.id + '"][value="' + bg[f.id] + '"]');
        if (radio) radio.checked = true;
      } else if (bg[f.id] !== undefined) {
        var el = $("#" + f.id);
        if (el) el.value = bg[f.id];
      }
    });
  }

  function saveNonLinearityState() {
    var checked = $('input[name="nl_choice"]:checked');
    var reason = $("#nl_reason");
    pageState.nonlinearity = {
      choice: checked ? checked.value : null,
      reason: reason ? reason.value : ""
    };
  }

  function restoreNonLinearityState() {
    var saved = pageState.nonlinearity;
    if (!saved) return;
    if (saved.choice) {
      var radio = $('input[name="nl_choice"][value="' + saved.choice + '"]');
      if (radio) radio.checked = true;
    }
    if (saved.reason) {
      var el = $("#nl_reason");
      if (el) el.value = saved.reason;
    }
  }

  /* ──────────────────────────────────────────────────────
     Renderers
     ────────────────────────────────────────────────────── */

  function renderConsent() {
    main.innerHTML =
      '<div class="card"><h2>Welcome</h2>' +
      CONFIG.moduleA.consent.text.split("\n\n").map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      "</div>";
  }

  function renderBackground() {
    var fields = CONFIG.moduleA.background.fields.map(function (f) {
      if (f.type === "radio") {
        return '<div class="form-group"><label>' + f.label + "</label>" +
          '<div class="radio-group">' +
          f.options.map(function (o) {
            return '<label><input type="radio" name="' + f.id + '" value="' + o + '"> ' + o + "</label>";
          }).join("") +
          "</div></div>";
      }
      return '<div class="form-group"><label for="' + f.id + '">' + f.label + "</label>" +
        '<input type="' + f.type + '" id="' + f.id + '" name="' + f.id + '"></div>';
    }).join("");
    main.innerHTML = '<div class="card"><h2>About you</h2>' + fields + "</div>";
  }

  function validateBackground() {
    return !!$('input[name="role"]:checked');
  }

  function collectBackground() {
    CONFIG.moduleA.background.fields.forEach(function (f) {
      if (f.type === "radio") {
        var checked = $('input[name="' + f.id + '"]:checked');
        responses.meta[f.id] = checked ? checked.value : null;
      } else {
        var el = $("#" + f.id);
        responses.meta[f.id] = el ? el.value : null;
      }
    });
  }

  function renderTutorial() {
    main.innerHTML =
      '<div class="card"><h2>' + CONFIG.moduleA.tutorial.title + "</h2>" +
      CONFIG.moduleA.tutorial.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      "</div>";
  }

  function renderContext() {
    main.innerHTML =
      '<div class="card"><h2>' + CONFIG.moduleA.context.title + "</h2>" +
      CONFIG.moduleA.context.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      "</div>";
  }

  function renderPracticeFeedback() {
    main.innerHTML =
      '<div class="card">' +
        "<h2>Practice result</h2>" +
        "<p><strong>Answer:</strong> " + CONFIG.moduleA.tutorial.practiceQuestion.answer + "</p>" +
        "<p>If most of your weight was in the right range, great \u2014 you\u2019re ready to continue.</p>" +
      "</div>";
  }

  function renderVignette() {
    main.innerHTML =
      '<div class="card"><h2>The programme</h2>' +
      CONFIG.vignette.split("\n\n").map(function (p) { return "<p>" + p + "</p>"; }).join("") +
      "</div>";
  }

  function renderOutcomePage(q, idx) {
    main.innerHTML =
      '<div class="card">' +
        '<h2>Outcome ' + (idx + 1) + " of " + CONFIG.moduleC.length + ": " + q.title + "</h2>" +
        (q.anchor ? '<div class="anchor-box">' + q.anchor + "</div>" : "") +
        "<p>" + q.prompt + "</p>" +
        '<p class="text-small text-muted">Unit: ' + q.unit + "</p>" +
      "</div>" +
      buildSliderHTML(q.id, q.bins, null);
    attachSliderListeners(q.id, q.bins.length);
  }

  function renderHeteroPage(q) {
    main.innerHTML =
      '<div class="card">' +
        "<h2>" + q.title + "</h2>" +
        "<p>" + q.preamble + "</p>" +
        '<p class="mt-1">' + q.prompt + "</p>" +
        '<p class="text-small text-muted">Unit: ' + q.unit + "</p>" +
      "</div>" +
      buildSliderHTML(q.id, q.bins, null) +
      "";
    attachSliderListeners(q.id, q.bins.length);
  }

  function renderNonLinearity() {
    var nl = CONFIG.moduleD.nonLinearity;

    var personalNote = "";
    var earningsData = responses.outcomes.earnings;
    if (earningsData && earningsData.allocation) {
      var maxVal = Math.max.apply(null, earningsData.allocation);
      if (maxVal > 0) {
        var maxIdx = earningsData.allocation.indexOf(maxVal);
        var modalBin = earningsData.bins[maxIdx];
        personalNote = "For instance, you predicted that the most likely effect on earnings was around <strong>" + modalBin + "</strong> for a 0.3 SD gain. ";
      }
    }

    var promptText = nl.promptTemplate.replace("{PERSONALISED_NOTE}", personalNote);
    var opts = nl.options.map(function (o) {
      return '<label><input type="radio" name="nl_choice" value="' + o.value + '"> ' + o.label + "</label>";
    }).join("");

    main.innerHTML =
      '<div class="card">' +
        '<h2>Non-linearity in returns</h2>' +
        promptText.split("\n\n").map(function (p) { return "<p>" + p + "</p>"; }).join("") +
        '<div class="radio-group mt-1">' + opts + "</div>" +
        '<div class="form-group mt-2">' +
          '<label for="nl_reason">' + nl.followUp + "</label>" +
          '<textarea id="nl_reason" rows="3"></textarea>' +
        "</div>" +
      "</div>";
  }

  function validateNonLinearity() {
    return !!$('input[name="nl_choice"]:checked');
  }

  function collectNonLinearity() {
    var checked = $('input[name="nl_choice"]:checked');
    responses.nonLinearity.choice = checked ? checked.value : null;
    responses.nonLinearity.reason = $("#nl_reason") ? $("#nl_reason").value : "";
  }

  function renderPolicyRelevance() {
    var pr = CONFIG.policyRelevance;
    main.innerHTML =
      '<div class="card">' +
        "<h2>Policy relevance</h2>" +
        "<p>" + pr.prompt + "</p>" +
        '<div class="form-group mt-2">' +
          '<label for="policy_threshold">' + pr.label + "</label>" +
          '<input type="number" id="policy_threshold" step="any" min="0">' +
        "</div>" +
        '<p class="text-small text-muted">Unit: ' + pr.unit + "</p>" +
      "</div>";
  }

  function validatePolicyRelevance() {
    var el = $("#policy_threshold");
    return el && el.value !== "" && !isNaN(parseFloat(el.value));
  }

  function collectPolicyRelevance() {
    var el = $("#policy_threshold");
    responses.policyRelevance = {
      threshold: el ? parseFloat(el.value) || null : null,
      unit: CONFIG.policyRelevance.unit,
      timestamp: new Date().toISOString()
    };
  }

  function renderFinish() {
    footer.classList.add("hidden");
    responses.meta.endTime = new Date().toISOString();

    submitToGitHub(responses);

    var blob = new Blob([JSON.stringify(responses, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var ts = new Date().toISOString().replace(/[:.]/g, "-");

    main.innerHTML =
      '<div class="card" style="text-align:center;">' +
        "<h2>Thank you!</h2>" +
        "<p>Your responses have been recorded.</p>" +
        '<p class="mt-2">' +
          '<a href="' + url + '" download="elicitation-response-' + ts + '.json" class="btn btn-primary">' +
            "Download responses (JSON)" +
          "</a>" +
        "</p>" +
        '<p class="text-small text-muted mt-2">If this exercise is being administered in person, your facilitator will collect your responses automatically.</p>' +
      "</div>";
  }

  /* ──────────────────────────────────────────────────────
     Slider grid builder (two-column layout)
     ────────────────────────────────────────────────────── */

  function buildSliderHTML(key, bins, anchorHTML) {
    var histBars = bins.map(function (_, i) {
      return '<div class="hist-bar-wrap"><div class="hist-bar" id="hbar_' + key + "_" + i + '"></div></div>';
    }).join("");

    var sliders = bins.map(function (label, i) {
      return '<div class="slider-row">' +
        '<span class="bin-label">' + label + "</span>" +
        '<input type="range" min="0" max="' + TOTAL + '" value="0" step="5" ' +
          'id="sl_' + key + "_" + i + '" data-key="' + key + '" data-idx="' + i + '">' +
        '<input type="number" min="0" max="' + TOTAL + '" value="0" ' +
          'id="sv_' + key + "_" + i + '" class="slider-val-input" ' +
          'data-key="' + key + '" data-idx="' + i + '">' +
      "</div>";
    }).join("");

    var rightContent = "";
    if (anchorHTML) {
      rightContent += '<div class="anchor-box">' + anchorHTML + "</div>";
    }
    rightContent +=
      '<div class="histogram" id="hist_' + key + '">' + histBars + "</div>" +
      '<div class="total-row">' +
        "<span>Total</span>" +
        '<span class="total-count under" id="total_' + key + '">0 / ' + TOTAL + "</span>" +
      "</div>";

    return '<div class="slider-grid-container" id="grid_' + key + '">' +
      '<div class="slider-col-left">' + sliders + "</div>" +
      '<div class="slider-col-right">' + rightContent + "</div>" +
    "</div>";
  }

  function attachSliderListeners(key, n) {
    for (var i = 0; i < n; i++) {
      (function (idx) {
        var sl = $("#sl_" + key + "_" + idx);
        var inp = $("#sv_" + key + "_" + idx);

        if (sl) {
          sl.addEventListener("input", function () {
            clampAndSync(key, n, idx, parseInt(sl.value, 10) || 0, "slider");
          });
        }
        if (inp) {
          inp.addEventListener("input", function () {
            var v = parseInt(inp.value, 10);
            if (isNaN(v) || v < 0) v = 0;
            clampAndSync(key, n, idx, v, "number");
          });
        }
      })(i);
    }
    updateSliderDisplay(key, n);
  }

  function clampAndSync(key, n, activeIdx, requested, source) {
    var sumOthers = 0;
    for (var i = 0; i < n; i++) {
      if (i === activeIdx) continue;
      var other = $("#sl_" + key + "_" + i);
      sumOthers += parseInt(other.value, 10) || 0;
    }
    var maxAllowed = Math.max(0, TOTAL - sumOthers);
    var clamped = Math.min(requested, maxAllowed);

    var sl = $("#sl_" + key + "_" + activeIdx);
    var inp = $("#sv_" + key + "_" + activeIdx);
    if (sl) sl.value = clamped;
    if (inp) inp.value = clamped;

    updateSliderDisplay(key, n);
  }

  function updateSliderDisplay(key, n) {
    var sum = 0;
    var maxVal = 1;
    var vals = [];

    for (var i = 0; i < n; i++) {
      var sl = $("#sl_" + key + "_" + i);
      var v = parseInt(sl.value, 10) || 0;
      vals.push(v);
      sum += v;
      if (v > maxVal) maxVal = v;
    }

    for (var j = 0; j < n; j++) {
      var bar = $("#hbar_" + key + "_" + j);
      if (bar) bar.style.height = (vals[j] / maxVal) * 100 + "%";
    }

    var totalEl = $("#total_" + key);
    totalEl.textContent = sum + " / " + TOTAL;
    totalEl.className = "total-count " + (sum === TOTAL ? "exact" : sum > TOTAL ? "over" : "under");
  }

  function getSliderValues(key) {
    var grid = $("#grid_" + key);
    if (!grid) return [];
    return $$('input[type="range"][data-key="' + key + '"]').map(function (sl) {
      return parseInt(sl.value, 10) || 0;
    });
  }

  function validateSliders(key) {
    var vals = getSliderValues(key);
    var sum = vals.reduce(function (a, b) { return a + b; }, 0);
    if (sum !== TOTAL) {
      var totalEl = $("#total_" + key);
      if (totalEl) {
        totalEl.classList.add("shake");
        setTimeout(function () { totalEl.classList.remove("shake"); }, 400);
      }
      return false;
    }
    return true;
  }

  function collectSliders(key, section) {
    var vals = getSliderValues(key);
    var binLabels = [];
    var calQ = CONFIG.moduleB.find(function (q) { return q.id === key; });
    var outQ = CONFIG.moduleC.find(function (q) { return q.id === key; });
    var hetQ = CONFIG.moduleD.hetero.find(function (q) { return q.id === key; });
    if (calQ) binLabels = calQ.bins;
    else if (outQ) binLabels = outQ.bins;
    else if (hetQ) binLabels = hetQ.bins;

    responses[section][key] = {
      bins: binLabels,
      allocation: vals,
      timestamp: new Date().toISOString()
    };
  }

  /* ──────────────────────────────────────────────────────
     Slider page (calibration & practice)
     ────────────────────────────────────────────────────── */

  function renderSliderPage(opts) {
    var key = opts.dataKey || "practice";
    main.innerHTML =
      '<div class="card"><h2>' + opts.title + "</h2><p>" + opts.preamble + "</p></div>" +
      buildSliderHTML(key, opts.bins, null);
    attachSliderListeners(key, opts.bins.length);
  }

  /* ──────────────────────────────────────────────────────
     GitHub data submission
     ────────────────────────────────────────────────────── */

  function submitToGitHub(data) {
    if (!CONFIG.github) return;
    var gh = CONFIG.github;
    var url = "https://api.github.com/repos/" + gh.owner + "/" + gh.repo + "/dispatches";

    fetch(url, {
      method: "POST",
      headers: {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": "token " + gh.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type: "elicitation-response",
        client_payload: data
      })
    }).then(function (resp) {
      if (resp.status === 204) {
        console.log("Response submitted to GitHub");
      } else {
        console.warn("GitHub submission status:", resp.status);
      }
    }).catch(function (err) {
      console.warn("GitHub submission failed:", err);
    });
  }

  /* ──────────────────────────────────────────────────────
     Navigation
     ────────────────────────────────────────────────────── */

  function showPage(idx) {
    currentPage = idx;
    window.scrollTo(0, 0);
    pages[idx].render();
    if (pages[idx].restoreState) pages[idx].restoreState();

    footer.classList.remove("hidden");
    btnBack.disabled = idx === 0;
    btnNext.textContent = idx === pages.length - 2 ? "Finish" : "Next";

    if (idx === pages.length - 1) {
      footer.classList.add("hidden");
    }

    var total = pages.length - 1;
    progressText.textContent = idx < total ? (idx + 1) + " / " + total : "";
  }

  btnNext.addEventListener("click", function () {
    var page = pages[currentPage];
    if (page.saveState) page.saveState();
    if (!page.validate()) {
      if (getSliderValues(page.id).length > 0) {
        alert("Please allocate exactly " + TOTAL + " points before proceeding.");
      } else {
        alert("Please complete this section before proceeding.");
      }
      return;
    }
    page.collect();
    if (currentPage < pages.length - 1) showPage(currentPage + 1);
  });

  btnBack.addEventListener("click", function () {
    var page = pages[currentPage];
    if (page.saveState) page.saveState();
    if (currentPage > 0) showPage(currentPage - 1);
  });

  /* ── Initialise ─────────────────────────────────────── */
  buildPages();
  responses.meta.startTime = new Date().toISOString();
  responses.meta.respondentId = (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : "id-" + Date.now();
  showPage(0);

})();
