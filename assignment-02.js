// using jquery in this code
var isGameOn = false; // set game on and off
let timer = null; 

// 4 circle info
let greenCircle = $('.greenCircle'); // 4 circle info
let blueCircle = $('.blueCircle');
let yellowCircle = $('.yellowCircle');
let redCircle = $('.redCircle');

let currentScoreButton =  document.querySelector('.current-score'); // get button
let currentScore = '00';
currentScoreButton.innerHTML = currentScore; // changing it in html to output the currentscore

let highScoreButton = document.querySelector('.highest-score') 
let highestScore = '00';
highScoreButton.innerHTML = highestScore; // changing it in html to output highest score

var circles = [".greenCircle",".redCircle",".yellowCircle",".blueCircle"]; // array of all four circles
var sequence = []; // stores the random selected circle value in
var clicked = []; // clicked circle storage
var score = 0;
var highScore = 0; 
var tempo = 500; // tempo at start
var clickable = false; // buttons user can select
var signal; // call signal to run random select value.

// created a flash function that flashes to white for 500ms
function flash(circle) {
    $(circle).addClass('active');
    setTimeout(function() {
        $(circle).removeClass('active');
    },500); 
}

// flashes the sequence in order
function flashAll(sequence) { 
    var i = 0;
    signal = setInterval(function() { 
        flash(circles[sequence[i]]); // flash each circle in sequence order
        i++;
        if (i >= sequence.length) { // if all sequence has been flashed 
            clearInterval(signal); // stops flashing
            clickable = false; 
            timer = setTimeout(endGame, 5000); 
        }
    }, tempo + 500); // adds stop of 500ms between each flash
}

// flashes all 4 ingame circles all at once for 5 times when user fails
function failFlash() { 
    var i = 0;
    var lose = setInterval(function() { // repeatedly flash
        flash('.circle'); // all circles to flash (in circle class)
        i++;
        if (i >= 5) { // 5 flashes
            clearInterval(lose);
        }
    }, 600 + 50); // small pause between each flash 50ms
}

// add random number between 0-3 to array, used for adding circle to sequence
function addNew() { 
    var randomIndex = Math.floor(Math.random() * 4); 
    sequence.push(randomIndex); 
    clickable = true; 
}

 // increases the tempo in 5th,9th and 13th rounds as required
function newRound() {
    if (score === 5) { 
        tempo = 400;
    } else if (score === 9) {
        tempo = 300;
    }
    else if (score === 13) {
        tempo = 200;
    }
    clicked = []; 
    clickable = true; 
    addNew(); // add new random to sequence
    flashAll(sequence); // flashes the entire sequence
}

// when a user clicks on a circle
$(".circle").on("click", function() { // all circle elements that can click
    if (!clickable && isGameOn) { // clickable is true
        clearTimeout(timer);
        // determine which circle the user has clicked and puts it into clicked array
        if ($(this).hasClass("greenCircle")) {
            clicked.push(0);
        } else if ($(this).hasClass("redCircle")) {
            clicked.push(1);
        } else if ($(this).hasClass("yellowCircle")) {
            clicked.push(2);
        } else if ($(this).hasClass("blueCircle")) {
            clicked.push(3);
        }
        timer = setTimeout(endGame, 5000); // 5 second cut off required from assignment

        // checks that for each circle user clicks, check if this is not equal to the sequence endgame
        for (var i = 0; i < clicked.length; i++) {
            if (clicked[i] !== sequence[i]) { 
                clearTimeout(timer);
                endGame();
                break;
            } else if (clicked.length === sequence.length) { // check circle lengths are equal
                var counter = 0;
                for (var i = 0; i < clicked.length; i++) { 
                    if (clicked[i] === sequence[i]) { // increase the counter variable if value equal
                        counter++; 
                    }
                }
                if (counter === clicked.length) { // if the counter of equals between clicked and sequence is the same, then its all correct
                    score++;
                    updateCurrentScore(); 
                    clearTimeout(timer);
                    setTimeout(newRound, 500); // after500ms call newRound to continue on
                } else { // else endgame
                    clearTimeout(timer);
                    endGame();
                }
            }
        }
    }
});

// updates the current score button
function updateCurrentScore () { 
    currentScore = (parseInt(currentScore)+1).toString(); // score to int +1 then back to string
    if (currentScore.length < 2) { // if the score is single digit make double by adding 0
        currentScore = '0' + currentScore;
    }
}

// start the game
function startGame() {
    if (!isGameOn) { // turn on game if off
        isGameOn = true;
        var minicircle = document.getElementsByClassName('miniCircle'); // get miniCircle
        for (var i = 0; i < minicircle.length; i++) // change to green
        {
            minicircle[i].style.backgroundColor = "limegreen";
        }
        setTimeout(newRound,3000); // 3 second delay as required by assignment then begin
    }
}

// end the game
function endGame() {
    clearTimeout(timer); // clear timer
    var minicircle = document.getElementsByClassName('miniCircle'); // get minicircle
    for (var i = 0; i < minicircle.length; i++) // change to red
    {
        minicircle[i].style.backgroundColor = "red";
    }
    failFlash(); // flash all circles 5 times
    currentScoreButton.innerHTML = currentScore; // display score of the game just completed
    if (score > highScore) { // if user beats their high score update it
        highScore = score; 
        highestScore = currentScore;
        highScoreButton.innerHTML = highestScore;
    }
    reset();
}

// reset everything when game ends to start a new game from scratch
function reset() {
    clearInterval(signal);
    sequence = [];
    clicked = []; 
    tempo = 500; // original value 
    score = 0;
    currentScore = '00';
    clickable = false; // cant click 
    isGameOn = false; // game off
}

// sources
// https://www.geeksforgeeks.org/create-a-simon-game-using-html-css-javascript/
// https://www.youtube.com/watch?v=W0MxUHlZo6U
