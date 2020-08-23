import './styles.css';
import { hi } from "./GraphLib"

var can = document.getElementById("c");
var ctx = can.getContext('2d');

can.width = 1000;
can.height = 1000;

function draw() {

}

function drawVertex(x, y) {
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.stroke();
}

can.addEventListener('mousedown', event => {
    let rect = can.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,
        "Coordinate y: " + y);
    drawVertex(x,y);

})

can.addEventListener('mousemove', e => {
    let offsetX = e.offsetX;

})

function main() {
    draw();
}

main();