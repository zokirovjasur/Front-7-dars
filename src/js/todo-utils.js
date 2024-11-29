export function saveTodos(todosParent) {
  const todos = Array.from(todosParent.children).map((todo) => ({
    title: todo.querySelector("#todoTitle").textContent,
    body: todo.querySelector("#todoBody").textContent,
    completed: todo.querySelector("#todoCheckbox").checked,
  }));
  localStorage.setItem("todos", JSON.stringify(todos));
}

export function loadTodos() {
  return JSON.parse(localStorage.getItem("todos") || "[]");
}
