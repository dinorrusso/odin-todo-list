//this needs to be fixed - it is NOT a singleton!!

export class ToDoList {
  #name = '';
  #todos = [];
  
  constructor(name) {
    this.#name = name;
    //console.log(`in constructor this.name=${this.#name}`)
  }

   // Get all list owner's name
  getName() {
    //console.log(`in getName, this.#identifier.name= ${this.#name}`);
    return this.#name;
  }
  
  // Get all projects (returns a shallow copy of the array)
  getToDos() {
    return [...this.#todos];
  }

  // Get a project by ID (returns the actual object)
  getTodoById(todoId) {
    return this.#todos.find(td => td.id === todoId);
  }

  // Add a new todo item
  addToDo(todoItem) {
    this.#todos.push(todoItem);
  }

  // Remove a project by ID
  removeToDo(todoId) {
    this.#todos = this.#todos.filter(td => td.id !== todoId);
  }
}

