var maxCnt = TASK_CONFIG.maxCnt;
var imageSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num = 1;
var targetSchedule = createTargetSchedule(maxCnt, 2);

function createTargetSchedule(total, minIndex) {
    var schedule = Array(total).fill(false);
    var candidates = [];
    for (var i = minIndex; i < total; i++) candidates.push(i);
    for (var j = candidates.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var temp = candidates[j];
        candidates[j] = candidates[k];
        candidates[k] = temp;
    }
    for (var t = 0; t < Math.round(total * 0.3); t++) schedule[candidates[t]] = true;
    return schedule;
}

function getDifferentImage(target) {
    var next = Math.floor(Math.random() * 8) + 1;
    return next >= target ? next + 1 : next;
}

function getRandomInt(nextIndex) {
    if (nextIndex < 2) return Math.floor(Math.random() * 9) + 1;
    var target = imageSequence[nextIndex - 2];
    return targetSchedule[nextIndex] ? target : getDifferentImage(target);
}

function isTarget(index) {
    return index >= 2 && imageSequence[index] === imageSequence[index - 2];
}

function buildRows() {
    return imageSequence.map(function(stimulus, index) {
        return {
            cnt: index,
            stimulus: stimulus,
            userAns: userAns[index],
            ansCheck: ansCheck[index],
            startTime: startTime[index],
            endTime: endTime[index],
            responseTime: endTime[index] ? endTime[index] - startTime[index] : 0,
            accuracy: userAns[index] === 1 ? 1 : 0
        };
    });
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
    if (imageSequence.length <= 2) {
        hideAnswerButtons();
    } else {
        showAnswerButtons();
    }
    setTimeout(hideImage, 500);
    setTimeout(function() {
        if (imageSequence.length < maxCnt) {
            changeImage();
        } else {
            completeTask('2back', buildRows());
        }
    }, 3000);
}

function hideImage() {
    $('#nBackImage').hide();
    num = getRandomInt(imageSequence.length);
    $('#nBackImage').attr('src', '../static/data/nBackImage/' + num.toString() + '.svg');
}

function userAnsCheck(isCorrectAnswer) {
    var index = imageSequence.length - 1;
    if (index < 2) return;
    userAns[index] = isCorrectAnswer === isTarget(index) ? 1 : -1;
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
