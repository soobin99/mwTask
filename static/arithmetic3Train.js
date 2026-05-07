var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var pairs = [[4, 5], [6, 5], [5, 5], [4, 5]];
var pairIndex = 0;

function isTarget(index) {
    return index > 1 && numberSequence[index] + numberSequence[index - 1] + numberSequence[index - 2] === 30;
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
    if (numberSequence.length <= 2) {
        hideAnswerButtons();
    } else {
        showAnswerButtons();
    }
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
    if (index < 2) return;
    var isAnswerCorrect = isCorrectAnswer === isTarget(index);
    userAns[index] = isAnswerCorrect ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
    showTrainFeedback(isAnswerCorrect);
}

$(document).ready(function() {
    $('#number').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        changeNum();
    }, 3000);
});
