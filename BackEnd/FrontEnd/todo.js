const MongoClient = require('mongodb').MongoClient;
const toDoInput = document.querySelector(".todo-input");
const toDoBtn = document.querySelector(".todo-btn");
const toDoList = document.querySelector(".todo-list");

// Event Listeners
toDoBtn.addEventListener("click", addToDo);
toDoList.addEventListener("click", deletecheck);
document.addEventListener("DOMContentLoaded", () => getTodos(userId));

// Funções
async function addToDo(event) {
  event.preventDefault();

  const todoText = toDoInput.value.trim();

  if (todoText === "") {
    alert("You must write something!");
    return;
  }

  const todo = { text: todoText, completed: false };
  addTodoToList(todo);
  await Save(todo, userId);
  toDoInput.value = "";
}

function addTodoToList(todo) {
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

  // Adicionar evento de remoção
  deleted.addEventListener("click", function (event) {
    toDoDiv.classList.add("fall");
    Remove(todo, toDoDiv);
  });

  // Adicionar evento de marcação
  checked.addEventListener("click", function (event) {
    toDoDiv.classList.toggle("completed");
    todo.completed = !todo.completed; // Atualizar o estado do todo
    Save(todo, userId); // Salvar o estado atualizado no banco
  });
}

async function Save(todo, userId) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const result = await collection.insertOne({ text: todo.text, completed: todo.completed, user: userId });
    console.log(`Um novo todo foi inserido com o ID: ${result.insertedId}`);
  } catch (err) {
    console.error('Erro ao inserir o todo:', err);
  } finally {
    client.close();
  }
}

async function Remove(todo, todoElement) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const result = await collection.deleteOne({ _id: todo._id });
    console.log(`${result.deletedCount} todo foi removido.`);
    removeTodoFromList(todoElement); // Remover da lista no DOM após remoção do banco
  } catch (err) {
    console.error('Erro ao remover o todo:', err);
  } finally {
    client.close();
  }
}

async function getTodos(userId) {
  console.log('Obtendo todos do MongoDB');
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db("test");
  const collection = db.collection("tarefas");

  try {
    const todos = await collection.find({ user: userId }).toArray();
    console.log('Todos obtidos:', todos);

    todos.forEach(function (todo) {
      addTodoToList(todo); // Adicionar cada todo à lista no DOM
    });
  } catch (err) {
    console.error('Erro ao obter os todos:', err);
  } finally {
    client.close();
  }
}
