import './styles.css';
import { hi } from "./GraphLib"

var can = document.getElementById("c");
var ctx = can.getContext('2d');
var menu = document.getElementById("menu");
var number = 1;
const radius = 15;

var delay;
var flag_ = 0;
var longpress = 1300;
var used = [];
used[10000] = 0;
var draw_dfs = [];
var vertices = [];
var isVerticeClicked = 0;
var first_vert;
var verticeNum = 0;
var stateMachine = [];
first_vert = -1;
can.width = document.body.clientWidth;
can.height = document.body.clientHeight;

var dfs_start_btn = document.getElementById("start_dfs");
var bfs_start_btn = document.getElementById("start_bfs");
var dijkstra_start_btn = document.getElementById("start_dijkstra");

dfs_start_btn.addEventListener("click", function () {
    if (menu.style.opacity == "1")
        start_dfs(vertices[verticeNum - 1]);
});


bfs_start_btn.addEventListener("click", function () {
    if (menu.style.opacity == "1")
        alert(this.id);
});


dijkstra_start_btn.addEventListener("click", function () {
    if (menu.style.opacity == "1")
        alert(this.id);
});

function draw() {
    ctx.beginPath();
    ctx.clearRect(0, 0, can.width, can.height);
    vertices.forEach((v) => { drawVertex(v) });
    vertices.forEach((v) => {
        v.connected_v.forEach((u) => {
            console.log(v.number, "->", u.number);
            drawLine(v, u);
        });
    });
}

function clear_used_status() {
    for (let i = 0; i < number; i++)
        used[i] = 0;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function start_dfs(v) {
    draw_dfs = [];
    clear_used_status();
    console.log("starting dfs");
    dfs(v);
    // for(let i = 0; i < draw_dfs.length;i++)
    //     console.log(draw_dfs[i]);
    for(let i = 0; i < draw_dfs.length;i++){
        draw();
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        for(let j = 0; j <= i; j++){
            drawVertex(vertices[draw_dfs[j].number - 1]);
        }
        ctx.closePath();
        ctx.strokeStyle = 'black';
        await sleep(1000);
    }
}



async function dfs(v) {
    draw_dfs.push(v);
    used[v.number - 1] = 1;
    for(let i = 0; i < v.connected_v.length;i++){
        let u = v.connected_v[i];
        if (used[u.number - 1] != 1){
            dfs(u);
        }
    }
}


function drawVertex(v) {
    ctx.beginPath();
    ctx.arc(v.x, v.y, radius, 0, 2 * Math.PI);
    ctx.fillText(v.number, v.x - 3, v.y + 4, 10);
    ctx.stroke();
}

function drawLine(v, u) {
    ctx.beginPath();
    // if (used[u.number - 1] == 1 && used[v.number - 1] == 1)
    //     ctx.strokeStyle = 'red';
    // else
    //     ctx.strokeStyle = 'black';
    ctx.strokeStyle = 'green';
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
    ctx.strokeStyle = 'black';
}

function getClickedCoords() {
    let rect = can.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return { x, y };
}

can.addEventListener('mousedown', event => {
    let { x, y } = getClickedCoords();

    if (event.button == 0) {
        clear_used_status();
        menu.style.visibility = "hidden"; // скрыли прошлое меню;
        console.log("leftClick");
        vertices.forEach((v) => {
            if (Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius) {
                flag_ = 1;
                console.log("collision with vertice " + v.number, isVerticeClicked);
                verticeNum = v.number;
            }
        });
        draw();
    }
    else if (event.button == 2) {
        console.log("rightClick");
        vertices.forEach((v) => {
            if (Math.abs(v.x - x) <= 2 * v.radius && Math.abs(v.y - y) <= 2 * v.radius) {
                console.log("collision with vertice " + v.number, isVerticeClicked);
                verticeNum = v.number;
                drawMenu(x, y);
            }
        });

    }
});


document.addEventListener("contextmenu", e => {
    e.preventDefault();
})

function drawMenu(x, y) {
    menu.style.top = y + "px";
    menu.style.left = x + "px";
    menu.style.visibility = "visible";
    menu.style.opacity = "1";
}

can.addEventListener('mouseup', e => {
    if (e.button == 2) return;
    if (isVerticeClicked == 0 && !flag_) {
        let connected_v = [];
        let { x, y } = getClickedCoords();
        let v = { x, y, radius, number, connected_v };
        vertices.push(v);
        number++;
    } else {
        console.log("popali v vertice");
        if (isVerticeClicked == 0 && flag_) {
            first_vert = vertices[verticeNum - 1];
            isVerticeClicked++;
            console.log(first_vert.number, verticeNum, " clicked = " + isVerticeClicked);
        }
        else {
            if (isVerticeClicked == 3) isVerticeClicked++;
            else {
                if (isVerticeClicked == 1 && flag_) {

                    console.log(first_vert.number, verticeNum, "provodim liniuy ");
                    isVerticeClicked = 0;
                    let second_vert = vertices[verticeNum - 1];
                    let flag_con = false;
                    first_vert.connected_v.forEach((u1) => {
                        if (u1.number == second_vert.number)
                            flag_con = true;
                    });
                    if (second_vert.number != first_vert.number && !flag_con) {
                        vertices[verticeNum - 1].connected_v.push(first_vert);
                        //console.log(vertices[verticeNum - 1].connected_v[0].number + " p a p a");
                        vertices[first_vert.number - 1].connected_v.push(second_vert);
                    }
                    first_vert = -1;
                    draw();
                }

            }
        }
    }
    flag_ = 0;
    console.log("end mouse up = " + isVerticeClicked);
    draw();
    // если изначально 0
    // если было состояние 0, mousedown
    // если после этого происходит mousemove - 3
    // если после mousedown -> mouseup - состояние 1
    // иначе состояние ++;
});

can.addEventListener('mousemove', e => {
    if (e.button == 2) return;
    console.log("moving  = " + isVerticeClicked);
    if (isVerticeClicked == 0 && flag_) isVerticeClicked = 3;
    else if (isVerticeClicked == 3) {
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
        let u = { x, y };
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