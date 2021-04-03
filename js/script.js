(function dayToday() {
    const dayDiv = document.querySelector('.day');
    const daysArray = ['Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const dayToday = new Date().getDay();

    dayDiv.appendChild(document.createTextNode(daysArray[dayToday].toUpperCase()));
} ())

function clock() {
    const clockDiv = document.querySelector('.clock');

    const dateObj = new Date();

    const hours = (dateObj.getHours() < 10) ? '0' + dateObj.getHours() : dateObj.getHours(),
          minutes = (dateObj.getMinutes() < 10) ? '0' + dateObj.getMinutes() : dateObj.getMinutes(),
          seconds = (dateObj.getSeconds() < 10) ? '0' + dateObj.getSeconds() : dateObj.getSeconds();

    clockDiv.innerHTML = `${hours}:${minutes}:${seconds}`;
}
setInterval(clock, 1000);


class Task {
    constructor(title) {
        this.title = title;
    }
}

class UI {
    static addTaskToTheList(task) {
        const taskList = document.querySelector('.task-list');

        const li = document.createElement('li');
        li.className = 'task-item d-flex justify-content-between';
        li.innerHTML = `${task.title}<a href="#" class="delete">X</a>`;

        taskList.appendChild(li);
    }

    static removeTaskFromList(target) {
        if(target.classList.contains('delete')){
            target.parentElement.remove();
            UI.showAlert('Task removed', 'success');
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');

        div.className = `alert ${className}`;

        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const taskForm = document.querySelector('.task-form');

        container.insertBefore(div, taskForm);

        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000)
    }

    static clearField() {
        document.getElementById('task').value = '';
    }
}

class LocalStorage {
    static getTasksFromLocalStorage() {
        let tasks;

        if(localStorage.getItem('tasks') === null){
            tasks = [];
        }else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }

        return tasks;
    }

    static displayTaskFromLocalStorage() {
        let tasks = LocalStorage.getTasksFromLocalStorage();

        tasks.forEach((task) => {
            UI.addTaskToTheList(task);
        })
    }

    static addTaskToLocalStorage(task) {
        let tasks = LocalStorage.getTasksFromLocalStorage();

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static removeTaskFromLocalStorage(text) {
        let tasks = LocalStorage.getTasksFromLocalStorage();

        tasks.forEach((task, index) => {
            if(task.title === text){
                tasks.splice(index, 1)
            }
        })

        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
}

document.addEventListener('DOMContentLoaded', LocalStorage.displayTaskFromLocalStorage)

document.querySelector('.task-form').addEventListener('submit', function (e) {
    const title = document.getElementById('task').value;

    const task = new Task(title);

    if(title === ''){
        UI.showAlert('Please, fill the title field', 'error');
    }else{
        UI.addTaskToTheList(task);

        LocalStorage.addTaskToLocalStorage(task)

        UI.showAlert('Task added', 'success');

        UI.clearField();
    }

    e.preventDefault();
});

document.querySelector('.task-list').addEventListener('click', function (e) {
    UI.removeTaskFromList(e.target);

    LocalStorage.removeTaskFromLocalStorage(e.target.parentElement.firstChild.textContent);

    e.preventDefault();
})