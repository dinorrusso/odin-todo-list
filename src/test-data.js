// test-data.js
import { ToDoList } from "./to-do-list.js";
import { ToDoItem, Subtask } from "./to-do-item.js";
/**
 * Generates all ToDoItems and organizes them into a collection of ToDoLists.
 * @returns {Array<ToDoList>} An array containing all real ToDoList objects.
 */
export function generateTestLists() {
  const allToDoLists = [];

  //create the list types , i.e. names for todo lists which are views
  const tasks = new ToDoList("Tasks");
  const groceries = new ToDoList("Groceries");
  const personalProjects = new ToDoList("Personal Projects");
  const workoutPlan = new ToDoList("Workout Plan");

  allToDoLists.push(tasks, groceries, personalProjects, workoutPlan);

  // --- Create ToDoItems and add them to their respective lists ---
  // Tasks list items
  const item1 = new ToDoItem('Tasks', "Plan daily tasks" );
  item1.setMyDay(true);
  tasks.addToDo(item1);

  const item2 = new ToDoItem('Tasks', "Review meeting notes");
  item2.toggleImportant(); // Make this important
  tasks.addToDo(item2);

  const item3 = new ToDoItem('Tasks', "Reply to emails");
  tasks.addToDo(item3);

  const item4 = new ToDoItem('Tasks', "Update documentation");
  tasks.addToDo(item4);

  // Groceries list items
  const item5 = new ToDoItem('Groceries', "Buy milk");
  groceries.addToDo(item5);

  const item6 = new ToDoItem('Groceries', "Get fresh vegetables");
  groceries.addToDo(item6);

  const item7 = new ToDoItem('Groceries', "Pick up bread");
  groceries.addToDo(item7);

  // Personal Projects list items
  const item8 = new ToDoItem('Personal Projects', "Finish project proposal");
  item8.toggleImportant(); // Make this important
  personalProjects.addToDo(item8);

  const item9 = new ToDoItem('Personal Projects', "Build personal website");
  item9.addNote("Remember to add a portfolio section.");
  item9.addSubtask(new Subtask("Design layout"));
  item9.addSubtask(new Subtask("Develop frontend"));
  personalProjects.addToDo(item9);

  // Workout Plan list items
  const item10 = new ToDoItem('Workout Plan', "Morning run (30 min)");
  item10.setMyDay(true);
  workoutPlan.addToDo(item10);

  const item11 = new ToDoItem('Workout Plan', "Strength training (upper body)");
  workoutPlan.addToDo(item11);

  const item12 = new ToDoItem('Workout Plan', "Schedule team sync");
  item12.setDueDate(new Date(2025, 7, 10)); // August 10, 2025
  workoutPlan.addToDo(item12);
  console.log('in generateTestLists allToDoList: ', allToDoLists);
  return allToDoLists;
}



