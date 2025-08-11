// A new file: TodoAppController.js

import { DataService } from './DataService.js';
import { SidebarView } from './SidebarView.js';
import { MainContentView } from './MainContentView.js';

export class TodoAppController {
    constructor() {
        this.dataService = new DataService();
        this.sidebarView = new SidebarView(this.dataService);
        this.mainContentView = new MainContentView(this.dataService);
        this.init();
    }

    init() {
        // Load initial data and render UI
        this.dataService.initializeData();
        this.sidebarView.renderInitialLists();
        this.mainContentView.renderActiveList();
        
        // Setup all event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // High-level event listeners that might coordinate between views
        this.sidebarView.on('list-selected', (list) => {
            this.dataService.setActiveList(list);
            this.mainContentView.renderActiveList();
        });
        
        // ... Other high-level listeners
    }
}