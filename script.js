const container = document.querySelector('.container')
const etchContainer = document.createElement('div')
etchContainer.classList.add('etchContainer')
container.appendChild(etchContainer)

const controlsContainer = document.createElement('div')

let brush = (() => {
  let size = 5 
  let color = 'black'

  let setSize = (newSize) => {
    if (isNaN(parseInt(newSize))) return
    size = parseInt(newSize)
    console.log(size)
  }

  let setColor = (newColor) => {
    if (typeof newColor !== 'string') return
    color = newColor
  }
  let getSize = () => {
    return size
  }
  let getColor = () => {
    return color
  }

  return {
    getColor,
    getSize,
    setSize,
    setColor,
  }
})()

let canvasDisplay = (() => {
  const canvas = document.createElement('canvas')
  let cx = canvas.getContext('2d')

  etchContainer.appendChild(canvas)

  let width = window.innerWidth
  let height = window.innerHeight

  canvas.setAttribute(
    'style',
    `
    box-sizing: border-box;
    height: ${height}px;
    width: ${width}px;
    `
  )

  let undoStack = []
  let redoStack = []

  const clear = () => {
    cx.fillStyle = 'white'
    cx.beginPath()
    cx.clearRect(0, 0, canvas.width, canvas.height)
    cx.fillRect(0, 0, canvas.width, canvas.height)
    cx.closePath()
    undoStack.push(canvas.toDataURL())
  }

  let mouseDown = false

  let prevDraw = null
  canvas.addEventListener('mousedown', () => {
    controlsContainer.classList.add('mouseDisabled')
    if (redoStack.length > 0) redoStack = []
    mouseDown = true
  })
  canvas.addEventListener('mouseup', () => {
    controlsContainer.classList.remove('mouseDisabled')
    prevDraw = null
    mouseDown = false
    undoStack.push(canvas.toDataURL())
    if (undoStack.length > 20) {
      undoStack.shift()
    }
  })

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && !e.repeat) {
      if (e.key === 'z') {
        if (undoStack.length > 0) {
          redoStack.push(undoStack.pop())
          let img = new Image()
          img.src = undoStack.slice(-1)
          img.onload = () => {
            cx.drawImage(img, 0, 0)
          }
        }
      }
      if (e.shiftKey && e.key === 'Z') {
        console.log('test')
        if (redoStack.length > 0) {
          let img = new Image()
          img.src = redoStack.slice(-1)
          img.onload = () => {
            cx.drawImage(img, 0, 0)
          }
          undoStack.push(redoStack.pop())
        }
      }
    }
  })

  canvas.height = canvas.offsetHeight
  canvas.width = canvas.offsetWidth

  clear()

  const drawOnMouseDown = (e) => {
    if (!mouseDown) return

    //Get grid
    // (GET mosue releactive to container )  / ( get width )

    let x = e.clientX - e.target.offsetLeft
    let y = e.clientY - e.target.offsetTop

    cx.lineCap = 'round'
    cx.strokeStyle = brush.getColor()
    cx.fillStyle = brush.getColor()
    cx.lineWidth = brush.getSize()

    if (prevDraw) {
      cx.beginPath()
      cx.moveTo(prevDraw.x, prevDraw.y)
      cx.lineTo(x, y)
      cx.stroke()
      prevDraw = { x, y }
    } else {
      prevDraw = { x, y }
    }

    // RECTANGLE Drawing, possibly add back once resolution is re-implemented.
    // cx.fillRect(x - (brush.getSize() / 2),
    //   y - (brush.getSize() / 2),
    //   brush.getSize(),
    //   brush.getSize());
  }

  canvas.addEventListener('mousemove', drawOnMouseDown)
  return {
    clear,
  }
})()

let gridCell = container.querySelectorAll('.gridItem')

let colorArray = [1, 100, 50]

controlsContainer.classList.add('controls')

const clearScreen = document.createElement('button')
clearScreen.classList.add('controlButton')
clearScreen.textContent = 'Clear'
clearScreen.setAttribute(
  'style',
  `
order:2;
`
)

// TODO change this to a canvas clear
clearScreen.addEventListener('click', () => {
  canvasDisplay.clear()

  // DOM old
  // gridCell.forEach((item) => {
  //   item.classList.remove('colorBackground')
  // })
})

const setBrushSize = document.createElement('input')
setBrushSize.type = 'number';
setBrushSize.classList.add('controlButton')
setBrushSize.value = brush.getSize();
setBrushSize.setAttribute(
  'style',
  `
order:3;
`
)

setBrushSize.addEventListener('change', () => {
  let pixels =  setBrushSize.value;
  brush.setSize(pixels)
  /* old laggy DOM
  let gridSize = 16;
  do {
    gridSize = prompt("How many pixels do you want for the Sketch n Etch. Max 100")
  } while (!(gridSize <= 100))
  console.log(gridSize)
  if (gridSize == 0 || gridSize == null) { return; }
  deleteGrid(gridCell);
  makeGrid(gridSize, gridSize);*/
})
const setColor = document.createElement('input')
setColor.classList.add('controlButton')
setColor.textContent = 'Color'
setColor.type = 'color'
setColor.setAttribute(
  'style',
  `
order:4;
`
)

setColor.addEventListener('change', (e) => {
  brush.setColor(e.target.value)
  /* old laggy DOM
  let gridSize = 16;
  do {
    gridSize = prompt("How many pixels do you want for the Sketch n Etch. Max 100")
  } while (!(gridSize <= 100))
  console.log(gridSize)
  if (gridSize == 0 || gridSize == null) { return; }
  deleteGrid(gridCell);
  makeGrid(gridSize, gridSize);*/
})
etchContainer.appendChild(controlsContainer)
controlsContainer.appendChild(clearScreen)
controlsContainer.appendChild(setBrushSize)
controlsContainer.appendChild(setColor)

/*  DOM Approch
for (i = 0; i < (rows * cols); i++) {
let cell = document.createElement('div');
cell.classList.add("gridItem")
gridContainer.appendChild(cell)
}
gridCell = container.querySelectorAll(".gridItem")
gridCell.forEach((item) => {
item.addEventListener('mouseover', () => {
item.classList.add('colorBackground')
colorArray[0] = (colorArray[0] < 360) ? colorArray[0] + 3 : 0;
colorArray[2] = (colorArray[2] > 0) ? colorArray[2] - 1 : 50;
item.style.setProperty('--etchColor', `hsl(${colorArray[0]}, ${colorArray[1]}%, ${colorArray[2]}%)`)
})
})
}
function deleteGrid(gridCell) {
gridCell.forEach((item) => {
item.remove();
})
}


display: grid;
grid-template-rows: repeat(${rows}, auto);
grid-template-columns: repeat(${cols}, auto);
*/
