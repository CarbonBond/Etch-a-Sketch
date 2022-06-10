const container = document.querySelector(".container");
const etchContainer = document.createElement('div');
etchContainer.classList.add('etchContainer');
container.appendChild(etchContainer)




let canvasDisplay = (() => {
  const canvas = document.createElement('canvas');
  let cx = canvas.getContext('2d');
  cx.fillStyle = 'blue';

  etchContainer.appendChild(canvas);

  cx.fillRect(0, 0, 10, 100)

  canvas.setAttribute('style', `
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    border: 4px inset red;
    order: 2;
    `)

  canvas.height = canvas.offsetHeight;
  canvas.width = canvas.offsetWidth


  const clear = () => {
    cx.fillStyle = 'white';
    cx.fillRect(0, 0, canvas.width, canvas.height)
  }

  clear();

  let resolution = 100;

  let setResolution = (pixels) => {
    if (pixels > 10000) pixels = 1000;
    resolution = pixels;
  }


  canvas.addEventListener('mousemove', (e) => {
    cx.fillStyle = 'black';
    let x = Math.floor((e.clientX - canvas.offsetLeft) / (canvas.offsetWidth / resolution));
    let y = Math.floor((e.clientY - canvas.offsetTop) / (canvas.offsetHeight / resolution));


    cx.fillRect(x * (canvas.offsetWidth / resolution),
      y * (canvas.offsetHeight / resolution),
      canvas.offsetWidth / resolution,
      canvas.offsetHeight / resolution);

    console.log(x * (canvas.offsetWidth / resolution),
      y * (canvas.offsetHeight / resolution),
      canvas.offsetWidth / resolution,
      canvas.offsetHeight / resolution)



  })
  return {
    clear,
    setResolution
  }
})();

console.log(canvasDisplay)


let gridCell = container.querySelectorAll(".gridItem")

let colorArray = [1, 100, 50]

const controlsContainer = document.createElement('div');
controlsContainer.classList.add(".controls")
controlsContainer.setAttribute('style', `
    box-sizing: border-box;
    height: 12%;
    width: 100%;
    margin-top: 1vmin;
    display: flex;
    justify-content: space-between;
    align-items: center;
    order:3;
    `)

const titleDiv = document.createElement('div');
controlsContainer.appendChild(titleDiv);
titleDiv.textContent = "Sketch N Etch";
titleDiv.classList.add('title');
titleDiv.setAttribute('style', `
    order:2;
    font-size: 5vmin;
`)

const clearScreen = document.createElement('button');
clearScreen.classList.add('controlButton');
clearScreen.textContent = "Clear";
clearScreen.setAttribute('style', `
order:1;
`)

// TODO change this to a canvas clear
clearScreen.addEventListener('click', () => {
  canvasDisplay.clear();

  // DOM old
  // gridCell.forEach((item) => {
  //   item.classList.remove('colorBackground')
  // })
})

const setResolution = document.createElement('button');
setResolution.classList.add('controlButton');
setResolution.textContent = "Size"
setResolution.setAttribute('style', `
order:3;
`)

setResolution.addEventListener('click', () => {
  pixels = prompt("How many pixels do you want for the Sketch n Etch. Max 100")
  canvasDisplay.setResolution(pixels)
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

etchContainer.appendChild(controlsContainer);
controlsContainer.appendChild(clearScreen);
controlsContainer.appendChild(setResolution);

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
