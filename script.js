const API_URL = "http://localhost:3000/todos";

const todosDiv = document.getElementById("todos");
const form = document.getElementById("todo-form");
const searchInput = document.getElementById("search");

/* LOAD TODOS */
async function loadTodos(query = "") {
  const res = await fetch(`${API_URL}${query}`);
  const todos = await res.json();

  todosDiv.innerHTML = "";

  todos.forEach(todo => {
    const div = document.createElement("div");
    div.className = "todo" + (todo.completed ? " completed" : "");

    div.innerHTML = `
      <input class="edit-title" value="${todo.title}" disabled />
      <input class="edit-description" value="${todo.description}" disabled />
      <input class="edit-category" value="${todo.category}" disabled />
      <input class="edit-dueDate" type="date" value="${todo.dueDate || ""}" disabled />

      <button onclick="toggleComplete('${todo.id}', ${todo.completed})">
        ${todo.completed ? "Undo" : "Complete"}
      </button>

      <button onclick="enableEdit(this, '${todo.id}')">Edit</button>

      <button onclick="deleteTodo('${todo.id}')">Delete</button>
    `;

    todosDiv.appendChild(div);
  });
}

/* ADD TODO */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const newTodo = {
    title: title.value,
    description: description.value,
    category: category.value,
    dueDate: dueDate.value,
    completed: false
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTodo)
  });

  form.reset();
  loadTodos();
});

/* TOGGLE COMPL */
async function toggleComplete(id, completed) {
  await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: !completed })
  });

  loadTodos();
}

/* DELETE TODO */
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  loadTodos();
}

/* ENABLE / SAVE EDIT */
async function enableEdit(button, id) {
  const card = button.parentElement;

  const title = card.querySelector(".edit-title");
  const desc = card.querySelector(".edit-description");
  const category = card.querySelector(".edit-category");
  const dueDate = card.querySelector(".edit-dueDate");

  if (button.innerText === "Save") {
    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.value,
        description: desc.value,
        category: category.value,
        dueDate: dueDate.value
      })
    });

    title.disabled = true;
    desc.disabled = true;
    category.disabled = true;
    dueDate.disabled = true;

    button.innerText = "Edit";
    loadTodos();
  } else {
    title.disabled = false;
    desc.disabled = false;
    category.disabled = false;
    dueDate.disabled = false;

    button.innerText = "Save";
  }
}

/* SEARCH FEATURE */
searchInput.addEventListener("input", e => {
  const value = e.target.value.trim();
  if (value) {
    loadTodos(`?q=${encodeURIComponent(value)}`);
  } else {
    loadTodos();
  }
});


loadTodos();
