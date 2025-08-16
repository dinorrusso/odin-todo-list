// TodoAppController.js
import { DataService } from "./DataService.js";
import { SidebarView } from "./SidebarView.js";
import { MainContentView } from "./MainContentView.js";
import { DetailView } from "./DetailView.js";
import { ModalView } from './ModalViews.js';
import { ToDoList } from "./to-do-list.js";
import { ToDoItem, Subtask } from "./to-do-item.js";

export class TodoAppController {
    constructor() {
        this.dataService = new DataService();
        this.sidebarView = new SidebarView(this.dataService, this); // Pass reference to itself
        this.mainContentView = new MainContentView(this.dataService, this);
        this.detailView = new DetailView(this.dataService, this);
        this.init();
    }

    init() {
        this.dataService.initializeData();
        this.mainContentView.renderActiveList();
    }
    // Method called by the SidebarView when a list is deleted NEEDS WORK
    handleListDeleted(listId){
        this.dataService.deleteListById(listId);
        location.reload();

    }
    // Method called by the SidebarView when a list is selected
    handleListSelected(listName) {
        this.dataService.setActiveListName(listName);
        this.mainContentView.renderActiveList();
        this.detailView.hideDetailPanel();
       
    }
    // Method called by the SidebarView when a new list is created
    handleNewListCreated(newList) {
        this.dataService.addNewList(newList);
        this.sidebarView.addUserList(newList);
        this.dataService.setActiveListName(newList);
        this.sidebarView.selectListInUI(newList);
        this.mainContentView.renderActiveList();
    }
    // Method called by the MainContentView when a todo item is selected
    handleTodoItemSelected(todoItem) {
        this.detailView.renderToDoItem(todoItem);
    }
    // Method called by the MainContentView or Detail View when a todo item is deleted
    handleTodoItemDeleted(todoItem) {
        this.dataService.deleteTodoById(todoItem.getId());
        this.dataService.savePersistentData();
        this.sidebarView.renderSidebar()
        this.mainContentView.renderActiveList();
        this.detailView.hideDetailPanel();
        //location.reload();
       
        
    }
    // Method called by the MainContentView or Detail View when a todo item state is changed
    handleToDoItemStateChanged(item){
        //need to refresh the sidebar, maincontent, and detail panel
        //save the state and reload
        this.dataService.savePersistentData();
        //this.dataService.getPersistentData();
        this.sidebarView.renderSidebar()
        this.mainContentView.renderActiveList();
        if (this.detailView.isOpen()) {
          this.detailView.renderToDoItem(item);
        }
        
    }
    //methods called by MainContentView when expand/contract selected
    handleExpandSelected(){
        this.sidebarView.hideSidebar();
    }
    handleContractSelected(){
        this.sidebarView.showSidebar();
    };
  //modal for a new ToDo
  handleAddItem() {
    const contentHtml = `
      <input type="text" class="modal-input" placeholder="Enter item name...">
    `;

    // The callback function will be executed when the user clicks 'Save'
    const onSaveCallback = (itemName) => {
      if (itemName) {
        let todo;
        let targetList;
        const activeList = this.dataService.activeTodoListName;
        switch (activeList) {
            case 'My Day':
                todo = new ToDoItem('Tasks', itemName);
                todo.setMyDay(true);
                targetList = this.dataService.getListByName('Tasks');
                targetList.addToDo(todo);
                break;
            case 'Important':
                todo = new ToDoItem('Tasks', itemName);
                todo.toggleImportant();
                targetList = this.dataService.getListByName('Tasks');
                targetList.addToDo(todo);
                break;
            case 'Planned':
                todo = new ToDoItem('Tasks', itemName);
                const date = new Date();         // create a Date object for now
                date.setDate(date.getDate() + 1); // add one to the day
                todo.setDueDate(date); 
                targetList = this.dataService.getListByName('Tasks');
                targetList.addToDo(todo);
                break;
            default:
                todo = new ToDoItem(activeList, itemName);
                targetList = this.dataService.getListByName(activeList);
                targetList.addToDo(todo);
            }
        
        this.dataService.savePersistentData();
        location.reload();

      }
    };

    new ModalView("Add New To-Do Item", contentHtml, onSaveCallback);
  }
  //modal for renaming a ToDo
  handleRenameList() {
    const contentHtml = `
      <input type="text" class="modal-input" placeholder="Enter new list name...">
    `;

    // The callback function will be executed when the user clicks 'Save'
    const onSaveCallback = (listName) => {
      if (listName) {
        //change the name of the active List
        //change the name of the actual list - which changes the tags of all 
        //items in the list
        const list = this.dataService.getListByName(this.dataService.activeTodoListName);
        list.setName(listName);
        //reset activeListName
        this.dataService.setActiveListName(listName);
        //display it
        this.mainContentView.renderActiveList();
        this.dataService.savePersistentData();
        location.reload();
      }
    };

    new ModalView("Rename List", contentHtml, onSaveCallback);
  }
}

