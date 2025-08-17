// to-do-list.js
export class ToDoList {
  #name = "";
  #id = null;
  #predefined = false;
  #todos = []; //collection of ToDoItem

  constructor(name, predefined = false) {
    this.#name = name;
    this.#id = crypto.randomUUID();
    this.#predefined = predefined;
  }
// A static "factory" method for reviving objects from JSON
    static fromJSON(data) {
        // Create an empty instance, bypassing the constructor's logic
        const list = new ToDoList(data.name || 'Untitled'); // Pass a default name
        
        // Manually set the private fields from the saved data
        list.#name = data.name;
        list.#id = data.id; // Use the STORED ID
        list.#predefined = data.predefined;
        list.#todos = []; // Start with an empty array
        
        return list;
    }
  // Get all list  name
  getName() {
    return this.#name;
  }
  setName(name) {
    this.#name = name;
    //iterate through each list-item and change the list-item tag to 
    //match the new name
     this.#todos.forEach((item) => {
        item.setTag(name);
    });
  }

  getId() {
    return this.#id;
  }

  isPredefined() {
    return this.#predefined;
  }

  // Get all projects (returns a shallow copy of the array)
  getToDoItems() {
    return [...this.#todos];
  }

  //Get a ToDoItem by ID (returns the actual object)
  getToDoItemById(todoId) {
    return this.#todos.find((td) => td.id === todoId);
  }

  // Add a new ToDoItem
  addToDo(todoItem) {
    this.#todos.push(todoItem);
  }

  // Remove a ToDoItem by ID
  removeToDo(todoId) {
    this.#todos = this.#todos.filter((td) => td.getId() !== todoId); // Use td.getId()
  }
 
  getLength(){
    return this.#todos.length;
  }
  toJSON() {
        return {
          name: this.#name,
          id: this.#id,
          predefined: this.#predefined,
          todos : this.#todos
        };
    }

  
}

