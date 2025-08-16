// to-do-item.js
export class Subtask {
  constructor(name, done = false) {
    this.name = name;
    this.done = done;
  }
  toJSON() {
    return {
      name: this.name,
      done: this.done
    }
    
  }
}

export class ToDoItem {
  //private fields
  #tag;  //name of the List this item 'belongs to'
  #title = "";
  #id = null;
  #dueDate = null;
  #important = false;
  #done = false;
  #myday = false;
  #note = "";
  #subtasks = [];

  constructor(tag, title) {
    this.#tag = tag;
    this.#title = title;
    this.#id = crypto.randomUUID();
    this.#dueDate = "";
  }
  toJSON() {
    // Return a plain object with all the data needed to recreate the item
    return {
            tag: this.#tag,
            title: this.#title,
            id: this.#id,
            dueDate: this.#dueDate,
            important: this.#important,
            done: this.#done,
            myDay: this.#myday,
            note: this.#note,
            subtasks: this.#subtasks
    };
  }
  getTag() {
    return this.#tag;
  }
  setTag(listName) {
    this.#tag = listName;
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
  getImportant() {
    return this.#important;
  }
  setImportant(booleanFlag) {
    this.#important = booleanFlag;
  }
  isMyDay() {
    return this.#myday;
  }
  
  setMyDay(booleanFlag){
    this.#myday = booleanFlag;
  }
  setDone(booleanFlag){
    this.#done = booleanFlag;
  }
  isDone() {
    return this.#done;
  }
  toggleImportant() {
    this.#important = !this.#important;
  }
  toggleDone() {
    this.#done = !this.#done;
  }
  toggleMyDay() {
    this.#myday = !this.#myday;
  }
  getNote() {
    return this.#note;
  }
  getSubtasks() {
    return [...this.#subtasks];
  }

  // New methods for test data
  setDueDate(date) {
    this.#dueDate = date;
  }
  getDueDate() {
    return this.#dueDate;
  }

  addNote(note) {
    this.#note = note;
  }

  addSubtask(subtask) {
    this.#subtasks.push(subtask);
  }
}