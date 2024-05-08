void function () {
  'use scrict';

  const addTodoBtn = document.querySelector('.add-todo-button');
  const tasksRow = document.querySelector('.tasks-row');
  const tasksContainer = document.querySelector('.tasks-container');
  const clearAllBtn = document.querySelector('.clear-all-btn');
  const addTodoInput = document.querySelector('.add-todo input');
  const tasksKey = 'todo-items';

  function generateId() {
    return Date.now()
  }

  function clearRow() {
    if (tasksRow.children.length === 0) {
      tasksContainer.style.display = 'none';
    } else {
      tasksContainer.style.display = 'block';
    }
  }

  function getData() {
    return JSON.parse(localStorage.getItem(tasksKey)) || [];
  }

  function setData(data, id, isDone) {
    const savedData = getData();
    const newData = [...savedData, { id: id, description: data, isDone: isDone }]
    localStorage.setItem(tasksKey, JSON.stringify(newData))
  }

  function deleteData(taskIdd) {
    const savedData = getData();
    const newData = savedData.filter(({id}) => id != taskIdd);
    localStorage.setItem(tasksKey, JSON.stringify(newData))
  }

  function deleteAllData() {
    localStorage.removeItem(tasksKey);
  }

  function isTaskChecked(task) {
    if (task.isDone === true) {
      return 'checked';
    }
  }

  function setLineThrough(task) {
    if (task.isDone === true) {
      return 'task-done';
    }
    else return '';
  }

  function addTodoTask() {
    let addTodoInput = document.querySelector('.add-todo input');
    let taskTemplate = `
        <div class="task-content">
          <div class="checkbox-wrapper">
            <input type="checkbox">
          </div>
          <div class="content-partition"></div>
          <p class="task-description" contenteditable="false">${addTodoInput.value}</p>
        </div>
        <div class="task-icons">
          <img class="pencil-icon" src="./icons/pencil.svg" alt="">
          <img class="garbage-icon" src="./icons/garbare-can.svg" alt="">
          <img class="checkmark-icon" src="./icons/checkmark-black.svg" alt="">
        </div>`
    let taskWrap = document.createElement('div');
    taskWrap.classList.add('task');
    taskWrap.setAttribute('task-id', generateId())
    taskWrap.innerHTML = taskTemplate;
    if (addTodoInput.value.trim() !== '') {
      tasksRow.prepend(taskWrap);
      setData(addTodoInput.value, generateId(), false);
      addTodoInput.value = '';
      clearRow();
    }
  }

  addTodoBtn.addEventListener('click', () => {
    addTodoTask();
  })

  addTodoInput.addEventListener('keypress', ({key}) => {
    if(key === 'Enter') {
      addTodoTask();
    }
  })

  function generateTask() {
    const savedData = getData().reverse();
    const tasksTemplate = savedData.reduce((acc, item) => {
      acc += `<div class="task ${setLineThrough(item)}" task-id="${item.id}">
                <div class="task-content">
                  <div class="checkbox-wrapper">
                   <input type="checkbox" ${isTaskChecked(item)}>
                  </div>
                  <div class="content-partition"></div>
                  <p class="task-description" contenteditable="false">${item.description}</p>
                </div>
                <div class="task-icons">
                  <img class="pencil-icon" src="./icons/pencil.svg" alt="">
                  <img class="garbage-icon" src="./icons/garbare-can.svg" alt="">
                  <img class="checkmark-icon" src="./icons/checkmark-black.svg" alt="">
                </div>
              </div>`
      return acc;
    }, '')

    tasksRow.innerHTML = tasksTemplate;
  }

  document.addEventListener('DOMContentLoaded', () => {
    generateTask();
    clearRow();
  })

  tasksRow.addEventListener('click', ({ target }) => {
    const clickedGarbage = target.classList.contains('garbage-icon');
    const clickedPencil = target.classList.contains('pencil-icon');
    const clickedCheckmark = target.classList.contains('checkmark-icon');
    const taskElement = target.closest('.task');
    const checkbox = taskElement.querySelector('.checkbox-wrapper input[type="checkbox"]');
    const taskId = taskElement.getAttribute('task-id')
    const targetDesc = taskElement.querySelector('.task-description');
    const data = getData();
    const task = data.find(({ id }) => id == taskId)
    if (clickedCheckmark && taskElement) {
      targetDesc.setAttribute('contenteditable', false);
    }

    if (checkbox.checked && taskElement) {
      taskElement.classList.add('task-done');
      taskElement.classList.add('task-done-hovered')
      taskElement.classList.remove('task-hovered')
      taskElement.classList.remove('task-edit')
      task.isDone = true;
      localStorage.setItem(tasksKey, JSON.stringify(data));

    } else if (!checkbox.checked && taskElement && !taskElement.classList.contains('task-edit')) {
      taskElement.classList.remove('task-done')
      taskElement.classList.add('task-hovered')
      task.isDone = false;
      localStorage.setItem(tasksKey, JSON.stringify(data));
    } else if (!checkbox.checked && taskElement) {
      taskElement.classList.remove('task-done')
      taskElement.classList.remove('task-done-hovered')
    }

    if (clickedPencil && taskElement) {
      const targetDesc = taskElement.querySelector('.task-description')
      targetDesc.setAttribute('contenteditable', true);
      const isEditAllowed = targetDesc.getAttribute('contenteditable');
      const targetCheckmark = taskElement.querySelector('.checkmark-icon');
      if (isEditAllowed) {
        taskElement.classList.add('task-edit');
        taskElement.classList.remove('task-hovered');
        targetCheckmark.addEventListener('click', () => {
          const editedDesc = taskElement.querySelector('.task-description').textContent
          taskElement.classList.add('task-hovered');
          taskElement.classList.remove('task-edit');
          const data = getData();
          const currentTask = data.find(({ id }) => id == taskId);
          currentTask.description = editedDesc;
          localStorage.setItem(tasksKey, JSON.stringify(data));

        })
      }
    }

    if (clickedGarbage && taskElement) {
      const taskId = taskElement.getAttribute('task-id')
      taskElement.remove();
      deleteData(taskId);
      clearRow()
    }
  })


  clearAllBtn.addEventListener('click', () => {
    deleteAllData();
    tasksRow.innerHTML = '';
    clearRow();
  })

  clearRow();
}()