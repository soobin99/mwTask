var imageSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var sequence = [2, 5, 2, 7];
var sequenceIndex = 0;

function isTarget(index) {
    return index >= 2 && imageSequence[index] === imageSequence[index - 2];
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
    if (imageSequence.length <= 2) {
        hideAnswerButtons();
        resetTrainFeedback();
    } else {
        showAnswerButtons();
        showTrainTarget(isTarget(imageSequence.length - 1));
    }
    sequenceIndex += 1;
    setTimeout(hideImage, 500);
    setTimeout(function() {
        if (sequenceIndex < sequence.length) {
            changeImage();
        } else {
            window.location.href = '../templates/train.html';
        }
    }, 3000);
}

function hideImage() {
    $('#nBackImage').hide();
}

function userAnsCheck(isCorrectAnswer) {
    var index = imageSequence.length - 1;
    if (index < 2) return;
    var isAnswerCorrect = isCorrectAnswer === isTarget(index);
    userAns[index] = isAnswerCorrect ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
}

$(document).ready(function() {
    $('#nBackImage').hide();
    hideAnswerButtons();
    setTimeout(function() {
        $('#description').css({'fontSize': '20px', 'margin-top': '0'});
        changeImage();
    }, 3000);
});
