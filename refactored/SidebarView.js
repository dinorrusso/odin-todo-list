// A new file: SidebarView.js

import { predefinedListsContainer, userListsContainer, addListDiv, newListDialog } from "./ui-element-constants.js";
import { EventEmitter } from './utils.js'; // A simple event emitter utility

export class SidebarView extends EventEmitter {
    constructor(dataService) {
        super();
        this.dataService = dataService;
        this.setupEventListeners();
    }

    renderInitialLists() {
        const allLists = this.dataService.getTodoListCollection();
        const allItems = allLists.flatMap(list => list.getToDoItems());

        // Render predefined lists
        this.addPreDefinedList("My Day", "sunny", "#faaa15ff", allItems.filter(item => item.isMyDay()).length);
        this.addPreDefinedList("Important", "star", "#f40909", allItems.filter(item => item.isImportant()).length);
        this.addPreDefinedList("Planned", "calendar_today", "#07b724", allItems.filter(item => item.getDueDate() !== null).length);

        // Find and render 'Tasks'
        const tasksList = allLists.find(list => list.getName() === "Tasks");
        if (tasksList) {
            this.addPreDefinedList(tasksList.getName(), "inventory", "#5467ae", tasksList.getToDoItems().length);
        }

        // Render user-defined lists
        allLists.filter(list => !list.isPredefined() && list.getName() !== "Tasks").forEach(list => {
            this.addUserList(list);
        });

        // Set the initial selected state
        const activeList = this.dataService.getActiveList();
        if (activeList) {
            const selectedDiv = document.querySelector(`[data-list-name="${activeList.getName()}"]`);
            if (selectedDiv) {
                selectedDiv.classList.add("selected");
            }
        }
    }

    setupEventListeners() {
        addListDiv.addEventListener("click", () => newListDialog.showModal());
        
        // ... all sidebar-related click listeners
        predefinedListsContainer.addEventListener("click", this.handleListClick.bind(this));
        userListsContainer.addEventListener("click", this.handleListClick.bind(this));
        
        // ... dialog close listener
    }

    handleListClick(event) {
        const item = event.target.closest(".user-list");
        if (item) {
            // Un-select previous item and select the new one
            document.querySelectorAll(".user-list").forEach(l => l.classList.remove("selected"));
            item.classList.add("selected");

            let selectedList;
            if (item.dataset.listName) {
                selectedList = this.dataService.getFilteredToDoList(item.dataset.listName);
            } else {
                selectedList = this.dataService.getTodoListCollection().find(list => list.getId() === item.id);
            }
            
            this.emit('list-selected', selectedList); // Emit event for the controller
        }
    }
    
    addPreDefinedList(listName, icon, iconColorHexStr, count = "") {
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
    
    addUserList(todoList) {
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
}