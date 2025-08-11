//DetailView.js
export class DetailView {
    constructor(dataService, controller) {
        this.controller = controller;
        this.dataService = dataService;
        this.detailPanel = document.querySelector(".detail-panel");
        this.renderDetailPanel();

        this.setupEventListeners();
    }
    renderDetailPanel() {

    }
    hide(){
        this.detailPanel.className = "detail-panel";
        //takes off open
    }
    setupEventListeners() {
        //close DetailView
        const closeDetailPanelBtn = document.getElementById("closenote");
        closeDetailPanelBtn.addEventListener("click", () => {
            const detailPanel = document.querySelector(".detail-panel");
            detailPanel.className = "detail-panel";
        });
    }

    //common activity to render the todoItem clicked on
    renderToDoItem(item) {
        //open the panel
        const detailPanel = document.querySelector(".detail-panel");
        detailPanel.classList.add("open");
        //clear the panel content
        const detailContent = document.querySelector('.detail-content');
        detailContent.innerHTML = "";
        //Render the To Do Item heading
        detailContent.appendChild(this.renderToDoItemHeading(item));
        detailContent.appendChild(this.renderSubtasksSection(item));
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
        span.classList = "material-symbols-outlined large-icon";
        span.textContent = item.isDone() ? "check_circle" : "circle";
        //title
        todoItemTitleDiv.appendChild(span);
        span = document.createElement("span");
        span.classList = 'description"';
        span.textContent = item.getTitle();
        todoItemTitleDiv.appendChild(span);
        //important indicator
        span = document.createElement("span");
        span.classList = "material-symbols-outlined large-icon";
        span.textContent = "star";
        if (item.isImportant()) {
            span.classList.add("filled-icon");
        }
        todoItemTitleDiv.appendChild(span);
        return todoItemTitleDiv;
    }
    renderSubtasksSection(item){
        const subtaskDiv = document.createElement("div");
        subtaskDiv.classList = "subtasks"
        console.log('in render subtasks item:', item);
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
                span.classList = "material-symbols-outlined large-icon";
                span.textContent = "circle";
            //     if (s.done) {
            //         span.classList.add("filled-icon");
            //     }
                div.appendChild(span);
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
                subtaskDiv.appendChild(div);
            
            }
        return subtaskDiv;

        }
        
}

        
