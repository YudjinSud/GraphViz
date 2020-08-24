import './styles.css';
import { hi } from "./GraphLib"

var can = document.getElementById("c");
var ctx = can.getContext('2d');
var number = 1;
const radius = 15;

var delay;

var longpress = 1300;

var vertices = [];
var isVerticeClicked = 0;
var first_vert;
var verticeNum = 0;
var stateMachine = [];

can.width = document.body.clientWidth;
can.height = document.body.clientHeight;

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, can.width, can.height);
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
    let rast = (Math.sqrt((v.x - u.x) * (v.x - u.x) + (v.y - u.y) * (v.y - u.y)));
    let cos_i = (v.x - u.x) / rast;
    let sin_i = Math.sqrt(1 - cos_i * cos_i);
    let s_y = radius * sin_i;
    let s_x = radius * cos_i;
    if (u.y > v.y) {
        ctx.moveTo(v.x - s_x, v.y + s_y);
        ctx.lineTo(u.x + s_x, u.y - s_y);
    } else {
        ctx.moveTo(v.x - s_x, v.y - s_y);
        ctx.lineTo(u.x + s_x, u.y + s_y);
    }
    ctx.closePath();
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

    let { x, y } = getClickedCoords();


    vertices.forEach((v) => {
        if (Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius) {
            //check_longclick();
            if (isVerticeClicked == 0) {
                if (Math.floor(Math.random() * Math.floor(2)) == 1) isVerticeClicked = 3;
                else isVerticeClicked = 1;
            } else isVerticeClicked++;
            console.log("collision with vertice " + v.number, isVerticeClicked);
            verticeNum = v.number;
        }
    });
    if (isVerticeClicked == 0) {
        let connected_v = [];
        let v = { x, y, radius, number, connected_v };
        vertices.push(v);
        number++;
    }

    if (isVerticeClicked == 1) {
        if (verticeNum < 1) {
            isVerticeClicked = 0;
        } else {
            first_vert = vertices[verticeNum - 1];
            console.log(first_vert.number + "  clicked = 1");
        }
    }
    if (isVerticeClicked == 2) {
        console.log(first_vert.number, verticeNum, " clicked = 2 ");
        isVerticeClicked = 0;
        let second_vert = vertices[verticeNum - 1];
        if (second_vert.number != first_vert.number) {
            vertices[verticeNum - 1].connected_v.push(first_vert.number);
            console.log(vertices[verticeNum - 1].connected_v[0].number + " p a p a");
            vertices[first_vert.number - 1].connected_v.push(second_vert);
        }
    }
    draw();
});
/*
function check_longclick(){
    delay = setTimeout(check, longpress);
    function check() {
        let {x, y} = getClickedCoords();
        let v = vertices[verticeNum - 1];
        if(Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius)
            isVerticeClicked = 3;
        else
            isVerticeClicked++;    
    }

}
function reflectMouse(startX, startY, x, y) {
    ctx.moveTo(startX, startY);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.stroke();
}
*/
can.addEventListener('mousemove', e => {
    if (isVerticeClicked == 3) {
        let rect = can.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        vertices[verticeNum - 1].x = x;
        vertices[verticeNum - 1].y = y;
        draw();
    }
    if (isVerticeClicked == 4) isVerticeClicked = 0;
    if (isVerticeClicked == 1) {
        let v = first_vert;
        let rect = can.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let u = {x, y};
        draw();
        ctx.beginPath();
        let rast = (Math.sqrt((v.x - u.x) * (v.x - u.x) + (v.y - u.y) * (v.y - u.y)));
        let cos_i = (v.x - u.x) / rast;
        let sin_i = Math.sqrt(1 - cos_i * cos_i);
        let s_y = radius * sin_i;
        let s_x = radius * cos_i;
        if (u.y > v.y) {
            ctx.moveTo(v.x - s_x, v.y + s_y);
            ctx.lineTo(u.x, u.y);
        } else {
            ctx.moveTo(v.x - s_x, v.y - s_y);
            ctx.lineTo(u.x, u.y);
        }
        ctx.closePath();
        ctx.stroke();
        
    }

})

function main() {
    draw();
}

main();