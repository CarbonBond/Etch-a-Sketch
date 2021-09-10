const container = document.querySelector(".container");
container.textContent = "Sketch N Etch"

size = prompt("How large of a sketch pad? 100 is the max!", "");
if(size > 100){size = 100;}
makeGrid(size,size);

function makeGrid(rows, cols) {
    const gridContainer =  document.createElement('div');
    gridContainer.setAttribute('style', `
    box-sizing: border-box;
    height: 95%;
    width: 100%;
    display: grid;
    grid-template-rows: repeat(${rows}, auto);
    grid-template-columns: repeat(${cols}, auto);
    border: 4px inset red;
    `)
    container.appendChild(gridContainer)
    for(i = 0; i < (rows * cols); i++){
        let cell = document.createElement('div');
        cell.classList.add("gridItem")
        gridContainer.appendChild(cell)
    }
}

gridCell = container.querySelectorAll(".gridItem")
gridCell.forEach((item) => {
    item.addEventListener('mouseover', () => {
        item.classList.add('blackBackground')
    })

})


const gridDivOne = 
gridDivOne.classList.add('flex_item');

container.appendChild(gridDivOne);

