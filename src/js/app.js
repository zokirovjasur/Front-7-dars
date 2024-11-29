import { elTodoForm, elTodoTemplate, elTodosParent } from "./html-selection.js";
import { saveTodos, loadTodos } from "./todo-utils.js";

const MAX_TITLE_LENGTH = 35;

function handleCheckboxChange(todoBody, checkbox) {
  if (checkbox.checked) {
    todoBody.classList.add("line-through", "opacity-70");
  } else {
    todoBody.classList.remove("line-through", "opacity-70");
  }
  saveTodos(elTodosParent);
}

function handleEdit(saveButton, todoTitle, todoBody) {
  todoTitle.contentEditable = "true";
  todoBody.contentEditable = "true";
  todoTitle.classList.add("border", "border-blue-500", "px-2");
  todoBody.classList.add("border", "border-blue-500", "px-2");
  saveButton.classList.remove("hidden");
}

function handleSave(saveButton, todoTitle, todoBody, errorText) {
  errorText.classList.add("hidden");
  if (!todoTitle.textContent.trim()) {
    errorText.textContent = "Topshiriq nomini bo'sh qoldira olmaysiz.";
    errorText.classList.remove("hidden");
    return;
  }
  if (todoTitle.textContent.length > MAX_TITLE_LENGTH) {
    errorText.textContent = `Topshiriq nomi ${MAX_TITLE_LENGTH} ta belgidan oshmasligi kerak.`;
    errorText.classList.remove("hidden");
    return;
  }

  todoTitle.contentEditable = "false";
  todoBody.contentEditable = "false";
  todoTitle.classList.remove("border", "border-blue-500", "px-2");
  todoBody.classList.remove("border", "border-blue-500", "px-2");
  saveButton.classList.add("hidden");
  saveTodos(elTodosParent);
}

function createTodoElement(todo) {
  const element = elTodoTemplate.content.cloneNode(true);
  const todoTitle = element.getElementById("todoTitle");
  const todoBody = element.getElementById("todoBody");
  const saveButton = element.getElementById("saveTodo");
  const errorText = element.getElementById("errorText");
  const checkbox = element.getElementById("todoCheckbox");
  const deleteButton = element.getElementById("deleteTodo");
  const editButton = element.getElementById("editTodo");

  todoTitle.textContent = todo.title;
  todoBody.textContent = todo.body;
  checkbox.checked = todo.completed;

  if (todo.completed) {
    todoBody.classList.add("line-through", "opacity-70");
  }

  checkbox.onchange = () => handleCheckboxChange(todoBody, checkbox);
  deleteButton.onclick = () => {
    deleteButton.closest("li").remove();
    saveTodos(elTodosParent);
  };
  editButton.onclick = () => handleEdit(saveButton, todoTitle, todoBody);
  saveButton.onclick = () =>
    handleSave(saveButton, todoTitle, todoBody, errorText);

  return element;
}

function loadAndRenderTodos() {
  const todos = loadTodos();
  todos.forEach((todo) => {
    elTodosParent.appendChild(createTodoElement(todo));
  });
}

elTodoForm.onsubmit = (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const todoName = data.get("todoName");
  const todoBody = data.get("todoBody");
  const todoTitleInput = elTodoForm.querySelector("[name='todoName']");
  const errorElement = todoTitleInput.nextElementSibling;

  errorElement.textContent = "";

  if (!todoName.trim()) {
    errorElement.textContent = "Topshiriq nomini kiritishingiz kerak.";
    errorElement.classList.add("text-red-500", "text-sm");
    return;
  }
  if (todoName.length > MAX_TITLE_LENGTH) {
    errorElement.textContent = `Topshiriq nomi ${MAX_TITLE_LENGTH} ta belgidan oshmasligi kerak.`;
    errorElement.classList.add("text-red-500", "text-sm");
    return;
  }

  const todo = { title: todoName, body: todoBody, completed: false };
  elTodosParent.appendChild(createTodoElement(todo));
  saveTodos(elTodosParent);
  e.target.reset();
};

loadAndRenderTodos();
