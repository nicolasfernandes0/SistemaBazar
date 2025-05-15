let notes = [];
let tasks = [];

function addNote() {
  const id = Date.now();
  const note = {
    id,
    title: "Nova Anotação",
    content: "",
    tags: [],
    important: false,
    date: new Date().toISOString()
  };
  notes.push(note);
  renderNotes();
}

function showNewTask() {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task show";
    taskDiv.innerHTML = `
    <div class="checklist-container">
        <h4>Tarefas:</h4>
        <div id="checklist-task-${Date.now()}"></div>
        <div class="add-task">
            <input type="text" id="newTask-${Date.now()}"       placeholder="Nova tarefa">
            <button onclick="addTask(null, this.parentElement.      parentElement, ${Date.now()})">Adicionar</button>
        </div>
        </div>
    <div class="actions">
        <button onclick="addTaskToList(this.parentElement.parentElement)">Salvar Tarefa</button>
        <button onclick="deleteTask(null, this.parentElement.parentElement)">🗑️</button>
    </div>
    <small>${new Date().toLocaleString()}</small>`;
    document.getElementById("tasks").appendChild(taskDiv);
}

function addTaskToList(taskElement) {
    const id = Date.now();
    const tasksList = Array.from(taskElement.querySelectorAll('.checklist-item')).map(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const text = item.querySelector('span').textContent;
    return { text, completed: checkbox ? checkbox.checked : false };
    });
    tasks.push({ id, title: "Tarefa", content: "", tasks: tasksList, date: new Date().toISOString() });
    renderTasks();
    taskElement.remove();
    }


function renderNotes() {
  const container = document.getElementById("notes");
  container.innerHTML = "";
  notes.forEach(note => {
    const noteEl = document.createElement("div");
    noteEl.className = "note";
    noteEl.innerHTML = `
      <h3 contenteditable="true" onblur="updateTitle(${note.id}, this.textContent)">${note.title}</h3>
      <textarea onblur="updateContent(${note.id}, this.value)">${note.content}</textarea>
      <div class="actions">
        <button onclick="toggleImportant(${note.id})">${note.important ? '⭐' : '☆'}</button>
        <button onclick="deleteNote(${note.id})">🗑️</button>
      </div>
      <small>${new Date(note.date).toLocaleString()}</small>
    `;
    container.appendChild(noteEl);
  });
}

function renderTasks() {
    const container = document.getElementById("tasks");
    container.innerHTML = "";
    tasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.innerHTML = `
        <h3>${task.title}</h3>
        <div class="checklist-container">
            <h4>Tarefas:</h4>
            <div id="checklist-${task.id}">
                ${renderChecklist(task.tasks, task.id)}
            </div>
        </div>
        <div class="actions">
            <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
        <small>${new Date(task.date).toLocaleString()}</small>`;
        container.appendChild(taskEl);
    });
}

function renderChecklist(tasksList, taskId) {
    return tasksList.map((task, index) => `
        <div class="checklist-item">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${taskId}, ${index})">
            <span>${task.text}</span>
        </div>
    `).join('');
    }

function updateTitle(id, newTitle) {
  const note = notes.find(n => n.id === id);
  if (note) note.title = newTitle;
}

function updateContent(id, newContent) {
  const note = notes.find(n => n.id === id);
  if (note) note.content = newContent;
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  renderNotes();
}

function deleteTask(id, taskElement) {
    if (id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    } else if (taskElement) {
        taskElement.remove();
    }
}

function addTask(taskId, taskElement, newTaskId) {
    const newTaskInput = document.getElementById(`newTask-${newTaskId}`);
    const newTaskText = newTaskInput.value.trim();
    if (newTaskText) {
        const checklistItem = document.createElement("div");
        checklistItem.className = "checklist-item";
        checklistItem.innerHTML = `
            <input type="checkbox" onchange="toggleTask(${taskId}, ${taskElement.querySelectorAll('.checklist-item').length})">
            <span>${newTaskText}</span>
        `;
        taskElement.querySelector(`#checklist-task-${newTaskId}`).appendChild(checklistItem);
        newTaskInput.value = "";
    }
}

function toggleTask(taskId, index) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.tasks[index]) {
    task.tasks[index].completed = !task.tasks[index].completed;
    renderTasks();
    }
}

function toggleImportant(id) {
  const note = notes.find(n => n.id === id);
  if (note) note.important = !note.important;
  renderNotes();
}

function searchNotes() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(keyword) || n.content.toLowerCase().includes(keyword)
    );
    const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(keyword) ||
    t.tasks.some(task => task.text.toLowerCase().includes(keyword))
    );
    const notesContainer = document.getElementById("notes");
    const tasksContainer = document.getElementById("tasks");
    notesContainer.innerHTML = "";
    tasksContainer.innerHTML = "";
    filteredNotes.forEach(note => {
        const noteEl = document.createElement("div");
        noteEl.className = "note";
        noteEl.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <div class="actions">
                <button onclick="deleteNote(${note.id})">🗑️</button>
            </div>
            <small>${new Date(note.date).toLocaleString()}</small>
        `;
        notesContainer.appendChild(noteEl);
    });
    filteredTasks.forEach(task => {
        const taskEl = document.createElement("div");
        taskEl.className = "task";
        taskEl.innerHTML = `
        <h3>${task.title}</h3>
        <div class="checklist-container">
            <h4>Tarefas:</h4>
            <div>
                ${renderChecklist(task.tasks, task.id)}
            </div>
        </div>
        <div class="actions">
            <button onclick="deleteTask(${task.id})">🗑️</button>
        </div>
        <small>${new Date(task.date).toLocaleString()}</small>
        `;
        tasksContainer.appendChild(taskEl);
    });
}

// Inicializa as notas e tarefas (pode ser carregamento de  localStorage no futuro)
renderNotes();
renderTasks();