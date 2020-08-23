import './styles.css';
import { hi } from "./GraphLib"

var can = document.getElementById("c");
var ctx = can.getContext('2d');
var number = 1;
const radius = 15;


class Vertex {
    x;
    y;
    radius;
    number;
}

var vertices = [];

var stateMachine = [];

can.width = document.body.clientWidth;
can.height = document.body.clientHeight;

function draw() {

}

function drawVertex(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillText(number++, x, y, 10);
    ctx.stroke();
}

function getClickedCoords() {
    let rect = can.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    return { x, y };
}

can.addEventListener('mousedown', event => {
    stateMachine.push("mousedown");

    let x, y = getClickedCoords();

    var isVerticeClicked = 0;
    let verticeNum = 0;
    vertices.forEach((v) => {
        if (Math.abs(v.x - x) <= v.radius && Math.abs(v.y - y) <= v.radius) {
            console.log("collision with vertice");
            isVerticeClicked = 1;
            verticeNum = v.number;
        }
    });

    // if(isVerticeClicked) {
    //     // return;

    // } else {
    vertices.push({ x, y, radius, number });
    drawVertex(x, y);
    //   }
})

function reflectMouse(startX, startY, x, y) {
    ctx.moveTo(startX, startY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.stroke();
}

can.addEventListener('mousemove', e => {
    let offsetX = e.offsetX;
})

function main() {
    draw();
}

main();