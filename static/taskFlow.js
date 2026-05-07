var TEST_TASKS = [
    {name: '1back', path: '1Back.html'},
    {name: '2back', path: '2Back.html'},
    {name: '3back', path: '3Back.html'},
    {name: 'arithmetic1', path: 'arithmetic.html'},
    {name: 'arithmetic2', path: 'arithmetic2.html'},
    {name: 'arithmetic3', path: 'arithmetic3.html'}
];

function shuffleTasks(tasks) {
    var shuffled = tasks.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function startRandomTestFlow() {
    sessionStorage.setItem('taskOrder', JSON.stringify(shuffleTasks(TEST_TASKS)));
    sessionStorage.setItem('taskIndex', '0');
    sessionStorage.removeItem('currentTaskResult');
    goToCurrentTask();
}

function getTaskOrder() {
    var stored = sessionStorage.getItem('taskOrder');
    return stored ? JSON.parse(stored) : TEST_TASKS;
}

function getTaskIndex() {
    return Number(sessionStorage.getItem('taskIndex') || '0');
}

function goToCurrentTask() {
    var order = getTaskOrder();
    var index = getTaskIndex();
    if (index >= order.length) {
        window.location.href = 'visualizationInfo.html';
        return;
    }
    window.location.href = order[index].path;
}

function completeTask(taskName, rows) {
    sessionStorage.setItem('currentTaskResult', JSON.stringify({
        taskName: taskName,
        rows: rows
    }));
    window.location.href = 'nasa-tlx.html';
}

function formatTimestamp(date) {
    function pad(value) {
        return String(value).padStart(2, '0');
    }
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate())
    ].join('') + '_' + [
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join('');
}

function downloadTaskCsv(taskName, rows, tlxScores) {
    var csv = 'section,cnt,stimulus,userAns,ansCheck,startTime,endTime,responseTime,accuracy,question,score\r\n';
    var answeredRows = rows.filter(function(row) {
        return row.ansCheck === 1;
    });
    var correctRows = rows.filter(function(row) {
        return row.accuracy === 1;
    });
    var averageResponseTime = answeredRows.length
        ? Math.round(answeredRows.reduce(function(sum, row) {
            return sum + Number(row.responseTime || 0);
        }, 0) / answeredRows.length)
        : 0;
    var accuracyRate = rows.length
        ? Math.round((correctRows.length / rows.length) * 10000) / 100
        : 0;

    csv += ['summary', '', '', '', '', '', '', averageResponseTime, accuracyRate, 'answeredCount', answeredRows.length].join(',') + '\r\n';
    csv += ['summary', '', '', '', '', '', '', '', '', 'totalCount', rows.length].join(',') + '\r\n';

    rows.forEach(function(row) {
        csv += [
            'trial',
            row.cnt,
            row.stimulus,
            row.userAns,
            row.ansCheck,
            row.startTime,
            row.endTime,
            row.responseTime,
            row.accuracy,
            '',
            ''
        ].join(',') + '\r\n';
    });
    tlxScores.forEach(function(item) {
        csv += ['nasa-tlx', '', '', '', '', '', '', '', '', '"' + item.question.replace(/"/g, '""') + '"', item.score].join(',') + '\r\n';
    });

    var downloadLink = document.createElement('a');
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = taskName + '_' + formatTimestamp(new Date()) + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function advanceToNextTask() {
    var nextIndex = getTaskIndex() + 1;
    sessionStorage.setItem('taskIndex', String(nextIndex));
    sessionStorage.removeItem('currentTaskResult');
    goToCurrentTask();
}
