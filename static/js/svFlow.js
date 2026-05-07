function shuffleSvTasks(tasks) {
    var shuffled = tasks.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function startSvFlow() {
    if (!sessionStorage.getItem('visualizationOrder')) {
        sessionStorage.setItem('visualizationOrder', JSON.stringify(['sv', 'vlat']));
        sessionStorage.setItem('visualizationIndex', '0');
    }
    var trainingTasks = (typeof Trainingsurvey !== 'undefined' ? Trainingsurvey : []).map(function(task) {
        return Object.assign({isTraining: true}, task);
    });
    var testTasks = shuffleSvTasks(typeof AllStimuli !== 'undefined' ? AllStimuli : []);
    sessionStorage.setItem('currentFlow', 'sv');
    sessionStorage.setItem('svTasks', JSON.stringify(trainingTasks.concat(testTasks)));
    sessionStorage.setItem('svIndex', '0');
    sessionStorage.setItem('svResults', JSON.stringify([]));
    sessionStorage.removeItem('currentSvResult');
    window.location.href = 'sv-task.html';
}

function getSvTasks() {
    return JSON.parse(sessionStorage.getItem('svTasks') || '[]');
}

function getSvIndex() {
    return Number(sessionStorage.getItem('svIndex') || '0');
}

function isLastSvTask() {
    return getSvIndex() >= getSvTasks().length - 1;
}

function completeSvTask(task, selectedAnswer, startTime) {
    var endTime = Date.now();
    sessionStorage.setItem('currentSvResult', JSON.stringify({
        taskID: task.qnum,
        chartType: task.type,
        level: task.isTraining ? 'training' : task.level,
        density: task.density,
        image: task.image,
        start: startTime,
        time: endTime - startTime,
        ans: selectedAnswer,
        acc: selectedAnswer === task.answer ? 1 : 0
    }));
    window.location.href = 'nasa-tlx.html';
}

function saveSvTlx(tlxScores) {
    var result = JSON.parse(sessionStorage.getItem('currentSvResult') || 'null');
    if (!result) return;

    result.tlx = tlxScores.map(function(item) {
        return item.score;
    });

    var results = JSON.parse(sessionStorage.getItem('svResults') || '[]');
    results.push(result);
    sessionStorage.setItem('svResults', JSON.stringify(results));
    sessionStorage.removeItem('currentSvResult');

    var nextIndex = getSvIndex() + 1;
    var tasks = getSvTasks();
    sessionStorage.setItem('svIndex', String(nextIndex));

    if (nextIndex >= tasks.length) {
        downloadSvCsv(results);
        sessionStorage.removeItem('currentFlow');
        sessionStorage.setItem('svNextPath', completeVisualizationSet());
    } else {
        sessionStorage.setItem('svNextPath', 'sv-task.html');
    }
}

function continueSvAfterTlx(tlxScores) {
    saveSvTlx(tlxScores);
    if (!isLastSvTask()) {
        advanceSvAfterTlx();
    }
}

function advanceSvAfterTlx() {
    var nextPath = sessionStorage.getItem('svNextPath') || 'sv-task.html';
    sessionStorage.removeItem('svNextPath');
    window.location.href = nextPath;
}

function escapeSvCsvValue(value) {
    var text = String(value == null ? '' : value);
    if (/[",\r\n]/.test(text)) {
        return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
}

function downloadSvCsv(results) {
    var header = [
        'taskID',
        'chartType',
        'level',
        'density',
        'image',
        'start',
        'time',
        'ans',
        'acc',
        'mental',
        'physical',
        'temporal',
        'performance',
        'frustration',
        'effort'
    ];
    var csv = header.join(',') + '\r\n';

    results.forEach(function(result) {
        var row = [
            result.taskID,
            result.chartType,
            result.level,
            result.density,
            result.image,
            result.start,
            result.time,
            result.ans,
            result.acc
        ].concat(result.tlx || []);
        csv += row.map(escapeSvCsvValue).join(',') + '\r\n';
    });

    var downloadLink = document.createElement('a');
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'SV_' + formatTimestamp(new Date()) + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
