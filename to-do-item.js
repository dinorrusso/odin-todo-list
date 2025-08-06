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
  }
  getTitle() {
    return this.#title;
  }
  getId() {
    return this.#id;
  }
  isImportant() {
    return this.#important;
  }
  isDone() {
    return this.#done;
  }
  toggleImportant() {
    this.#important = !this.#important;
  }
  getNote() {
    return this.#note;
  }
  getSubtasks() {
    return [...this.#subtasks];
  }
}
