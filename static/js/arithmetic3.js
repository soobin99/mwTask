var maxCnt = TASK_CONFIG.maxCnt;
var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num1 = 1;
var num2 = 1;
var targetSchedule = createTargetSchedule(maxCnt, 2);

function createTargetSchedule(total, minIndex) {
    var schedule = Array(total).fill(false);
    var offset = minIndex + Math.floor(Math.random() * 3);
    var candidates = [];
    for (var i = offset; i < total; i += 3) {
        candidates.push(i);
    }
    for (var j = candidates.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var temp = candidates[j];
        candidates[j] = candidates[k];
        candidates[k] = temp;
    }
    for (var t = 0; t < Math.round(total * 0.3); t++) {
        schedule[candidates[t]] = true;
    }
    return schedule;
}

function getRandomInt() {
    var nextIndex = numberSequence.length;
    if (nextIndex < 2) {
        setPairForSum(Math.floor(Math.random() * 7) + 8);
        return;
    }
    var targetSum = 30 - numberSequence[nextIndex - 1] - numberSequence[nextIndex - 2];
    var sum = targetSchedule[nextIndex]
        ? targetSum
        : getRandomNonTargetSum(targetSum);
    setPairForSum(sum);
}

function getRandomNonTargetSum(target) {
    var sum = Math.floor(Math.random() * 4) + 8;
    while (sum === target) {
        sum = Math.floor(Math.random() * 4) + 8;
    }
    return sum;
}

function setPairForSum(sum) {
    var min = Math.max(1, sum - 9);
    var max = Math.min(9, sum - 1);
    num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    num2 = sum - num1;
}

function isTarget(index) {
    return index > 1 && numberSequence[index] + numberSequence[index - 1] + numberSequence[index - 2] === 30;
}

function buildRows() {
    return numberSequence.map(function(stimulus, index) {
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

function changeNum() {
    if (numberSequence.length >= maxCnt) return;
    resetAnswerButtons();
    $('#number').show();
    numberSequence.push(num1 + num2);
    userAns.push(0);
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
    if (numberSequence.length <= 2) {
        hideAnswerButtons();
    } else {
        showAnswerButtons();
    }
    setTimeout(hideNum, 500);
    setTimeout(function() {
        if (numberSequence.length < maxCnt) {
            changeNum();
        } else {
            completeTask('arithmetic3', buildRows());
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
    if (index < 2) return;
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
        changeNum();
    }, 3000);
});
