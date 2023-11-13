
console.clear()
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';
import { faker } from "https://cdn.skypack.dev/@faker-js/faker";

const localStorageData = JSON.parse(localStorage.getItem('myPomidoro'));

if(!localStorageData){
    localStorage.setItem('myPomidoro', JSON.stringify([[],[]]))
} else {
  console.log('storage myPomidoro exists!');
}
const pendingTasks = localStorageData[0];
const finishedTasks = localStorageData[1];

// const  = document.querySelector('.')
const themeColors = ["RoyalBlue","Gold","DarkGreen", "#222831", "DarkOrange"]
const bgEl = document.querySelector('.bg')
const closeBtnEl = document.querySelector('.close-btn')
const modalEl = document.querySelector('.modal')
const timeSetupModalEl = document.querySelector('.time_setup_modal')
const timeSetupCloseBtn = document.querySelector('.close-btn-time')
const timeSetupEl = document.querySelector('.time-set_up')


const tasksEl = document.querySelector('.image-tasks')
const pendingEl = document.querySelector('.started-list')
const finishedEl = document.querySelector('.finished-list')
const secondsEl = document.querySelector('.seconds-arrow')
const minutesEl = document.querySelector('.minutes-arrow')
const timerEl = document.querySelector('.timer')
const playEl = document.querySelector('.play')
const pauseEl = document.querySelector('.pause')
const stopEl = document.querySelector('.stop')
const currentTaskEl = document.querySelector('.current-task')
const themeEl = document.querySelector('.themes')
const saveEl = document.querySelector('.save')
const inputFieldEl = document.querySelector("input");
const tinePluckEl = document.querySelector('.tine-pluck')
const pipeBlowEl = document.querySelector('.pipe-blow')
const hitHighEl = document.querySelector('.hit-high')
const pianoSoundEl = document.querySelector('.piano-sound')

const testConfettiEl = document.querySelector('.one')
const clockfaceEl = document.querySelector('.timer-bg')

const tinePluckSound = new Audio('https://raw.githubusercontent.com/jvin08/sounds/master/_tine_pluck.mp3');
const hitHighSound = new Audio('https://raw.githubusercontent.com/jvin08/sounds/master/hit_high.mp3');
const PianoSound = new Audio('https://raw.githubusercontent.com/jvin08/sounds/master/piano-2.mp3');
const PipeBlowSound = new Audio('https://raw.githubusercontent.com/jvin08/sounds/master/pipe_blow.mp3');
const CheeringSound = new Audio('https://raw.githubusercontent.com/jvin08/sounds/master/cheering.mp3')


for (let i = 0; i < themeEl.children.length; i++) {
themeEl.children[i].addEventListener('click', (event) => {
    document.body.style.backgroundColor = themeColors[i];
  });
}

closeBtnEl.addEventListener('click', toggleModal)
tasksEl.addEventListener('click', toggleModal)
playEl.addEventListener('click', startTimer)
pauseEl.addEventListener('click', pauseTimer)
stopEl.addEventListener('click', stopTimer)
timeSetupEl.addEventListener('click', toggleTimeSetUpModal)
timeSetupCloseBtn.addEventListener('click', toggleTimeSetUpModal)
saveEl.addEventListener('click', collectTimeSettings)
tinePluckEl.addEventListener('click', ()=>{tinePluckSound.play()})
hitHighEl.addEventListener('click', ()=>{hitHighSound.play()})
pianoSoundEl.addEventListener('click', ()=>{PianoSound.play()})
pipeBlowEl.addEventListener('click', ()=>{PipeBlowSound.play()})
testConfettiEl.addEventListener('click', lunchSession)

renderPending()
renderFinished()

function toggleModal(){
  modalEl.classList.toggle('hidden')
}
function toggleTimeSetUpModal(){
  timeSetupModalEl.classList.toggle('hidden')
}

function createTaskElement(task, eventHandler, parent){
  let taskEl = document.createElement("li")
  let trashEl = document.createElement('img')
  trashEl.src = "https://raw.githubusercontent.com/jvin08/pomodoro/main/trash.png"
  trashEl.alt = "trash-can"
  trashEl.style.width = "40px"
  trashEl.className = "trash"
  taskEl.id = task.uuid
  if(parent.className==='started-list'){
    taskEl.addEventListener('click', addTaskToScreen)
    trashEl.style.display = "none"
  }
  if(parent.className==='finished-list'){
   taskEl.addEventListener('click', eventHandler)
   trashEl.style.display = "block"
  }
  taskEl.textContent = task.taskText
  taskEl.append(trashEl)
  taskEl.draggable = 'true'
  parent.append(taskEl)
  return taskEl
}

