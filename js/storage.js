// Saves the tasks array to localStorage as text
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Loads tasks from localStorage and converts them back to an array.
// Returns an empty array if nothing has been saved yet.
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  return saved ? JSON.parse(saved) : [];
}

// Saves the chosen theme ("light" or "dark")
function saveTheme(theme) {
  localStorage.setItem("theme", theme);
}

// Loads the saved theme, defaulting to "light"
function loadTheme() {
  return localStorage.getItem("theme") || "light";
}