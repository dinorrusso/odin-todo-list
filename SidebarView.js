//SidebarView.js
export class SidebarView{
    constructor(dataService, controller) {
        this.dataService = dataService;
        this.controller = controller;
        this.predefinedListsContainer = document.querySelector(".predefined-lists-container");
        this.userListsContainer = document.querySelector(".user-lists-container");
        this.addListDiv = document.querySelector('.sidebar-bottom .addlist');

        this.sidebar = document.querySelector("aside.sidebar");
        this.newListDialog = document.getElementById('newListDialog');
        this.newListDialog = this.createDialog(); // Create the dialog and store it
        document.body.appendChild(this.newListDialog); // Append it to the body
        this.setupUiElements();
        this.setupEventListeners();
    }

    showSidebar(){
      this.sidebar.className = "sidebar";
    }
    hideSidebar(){
      this.sidebar.classList.add("closed");
    }
    
    setupUiElements(){
      const allItems = this.dataService.getAllItems();//get all To Do Items
      // Add the predefined filter views to the UI
      this.addPreDefinedList("My Day", "sunny", "#faaa15ff", allItems.filter(item => item.isMyDay()).length);
      this.addPreDefinedList("Important", "star", "#f40909", allItems.filter(item => item.isImportant()).length);
      this.addPreDefinedList("Planned", "calendar_today", "#07b724", allItems.filter(item => item.getDueDate() !== null).length);

      // Find the 'Tasks' list to display it under the filtered views
      const tasksList = this.dataService.getTaskList();
      if (tasksList) {
        this.addPreDefinedList(tasksList.getName(), "inventory", "#5467ae", tasksList.getToDoItems().length);
      }
  
    
      // Render user-defined lists not named Tasks after the break
        const allLists = this.dataService.getTodoListCollection();
        allLists.filter(list => list.getName() !== "Tasks").forEach(list => {
            this.addUserList(list);
        });
    }//setupUiElements

  
  createDialog() {
    const dialog = document.createElement('dialog');
    dialog.id = 'newListDialog';

    const form = document.createElement('form');
    form.method = 'dialog';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'inputField';
    input.placeholder = 'Enter New List Name';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';

    const cancelButton = document.createElement('button');
    cancelButton.formMethod = 'dialog';
    cancelButton.value = 'cancel';
    cancelButton.textContent = 'Cancel';

    form.appendChild(input);
    form.appendChild(submitButton);
    form.appendChild(cancelButton);

    dialog.appendChild(form);
    return dialog;
  }
    //
    setupEventListeners(){
      
      //sidebar list selection
      const sidebarContentDiv = document.querySelector('.sidebar');
      sidebarContentDiv.addEventListener('click', (event) => this.handleListClicked(event));
      //sidebar + New List and resulting diialog
      this.addListDiv.addEventListener("click", () => this.newListDialog.showModal());
      this.newListDialog.addEventListener("close", () => {
        if (this.newListDialog.returnValue !== "cancel") {
          const input = document.getElementById("inputField").value;
          const newList = this.dataService.addNewList(input);
          this.addUserList(newList);
        }
      });
    }//setupEventListeners

    //add a predefined list
    addPreDefinedList(listName, icon, iconColorHexStr, count = "") {
        const listItemDiv = document.createElement("div");
        listItemDiv.className = "user-list";
        listItemDiv.dataset.listName = listName;
        // if(listName === ACTIVE_TODO_LIST.todoList?.getName()){
        //     listItemDiv.classList.add('selected');
        // }
        if(listName === this.dataService.getActiveListName()){
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
        this.predefinedListsContainer.appendChild(listItemDiv);
      }
    //add a user defined list
    addUserList(todoList) {
      
        const listItemDiv = document.createElement("div");
        listItemDiv.className = "user-list";
        listItemDiv.id = todoList.getId();
        //if(listItemDiv. === this.dataService.getActiveListName()){
        //     listItemDiv.classList.add('selected');
        // }
        let spanElement = document.createElement("span");
        spanElement.className = "material-symbols-outlined large-icon";
        spanElement.textContent = "list";
        listItemDiv.appendChild(spanElement);
        spanElement = document.createElement("span");
        spanElement.className = "name";
        spanElement.textContent = todoList.getName();
        //highlight if Active
        if (todoList.getName() === this.dataService.getActiveListName()){
          listItemDiv.classList.add('selected');
        }
        listItemDiv.appendChild(spanElement);
        spanElement = document.createElement("span");
        spanElement.className = "count";
        spanElement.textContent = todoList.getLength();
        listItemDiv.appendChild(spanElement);

        //add delete 
        spanElement = document.createElement("span");
        spanElement.className = "material-symbols-outlined large-icon";
        spanElement.textContent = "delete";
        spanElement.addEventListener("click", (event) => {
          
          const parent = event.target.parentElement;
          console.log('trash clicked - parent : ', parent);
          console.log('trash clicked - parent id : ', parent.id);
          event.stopPropagation();
          this.controller.handleListDeleted(parent.id);
          
        });

        listItemDiv.appendChild(spanElement);
        

        //
        this.userListsContainer.appendChild(listItemDiv);
    }
    
    //handle selecting a list name in the sidebar
    handleListClicked(event){
      const item = event.target.closest(".user-list");
      //selection indicated by a background 
      // clear all 
      if (item) {
        const lists = document.querySelectorAll(".user-list");
        lists.forEach((l) => {
          l.classList = "user-list";
        });
        //add background
        item.classList.add("selected");
        
         //Interesting situation here
        //we will always have a name but in the case of filtered view no id
        
        const nameSpan = item.querySelector('.name');
        const nameText = nameSpan ? nameSpan.textContent : null;
        this.controller.handleListSelected(nameText);
      }
    }
}
