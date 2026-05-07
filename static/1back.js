var maxCnt = 100;
var imageSequence = [];
var userAns = [];
var ansCheck = [];
var startTime = [];
var endTime = [];
var num = 1;
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

function getDifferentImage(target) {
    var next = Math.floor(Math.random() * 8) + 1;
    return next >= target ? next + 1 : next;
}

function getRandomInt(nextIndex) {
    if (nextIndex < 1) return Math.floor(Math.random() * 9) + 1;
    var target = imageSequence[nextIndex - 1];
    return targetSchedule[nextIndex] ? target : getDifferentImage(target);
}

function isTarget(index) {
    return index > 0 && imageSequence[index] === imageSequence[index - 1];
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
            completeTask('1back', buildRows());
        }
    }, 3000);
}

function hideImage() {
    $('#nBackImage').hide();
    num = getRandomInt(imageSequence.length);
    $('#nBackImage').attr('src', '../static/nBackImage/' + num.toString() + '.svg');
}

function userAnsCheck(isCorrectAnswer) {
    var index = imageSequence.length - 1;
    if (index < 0) return;
    userAns[index] = isCorrectAnswer === isTarget(index) ? 1 : -1;
    ansCheck[index] = 1;
    endTime[index] = Date.now();
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

function downloadCSV() {
    var rows = [{cnt: 'cnt', imageSequence: 'imageSequence', userAns: 'userAns', ansCheck: 'ansCheck', startTime: 'startTime', endTime: 'endTime', responseTime: 'responseTime'}];
    for (var i = 0; i < imageSequence.length; i++) {
        rows.push({
            cnt: i,
            imageSequence: imageSequence[i],
            userAns: userAns[i],
            ansCheck: ansCheck[i],
            startTime: startTime[i],
            endTime: endTime[i],
            responseTime: endTime[i] ? endTime[i] - startTime[i] : 0
        });
    }
    var csv = '';
    $.each(rows, function(i, item) {
        csv += item.cnt + ',' + item.imageSequence + ',' + item.userAns + ',' + item.ansCheck + ',' + item.startTime + ',' + item.endTime + ',' + item.responseTime + '\r\n';
    });
    var downloadLink = document.createElement('a');
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = '1back_' + new Date().toString() + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
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
