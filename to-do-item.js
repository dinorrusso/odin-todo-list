export class Subtask {
  constructor(name, done = false) {
    this.name = name;
    this.done = done;
  }
}

export class ToDoItem {
  //private fields
  #title = '';
  #id = null;
  #dueDate = null;
  #important = false;
  #done = false;
  #myday = false;
  #note = '';
  #subtasks = [];


  constructor(title) {
    this.#title = title;
    this.#id = crypto.randomUUID();
    
    // console.log(`in constructor this ToDoItem =
    //     title:${this.#title}, 
    //     id: ${this.#id},
    //     due date: ${this.#dueDate},
    //     important: ${this.#important},
    //     done: ${this.#done},
    //     myday: ${this.#myday},
    //     note: ${this.#note},
    //     subtasks: ${this.#subtasks}`
    //   );
  }
  toggleImportant() {
    this.#important = !this.#important;
  }
}
