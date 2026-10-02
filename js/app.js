'use strict';

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const loadSamplesBtn = document.getElementById('loadSamplesBtn');
const taskList = document.getElementById('taskList');
const taskMessage = document.getElementById('taskMessage');
const totalCount = document.getElementById('totalCount');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');

let taskCounter = 0;

function createTaskElement(taskText, taskId) {
  const taskItem = document.createElement('li');
  taskItem.className = 'task-item';
  taskItem.dataset.taskId = taskId;
  taskItem.dataset.state = 'pending';

  const taskTextSpan = document.createElement('span');
  taskTextSpan.className = 'task-text';
  taskTextSpan.textContent = taskText;

  const completeBtn = document.createElement('button');
  completeBtn.type = 'button';
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = 'Complete';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'edit-btn';
  editBtn.textContent = 'Edit';

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'remove-btn';
  removeBtn.textContent = 'Remove';

  taskItem.appendChild(taskTextSpan);
  taskItem.appendChild(completeBtn);
  taskItem.appendChild(editBtn);
  taskItem.appendChild(removeBtn);

  return taskItem;
}

function addTask(taskText) {
  const cleanText = taskText.trim();

  if (cleanText === '') {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  taskCounter += 1;
  const taskId = `task-${taskCounter}`;
  const taskItem = createTaskElement(cleanText, taskId);

  taskList.appendChild(taskItem);
  taskInput.value = '';
  taskMessage.textContent = '';
  updateTaskCounts();
}

function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle('completed');

  const isCompleted = taskItem.classList.contains('completed');
  taskItem.dataset.state = isCompleted ? 'completed' : 'pending';

  updateTaskCounts();
}

function beginTaskEdit(taskItem) {
  const taskTextSpan = taskItem.querySelector('.task-text');
  const editBtn = taskItem.querySelector('.edit-btn');

  if (!taskTextSpan || !editBtn) {
    return;
  }

  const currentText = taskTextSpan.textContent;

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'edit-input';
  editInput.value = currentText;

  taskItem.replaceChild(editInput, taskTextSpan);
  editBtn.textContent = 'Save';
  editInput.focus();
}

function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector('.edit-input');
  const editBtn = taskItem.querySelector('.edit-btn');

  if (!editInput || !editBtn) {
    return;
  }

  const newText = editInput.value.trim();

  if (newText === '') {
    taskMessage.textContent = 'Task cannot be empty';
    return;
  }

  const newTaskTextSpan = document.createElement('span');
  newTaskTextSpan.className = 'task-text';
  newTaskTextSpan.textContent = newText;

  taskItem.replaceChild(newTaskTextSpan, editInput);
  editBtn.textContent = 'Edit';
  taskMessage.textContent = '';
  updateTaskCounts();
}

// --- Remove ---
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

// --- Counts ---
function updateTaskCounts() {
  const taskItems = Array.from(taskList.querySelectorAll('.task-item'));

  const total = taskItems.length;
  const completed = taskItems.filter(
    (taskItem) => taskItem.dataset.state === 'completed'
  ).length;
  const pending = total - completed;

  totalCount.textContent = String(total);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
}

function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest('.task-item');

  if (!taskItem) {
    return;
  }

  if (target.matches('.complete-btn') || target.classList.contains('complete-btn')) {
    toggleTaskComplete(taskItem);
  } else if (target.matches('.edit-btn') || target.classList.contains('edit-btn')) {
    if (target.textContent.trim() === 'Edit') {
      beginTaskEdit(taskItem);
    } else {
      saveTaskEdit(taskItem);
    }
  } else if (target.matches('.remove-btn') || target.classList.contains('remove-btn')) {
    removeTask(taskItem);
  }
}

function loadSampleTasks() {
  const sampleTasks = [
    'Review DOM selectors',
    'Practice createElement',
    'Study event delegation'
  ];

  const fragment = document.createDocumentFragment();

  sampleTasks.forEach((sampleText) => {
    taskCounter += 1;
    const taskId = `task-${taskCounter}`;
    const taskItem = createTaskElement(sampleText, taskId);
    fragment.appendChild(taskItem);
  });

  taskList.appendChild(fragment);
  updateTaskCounts();
}

addTaskBtn.addEventListener('click', () => {
  addTask(taskInput.value);
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask(taskInput.value);
  }
});

loadSamplesBtn.addEventListener('click', loadSampleTasks);

taskList.addEventListener('click', handleTaskListClick);

updateTaskCounts();