//MainContentView.js

export class MainContentView {
    constructor(dataService, controller) {
        this.controller = controller;
        this.dataService = dataService;
        this.mainContent = document.querySelector(".main-content");
        this.mainBottom = document.querySelector(".main-bottom");
        this.renderEmptyMainView();
        this.taskListTitle;
        this.todoCollection;
        this.expandBtn;
        this.contractBtn;
        this.setupEventListeners();
    }
    renderEmptyMainView(){
        //expand/contract buttons
        const expandButton = document.createElement('button');
        expandButton.id = 'expand';
        let span = document.createElement('span');
        span.className = "material-symbols-outlined large-icon";
        span.textContent = "expand_content";
        expandButton.appendChild(span);
        this.mainContent.appendChild(expandButton);
        this.expandBtn = expandButton;

        const contractButton = document.createElement('button');
        contractButton.id = 'contract';
        contractButton.className = "hide";
        span = document.createElement('span');
        span.className = "material-symbols-outlined large-icon";
        span.textContent = "collapse_content";
        contractButton.appendChild(span);
        this.mainContent.appendChild(contractButton);
        this.contractBtn = contractButton;

        //Title area
        const titleDiv = document.createElement('div');
        titleDiv.className = "task-list-title";
        this.mainContent.appendChild(titleDiv);
        this.taskListTitle = titleDiv;
        //this is for the selected To Do Items list
        const todoItemsDiv = document.createElement('div');
        todoItemsDiv.className = "todo-collection";
        this.mainContent.appendChild(todoItemsDiv);
        this.todoCollection = todoItemsDiv;

        //bottom area with add task button
        const addTaskDiv = document.createElement('div');
        addTaskDiv.className = "addtask";
        span = document.createElement('span');
        span.className = "material-symbols-outlined large-icon";
        span.textContent = "add";
        addTaskDiv.appendChild(span);
        span = document.createElement('span');
        span.textContent = "Add a Task";
        addTaskDiv.appendChild(span);
        this.mainBottom.appendChild(addTaskDiv);
    
    }
   
    //common activity to render the current (i.e. active) list
    renderActiveList() {

        const activeTodoListName = this.dataService.getActiveListName();
        this.clearToDoCollection();
        this.taskListTitle.textContent = activeTodoListName;

        const todos = this.dataService.getNamedList(activeTodoListName);
        todos.forEach((item, index) => {
            this.addTodoItemToView(item);
            });
    }

    //populate the ui with the to do items
    addTodoItemToView(item) {
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
      this.todoCollection.appendChild(todoDiv);
    }

    // clear the ui
    clearToDoCollection() {
        this.todoCollection.innerHTML = "";
    }
    handleTodoItemClicked(event){
        console.log('in handleTodoItemClicked(event) in Main')
        const item = event.target.closest(".todo");
        const todoItem = this.dataService.getTodoById(item.id);
        //highlight
        //turn off 
        const todoItems = document.querySelectorAll('.todo');
        todoItems.forEach(t => {
            t.classList = 'todo';
            });
        item.classList.add('selected');
        //let the controller know to open the item in the detailView
        this.controller.handleTodoItemSelected(todoItem);
        // and show the todoItem

}
    //Main Content View Event Handlers
    setupEventListeners() {
        // edit the Task List name
        this.taskListTitle.addEventListener("click", () => {
            this.taskListTitle.contentEditable = "true";
            this.taskListTitle.focus();
        });

        this.taskListTitle.addEventListener("blur", () => {
            this.taskListTitle.contentEditable = "false";
        });
        
        this.todoCollection.addEventListener("click", (event) => {
            this.handleTodoItemClicked(event);
            // ... logic to open the detail view panel
            // and display content
        });
        // events for making task list expand/contract
        this.expandBtn.addEventListener("click", () => {
              this.controller.handleExpandSelected()
              this.expandBtn.classList.add("hide");
              this.contractBtn.classList.remove("hide");
            });
        this.contractBtn.addEventListener("click", () => {
            this.controller.handleContractSelected();
            this.expandBtn.classList.remove("hide");
            this.contractBtn.classList.add("hide");
            });

        // open todo item detail  
        // const openNoteBtn = document.getElementById("opennote");
        // openNoteBtn.addEventListener("click", () => {
        //     const notePanel = document.querySelector(".detail-panel");
        //     notePanel.classList.add("open");
        // });
        
    }
        
}