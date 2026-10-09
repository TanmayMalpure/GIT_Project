const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("teamTasks")) || [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("teamTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === "pending") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const completeButton = document.createElement("button");
    completeButton.className = "complete-btn";
    completeButton.textContent = task.completed ? "Undo" : "Complete";
    completeButton.setAttribute(
      "aria-label",
      `${task.completed ? "Undo" : "Complete"} ${task.text}`
    );

    completeButton.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((item) => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    li.append(text, completeButton, deleteButton);
    taskList.appendChild(li);
  });

  totalTasks.textContent = tasks.length;
  pendingTasks.textContent = tasks.filter(
    (task) => !task.completed
  ).length;
  completedTasks.textContent = tasks.filter(
    (task) => task.completed
  ).length;

  emptyMessage.hidden = filteredTasks.length > 0;
  emptyMessage.textContent = tasks.length === 0
    ? "No tasks yet. Add your first task!"
    : "No tasks match this filter.";
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) return;

  tasks.push({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  saveTasks();
  taskInput.value = "";
  currentFilter = "all";

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderTasks();
  taskInput.focus();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    renderTasks();
  });
});

renderTasks();