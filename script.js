const container = document.querySelector(".container");

const gridContainer =  document.createElement('div');
let size = 16//prompt("How large of a sketch pad? 100 is the max!", "");
if(size > 100){size = 100;}


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

const controlReset = document.createElement('button');
controlReset.classList.add('controlButton');
controlReset.textContent = "Clear";
controlReset.setAttribute('style', `
order:1;
`)

const titleDiv = document.createElement('div');
controlsContainer.appendChild(titleDiv);
titleDiv.textContent = "Sketch N Etch";
titleDiv.classList.add('title');
titleDiv.setAttribute('style', `
    order:2;
    font-size: 5vmin;
`)

const controlSet = document.createElement('button');
controlSet.classList.add('controlButton');
controlSet.textContent = "Size"
controlSet.setAttribute('style', `
order:3;
`)


controlReset.addEventListener('click', () => {
    gridCell.forEach((item) => {
        item.classList.remove('blackBackground')
    })   
})

controlSet.addEventListener('click', () => {
    let gridSize = 16;
    do{
    gridSize = prompt("How many pixels do you want for the Sketch n Etch. Max 100")
    } while (!(gridSize <= 100))
    console.log(gridSize)
    if(gridSize == 0 || gridSize == null) {return;}
    deleteGrid(gridCell);
    makeGrid(gridSize,gridSize);
})

container.appendChild(controlsContainer);
controlsContainer.appendChild(controlReset);
controlsContainer.appendChild(controlSet);

makeGrid(size,size);




function makeGrid(rows, cols) {

    gridContainer.setAttribute('style', `
    box-sizing: border-box;
    height: 87%;
    width: 100%;
    display: grid;
    grid-template-rows: repeat(${rows}, auto);
    grid-template-columns: repeat(${cols}, auto);
    border: 4px inset red;
    order: 2;
    `)
    container.appendChild(gridContainer)
    for(i = 0; i < (rows * cols); i++){
        let cell = document.createElement('div');
        cell.classList.add("gridItem")
        gridContainer.appendChild(cell)
    }
    gridCell = container.querySelectorAll(".gridItem")
    gridCell.forEach((item) => {
        item.addEventListener('mouseover', () => {
            item.classList.add('blackBackground')
            colorArray[0] = (colorArray[0]<360) ? colorArray[0]+3: 0;
            colorArray[2] = (colorArray[2]>0) ? colorArray[2]-1: 50;
            item.style.setProperty('--etchColor', `hsl(${colorArray[0]}, ${colorArray[1]}%, ${colorArray[2]}%)`)
        })
    })
}
function deleteGrid(gridCell){
    gridCell.forEach((item) => {
        item.remove();
    })
}
