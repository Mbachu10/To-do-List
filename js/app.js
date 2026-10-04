// Select the elements we need from the page
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const taskList = document.getElementById("task-list");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskCount = document.getElementById("task-count");
const clearBtn = document.getElementById("clear-btn");
const themeBtn = document.getElementById("theme-btn");

// App state: the list of tasks and the active filter
let tasks = loadTasks();
let currentFilter = "all";

// Displays tasks on the page based on the current filter
function renderTasks() {
  taskList.innerHTML = "";

  // Keep only the tasks that match the selected filter
  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  // Show a message when there is nothing to display
  if (visibleTasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.classList.add("empty");
    emptyItem.textContent = "No tasks to show";
    taskList.appendChild(emptyItem);
  }

  // Create a list item for each visible task
  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    }

    // Circle button: tap it to mark the task as done or not done
    const checkBtn = document.createElement("button");
    checkBtn.classList.add("check-btn");
    checkBtn.addEventListener("click", function () {
      toggleTask(task.id);
    });

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;

    // Date the task was added
    const dateLabel = document.createElement("small");
    dateLabel.textContent = task.date || "";

    // Delete button for this task
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    li.appendChild(checkBtn);
    li.appendChild(span);
    li.appendChild(dateLabel);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCount();
}

// Updates the "tasks left" counter
function updateCount() {
  const activeTasks = tasks.filter(function (task) {
    return !task.completed;
  });
  const word = activeTasks.length === 1 ? "task" : "tasks";
  taskCount.textContent = activeTasks.length + " " + word + " left";
}

// Adds a new task from the input box
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return; // ignore empty input

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    date: new Date().toLocaleDateString()
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  taskInput.value = "";
}

// Switches a task between completed and not completed
function toggleTask(id) {
  tasks = tasks.map(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  saveTasks(tasks);
  renderTasks();
}

// Removes a task by its id
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks(tasks);
  renderTasks();
}

// Removes all completed tasks at once
function clearCompleted() {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });
  saveTasks(tasks);
  renderTasks();
}

// Changes the active filter and highlights the matching button
function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderTasks();
}

// Applies the saved theme and sets the button label to match
function applyTheme(theme) {
  document.body.classList.toggle("dark", theme === "dark");
  themeBtn.textContent = theme === "dark" ? "Light" : "Dark";
}

// Switches between light and dark mode and saves the choice
function toggleTheme() {
  const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
  saveTheme(newTheme);
  applyTheme(newTheme);
}

// Event listeners
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearCompleted);
themeBtn.addEventListener("click", toggleTheme);

// Pressing Enter in the input also adds the task
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") addTask();
});

// Each filter button applies its own filter
filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    setFilter(btn.dataset.filter);
  });
});

// Apply the saved theme and show saved tasks when the page loads
applyTheme(loadTheme());
renderTasks();