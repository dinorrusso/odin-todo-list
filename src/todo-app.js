// todo-app.js
import { ToDoList } from "./to-do-list.js";
import { ToDoItem } from "./to-do-item.js";
import { generateToDoItems } from "./test-data.js";
import { Sidebar } from "./SidebarView.js";
import {
  expandBtn,
  contractBtn,
  sidebar,
  todoCollection,
  predefinedListsContainer,
  userListsContainer,
  mainContent,
  addListDiv,
  newListDialog,
  taskListTitle,
} from "./ui-element-constants.js";

const TODO_LIST_COLLECTION = []; // all TODO Lists in the application
const ACTIVE_TODO_LIST = { todoList: null };

function todoController() {
  eventListeners();

  ////////////////////////// LOCAL FUNCTIONS ///////////////////////////
  function eventListeners() {
    taskListTitle.addEventListener("click", () => {
      taskListTitle.contentEditable = "true";
      taskListTitle.focus();
    });

    taskListTitle.addEventListener("blur", () => {
      taskListTitle.contentEditable = "false";
    });
    addListDiv.addEventListener("click", () => newListDialog.showModal());

    newListDialog.addEventListener("close", () => {
      if (newListDialog.returnValue !== "cancel") {
        const input = document.getElementById("inputField").value;
        const newList = new ToDoList(input);
        TODO_LIST_COLLECTION.push(newList);
        addUserList(newList);
      }
    });

    sidebar.addEventListener("click", function (event) {
      const item = event.target.closest(".user-list");
      if (item) {
        const lists = document.querySelectorAll(".user-list");
        lists.forEach((l) => {
          l.classList = "user-list";
        });
        item.classList.add("selected");

        let selectedList;
        const filterType = item.dataset.listName;

        if (filterType) {
          selectedList = getFilteredToDoList(filterType);
          ACTIVE_TODO_LIST.todoList = selectedList;
        } else {
          selectedList = TODO_LIST_COLLECTION.find(
            (list) => list.getId() === item.id
          );
          ACTIVE_TODO_LIST.todoList = selectedList;
        }

        if (selectedList) {
          clearToDoCollection();
          displayToDoList(selectedList);
        } else {
          console.warn("No matching ToDoList found for ID:", item.id);
        }
      }
    });

    todoCollection.addEventListener("click", function (event) {
      const todo = event.target.closest(".todo");
      if (todo && this.contains(todo)) {
        const todoId = todo.id;
        const notePanel = document.querySelector(".overlay-panel");
        notePanel.classList.add("open");
        const todoitems = ACTIVE_TODO_LIST.todoList.getToDoItems();
        const selectedToDoItem = todoitems.find(
          (list) => list.getId() === todo.id
        );
        if (selectedToDoItem) {
          console.log(`selectedToDoItem = `, selectedToDoItem);
        }
      }
    });

    expandBtn.addEventListener("click", () => {
      sidebar.classList.add("closed");
      expandBtn.classList.add("hide");
      contractBtn.classList.remove("hide");
    });
    contractBtn.addEventListener("click", () => {
      sidebar.className = "sidebar";
      expandBtn.classList.remove("hide");
      contractBtn.classList.add("hide");
    });
    const openNoteBtn = document.getElementById("opennote");
    openNoteBtn.addEventListener("click", () => {
      const notePanel = document.querySelector(".overlay-panel");
      notePanel.classList.add("open");
    });
    const closeNoteBtn = document.getElementById("closenote");
    closeNoteBtn.addEventListener("click", () => {
      const notePanel = document.querySelector(".overlay-panel");
      notePanel.className = "overlay-panel";
    });
  } //eventListeners

  function getFilteredToDoList(filterType) {
    const allItems = [];
    TODO_LIST_COLLECTION.forEach(list => {
      list.getToDoItems().forEach(item => {
        allItems.push(item);
      });
    });

    let filteredItems = [];
    let listName = "";

    if (filterType === "My Day") {
      filteredItems = allItems.filter(item => item.isMyDay());
      listName = "My Day";
    } else if (filterType === "Important") {
      filteredItems = allItems.filter(item => item.isImportant());
      listName = "Important";
    } else if (filterType === "Planned") {
      filteredItems = allItems.filter(item => item.getDueDate() !== null);
      listName = "Planned";
    } else if (filterType === "Tasks") {
      // This is a special case. "Tasks" is a real list, but we'll get it from the collection
      const tasksList = TODO_LIST_COLLECTION.find(list => list.getName() === "Tasks");
      if (tasksList) {
        filteredItems = tasksList.getToDoItems();
        listName = "Tasks";
      }
    } else {
      listName = "Unknown";
    }

    const filteredList = new ToDoList(listName, true);
    filteredItems.forEach(item => filteredList.addToDo(item));
    return filteredList;
  }

  function addPreDefinedList(listName, icon, iconColorHexStr, count = "") {
    const listItemDiv = document.createElement("div");
    listItemDiv.className = "user-list";
    listItemDiv.dataset.listName = listName;
    if(listName === ACTIVE_TODO_LIST.todoList?.getName()){
        listItemDiv.classList.add('selected');
    }
    let spanElement = document.createElement("span");
    spanElement.className = "material-symbols-outlined large-icon";
    spanElement.style.color = iconColorHexStr;
    spanElement.textContent = icon;
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "name";
    spanElement.textContent = listName;
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "count";
    spanElement.textContent = count;
    listItemDiv.appendChild(spanElement);
    predefinedListsContainer.appendChild(listItemDiv);
  }

  function addUserList(todoList) {
    const listItemDiv = document.createElement("div");
    listItemDiv.className = "user-list";
    listItemDiv.id = todoList.getId();
    if (ACTIVE_TODO_LIST.todoList && todoList.getId() === ACTIVE_TODO_LIST.todoList.getId()) {
      listItemDiv.classList.add("selected");
    }
    let spanElement = document.createElement("span");
    spanElement.className = "material-symbols-outlined large-icon";
    spanElement.textContent = "list";
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "name";
    spanElement.textContent = todoList.getName();
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "count";
    spanElement.textContent = "";
    listItemDiv.appendChild(spanElement);
    userListsContainer.appendChild(listItemDiv);
  }

  function clearToDoCollection() {
    const todoCollection = document.querySelector(".todo-collection");
    todoCollection.innerHTML = "";
  }
  
  function displayToDoList(todoList) {
    const title = document.querySelector(".task-list-title");
    title.textContent = todoList.getName();
    const toDoListArray = todoList.getToDoItems();
    const todoCollection = document.querySelector(".todo-collection");
    toDoListArray.forEach((item) => {
      let todoDiv = document.createElement("div");
      todoDiv.classList = "todo";
      todoDiv.id = item.getId();
      let span = document.createElement("span");
      span.classList = "material-symbols-outlined large-icon";
      span.textContent = item.isDone() ? "check_circle" : "circle";
      todoDiv.appendChild(span);
      span = document.createElement("span");
      span.classList = 'description"';
      span.textContent = item.getTitle();
      todoDiv.appendChild(span);
      span = document.createElement("span");
      span.classList = "material-symbols-outlined large-icon";
      span.textContent = "star";
      if (item.isImportant()) {
        span.classList.add("filled-icon");
      }
      todoDiv.appendChild(span);
      todoCollection.appendChild(todoDiv);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  const initialLists = generateTestLists();
  const allToDoItems = generateToDoItems(50);
  console.log(allToDoItems);

  // Add all the actual ToDoLists to the collection first so they are available for filtering
  initialLists.forEach(list => {
    TODO_LIST_COLLECTION.push(list);
  });
  
  // Calculate counts for the filtered views based on all items
  const allItems = initialLists.flatMap(list => list.getToDoItems());
  
  // Add the predefined filter views to the UI
  addPreDefinedList("My Day", "sunny", "#faaa15ff", allItems.filter(item => item.isMyDay()).length);
  addPreDefinedList("Important", "star", "#f40909", allItems.filter(item => item.isImportant()).length);
  addPreDefinedList("Planned", "calendar_today", "#07b724", allItems.filter(item => item.getDueDate() !== null).length);

  // Find the 'Tasks' list to display it under the filtered views
  const tasksList = initialLists.find(list => list.getName() === "Tasks");
  if (tasksList) {
    addPreDefinedList(tasksList.getName(), "inventory", "#5467ae", tasksList.getToDoItems().length);
  }

  // Add all the other user-defined lists to the user-defined container
  initialLists.filter(list => list.getName() !== "Tasks").forEach(list => {
    addUserList(list);
  });

  // Set an initial active list to display, which is the 'Tasks' list
  ACTIVE_TODO_LIST.todoList = tasksList;

  if (ACTIVE_TODO_LIST.todoList) {
    clearToDoCollection();
    displayToDoList(ACTIVE_TODO_LIST.todoList);
    const filterDiv = document.querySelector(`[data-list-name="${ACTIVE_TODO_LIST.todoList.getName()}"]`);
    if (filterDiv) {
      filterDiv.classList.add("selected");
    }
  }
}

//////////////////////////////////////////////////////////////////////////
//run the controller

todoController();