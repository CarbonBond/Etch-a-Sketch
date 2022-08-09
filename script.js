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

let selectBox = (() => {
  let p1 = {
    x : 0,
    y : 0 
  } 
  let p2 = { x: window.innerWidth,  y : window.innerHeight}

  let inside = (x, y) => {
    if(x > p1.x && x < p2.x && y > p1.y && y < p2.y) {
      return true;
    }
    return false;
  }

  const box = document.createElement('div');
  box.classList.add('box');

  return {
    inside,
    p1,
    p2,
    box
  }
})();


let canvasDisplay = (() => {

  const createLayer = () => {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'fixed'
    canvas.style.top = 0;
    canvas.style.left = 0
    canvas.style.width = innerWidth;
    canvas.style.height = innerHeight;
    etchContainer.appendChild(canvas)
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth
    return canvas;
  }

  const canvas =  createLayer();
  let cx = canvas.getContext('2d')

  const toolsLayer = createLayer();
  toolsLayer.style.pointerEvents = 'none'
  let toolCX = toolsLayer.getContext('2d');

  let undoStack = []
  let redoStack = []

  const clear = (color, ctx = cx) => {
    ctx.beginPath()
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    ctx.closePath()
    if(color) {
      ctx.fillStyle = color 
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
    }
    undoStack.push(canvas.toDataURL())
  }

  let mouseDown = "notPressed"; 
  let prevDraw = null


  clear('white')
  clear(null, toolCX)

  const drawSelectBox = (e) => {
    toolCX.fillStyle = 'black';
    clear(null, toolCX)
    toolCX.rect(selectBox.p1.x, selectBox.p1.y, e.clientX - selectBox.p1.x, e.clientY - selectBox.p1.y);
    toolCX.stroke();
  }

  const drawOnMouseDown = (e, ctx = cx) => {

    //Get grid
    // (GET mosue releactive to container )  / ( get width )

    let x = e.clientX - e.target.offsetLeft
    let y = e.clientY - e.target.offsetTop

    ctx.lineCap = 'round'
    ctx.strokeStyle = brush.getColor()
    ctx.fillStyle = brush.getColor()
    ctx.lineWidth = brush.getSize()

    if (prevDraw) {
      ctx.beginPath()
      ctx.moveTo(prevDraw.x, prevDraw.y)
      ctx.lineTo(x, y)
      ctx.stroke()
      prevDraw = { x, y }
    } else {
      prevDraw = { x, y }
    }

    // RECTANGLE Drawing, possibly add back once resolution is re-implemented.
    // ctx.fillRect(x - (brush.getSize() / 2),
    //   y - (brush.getSize() / 2),
    //   brush.getSize(),
    //   brush.getSize());
  }
  canvas.addEventListener('mousedown', (e) => {
    controlsContainer.classList.add('mouseDisabled')
    switch (e.button) {
      case 0:
        if (redoStack.length > 0) redoStack = []
        mouseDown = "draw"
        break;
      case 1:
        selectBox.p1 = {x: e.x, y: e.y};
        mouseDown = "select"
        break;
    }
  })
  canvas.addEventListener('mouseup', (e) => {
    controlsContainer.classList.remove('mouseDisabled')
    mouseDown = 'notPressed' 
    switch (e.button) {
      case 0:
        prevDraw = null
        undoStack.push(canvas.toDataURL())
        if (undoStack.length > 20) {
          undoStack.shift()
        }
        break;
      case 2:
        selectBox.p2 = {x: e.x, y: e.y};
        break;
    } 
  })

  let undo = () => {
    if (undoStack.length > 0) {
      redoStack.push(undoStack.pop())
      let img = new Image()
      img.src = undoStack.slice(-1)
      img.onload = () => {
        cx.drawImage(img, 0, 0)
      }
    }
  }

  let redo = () => {
    if (redoStack.length > 0) {
      let img = new Image()
      img.src = redoStack.slice(-1)
      img.onload = () => {
        cx.drawImage(img, 0, 0)
      }
      undoStack.push(redoStack.pop())
    }
  }
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && !e.repeat) {
      if (e.key === 'z') {
        undo()
      }
      if (e.shiftKey && e.key === 'Z') {
        redo()
      }
    }
  })
  canvas.addEventListener('mousemove', (e) => {
    switch(mouseDown) {
      case 'draw':
        drawOnMouseDown(e, cx)
        break;
      case 'select':
        drawSelectBox(e)
        break;
      default:
        break;
    }
  })
  return {
    clear,
    undo,
    redo,
    undoStack,
    redoStack
  }
})()

let gridCell = container.querySelectorAll('.gridItem')

let colorArray = [1, 100, 50]

controlsContainer.classList.add('controls')

//CLEAR Button
const clearScreen = document.createElement('button')
clearScreen.classList.add('controlButton')
clearScreen.textContent = 'Clear'
clearScreen.setAttribute(
  'style',
  `
order:2;
`
)
clearScreen.addEventListener('click', () => {
  canvasDisplay.clear('white')
})


const undoButton = document.createElement('button')
undoButton.classList.add('controlButton')
undoButton.textContent = 'Undo'
undoButton.setAttribute(
  'style',
  `
order:4;
`
)
undoButton.addEventListener('click', () => {
  canvasDisplay.undo()
})

const redoButton = document.createElement('button')
redoButton.classList.add('controlButton')
redoButton.textContent = 'Redo'
redoButton.setAttribute(
  'style',
  `
order:5;
`
)
redoButton.addEventListener('click', () => {
  canvasDisplay.redo()
})
//BRUSHSIZE input
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
})

//COLOR INPUT
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
})
etchContainer.appendChild(controlsContainer)

controlsContainer.appendChild(clearScreen)
controlsContainer.appendChild(setBrushSize)
controlsContainer.appendChild(setColor)
controlsContainer.appendChild(undoButton)
controlsContainer.appendChild(redoButton)

