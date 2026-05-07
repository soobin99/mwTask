var maxCnt = TASK_CONFIG.maxCnt;
var numberSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num1 = 1;
var num2 = 1;
var targetSchedule = createTargetSchedule(maxCnt, 1);

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

function getRandomInt() {
    var nextIndex = numberSequence.length;
    if (nextIndex === 0) {
        setPairForSum(Math.floor(Math.random() * 17) + 2);
        return;
    }
    var targetSum = 20 - numberSequence[nextIndex - 1];
    var sum = targetSchedule[nextIndex] ? targetSum : getRandomNonTargetSum(targetSum);
    setPairForSum(sum);
}

function getRandomNonTargetSum(target) {
    var sum = Math.floor(Math.random() * 17) + 2;
    while (sum === target) {
        sum = Math.floor(Math.random() * 17) + 2;
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
    return index > 0 && numberSequence[index] + numberSequence[index - 1] === 20;
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
            completeTask('arithmetic2', buildRows());
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

function downloadCSV() {
    var rows = [{cnt: 'cnt', numberSequence: 'numberSequence', userAns: 'userAns', ansCheck: 'ansCheck', startTime: 'startTime', endTime: 'endTime', responseTime: 'responseTime'}];
    for (var i = 0; i < numberSequence.length; i++) {
        rows.push({
            cnt: i,
            numberSequence: numberSequence[i],
            userAns: userAns[i],
            ansCheck: ansCheck[i],
            startTime: startTime[i],
            endTime: endTime[i],
            responseTime: endTime[i] ? endTime[i] - startTime[i] : 0
        });
    }
    var csv = '';
    $.each(rows, function(i, item) {
        csv += item.cnt + ',' + item.numberSequence + ',' + item.userAns + ',' + item.ansCheck + ',' + item.startTime + ',' + item.endTime + ',' + item.responseTime + '\r\n';
    });
    var downloadLink = document.createElement('a');
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'arithmetic2_' + new Date().toString() + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
