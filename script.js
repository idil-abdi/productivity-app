// Notes
const noteBtnEl = document.getElementById("note-btn");
const appEl = document.getElementById("app");

getNotes().forEach((note) => {
  const noteEl = createNoteEl(note.id, note.content);
  appEl.insertBefore(noteEl, noteBtnEl);
});

function createNoteEl(id, content) {  
  const element = document.createElement("textarea");
  element.classList.add("note");
  element.placeholder = "Empty Note";
  element.value = content;
  

  element.addEventListener("dblclick", () => {
    const warning = confirm("Do you want to delete this note?");
    if (warning) {
      deleteNote(id, element);
    }
  });

  element.addEventListener("input", () => {
    updateNote(id, element.value);
  });

  return element;
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note)=>note.id != id)
    saveNote(notes)
    appEl.removeChild(element)
}

function updateNote(id, content) {
  const notes = getNotes();
  const target = notes.filter((note) => note.id == id)[0];
  target.content = content;
  saveNote(notes);
}

function addNote() {
  const notes = getNotes();
  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    content: "",
  };
  const noteEl = createNoteEl(noteObj.id, noteObj.content);
  appEl.insertBefore(noteEl, noteBtnEl);

  notes.push(noteObj);

  saveNote(notes);
}

function saveNote(notes) {
  localStorage.setItem("note-app", JSON.stringify(notes));
}

function getNotes() {
  return JSON.parse(localStorage.getItem("note-app") || "[]");
}

noteBtnEl.addEventListener("click", addNote);

// End of Notes

// To Do List 

let tasks = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedTasks = JSON.parse(localStorage.getItem('task'))
    
    if (storedTasks) {
        storedTasks.forEach((task) => tasks.push(task))
        updateTasksList()
    }
})



const saveTasks = () => {
    localStorage.setItem('task', JSON.stringify(tasks))
}


const addTask = () => {
    const taskInput = document.getElementById('task-input');
    const text = taskInput.value.trim()

    if (text) {
        tasks.push({text: text, completed: false})
        taskInput.value =''
        updateTasksList()
        saveTasks()
    }    
}

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed
    updateTasksList()
    saveTasks()
};

const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList()
    saveTasks()
}

const editTask = (index) => {
    const taskInput = document.getElementById('task-input')
    taskInput.value = tasks[index].text

    tasks.splice(index,1)
    updateTasksList()
    
    saveTasks()
}

const updateTasksList = () => {
    const taskList = document.getElementById('task-list')
    taskList.innerHTML = ''

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li')

        listItem.innerHTML = `
        <div class="taskItem">
            <div class="task ${task.completed ? 'completed' : ''}">
                <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                <p>${task.text}</p>
            </div>
            <div class="icons">
                <img src="./img/tabler--edit.png"  alt="edit-icon" onClick='editTask(${index})'>
                <img src="./img/bin.png" alt="bin-icon"  onClick='deleteTask(${index})'>
                
            </div>
        </div>
        `;
        listItem.addEventListener('change', () => toggleTaskComplete(index))
        taskList.append(listItem)
    });
}

document.getElementById('new-task').addEventListener('click', (e) => {
    e.preventDefault()

    addTask();
})


// End of To Do List