//index.js 
import './styles/reset.css';
import './styles/styles.css';

import avatarImage from './Avatar_with_bg.png';  // If you want to use Webpack to bundle images
const avatarImgElement = document.querySelector('.avatar-image');
if (avatarImgElement) {
  avatarImgElement.src = avatarImage; // Webpack replaces this with the correct URL
}

import { TodoAppController } from "./ToDoAppController.js";

const myApp = new TodoAppController();