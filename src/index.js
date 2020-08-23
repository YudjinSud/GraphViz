import './styles.css';
import { hi } from "./GraphLib"

var can = document.getElementById("c");
var ctx = can.getContext('2d');
var number = 1;
var begin_line_x, begin_line_y, end_line_x, end_line_y;
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
    ctx.fillText(number++, x - 3, y + 4, 10);
    ctx.stroke();
}

function drawLine(x, y, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function getClickedCoords() {
    let rect = can.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    return { x, y };
}
var isVerticeClicked = 0;

can.addEventListener('mousedown', event => {
    stateMachine.push("mousedown");

    let { x, y } = getClickedCoords();

    
    let verticeNum = 0;
    vertices.forEach((v) => {
        if (Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius) {
            isVerticeClicked+=1;
            console.log("collision with vertice " + isVerticeClicked);
            verticeNum = v.number;
        }
    });
    if (isVerticeClicked == 1) {
        begin_line_x = vertices[verticeNum-1].x;
        begin_line_y = vertices[verticeNum-1].y;
    } else {
        if (isVerticeClicked == 2) {
            console.log("drawing line " + isVerticeClicked);
            isVerticeClicked = 0;
            end_line_x = vertices[verticeNum - 1].x;
            end_line_y = vertices[verticeNum - 1].y;
            drawLine(begin_line_x, begin_line_y, end_line_x, end_line_y);
        } else {
            vertices.push({ x, y, radius, number });
            
            drawVertex(x, y);
        }
    }
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