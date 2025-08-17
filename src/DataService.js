// DataService.js

import { generateTestLists } from "./test-data.js";
import { ToDoList } from "./to-do-list.js";
import { ToDoItem, Subtask } from "./to-do-item.js";

export class DataService {
  constructor() {
    this.todoListCollection = []; //holds all ToDoItem
    this.listNames = new Set();
    this.activeTodoListName;
    this.initializeData();
  }
  initializeData() {
    if (localStorage.getItem("todoListCollection") === null) {
      //no persistent data - generate test data
      const initialLists = generateTestLists();
      this.todoListCollection = initialLists;
      this.activeTodoListName = "Tasks";
      this.savePersistentData();
    } else {
      //get persistent data
      this.getPersistentData();
    }
  }
  deleteListById(id) {
    // Filter the todoListCollection to create a new array
    // that includes all lists except the one with the matching id.
    this.todoListCollection = this.todoListCollection.filter(
      (list) => list.getId() !== id
    );
    // After modifying the collection, save the updated data to local storage.
    this.savePersistentData();
  }
  getAllItems() {
    return this.todoListCollection.flatMap((list) => list.getToDoItems());
  }
  getTodoListCollection() {
    return this.todoListCollection;
  }
  getActiveListName() {
    return this.activeTodoListName;
  }
  setActiveListName(name) {
    this.activeTodoListName = name;
    this.savePersistentData();
    this.getPersistentData();
  }
  addNewList(name) {
    const newList = new ToDoList(name);
    this.todoListCollection.push(newList);
    this.savePersistentData();
    this.getPersistentData();
    return newList;
  }
  getTaskList() {
    return this.todoListCollection.find((list) => list.getName() === "Tasks");
  }
  getListByName(name) {
    return this.todoListCollection.find((list) => list.getName() === name);
  }
  getNamedList(name) {
    const allItems = this.getAllItems();
    let list;
    switch (name) {
      case "My Day":
        list = allItems.filter((item) => item.isMyDay());
        break;
      case "Important":
        list = allItems.filter((item) => item.isImportant());
        break;
      case "Planned":
        list = allItems.filter((item) => item.getDueDate() !== null);
        break;
      default:
        list = allItems.filter((item) => item.getTag() === name);
    }
    return list;
  }
  getFilteredToDoList(name) {
    const allLists = this.getTodoListCollection();
    const allItems = allLists.flatMap((list) => list.getToDoItems());
    let filteredList = null;
    switch (name) {
      case "My Day":
        filteredList = allItems.filter((item) => item.isMyDay());
        break;
      case "Important":
        filteredList = allItems.filter((item) => item.isImportant());
        break;
      case "Planned":
        filteredList = allItems.filter((item) => item.getDueDate() !== null);
        break;
    }

    return filteredList;
  }
  getTodoById(id) {
    const allLists = this.getTodoListCollection();
    const allItems = allLists.flatMap((list) => list.getToDoItems());
    const todoItem = allItems.find((item) => item.getId() === id);
    return todoItem;
  }
  deleteTodoById(id) {
    //need to know what list it is in
    const todoItemToDelete = this.getTodoById(id);
    const listName = todoItemToDelete.getTag();
    const list = this.getListByName(listName);
    list.removeToDo(id);
  }
  savePersistentData() {
    localStorage.setItem(
      "todoListCollection",
      JSON.stringify(this.todoListCollection)
    );
    localStorage.setItem(
      "activeTodoListName",
      JSON.stringify(this.activeTodoListName)
    );
  }
  getPersistentData() {
    const storedLists = JSON.parse(localStorage.getItem("todoListCollection"));

    if (storedLists) {
      this.todoListCollection = storedLists.map((listData) => {
        // Use the static "fromJSON" method to revive the list while preserving its ID
        const revivedList = ToDoList.fromJSON(listData);

        // Check if there are any to-do items to revive
        if (listData.todos && listData.todos.length > 0) {
          const revivedItems = listData.todos.map((itemData) => {
            // Create a new ToDoItem instance with the correct constructor arguments
            const revivedItem = new ToDoItem(itemData.tag, itemData.title);

            // Manually restore all other properties from the saved data
            revivedItem.id = itemData.id; // Restore original ID
            revivedItem.setMyDay(itemData.myDay);
            revivedItem.setDone(itemData.done);
            revivedItem.setImportant(itemData.important);
            revivedItem.setDueDate(itemData.dueDate);
            revivedItem.addNote(itemData.note);

            // Revive the nested subtasks
            if (itemData.subtasks && itemData.subtasks.length > 0) {
              itemData.subtasks.forEach((subtaskData) => {
                const revivedSubtask = new Subtask(
                  subtaskData.name,
                  subtaskData.done
                );
                revivedItem.addSubtask(revivedSubtask);
              });
            }

            return revivedItem;
          });

          // Use the public "addToDo" method to correctly populate the private #todos array
          revivedItems.forEach((item) => revivedList.addToDo(item));
        }

        return revivedList;
      });
    }

    // Restore the active list name
    this.activeTodoListName =
      JSON.parse(localStorage.getItem("activeTodoListName")) || "Tasks";
  }
}
