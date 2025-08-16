//DetailView.js
import { ToDoItem, Subtask } from "./to-do-item.js";
import { ModalView } from "./ModalViews.js";

const TEXT_AREA_ROWS = 5;
const TEXT_AREA_COLS = 40;

export class DetailView {
    constructor(dataService, controller) {
        this.controller = controller;
        this.dataService = dataService;
        this.detailPanel = document.querySelector(".detail-panel");
        this.renderDetailPanel();
        this.setupEventListeners();
        this.todoItem;
        this.dateText;
    }
    isOpen(){
        return this.detailPanel.className.includes("open");
    }
    renderDetailPanel() {
        const detailPanel = document.querySelector('.detail-panel');
        detailPanel.innerHTML = ''; // Clear any existing content

        // Create detail content div
        const detailContentDiv = document.createElement('div');
        detailContentDiv.className = 'detail-content';
        detailContentDiv.textContent = 'detail view content goes in here';

        // Create detail bottom div
        const detailBottomDiv = document.createElement('div');
        detailBottomDiv.className = 'detail-bottom';

        // Create the button
        const closeButton = document.createElement('button');
        closeButton.id = 'close-detail';

        // Create the span for the icon
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined large-icon';
        iconSpan.textContent = 'chevron_right';

        // Append everything
        closeButton.appendChild(iconSpan);
        // Add event listener for the close button
        closeButton.addEventListener('click', () => {
            // Logic to close the detail view
            this.hideDetailPanel();
        });
        detailBottomDiv.appendChild(closeButton);
        //new 
        const trashButton = document.createElement('button');
        trashButton.id = 'delete-todo';

        // Create the span for the icon
        const trashIconSpan = document.createElement('span');
        trashIconSpan.className = 'material-symbols-outlined large-icon';
        trashIconSpan.textContent = 'delete';
        trashButton.appendChild(trashIconSpan);
        trashIconSpan.addEventListener('click', (event) => {
            this.controller.handleTodoItemDeleted(this.todoItem);
        });
        detailBottomDiv.appendChild(trashButton)
        detailPanel.appendChild(detailContentDiv);
        detailPanel.appendChild(detailBottomDiv);
    }
    hideDetailPanel(){
        //takes off open in ClassName
        this.detailPanel.className = "detail-panel";
    }
    setupEventListeners() {
        //close DetailView
        const closeDetailPanelBtn = document.getElementById("close-detail");
        closeDetailPanelBtn.addEventListener("click", () => {
            const detailPanel = document.querySelector(".detail-panel");
            //takes off open in ClassName
            detailPanel.className = "detail-panel";
        });
    }
    //common activity to render the todoItem clicked on
    renderToDoItem(item) {
        //open the panel
        this.todoItem = item;
        const detailPanel = document.querySelector(".detail-panel");
        detailPanel.classList.add("open");
        //clear the panel content
        const detailContent = document.querySelector('.detail-content');
        detailContent.innerHTML = "";
        //Render the To Do Item heading
        detailContent.appendChild(this.renderToDoItemHeading(item));
        detailContent.appendChild(this.renderSubtasksSection(item));
        detailContent.appendChild(this.renderAddToMyDay(item));
        detailContent.appendChild(this.renderDueDate(item));
        detailContent.appendChild(this.renderNote(item));
    }
    renderToDoItemHeading(item){
        //Render the To Do Item heading
        // done indicator, title, and important indicator
        //const detailContent = document.querySelector('.detail-content');
        let todoItemTitleDiv = document.createElement("div");
        todoItemTitleDiv.classList = "todo-detail";
        todoItemTitleDiv.id = item.getId();
        //done indicator
        let span = document.createElement("span");
        span.classList = "material-symbols-outlined large-icon isdone";
        span.textContent = item.isDone() ? "check_circle" : "circle";
        //handle toggle done
        span.addEventListener("click", () => {
            item.toggleDone();
            this.controller.handleToDoItemStateChanged(item);
        });
        //title
        todoItemTitleDiv.appendChild(span);
        span = document.createElement("span");
        span.classList = 'description"';
        span.textContent = item.getTitle();
        todoItemTitleDiv.appendChild(span);
        //important indicator
        span = document.createElement("span");
        span.classList = "material-symbols-outlined large-icon isimportant";
        span.textContent = "star";
        if (item.isImportant()) {
            span.classList.add("filled-icon");
        }
        span.addEventListener("click", (event) => {
            item.toggleImportant();
            this.controller.handleToDoItemStateChanged(item);
    });
        todoItemTitleDiv.appendChild(span);
        return todoItemTitleDiv;
    }
    renderSubtasksSection(item){
        const subtaskDiv = document.createElement("div");
        subtaskDiv.classList = "subtasks"
        if (item.getSubtasks().length === 0){
            //no subtasks found - render a + Next Step 
            let div = document.createElement("div");
            div.classList = 'subtask add-subtask';
            let span = document.createElement("span");
            span.textContent = '+';
            div.appendChild(span);
            span = document.createElement("span");
            span.textContent = 'Add Subtask';
            div.appendChild(span)
            subtaskDiv.appendChild(div);
            //handle toggle done
            subtaskDiv.addEventListener("click", () => {
                this.handleAddSubtask(item);
                });
        }else {
            //there are 1 or more subtasks to show
            //render + add step 
            const subs = item.getSubtasks();
            // let div = document.createElement("div");
            // div.classList = 'subtask';
            subs.forEach((s, index) => {
                let div = document.createElement("div");
                div.classList = 'subtask';
                let span = document.createElement("span");
                span.classList = "material-symbols-outlined large-icon subtaskdone";
                span.textContent = s.done ? "check_circle" : "circle";"circle";
                div.appendChild(span);
                //handle toggle done
                span.addEventListener("click", () => {
                    s.done = !s.done;
                    this.controller.handleToDoItemStateChanged(item);
                    });
                span = document.createElement("span");
                span.textContent = s.name;
                div.appendChild(span);
                subtaskDiv.appendChild(div);

                     });
                let div = document.createElement('div');
                div.classList = "subtask next-subtask"
                let span = document.createElement("span");
                span.textContent = '+';
                div.appendChild(span);
                span = document.createElement("span");
                span.textContent = 'Next Subtask';
                div.appendChild(span);
                span.addEventListener("click", () => {
                    this.handleAddSubtask(item);
                    
                    });
                subtaskDiv.appendChild(div);
            
            }
        return subtaskDiv;

        }
    renderAddToMyDay(item){
        const myDayDiv = document.createElement("div");
        let text = "Add to My Day";
        myDayDiv.classList = "myday add";
        myDayDiv.dataset.mydata = item.getId();
        let span = document.createElement("span"); 
        if (item.isMyDay()) {
            span.classList = "material-symbols-outlined large-icon myday-set";
            text = "Added to My Day"
            } else {
                span.classList = "material-symbols-outlined large-icon myday-not-set";
            }
        span.textContent = "sunny";
        myDayDiv.appendChild(span);
        span = document.createElement("span"); 
        span.textContent = text;
        myDayDiv.appendChild(span);
        myDayDiv.addEventListener("click", () => {
            item.toggleMyDay();
            this.controller.handleToDoItemStateChanged(item);
            });
        return myDayDiv;
    }
    renderDueDate(item){
        const dueDateDiv = document.createElement("div");
        dueDateDiv.classList = "myday add";
        dueDateDiv.dataset.mydata = item.getId();
        let span = document.createElement("span"); 
        span.classList = "material-symbols-outlined large-icon";
        span.textContent = "calendar_today";
        dueDateDiv.appendChild(span);
        span = document.createElement("span"); 
        if(item.getDueDate()){
            span.textContent = "Due: " + item.getDueDate();
        }else{
            span.textContent = "Add Due Date";
        }
        this.dateText = span;
        dueDateDiv.appendChild(span);
        const dateInput = document.createElement("input");
        dateInput.className = "transparent-date";
        dateInput.id = "realDateInput";
        dateInput.type = "date";
        dateInput.addEventListener('change', (event) => {
            const selectedDate = event.target.value;
            item.setDueDate(selectedDate);
            this.dateText = "Due: " + selectedDate;
            this.controller.handleToDoItemStateChanged(item);
            });
        dueDateDiv.appendChild(dateInput);
        dueDateDiv.addEventListener("click", () => {
            dateInput.showPicker();
        });
        return dueDateDiv;
    }        
    renderNote(item){
        const noteTextAreaDiv = document.createElement("div");
        noteTextAreaDiv.className ="text-area-div";
        const span = document.createElement("span");
        span.textContent = 'This is a note'
        noteTextAreaDiv.appendChild(span);
        const noteTextArea = document.createElement("textarea");
        noteTextArea.classList = "note";
        noteTextArea.id = item.getId();
        noteTextArea.name = "todo-note";
        noteTextArea.rows = TEXT_AREA_ROWS;
        noteTextArea.cols = TEXT_AREA_COLS;
        noteTextArea.value = item.getNote();
        noteTextAreaDiv.appendChild(noteTextArea);
        noteTextArea.addEventListener("change", () => {
                    item.addNote(noteTextArea.value);
                    this.controller.handleToDoItemStateChanged(item);
                    });
        return noteTextAreaDiv;
    }  
    handleAddSubtask(item) {
        const contentHtml = `
          <input type="text" class="modal-input" placeholder="Enter new list name...">
        `;
    
        // The callback function will be executed when the user clicks 'Save'
        const onSaveCallback = (subtaskName) => {
          if (subtaskName) {
            //create a subtask
            const st = new Subtask(subtaskName);
            item.addSubtask(st);
            this.controller.handleToDoItemStateChanged(item);
          }
        };
    
        new ModalView("New Subtask", contentHtml, onSaveCallback);
      }
}

        
