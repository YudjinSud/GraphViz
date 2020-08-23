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
    connected_v = [];
}

var vertices = [];

var stateMachine = [];

can.width = document.body.clientWidth;
can.height = document.body.clientHeight;

function draw() {
    ctx.beginPath();
    ctx.clearRect(0,0,can.width,can.height);
    vertices.forEach((v) => { drawVertex(v) });
    vertices.forEach((v) => {
        v.connected_v.forEach((u) => {
            if (u > 0) {
                console.log(v.number + "->" + u);
                drawLine(v, vertices[u - 1]);
            }
        });
    });
}

function drawVertex(v) {
    ctx.beginPath();
    ctx.arc(v.x, v.y, radius, 0, 2 * Math.PI);
    ctx.fillText(v.number, v.x - 3, v.y + 4, 10);
    ctx.stroke();
}

function drawLine(v, u) {
    ctx.beginPath();
    ctx.moveTo(v.x, v.y);
    ctx.lineTo(u.x, u.y);
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
var first_vert;
can.addEventListener('mousedown', event => {
    stateMachine.push("mousedown");

    let { x, y } = getClickedCoords();

    let verticeNum = 0;
    vertices.forEach((v) => {
        if (Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius) {
            isVerticeClicked++;
            console.log("collision with vertice " + isVerticeClicked);
            verticeNum = v.number;
        }
    });
    if (isVerticeClicked == 0) {
        let connected_v = [];
        let v = { x, y, radius, number, connected_v };
        vertices.push(v);
        number++;
        //drawVertex(v);
    }
    if (isVerticeClicked == 1) {
        console.log(verticeNum);
        first_vert = vertices[verticeNum - 1];
        console.log(first_vert.number + "  clicked = 1");
    }
    if (isVerticeClicked == 2) {
        console.log(first_vert.number, verticeNum, " clicked = 2 ");
        isVerticeClicked = 0;
        let second_vert = vertices[verticeNum - 1];
        if (second_vert.number != first_vert.number) {
            vertices[verticeNum - 1].connected_v.push(first_vert.number);
            console.log(vertices[verticeNum - 1].connected_v[0].number + " p a p a");
            vertices[first_vert.number - 1].connected_v.push(second_vert);
            //drawLine(first_vert, second_vert);
        }
    }
    draw();
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