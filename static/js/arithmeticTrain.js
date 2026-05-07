var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var pairs = [[4, 6], [5, 6]];
var pairIndex = 0;

function isTarget(index) {
    return numberSequence[index] === 10;
}

function changeNum() {
    if (pairIndex >= pairs.length) return;
    resetAnswerButtons();
    resetTrainFeedback();
    var pair = pairs[pairIndex];
    $('#num1').text(pair[0].toString());
    $('#num2').text(pair[1].toString());
    $('#number').show();
    numberSequence.push(pair[0] + pair[1]);
    userAns.push(0);
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
    showAnswerButtons();
    showTrainTarget(isTarget(numberSequence.length - 1));
    pairIndex += 1;
    setTimeout(hideNum, 500);
    setTimeout(function() {
        if (pairIndex < pairs.length) {
            changeNum();
        } else {
            window.location.href = '../templates/train.html';
        }
    }, 3000);
}

function hideNum() {
    $('#number').hide();
}

function userAnsCheck(isCorrectAnswer) {
    var index = numberSequence.length - 1;
    if (index < 0) return;
    var isAnswerCorrect = isCorrectAnswer === isTarget(index);
    userAns[index] = isAnswerCorrect ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
}

$(document).ready(function() {
    $('#number').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        changeNum();
    }, 3000);
});
