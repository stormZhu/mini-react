let taskId = 1
let workOfUnit = null
function workLoop(deadline) {
  taskId++
  console.log("workLoop", deadline.timeRemaining())
  let shouldYield = false
  while (!shouldYield) {
    console.log(`task: ${taskId} run task`)
    performWorkOfUnit()
    shouldYield = deadline.timeRemaining() < 1
  }
  //   requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
