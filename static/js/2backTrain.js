var N_BACK = 2;
var REQUIRED_RESPONSE_COUNT = 5;
var AUTO_RESPONSE_COUNT = 5;
var TARGET_PATTERN = [true, false, true, false, true, false, true, false, true, false];

var imageSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var sequence = buildTrainSequence();
var sequenceIndex = 0;
var currentRequiresResponse = false;
var advanceTimer = null;

function buildTrainSequence() {
    var generated = [2, 5];
    TARGET_PATTERN.forEach(function(isTarget) {
        var compareValue = generated[generated.length - N_BACK];
        generated.push(isTarget ? compareValue : getDifferentImage(compareValue));
    });
    return generated;
}

function getDifferentImage(target) {
    var next = Math.floor(Math.random() * 8) + 1;
    return next >= target ? next + 1 : next;
}

function isTarget(index) {
    return index >= N_BACK && imageSequence[index] === imageSequence[index - N_BACK];
}

function getAnswerTrialNumber() {
    return imageSequence.length - N_BACK;
}

function changeImage() {
    if (sequenceIndex >= sequence.length) return;
    resetAnswerButtons();
    resetTrainFeedback();

    var current = sequence[sequenceIndex];
    $('#nBackImage').attr('src', '../static/data/nBackImage/' + current.toString() + '.svg').show();
    imageSequence.push(current);
    userAns.push(0);
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);

    if (imageSequence.length <= N_BACK) {
        hideAnswerButtons();
        currentRequiresResponse = false;
    } else {
        showAnswerButtons();
        showTrainTarget(isTarget(imageSequence.length - 1));
        currentRequiresResponse = getAnswerTrialNumber() <= REQUIRED_RESPONSE_COUNT;
    }

    sequenceIndex += 1;
    setTimeout(hideImage, 500);
    if (!currentRequiresResponse) {
        advanceTimer = setTimeout(advanceTrain, 3000);
    }
}

function advanceTrain() {
    if (sequenceIndex < sequence.length) {
        changeImage();
    } else {
        hideImage();
        hideAnswerButtons();
        resetTrainFeedback();
        window.location.href = '../templates/train.html';
    }
}

function hideImage() {
    $('#nBackImage').hide();
}

function userAnsCheck(isCorrectAnswer) {
    var index = imageSequence.length - 1;
    if (index < N_BACK) return;
    var isAnswerCorrect = isCorrectAnswer === isTarget(index);
    userAns[index] = isAnswerCorrect ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();

    if (currentRequiresResponse) {
        currentRequiresResponse = false;
        clearTimeout(advanceTimer);
        hideImage();
        advanceTimer = setTimeout(advanceTrain, 1200);
    }
}

$(document).ready(function() {
    $('#nBackImage').removeAttr('src').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        changeImage();
    }, 3000);
});
