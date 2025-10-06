// src/index.js
import {
    DOMController
} from "./domController";
import "./styles.css";

document.addEventListener("DOMContentLoaded", () => {
    const controller = new DOMController();
    controller.init();
})