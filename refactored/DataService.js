// A new file: DataService.js

import { generateTestLists } from "./test-data.js";
import { ToDoList } from "./to-do-list.js";

export class DataService {
    
    constructor() {
        this.todoListCollection = [];
        this.activeTodoList = { todoList: null };
    }

    initializeData() {
        const initialLists = generateTestLists();
        this.todoListCollection = initialLists;
        
        // Set the initial active list
        const tasksList = this.todoListCollection.find(list => list.getName() === "Tasks");
        this.activeTodoList.todoList = tasksList;
    }

    getTodoListCollection() {
        return this.todoListCollection;
    }

    getActiveList() {
        return this.activeTodoList.todoList;
    }

    setActiveList(list) {
        this.activeTodoList.todoList = list;
    }

    addNewList(name) {
        const newList = new ToDoList(name);
        this.todoListCollection.push(newList);
        return newList;
    }
    getAllItems(){
        return this.todoListCollection.flatMap(list => list.getToDoItems());
    }
    
    getFilteredToDoList(filterType) {
        // The original filtering logic goes here
        // const allItems = this.todoListCollection.flatMap(list => list.getToDoItems());
        // ... (rest of the filtering logic from the original file)
        const filteredList = this.todoListCollection.find(list => list.getName() === filterType);
        this.activeTodoList.todoList = filteredList;
    }
    
    // ... Other data-related methods
}