export class ToDoList {
  #name = '';
  #id = null;
  #predefined = false;
  #todos = [];
  
  constructor(name, predefined = false) {
    this.#name = name;
    this.#id = crypto.randomUUID();
    this.#predefined = predefined;
  }

   // Get all list  name
  getName() {
    return this.#name;
  }

  getId() {
    return this.#id;
  }
  
  // Get all projects (returns a shallow copy of the array)
  getToDoItems() {
    return [...this.#todos];
  }

  // Get a project by ID (returns the actual object)
  // getTodoListById(todoId) {
  //   return this.#todos.find(td => td.id === todoId);
  // }

  // Add a new todo item
  addToDo(todoItem) {
    this.#todos.push(todoItem);
  }

  // Remove a project by ID
  removeToDo(todoId) {
    this.#todos = this.#todos.filter(td => td.id !== todoId);
  }
}

