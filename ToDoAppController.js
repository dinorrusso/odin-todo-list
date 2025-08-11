// TodoAppController.js
import { DataService } from "./DataService.js";
import { SidebarView } from "./SidebarView.js";
import { MainContentView } from "./MainContentView.js";
import { DetailView } from "./DetailView.js";

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

    // Method called by the SidebarView when a list is selected
    handleListSelected(listName) {
        this.dataService.setActiveListName(listName);
        this.mainContentView.renderActiveList();
        this.detailView.hide();
       
    }
    
    // Method called by the SidebarView when a new list is created
    handleNewListCreated(newList) {
        this.dataService.addNewList(newList);
        this.sidebarView.addUserList(newList);
        this.dataService.setActiveList(newList);
        this.sidebarView.selectListInUI(newList);
        this.mainContentView.renderActiveList();
    }
    // Method called by the MainContentView when a todo item is selected
    handleTodoItemSelected(todoItem) {
        console.log('in handleTodoItemSelected todoItem: ', todoItem);
        this.detailView.renderToDoItem(todoItem);
    }
    //methods called by MainContentView when expand/contract selected
    handleExpandSelected(){
        this.sidebarView.hideSidebar();
    }
    handleContractSelected(){
        this.sidebarView.showSidebar();
    };
}
