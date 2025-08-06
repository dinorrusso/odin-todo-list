import { ToDoList } from "./to-do-list.js";
import { ToDoItem } from "./to-do-item.js";
import { ACTIVE_TODO_LIST, ALL_TASK_LISTS } from "./to-do-list-collections.js";
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
  taskListTitle
} from './ui-element-constants.js';

function todoController() {
  //setup event listeners
  eventListeners();

  

  ////////////////////////// LOCAL FUNCTIONS ///////////////////////////
function eventListeners() {
    function handleCardClick(cardId) {
      // Your logic to handle the card click using the UUID
      console.log("Card clicked:", cardId);
      // Access your model data here
    }
    /////////////////////////////////////////////////////
    // NEEDS WORK - this is meant to handle enabling 
    // editing of the title but it does not apply to all targets
taskListTitle.addEventListener('click', () => {
      taskListTitle.contentEditable = 'true';
      taskListTitle.focus();
});

// When the div loses focus, make it non-editable again
//TODO: need to change the actual todolist name and update the ui 
taskListTitle.addEventListener('blur', () => {
  taskListTitle.contentEditable = 'false';

  // TODO: Optionally, update your data or save the content here
  //console.log('Updated title:', taskListTitle.textContent);
});
    addListDiv.addEventListener('click', () => newListDialog.showModal());

    newListDialog.addEventListener('close', () => {
      //console.log('newListDialog.returnValue:', newListDialog.returnValue);
      if (newListDialog.returnValue === 'cancel') {
        //console.log('User cancelled');
      } else {
        const input = document.getElementById('inputField').value;
        //console.log('User input:', input);
        //create the new list
        const newList = new ToDoList(input);
        ALL_TASK_LISTS.push(newList);
        addUserList(newList);
      }
});
    //this event listener is to react to a task list being selected in the sidebar
    //what should happen?
    // 1) what was clicked?  assuming it was a user-list...
    // 2) deselect all user-list items
    // 3) 'select' the clicked list
    // 4) the side effect of this is that we need to
    // clear the main area and display the contents of the selected
    // user-list

    sidebar.addEventListener("click", function (event) {
      console.log('sidebar event:', event);
      // 1) Find the closest .user-list
      const item = event.target.closest(".user-list");
      if (item) {
        console.log("item.id=", item.id);
        // 2) deselect all
        const lists = document.querySelectorAll(".user-list");
        lists.forEach((l) => {
          l.classList = "user-list";
        });
        // 3) select clicked 
        item.classList.add("selected");

        // Find the corresponding ToDoList object in ALL_TASK_LISTS
        const selectedList = ALL_TASK_LISTS.find(
          (list) => list.getId() === item.id
        );
        ACTIVE_TODO_LIST = selectedList;
        // console.log("ALL_TASK_LISTS=", ALL_TASK_LISTS);
        // console.log("selectedList=", selectedList);

        // Check if a list was found before proceeding
        if (selectedList) {
          //need to clear the div first
          clearToDoCollection();
          displayToDoList(selectedList); // Now you are passing the ToDoList object
        } else {
          console.warn("No matching ToDoList found for ID:", item.id);
        }
      }
    });
    // This event handler is for detecting and reacting to a todo div
    // being clicked 
    // right now it has no real functionality but it should open 
    // the side panel to display the to-do-item details
    todoCollection.addEventListener("click", function (event) {
      console.log('todoCollection Event:', event);
      // Find the closest .todo element 
      const todo = event.target.closest(".todo");
      console.log("todo =", todo);
      if (todo && this.contains(todo)) {
        
        const todoId = todo.id; // This is the UUID of the to-do-item 
        console.log(`show note clicked - todo.id =`, todo.id);
        //open side panel 
        const notePanel = document.querySelector(".overlay-panel");
        notePanel.classList.add("open");
        // Use todo.id to access your underlying data/model
        // Find the corresponding ToDoList object in ACTIVE_TODO_LIST
        console.log(ACTIVE_TODO_LIST);
        const todoitems = ACTIVE_TODO_LIST.getToDoItems();
        console.log(todoitems);
        const selectedToDoItem = todoitems.find(
          (list) => list.getId() === todo.id
        );
        //populate the overlay panel 
        console.log(`before if, selectedToDoItem = `, selectedToDoItem);
        if (selectedToDoItem){
          console.log(`selectedToDoItem = `, selectedToDoItem);
        }
      }
    });
    //event handler for making the main area wider/hiding sidebar
    expandBtn.addEventListener("click", () => {
      console.log(`expand clicked`);
      sidebar.classList.add("closed");
      expandBtn.classList.add("hide");
      contractBtn.classList.remove("hide");
    });
    //event handler for making the main area narrower/showing sidebar
    contractBtn.addEventListener("click", () => {
      console.log(`contract clicked`);
      sidebar.className = "sidebar";
      expandBtn.classList.remove("hide");
      contractBtn.classList.add("hide");
    });
    //event handler for making the overlay panel open
    // REMOVE
    const openNoteBtn = document.getElementById("opennote");
    openNoteBtn.addEventListener("click", () => {
      console.log(`show note clicked`);
      const notePanel = document.querySelector(".overlay-panel");
      notePanel.classList.add("open");
    });
    //event handler for making the overlay panel close
    const closeNoteBtn = document.getElementById("closenote");
    closeNoteBtn.addEventListener("click", () => {
      console.log(`close note clicked`);
      const notePanel = document.querySelector(".overlay-panel");
      notePanel.className = "overlay-panel";
    });
  } //eventListeners
  ////////////////////////////////////////////////////
  //this adds a pre-defined to-do-list to the UI sidebar
  function addPreDefinedList(todoList, icon, iconColorHexStr, count = "") {
    const listItemDiv = document.createElement("div");
    listItemDiv.className = "user-list";
    listItemDiv.id = todoList.getId();
    let spanElement = document.createElement("span");
    spanElement.className = "material-symbols-outlined large-icon";
    spanElement.style.color = iconColorHexStr;
    spanElement.textContent = icon;
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "name";
    spanElement.textContent = todoList.getName();
    listItemDiv.appendChild(spanElement);
    spanElement = document.createElement("span");
    spanElement.className = "count";
    spanElement.textContent = count;
    listItemDiv.appendChild(spanElement);
    predefinedListsContainer.appendChild(listItemDiv);
  }
  ////////////////////////////////////////////////////
  //this adds a user-defined to-do-list to the UI sidebar
  function addUserList(todoList) {
    const listItemDiv = document.createElement("div");
    listItemDiv.className = "user-list";
    listItemDiv.id = todoList.getId();
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
    todoCollection.innerHTML="";
  }
  function displayToDoList(todoList) {
    //this works but needs some more work
    //needs section for completed
    //needs different icons depending on item state
    console.log("in displayToDoList(todoList)", todoList);
    const title = document.querySelector(".task-list-title");
    title.textContent = todoList.getName();
    const toDoListArray = todoList.getToDoItems();
    //display the to-do-items
    const todoCollection = document.querySelector(".todo-collection");
    toDoListArray.forEach((item, index) => {
      console.log(`Item at index ${index}:`, item);
      let todoDiv = document.createElement("div");
      todoDiv.classList = "todo";
      console.log(`in displayToDoList item=`, item, item.id);
      todoDiv.id = item.getId();
      console.log(`Item at index ${index}:`, item);
      let span = document.createElement("span");
      span.classList = "material-symbols-outlined large-icon";
      span.textContent = "circle";
      todoDiv.appendChild(span);
      span = document.createElement("span");
      span.classList = 'description"';
      span.textContent = item.getTitle();
      todoDiv.appendChild(span);
      span = document.createElement("span");
      span.classList = "material-symbols-outlined large-icon";
      span.textContent = "star";
      todoDiv.appendChild(span);
      todoCollection.appendChild(todoDiv);
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////////
  //setup the sidebar
  //this assumes nothing already exists so I am creating the predefined To Do Lists
  const myDay = new ToDoList("My Day", true);
  ALL_TASK_LISTS.push(myDay);
  addPreDefinedList(myDay, "sunny", "#faaa15ff");
  const important = new ToDoList("Important", true);
  ALL_TASK_LISTS.push(important);
  addPreDefinedList(important, "star", "#f40909");
  const planned = new ToDoList("Planned", true);
  ALL_TASK_LISTS.push(planned);
  addPreDefinedList(planned, "calendar_today", "#07b724");
  const tasks = new ToDoList("Tasks", true);
  ALL_TASK_LISTS.push(tasks);
  addPreDefinedList(tasks, "inventory","#5467ae", 10);
  //  now create some user defined lists 
  for (let i = 0; i < 5; i++) {
    const testList = new ToDoList(`NewList[${i}]`);
    ALL_TASK_LISTS.push(testList);
  }

  //now let's mess with a testList[3] which would be Tasks
  const thisList = ALL_TASK_LISTS[3];
  console.log("ALL_TASK_LISTS[0]", thisList);
  //add 5 to-do-items
  for (let i = 0; i < 5; i++) {
    const testItem = new ToDoItem(`This is a test To Do Item(${i}) in Tasks`);
    thisList.addToDo(testItem);
  }
  console.log(thisList);
  //this all works 5 to do's added

  //lets see if we can populate the rest of the sidebar
  for (let i = 4; i < ALL_TASK_LISTS.length; i++) {
    addUserList(ALL_TASK_LISTS[i]);
  }
//hokey but it works and here is teh list in the main area
  const toDoListCopy = thisList.getToDoItems();
  displayToDoList(thisList);


  //for fun, lets get an array of todos and see if we can work with them
  console.log(`toDoListCopy after getToDoItems:`, toDoListCopy);
  //lets see if I can change a ToDoItem
  console.log(`toDoListCopy[0] before toggle`, toDoListCopy[0]);
  toDoListCopy[0].toggleImportant();
  console.log(`toDoListCopy[0] after toggle`, toDoListCopy[0]);
  console.log(`thisList after toggle:`, thisList);
  
  
}

//////////////////////////////////////////////////////////////////////////
//run the controller
todoController();
