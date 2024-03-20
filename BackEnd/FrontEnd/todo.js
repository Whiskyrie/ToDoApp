// Selectors
const MongoClient = require('mongodb').MongoClient;
const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");

// Event Listeners

toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);
// Check if one theme has been set previously and apply it (or std theme if not found):
let savedTheme = localStorage.getItem("savedTheme");
savedTheme === null
  ? changeTheme("standard")
  : changeTheme(localStorage.getItem("savedTheme"));

// Functions;
function addToDo(event) {
  // Prevents form from submitting / Prevents form from relaoding;
  event.preventDefault();

  // toDo DIV;
  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo", `${savedTheme}-todo`);

  // Create LI
  const newToDo = document.createElement("li");
  if (toDoInput.value === "") {
    alert("You must write something!");
  } else {
    // newToDo.innerText = "hey";
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    // Adding to local storage;
    Save(toDoInput.value);

    // check btn;
    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(checked);
    // delete btn;
    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn", `${savedTheme}-button`);
    toDoDiv.appendChild(deleted);

    // Append to list;
    toDoList.appendChild(toDoDiv);

    // CLearing the input;
    toDoInput.value = "";
  }
}

function deletecheck(event) {
  // console.log(event.target);
  const item = event.target;

  // delete
  if (item.classList[0] === "delete-btn") {
    // item.parentElement.remove();
    // animation
    item.parentElement.classList.add("fall");

    Remove(item.parentElement);

    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });
  }

  // check
  if (item.classList[0] === "check-btn") {
    item.parentElement.classList.toggle("completed");
  }
}


const url = "mongodb+srv://evandroropfilho:K206wibABGTilAZm@cluster0.rvtkh7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function Save(todo) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const result = await collection.insertOne({ text: todo });
    console.log(`Um novo todo foi inserido com o ID: ${result.insertedId}`);
  } catch (err) {
    console.error('Erro ao inserir o todo:', err);
  } finally {
    client.close();
  }
}

async function Remove(todoText) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const result = await collection.deleteOne({ text: todoText });
    console.log(`${result.deletedCount} todo foi removido.`);
  } catch (err) {
    console.error('Erro ao remover o todo:', err);
  } finally {
    client.close();
  }
}

async function getTodos() {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const todos = await collection.find().toArray();

    todos.forEach(function (todo) {
      // toDo DIV;
      const toDoDiv = document.createElement("div");
      toDoDiv.classList.add("todo", `${savedTheme}-todo`);

      // Create LI
      const newToDo = document.createElement("li");

      newToDo.innerText = todo.text;
      newToDo.classList.add("todo-item");
      toDoDiv.appendChild(newToDo);

      // check btn;
      const checked = document.createElement("button");
      checked.innerHTML = '<i class="fas fa-check"></i>';
      checked.classList.add("check-btn", `${savedTheme}-button`);
      toDoDiv.appendChild(checked);
      // delete btn;
      const deleted = document.createElement("button");
      deleted.innerHTML = '<i class="fas fa-trash"></i>';
      deleted.classList.add("delete-btn", `${savedTheme}-button`);
      toDoDiv.appendChild(deleted);

      // Append to list;
      toDoList.appendChild(toDoDiv);
    });
  } catch (err) {
    console.error('Erro ao obter os todos:', err);
  } finally {
    client.close();
  }
}

