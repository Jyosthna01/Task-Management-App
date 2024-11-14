document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskButton = document.getElementById('addTaskButton');
    const taskList = document.getElementById('taskList');
    const searchBar = document.getElementById('searchBar');
    const noTasksMessage = document.getElementById('noTasksMessage');

    const showAllButton = document.getElementById('showAll');
    const showCompletedButton = document.getElementById('showCompleted');
    const showNotCompletedButton = document.getElementById('showNotCompleted');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks(filter = 'all') {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filter === 'completed') return task.completed;
            if (filter === 'notCompleted') return !task.completed;
            return true;
        });
        
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.dataset.id = task.id;
            li.className = task.completed ? 'completed' : '';
            
            const span = document.createElement('span');
            span.textContent = task.text;
            span.addEventListener('dblclick', () => enableEditMode(task.id));
            li.appendChild(span);
            
            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Undo' : 'Complete';
            completeButton.addEventListener('click', () => toggleComplete(task.id));
            li.appendChild(completeButton).style.backgroundColor="rgb(82 156 232)";
            
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => enableEditMode(task.id));
            li.appendChild(editButton).style.backgroundColor="#fcd112";
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(task.id));
            li.appendChild(deleteButton).style.backgroundColor="#E64833";

            taskList.appendChild(li);
        });
        
        noTasksMessage.style.display = filteredTasks.length ? 'none' : 'block';
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function toggleComplete(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        }
    }

    function enableEditMode(id) {
        const task = tasks.find(task => task.id === id);
        if (!task) return;

        const li = taskList.querySelector(`li[data-id='${id}']`);
        li.classList.add('editing');
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveEdit(id, input.value);
            if (e.key === 'Escape') renderTasks();
        });

        li.replaceChild(input, li.firstChild);
        input.focus();
    }

    function saveEdit(id, newText) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }

    searchBar.addEventListener('input', () => {
        const searchTerm = searchBar.value.toLowerCase();
        taskList.querySelectorAll('li').forEach(li => {
            const text = li.querySelector('span').textContent.toLowerCase();
            li.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });

    showAllButton.addEventListener('click', () => renderTasks('all'));
    showCompletedButton.addEventListener('click', () => renderTasks('completed'));
    showNotCompletedButton.addEventListener('click', () => renderTasks('notCompleted'));

    renderTasks();
});