function changeBodyColor(color){
  document.querySelector('body').style.backgroundColor = color
}

function addTaskToScreen(e){
  currentTaskEl.innerText = e.target.innerText
  const messageEl = document.querySelector('.message-pending')
  messageEl.innerText = 'You can see it now on dashboard'
  messageEl.style.color = 'red'
  setTimeout(()=>{
    messageEl.innerText = 'Click task to put on dashboard'
    messageEl.style.color = 'grey'
  }, 2000)
  taskSetUp = true
}

//creating new task
function handleEnterBtn(){
    if(inputFieldEl.value){
    const newTask =  {
      taskText: inputFieldEl.value,
      uuid: uuidv4(),
    }
    addToLocalStorage(newTask)
    }  
  inputFieldEl.value = ''
}

// drag drop task from pending to trash
document.ondragstart = function(event) {
  event.dataTransfer.setData("html", event.target.id);
};
document.ondragover = function(event) {
  event.preventDefault();
};
document.ondrop = function(event) {
  event.preventDefault();
  if ( event.target.className === "finished-container" || event.target.className === "trash-table") {
    const id = event.dataTransfer.getData("html");
    pendingTaskHandler(event)
  }
};

function pendingTaskHandler(e){
  // let id = e.target.id || e.target.parentElement.id
  const id = event.dataTransfer.getData("html");
  console.log(id)
  //add task to finished Tasks list
  let removedTaskIndex = pendingTasks.findIndex(task => id === task.uuid )
  let taskMovingToFinished = pendingTasks[removedTaskIndex]
  finishedTasks.unshift(taskMovingToFinished)
  //remove task from pending Tasks list
  pendingTasks.splice(removedTaskIndex, 1)
  localStorage.setItem('myPomidoro', JSON.stringify(localStorageData))
  renderPending()
  renderFinished()
}

function deleteTaskCompletely(e){
  let id = e.target.id || e.target.parentElement.id
  let taskToBeDeletedIndex = finishedTasks.findIndex(task => task.uuid === e.target.id)
  console.log('taskToBeDeletedIndex: ' + taskToBeDeletedIndex)
  finishedTasks.splice(taskToBeDeletedIndex, 1)
  localStorage.setItem('myPomidoro', JSON.stringify(localStorageData))
  renderFinished()
}

function addToLocalStorage(task){
  //adding new task to pending storage
  pendingTasks.unshift(task)
  localStorage.setItem('myPomidoro', JSON.stringify(localStorageData))
}

function renderPending(){
  pendingEl.textContent = ''
  //render if tasks exist
  pendingTasks && pendingTasks.forEach((task)=>{
  createTaskElement(task, pendingTaskHandler, pendingEl)
})
}

function renderFinished(){
  finishedEl.innerHTML = '<p class="trash-table">Place trash here</p>'
  //render if tasks exist
  finishedTasks.length && finishedTasks.forEach((task)=>{
    // task.color = 'gray'
    createTaskElement(task, deleteTaskCompletely, finishedEl)
  })
}

let degrees = 0;
function spinArrows(){
  degrees+=6;
  secondsEl.style.transform = `rotate(${degrees}deg)`;
  minutesEl.style.transform = `rotate(${degrees/60}deg)`;
}
function resetArrows(degrees){
  secondsEl.style.transform = `rotate(${degrees}deg)`;
  minutesEl.style.transform = `rotate(${degrees/60}deg)`;
}
  
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
  if(e.keyCode===13){
    handleEnterBtn()
    renderPending()
  }
}

pipeBlowEl.addEventListener("click", function(){
    pipeBlowEl.style.top = "410px"
    tinePluckEl.style.top = "45px"
})
tinePluckEl.addEventListener("click", function(){
    pipeBlowEl.style.top = "45px"
    tinePluckEl.style.top = "410px"
})

let stopWatch
let arrowStopWatch
let taskBlinking
let seconds = 60
let pomodoro
let minutes = pomodoro || 20
let taskSetUp = false
let pomoCount = 4 //updates every 4 Pomodoro
let shortBreak
let longBreak
let cycles

// timeIntervalEvents
function startArrowWatch(){
  arrowStopWatch = setInterval(spinArrows,1000)
}
//array with elements to shake
const timerElementsEl = [clockfaceEl, playEl, pauseEl, stopEl, timerEl]
let timerIsActive = false
// --------------------------------START TIMER----------------

function startTimer() {
  if(taskSetUp && !timerIsActive){
    timerIsActive = true
    stopWatch = setInterval(myTimer,1000)
    arrowStopWatch = setInterval(spinArrows,1000)
    clearInterval(taskBlinking)//for pauseEvent purpose
    taskBlinking = setInterval(toggleTaskBlinking, 500)
    for(const element of timerElementsEl){
      element.classList.add('shake')
      element.style.animationDuration = '5s';
    }
  } 
  if(!taskSetUp){
    currentTaskEl.innerText = '...Set up your task first...'
  }
}

