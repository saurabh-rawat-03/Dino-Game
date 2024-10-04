import Cactus from "./cactus.js";
import { FRAME_RATE, GAME_HEIGHT, GAME_WIDTH, MAX, MIN } from "./config.js";
import Floor from "./floor.js";
import Player from "./player.js";


window.addEventListener('load', gameStart);
let player;
let context; 
let floor;

function gameStart(){
    bindEvents();
    prepareCanvas();
    loadSprites();
    gameLoop();
}

function bindEvents(){
    window.addEventListener('keyup', doJump);
}

function doJump(event){
    console.log('Do jump', event.code);
    if(event.code == 'Space'){
        player.jump();
    }
}

function prepareCanvas(){
    const canvas = document.querySelector('#canvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    context = canvas.getContext('2d');

}

function loadSprites(){
    player = new Player();
    floor = new Floor();
    loadCactus();
}

let cactusArray = [];
function loadCactus(){
    const cactusArr = ['./assets/cactus1.png', './assets/cactus2.png', './assets/cactus3.png']
    let gap = 1;
    
    for(var c of cactusArr){
        const cactus = new Cactus(GAME_WIDTH * gap, GAME_HEIGHT, 48, 100, c);
        gap++;
        cactusArray.push(cactus);
    }
}

function generateRandomNumber(){
    return Math.floor(Math.random() * MAX - MIN + 1) + MIN;

}

let delay = 0;
function generateRandomCactus(){

    if(delay >= 70){
        delay = 0;
        
        setTimeout(() =>{
            loadCactus();
        },generateRandomNumber());
    }
    delay++;
}
// Math.random(); // 0.90329819
// Math.random() * 10; //0.4389749837-10.3284082349;
// Math.floor(Math.random() * 10); //0-10
// Math.floor(Math.random() * 10 - 1 + 1) + 1; //1 - 10;

function printCactus(context){
    for(let cactus of cactusArray){
        cactus.draw(context);
    }
}

function removeUnusedCactus(){
    cactusArray = cactusArray.filter(c => !c.isOutOfScreen());
}

function printGameOver(){
    context.font = 'bold 48px serif';
    context.fillStyle = 'grey';
    context.fillText('Game Over', GAME_WIDTH / 3, GAME_HEIGHT / 2);
}


function gameLoop(){
    clearScreen();

    if(isCollisionHappens()){
        player.draw(context);
        floor.draw(context);
        printCactus(context);
        generateRandomCactus();
        removeUnusedCactus();
        printGameOver();
        score();
    }else{
        player.draw(context);
        floor.draw(context);
        printCactus(context);
        generateRandomCactus();
        removeUnusedCactus();
        score();
        setTimeout(function(){
            requestAnimationFrame(gameLoop);
        }, FRAME_RATE);
    }
}

function clearScreen(){
    context.fillStyle = 'white';
    context.fillRect(0,0, GAME_WIDTH, GAME_HEIGHT);
}

function isCollide(cactus){
    return player.x < cactus.x + cactus.w && player.x + player.w > cactus.x && player.y < cactus.y + cactus.h && player.y + player.h > cactus.y
}

function isCollisionHappens(){
    return cactusArray.some(c => isCollide(c));

    // for(let cactus of cactusArray){
    //     if(isCollide(cactus)){
    //         return true;
    //     }
    // }
    // return false;
}

let scoreValue = 0;

function score(){

    if(!localStorage.maxScore){
        localStorage.maxScore = scoreValue;
    }

    if(scoreValue > localStorage.maxScore){
        localStorage.maxScore = scoreValue;
    }
    scoreValue++;
    context.font = 'bold 20px serif';
    context.fillStyle = 'grey';
    context.fillText(scoreValue.toString().padStart(5, 0), GAME_WIDTH - 100, 40);
    context.fillText(localStorage.maxScore.toString().padStart(5, 0), GAME_WIDTH - 190, 40);
}