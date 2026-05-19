var REQUIRED_RESPONSE_COUNT = 5;
var TARGET_PATTERN = [true, false, true, false, true, false, true, false, true, false];

var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var pairs = buildTrainPairs();
var pairIndex = 0;
var currentRequiresResponse = false;
var advanceTimer = null;

function buildTrainPairs() {
    return TARGET_PATTERN.map(function(isTarget, index) {
        return pairForSum(isTarget ? 10 : (index % 2 === 0 ? 9 : 11));
    });
}

function pairForSum(sum) {
    var first = Math.max(1, Math.min(9, Math.floor(sum / 2)));
    var second = sum - first;
    if (second > 9) {
        second = 9;
        first = sum - second;
    }
    return [first, second];
}

function isTarget(index) {
    return numberSequence[index] === 10;
}

function getAnswerTrialNumber() {
    return numberSequence.length;
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
    currentRequiresResponse = getAnswerTrialNumber() <= REQUIRED_RESPONSE_COUNT;

    pairIndex += 1;
    setTimeout(hideNum, 500);
    if (!currentRequiresResponse) {
        advanceTimer = setTimeout(advanceTrain, 3000);
    }
}

function advanceTrain() {
    if (pairIndex < pairs.length) {
        changeNum();
    } else {
        hideNum();
        hideAnswerButtons();
        resetTrainFeedback();
        window.location.href = '../templates/train.html';
    }
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

    if (currentRequiresResponse) {
        currentRequiresResponse = false;
        clearTimeout(advanceTimer);
        advanceTimer = setTimeout(advanceTrain, 500);
    }
}

$(document).ready(function() {
    $('#number').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        changeNum();
    }, 3000);
});