function toggleTaskBlinking(){
  currentTaskEl.classList.toggle('transparent')
}

function myTimer() {
  seconds--
  if(seconds < 0){
  	seconds = 59
  }
  seconds === 59 && minutes--
  let showSeconds = seconds<10 ? `0${seconds}` : `${seconds}`
  let showMinutes = minutes<10 ? `0${minutes}` : `${minutes}`
  timerEl.innerHTML = showMinutes + ':' + showSeconds
}

function pauseTimer(){
  timerIsActive=false
  clearInterval(stopWatch)
  clearInterval(arrowStopWatch)
  for(const element of timerElementsEl){//array with elements to shake
      element.classList.remove('shake')
    }
}

function stopTimer(){
  taskSetUp = false
  timerIsActive=false
  clearInterval(stopWatch)
  clearInterval(arrowStopWatch)
  clearInterval(taskBlinking)
  seconds = 60
  minutes = 25
  degrees = 0
  resetArrows(degrees)
  secondsEl.style.transform = `rotate(${degrees}deg)`;
  
  timerEl.innerText = '25:00'
  currentTaskEl.innerText = '...task in progress will see here...'
  if(currentTaskEl.style.opacity === '0'){
    toggleTaskBlinking()
  }
  for(const element of timerElementsEl){
      element.classList.remove('shake')
  }
}

function collectTimeSettings() {
  let pomodoroEl = document.querySelector('.pomodoro')
  let shortEl = document.querySelector('.short')
  let longEl = document.querySelector('.long')
  let cyclesEl = document.querySelector('.cycles')
 minutes = parseInt(pomodoroEl.value)
  timerEl.textContent = minutes < 10 ? `0${minutes}:00` : `${minutes}:00`
  shortBreak = shortEl.value
  longBreak = longEl.value
  cycles = cyclesEl.value
}


// Generate random task
const taskGeneratorBtnEl = document.querySelector('.task-generator');
const fetchBoredActivity = async () => {
  try {
    const response = await fetch('https://www.boredapi.com/api/activity');
    const data = await response.json();
    console.log('fetching...')
    if (response.status !== 200) {
      throw new Error('Failed to fetch bored activity');
    }
    const activity = data.activity;
    inputFieldEl.value = activity;
    
  } catch (error) {
    console.error(error);
    inputFieldEl.textContent = 'Failed to fetch bored activity';
  } finally {
    // loadingElement.style.display = 'none';
  }
};
taskGeneratorBtnEl.addEventListener('click', fetchBoredActivity)

function createOneConfetti(top,left){
  const conf = document.createElement('div')
  conf.className = 'confetti'
  conf.style.width = `${Math.floor(Math.random()*15)}px`
  conf.style.height = `${Math.floor(Math.random()*13)}px`
  conf.style.background = faker.color.rgb()
  conf.style.top = `${top}px`
  conf.style.left = `${left}px`
  conf.style.borderRadius = '50%'
  conf.style.position = 'absolute'
  conf.style.zIndex = '3'
  return conf
}

function throwConfetti(){
const top = 91
const left = Math.floor(Math.random()*50)+90
const confet = createOneConfetti(top, left)
document.querySelector('.bg').append(confet)
  let degreeConf = Math.floor(Math.random()*360);
  let x = Math.floor(Math.random()*3)
  let y = Math.floor(Math.random()*3)
  let flyOfConfetti
  let stepX = Math.floor(Math.random()*3)-Math.floor(Math.random()*2)
  let stepY = Math.floor(Math.random()*2)-Math.floor(Math.random()*3)
  
  function oneConfettiStep(){
    x+=stepX
    y+=(stepY+Math.floor(Math.random()*3))
    degreeConf+=5
    confet.style.rotate = `2 2 1 ${degreeConf}deg`
    confet.style.left = `${left + x}px`
    confet.style.top = `${top + y}px`
  }
  flyOfConfetti = setInterval(oneConfettiStep, 60)
  setTimeout(() => {
  clearInterval(flyOfConfetti);
  document.querySelector('.bg').removeChild(confet)
}, 10000);
}

function lunchConfetti(){
  for(let i=0;i<150;i++){
    throwConfetti()
  }
}
function lunchSession(){
  CheeringSound.play()
  let makeSession = setInterval(lunchConfetti, 2000)
  setTimeout(()=>{
    console.log('im here')
    clearInterval(makeSession)
  }, 10000)
}


