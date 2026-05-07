var maxCnt = 20;
var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num1 = 1;
var num2 = 1;

function getRandomInt() {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * 9) + 1;
}

function isTarget(index) {
    return index > 1 && numberSequence[index] + numberSequence[index - 1] + numberSequence[index - 2] === 30;
}

function changeNum() {
    if (numberSequence.length >= maxCnt) return;
    resetAnswerButtons();
    $('#number').show();
    numberSequence.push(num1 + num2);
    userAns.push(0);
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
    setTimeout(hideNum, 500);
    setTimeout(function() {
        if (numberSequence.length < maxCnt) {
            changeNum();
        } else {
            window.location.href = '../templates/train.html';
        }
    }, 3000);
}

function hideNum() {
    $('#number').hide();
    getRandomInt();
    $('#num1').text(num1.toString());
    $('#num2').text(num2.toString());
}

function userAnsCheck(isCorrectAnswer) {
    var index = numberSequence.length - 1;
    if (index < 0) return;
    userAns[index] = isCorrectAnswer === isTarget(index) ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
}

$(document).ready(function() {
    $('#number').hide();
    hideAnswerButtons();
    getRandomInt();
    $('#num1').text(num1.toString());
    $('#num2').text(num2.toString());
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        showAnswerButtons();
        changeNum();
    }, 3000);
});
