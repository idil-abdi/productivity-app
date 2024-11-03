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

// pomodoro
const focusBtn = document.getElementById('focus')
const buttons = document.querySelectorAll('.p-btn')
const shortBtn = document.getElementById('shortbreak')
const longBtn = document.getElementById('longbreak')
const startBtn = document.getElementById('pomodoro-start-btn')
const reset = document.getElementById('pomodoro-reset-btn')
const pause = document.getElementById('pomodoro-pause-btn')
const time = document.getElementById('time')

let set;
let active = 'focus'
let count = 59;
let paused = true
let minCount = 59

time.textContent = `1:00:00`
const appendZero = (value) => {
    value = value < 10 ? `0${value}` : value;
    return value
}

reset.addEventListener('click', (
    resetTime = () => {
        pauseTimer();
        switch (active) {
            case 'long':
                minCount = 29
                break;
            case 'short':
                minCount = 14
                break;
            default:
                minCount = 59
                break;
        }
        count = 59;
        time.textContent = minCount < 10 ? `0${minCount + 1}:00` : `${minCount + 1}:00`
    }
))

const removeFocus = () => {
    buttons.forEach((btn)=> {
        btn.classList.remove('btn-focus')
    });
}

focusBtn.addEventListener('click', () => {
    removeFocus()
    focusBtn.classList.add('btn-focus')
    pauseTimer()
    count = 59;
    minCount = 59;
    time.textContent = `1:00:00`
})

shortBtn.addEventListener('click', () => {
    active = 'short'
    removeFocus()
    shortBtn.classList.add('btn-focus')
    pauseTimer()
    minCount = 14;
    count = 59;
    time.textContent = `${appendZero(minCount + 1)}:00`
})

longBtn.addEventListener('click', () => {
    active = 'long'
    removeFocus()
    longBtn.classList.add('btn-focus')
    pauseTimer()
    minCount = 29;
    count = 59;
    time.textContent = `${minCount + 1}:00`
})

pause.addEventListener('click',
    (pauseTimer = () => {
        paused = true;
        clearInterval(set)
        startBtn.classList.remove('pomodoro-hide')
        pause.classList.remove('pomodoro-show')
        reset.classList.remove('pomodoro-show')
    })
)

startBtn.addEventListener('click', () => {
    reset.classList.add('pomodoro-show')
    pause.classList.add('pomodoro-show')
    startBtn.classList.add('pomodoro-hide')
    startBtn.classList.remove('pomodoro-show')
    if (paused) {
        paused = false;
        time.textContent = `${appendZero(minCount)} : ${appendZero(count)}`
        set = setInterval(() => {
            count--
            time.textContent  = `${appendZero(minCount)} : ${appendZero(count)}`
            if (minCount == 0) {
                if(minCount != 0) {
                    minCount--
                    count = 60
                } else {
                    clearInterval(set)
                }
            }
        }, 1000)
    }    
})
// end of pomodoro

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