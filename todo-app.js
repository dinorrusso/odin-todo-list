import { ToDoList } from './to-do-list.js'
import { ToDoItem } from './to-do-item.js'
//import { createElement } from 'react';

const expandBtn = document.getElementById('expand');
const contractBtn = document.getElementById('contract');
const sidebar = document.querySelector('aside.sidebar');
const todoCollection = document.querySelector('.todo-collection');
const userListsContainer = document.querySelector('.user-lists-container');

//test the ToDoList functions
const testLists = [];
for (let i = 0; i < 5; i++) {
  const testList = new ToDoList(`NewList${i}`)
  testLists.push(testList);
}
//I should have an array of 5 todo lists
console.log('testLists=', testLists);
//now let's mess with a testList[0]
const firstList = testLists[0];

//test toDoItem and add 5 items
for (let i = 0; i < 5; i++) {
  const testItem = new ToDoItem(`This is a test To Do Item(${i});`)
  firstList.addToDo(testItem);
}
console.log(firstList);
//this all works

//lets see if we can populate some DOM stuff
for (let i = 0; i < 5; i++) {
  addUserList(testLists[i]);
}




//for fun, lets get an array of todos and see if we can work with them
const toDoListCopy = firstList.getToDos();
console.log(`toDoListCopy after getToDos:`,toDoListCopy);
//lets see if I can change a ToDoItem
console.log(`toDoListCopy[0] before toggle`, toDoListCopy[0]);
toDoListCopy[0].toggleImportant();
console.log(`toDoListCopy after toggle`, toDoListCopy);
console.log(`firstList after toggle:`, firstList);

////////////////////////////////////////////////////
function addUserList(todoList){
  const listItemDiv = document.createElement('div');
  listItemDiv.className = "user-list";
  let spanElement = document.createElement('span');
  spanElement.className = "material-symbols-outlined large-icon";
  spanElement.textContent = "list";
  listItemDiv.appendChild(spanElement);
  spanElement = document.createElement('span')
  spanElement.className = "name";
  spanElement.textContent = todoList.getName();
  listItemDiv.appendChild(spanElement);
  spanElement = document.createElement('span')
  spanElement.className = "count";
  spanElement.textContent = "";
  listItemDiv.appendChild(spanElement);
  userListsContainer.appendChild(listItemDiv);

}




/////////////////////////////////////////////////////

todoCollection.addEventListener("click", function(event){
  console.log(`todo clicked`);
    // Find the closest .card element (in case of nested elements in .card)
  const card = event.target.closest('.card');
  if (card && this.contains(card)) {
      const cardId = card.id; // This is the UUID
    // Use cardId to access your underlying data/model
    handleCardClick(cardId);
  }
});

function handleCardClick(cardId) {
// Your logic to handle the card click using the UUID
console.log('Card clicked:', cardId);
// Access your model data here
}

expandBtn.addEventListener("click", () => {
    console.log(`expand clicked`);
    sidebar.classList.add("closed");
    expandBtn.classList.add("hide");
    contractBtn.classList.remove("hide");
});

contractBtn.addEventListener("click", () => {
    console.log(`contract clicked`);
    sidebar.className = 'sidebar';
    expandBtn.classList.remove("hide");
    contractBtn.classList.add("hide");
});

const openNoteBtn = document.getElementById('opennote');
openNoteBtn.addEventListener("click", () => {
    console.log(`show note clicked`);
    const notePanel = document.querySelector(".overlay-panel");
    notePanel.classList.add("open");
});

const closeNoteBtn = document.getElementById('closenote');
closeNoteBtn.addEventListener("click", () => {
    console.log(`close note clicked`);
    const notePanel = document.querySelector(".overlay-panel");
    notePanel.className = 'overlay-panel';
});