var TEST_TASKS = [
    {
        name: '1back',
        title: '1-Back',
        path: '1Back.html',
        description: '두 이미지를 비교합니다. 현재 이미지가 바로 이전 이미지와 같으면 “정답입니다”, 다르면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'images',
        preview: ['1', '1'],
        highlights: [0, 1]
    },
    {
        name: '2back',
        title: '2-Back',
        path: '2Back.html',
        description: '세 이미지 중 첫 번째 이미지와 마지막 이미지를 비교합니다. 현재 이미지가 전전 이미지와 같으면 “정답입니다”, 다르면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'images',
        preview: ['2', '5', '2'],
        highlights: [0, 2]
    },
    {
        name: '3back',
        title: '3-Back',
        path: '3Back.html',
        description: '네 이미지 중 첫 번째 이미지와 마지막 이미지를 비교합니다. 현재 이미지가 3단계 이전 이미지와 같으면 “정답입니다”, 다르면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'images',
        preview: ['3', '6', '8', '3'],
        highlights: [0, 3]
    },
    {
        name: 'arithmetic1',
        title: 'Arithmetic 1-frame',
        path: 'arithmetic.html',
        description: '한 박스 안의 두 숫자 합이 10인지 판단합니다. 10이면 “정답입니다”, 아니면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'numbers',
        preview: [[4, 6]],
        highlights: [0]
    },
    {
        name: 'arithmetic2',
        title: 'Arithmetic 2-frame',
        path: 'arithmetic2.html',
        description: '두 박스의 숫자 4개 합이 20인지 판단합니다. 20이면 “정답입니다”, 아니면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'numbers',
        preview: [[4, 5], [6, 5]],
        highlights: [0, 1]
    },
    {
        name: 'arithmetic3',
        title: 'Arithmetic 3-frame',
        path: 'arithmetic3.html',
        description: '세 박스의 숫자 6개 합이 30인지 판단합니다. 30이면 “정답입니다”, 아니면 “정답이 아닙니다”를 선택해 주세요.',
        previewType: 'numbers',
        preview: [[4, 5], [6, 5], [5, 5]],
        highlights: [0, 2]
    }
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
    window.location.href = 'task-info.html';
}

function startCurrentTask() {
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
