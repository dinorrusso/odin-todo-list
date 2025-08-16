//MainContentView.js

import { ToDoItem } from "./to-do-item.js";
import { getFormattedDate } from "./UtilityFunctions.js";

export class MainContentView {
  constructor(dataService, controller) {
    this.controller = controller;
    this.dataService = dataService;
    this.mainContent = document.querySelector(".main-content");
    this.mainBottom = document.querySelector(".main-bottom");
    this.taskListHeader = this.createTaskListHeader();
    this.renderEmptyMainView();
    
    this.taskListTitle;
    this.mydaydateText;
    this.actionDiv;
    this.todoCollection;
    this.expandBtn;
    this.contractBtn;
    this.setupEventListeners();
  }
  createTaskListHeader(){
    const headerDiv = document.createElement("div");
    headerDiv.className = "task-list-header";
    const titleDiv = document.createElement("div");
    titleDiv.className = "task-list-title";
    headerDiv.appendChild(titleDiv);
    this.taskListTitle = titleDiv;
    const actionDiv = document.createElement("div");
    actionDiv.className = "material-symbols-outlined large-icon hide";
    actionDiv.textContent = "edit";
    headerDiv.appendChild(actionDiv);
    this.actionDiv = actionDiv;
    //
    const mydaydateDiv = document.createElement('div');
    mydaydateDiv.className = "mydaydate";
    mydaydateDiv.textContent =  "";
    this.mydaydateText = mydaydateDiv;
    headerDiv.appendChild(mydaydateDiv);

    //
    return headerDiv;
  }
  renderEmptyMainView() {
    //expand/contract buttons
    const expandButton = document.createElement("button");
    expandButton.id = "expand";
    let span = document.createElement("span");
    span.className = "material-symbols-outlined large-icon";
    span.textContent = "expand_content";
    expandButton.appendChild(span);
    this.mainContent.appendChild(expandButton);
    this.expandBtn = expandButton;

    const contractButton = document.createElement("button");
    contractButton.id = "contract";
    contractButton.className = "hide";
    span = document.createElement("span");
    span.className = "material-symbols-outlined large-icon";
    span.textContent = "collapse_content";
    contractButton.appendChild(span);
    this.mainContent.appendChild(contractButton);
    this.contractBtn = contractButton;

    //Title area
    this.mainContent.appendChild(this.taskListHeader);
    
    
    //this is for the selected To Do Items list
    const todoItemsDiv = document.createElement("div");
    todoItemsDiv.className = "todo-collection";
    this.mainContent.appendChild(todoItemsDiv);
    this.todoCollection = todoItemsDiv;

    //bottom area with add task button
    const addTaskDiv = document.createElement("div");
    addTaskDiv.className = "addtask";
    span = document.createElement("span");
    span.className = "material-symbols-outlined large-icon";
    span.textContent = "add";
    addTaskDiv.appendChild(span);
    span = document.createElement("span");
    span.textContent = "Add an Item";
    addTaskDiv.appendChild(span);
    //add the event listener
    addTaskDiv.addEventListener("click", () => {
        this.controller.handleAddItem();
    });
    this.mainBottom.appendChild(addTaskDiv);
  }
  //common activity to render the current (i.e. active) list
  renderActiveList() {
    const activeTodoListName = this.dataService.getActiveListName();
    this.clearToDoCollection();
    this.taskListTitle.textContent = activeTodoListName;
    if (activeTodoListName === 'My Day'){
      this.taskListTitle.textContent += " (" + getFormattedDate() + ")";
      }
    const todos = this.dataService.getNamedList(activeTodoListName);
    todos.forEach((item, index) => {
      this.addTodoItemToView(item);
    });
    //control which task list names can be edited
    switch (activeTodoListName) {
      //not editable
      case "My Day":
      case "Important":
      case "Planned":
      case "Tasks":
        this.actionDiv.className = "material-symbols-outlined large-icon hide";
        break;
      default:
        //editable
        this.actionDiv.className = "material-symbols-outlined large-icon";
        break;
    }

  }
  //populate the ui with the to do items
  addTodoItemToView(item) {
    let todoDiv = document.createElement("div");
    todoDiv.classList = "todo";
    todoDiv.id = item.getId();
    let span = document.createElement("span");
    span.classList = "material-symbols-outlined large-icon done";
    span.textContent = item.isDone() ? "check_circle" : "circle";
    todoDiv.appendChild(span);
    //
    span.addEventListener("click", (event) => {
      event.stopPropagation();
      item.toggleDone();
      this.controller.handleToDoItemStateChanged(item);
    });


    //
    span = document.createElement("span");
    span.classList = 'description"';
    span.textContent = item.getTitle();
    todoDiv.appendChild(span);
    span = document.createElement("span");
    span.classList = "material-symbols-outlined large-icon important";
    span.textContent = "star";
    if (item.isImportant()) {
      span.classList.add("filled-icon");
    }
    //add the event listener
    span.addEventListener("click", (event) => {
      event.stopPropagation();
      //parent has todo item is
      const parent = event.target.parentElement;
      // logic here for toggle important
      const todoItem = this.dataService.getTodoById(parent.id);
      todoItem.toggleImportant();
      this.controller.handleToDoItemStateChanged(todoItem);
    });

    todoDiv.appendChild(span);
    span = document.createElement("span");
    span.classList = "material-symbols-outlined large-icon delete";
    span.textContent = "delete";
    //add the event listener
    span.addEventListener("click", (event) => {
      event.stopPropagation();
      //parent has todo item is
      const parent = event.target.parentElement;
      // logic here for delete todo item
      const todoItem = this.dataService.getTodoById(parent.id);
      this.dataService.deleteTodoById(parent.id);
      this.controller.handleTodoItemDeleted(todoItem);
    });
    todoDiv.appendChild(span);
    this.todoCollection.appendChild(todoDiv);
  }
  // clear the ui
  clearToDoCollection() {
    this.todoCollection.innerHTML = "";
  }
  handleTodoItemClicked(event) {
    const item = event.target.closest(".todo");
    const todoItem = this.dataService.getTodoById(item.id);
    //highlight
    //turn off
    const todoItems = document.querySelectorAll(".todo");
    todoItems.forEach((t) => {
      t.classList = "todo";
    });
    item.classList.add("selected");
    //let the controller know to open the item in the detailView
    this.controller.handleTodoItemSelected(todoItem);
    // and show the todoItem
  }
  //Main Content View Event Handlers
  setupEventListeners() {
    // edit the Task List name
    this.actionDiv.addEventListener('click', () => {
      this.controller.handleRenameList();
    });

    this.todoCollection.addEventListener("click", (event) => {
      this.handleTodoItemClicked(event);
      // ... logic to open the detail view panel
      // and display content
    });
    // events for making task list expand/contract
    this.expandBtn.addEventListener("click", () => {
      this.controller.handleExpandSelected();
      this.expandBtn.classList.add("hide");
      this.contractBtn.classList.remove("hide");
    });
    this.contractBtn.addEventListener("click", () => {
      this.controller.handleContractSelected();
      this.expandBtn.classList.remove("hide");
      this.contractBtn.classList.add("hide");
    });
  }
}
