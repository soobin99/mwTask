var maxCnt = 20;
var imageSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num = 1;

function getRandomInt() {
    return Math.floor(Math.random() * 9) + 1;
}

function isTarget(index) {
    return index >= 3 && imageSequence[index] === imageSequence[index - 3];
}

function changeImage() {
    if (imageSequence.length >= maxCnt) return;
    resetAnswerButtons();
    $('#nBackImage').show();
    imageSequence.push(num);
    userAns.push(0);
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
    setTimeout(hideImage, 500);
    setTimeout(function() {
        if (imageSequence.length < maxCnt) {
            changeImage();
        } else {
            window.location.href = '../templates/train.html';
        }
    }, 3000);
}

function hideImage() {
    $('#nBackImage').hide();
    num = getRandomInt();
    $('#nBackImage').attr('src', '../static/nBackImage/' + num.toString() + '.svg');
}

function userAnsCheck(isCorrectAnswer) {
    var index = imageSequence.length - 1;
    if (index < 0) return;
    userAns[index] = isCorrectAnswer === isTarget(index) ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
}

$(document).ready(function() {
    $('#nBackImage').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        showAnswerButtons();
        changeImage();
    }, 3000);
});
