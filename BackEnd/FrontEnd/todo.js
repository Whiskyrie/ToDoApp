// Selectors
const MongoClient = require('mongodb').MongoClient;
const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");

// Event Listeners
toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", getTodos);

// Funções
function addToDo(event) {
  event.preventDefault();

  const toDoDiv = document.createElement("div");
  toDoDiv.classList.add("todo");

  const newToDo = document.createElement("li");
  if (toDoInput.value === "") {
    alert("You must write something!");
  } else {
    newToDo.innerText = toDoInput.value;
    newToDo.classList.add("todo-item");
    toDoDiv.appendChild(newToDo);

    Save(toDoInput.value);

    const checked = document.createElement("button");
    checked.innerHTML = '<i class="fas fa-check"></i>';
    checked.classList.add("check-btn");
    toDoDiv.appendChild(checked);

    const deleted = document.createElement("button");
    deleted.innerHTML = '<i class="fas fa-trash"></i>';
    deleted.classList.add("delete-btn");
    toDoDiv.appendChild(deleted);

    toDoList.appendChild(toDoDiv);
    toDoInput.value = "";
  }
}

function deletecheck(event) {
  const item = event.target;

  if (item.classList.contains("delete-btn")) {
    item.parentElement.classList.add("fall");
    Remove(item.parentElement);
    item.parentElement.addEventListener("transitionend", function () {
      item.parentElement.remove();
    });
  }

  if (item.classList.contains("check-btn")) {
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

async function Remove(todoElement) {
  const todoText = todoElement.firstChild.innerText;
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
  console.log('Obtendo todos do MongoDB');
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const todos = await collection.find().toArray();
    console.log('Todos obtidos:', todos);

    todos.forEach(function (todo) {
      const toDoDiv = document.createElement("div");
      toDoDiv.classList.add("todo");

      const newToDo = document.createElement("li");
      newToDo.innerText = todo.text;
      newToDo.classList.add("todo-item");
      toDoDiv.appendChild(newToDo);

      const checked = document.createElement("button");
      checked.innerHTML = '<i class="fas fa-check"></i>';
      checked.classList.add("check-btn");
      toDoDiv.appendChild(checked);

      const deleted = document.createElement("button");
      deleted.innerHTML = '<i class="fas fa-trash"></i>';
      deleted.classList.add("delete-btn");
      toDoDiv.appendChild(deleted);

      toDoList.appendChild(toDoDiv);
    });
  } catch (err) {
    console.error('Erro ao obter os todos:', err);
  } finally {
    client.close();
  }
}