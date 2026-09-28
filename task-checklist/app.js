(function () {
  "use strict";

  const STORAGE_KEY = "task-checklist.tasks";

  const form = document.getElementById("add-form");
  const input = document.getElementById("new-task");
  const list = document.getElementById("task-list");
  const emptyState = document.getElementById("empty-state");
  const footer = document.getElementById("footer");
  const progressText = document.getElementById("progress-text");
  const progressBar = document.getElementById("progress-bar");
  const progressFill = document.getElementById("progress-fill");
  const clearBtn = document.getElementById("clear-completed");

  let tasks = loadTasks();

  // --- Storage ---------------------------------------------------------

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed)
        ? parsed.filter((t) => t && typeof t.text === "string")
        : [];
    } catch (err) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      // Storage may be unavailable (e.g. private mode); the app still works for this session.
    }
  }

  // --- Actions ---------------------------------------------------------

  function addTask(text) {
    tasks.push({ id: makeId(), text: text, done: false });
    commit();
  }

  function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.done = !task.done;
      commit();
    }
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    commit();
  }

  function clearCompleted() {
    tasks = tasks.filter((t) => !t.done);
    commit();
  }

  function commit() {
    saveTasks();
    render();
  }

  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  // --- Rendering -------------------------------------------------------

  function render() {
    list.replaceChildren(...tasks.map(renderTask));

    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const percent = total ? Math.round((done / total) * 100) : 0;

    emptyState.hidden = total > 0;
    footer.hidden = total === 0;

    progressText.textContent = done + " of " + total + " done";
    progressFill.style.width = percent + "%";
    progressBar.setAttribute("aria-valuenow", String(percent));
    clearBtn.disabled = done === 0;
  }

  function renderTask(task) {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");
    li.dataset.id = task.id;

    const checkboxId = "task-" + task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxId;
    checkbox.checked = task.done;

    const label = document.createElement("label");
    label.htmlFor = checkboxId;
    label.textContent = task.text;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "×";
    del.setAttribute("aria-label", "Delete task: " + task.text);

    li.append(checkbox, label, del);
    return li;
  }

  // --- Events ----------------------------------------------------------

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) {
      input.value = "";
      return;
    }
    addTask(text);
    input.value = "";
    input.focus();
  });

  list.addEventListener("change", function (event) {
    if (event.target.matches('input[type="checkbox"]')) {
      const id = event.target.closest(".task").dataset.id;
      toggleTask(id);
      // Re-rendering replaces the checkbox, so restore keyboard focus to it.
      const box = document.getElementById("task-" + id);
      if (box) box.focus();
    }
  });

  list.addEventListener("click", function (event) {
    const btn = event.target.closest(".delete-btn");
    if (btn) {
      deleteTask(btn.closest(".task").dataset.id);
      input.focus();
    }
  });

  clearBtn.addEventListener("click", function () {
    clearCompleted();
    input.focus();
  });

  // --- Init ------------------------------------------------------------

  document.getElementById("today").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  render();
})();
