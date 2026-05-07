var VLAT_CSV_PATH = '../static/data/VLAT/visAns.CSV';
var VLAT_IMAGE_BASE = '../static/data/VLAT/';

function parseCsv(text) {
    var rows = [];
    var row = [];
    var value = '';
    var inQuotes = false;

    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var nextChar = text[i + 1];

        if (char === '"' && inQuotes && nextChar === '"') {
            value += '"';
            i += 1;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            row.push(value);
            value = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i += 1;
            row.push(value);
            if (row.some(function(cell) { return cell.trim() !== ''; })) rows.push(row);
            row = [];
            value = '';
        } else {
            value += char;
        }
    }

    if (value || row.length) {
        row.push(value);
        rows.push(row);
    }

    return rows;
}

function csvRowsToObjects(rows) {
    var headers = rows[0].map(function(header, index) {
        return index === 5 ? 'taskText' : header.trim();
    });
    return rows.slice(1).map(function(row) {
        var item = {};
        headers.forEach(function(header, index) {
            item[header] = row[index] ? row[index].trim() : '';
        });
        return item;
    });
}

function loadVlatTasks() {
    return fetch(VLAT_CSV_PATH)
        .catch(function() {
            return fetch('../static/data/VLAT/visAns.csv');
        })
        .then(function(response) {
            if (!response.ok) throw new Error('VLAT task file load failed');
            return response.text();
        })
        .then(function(text) {
            return csvRowsToObjects(parseCsv(text));
        });
}

function shuffleVlatTasks(tasks) {
    var shuffled = tasks.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
    }
    return shuffled;
}

function startVlatFlow() {
    loadVlatTasks().then(function(tasks) {
        sessionStorage.setItem('currentFlow', 'vlat');
        sessionStorage.setItem('vlatTasks', JSON.stringify(shuffleVlatTasks(tasks)));
        sessionStorage.setItem('vlatIndex', '0');
        sessionStorage.setItem('vlatResults', JSON.stringify([]));
        sessionStorage.removeItem('currentVlatResult');
        window.location.href = 'vlat-task.html';
    }).catch(function(error) {
        alert('VLAT 과제 정보를 불러오지 못했습니다.');
        console.error(error);
    });
}

function getVlatTasks() {
    return JSON.parse(sessionStorage.getItem('vlatTasks') || '[]');
}

function getVlatIndex() {
    return Number(sessionStorage.getItem('vlatIndex') || '0');
}

function getVlatImageFile(task) {
    var fileName = task.visualization || '';
    return /\.(png|jpg|jpeg|svg)$/i.test(fileName) ? fileName : fileName + '.png';
}

function completeVlatTask(task, selectedAnswer, startTime) {
    var endTime = Date.now();
    var correctAnswer = String(task['ans cnt'] || '').trim();
    var isCorrect = String(selectedAnswer) === correctAnswer ? 1 : 0;

    sessionStorage.setItem('currentVlatResult', JSON.stringify({
        taskNumber: task.count,
        visualization: getVlatImageFile(task),
        startTime: startTime,
        responseTime: endTime - startTime,
        answer: selectedAnswer,
        accuracy: isCorrect
    }));
    window.location.href = 'nasa-tlx.html';
}

function saveVlatTlx(tlxScores) {
    var result = JSON.parse(sessionStorage.getItem('currentVlatResult') || 'null');
    if (!result) return;

    result.tlx = tlxScores.map(function(item) {
        return item.score;
    });

    var results = JSON.parse(sessionStorage.getItem('vlatResults') || '[]');
    results.push(result);
    sessionStorage.setItem('vlatResults', JSON.stringify(results));
    sessionStorage.removeItem('currentVlatResult');

    var nextIndex = getVlatIndex() + 1;
    var tasks = getVlatTasks();
    sessionStorage.setItem('vlatIndex', String(nextIndex));

    if (nextIndex >= tasks.length) {
        downloadVlatCsv(results);
        sessionStorage.removeItem('currentFlow');
        sessionStorage.setItem('vlatNextPath', 'visualizationInfo2.html');
    } else {
        sessionStorage.setItem('vlatNextPath', 'vlat-task.html');
    }
}

function isLastVlatTask() {
    return getVlatIndex() >= getVlatTasks().length - 1;
}

function continueVlatAfterTlx(tlxScores) {
    saveVlatTlx(tlxScores);
    if (!isLastVlatTask()) {
        advanceVlatAfterTlx();
    }
}

function advanceVlatAfterTlx() {
    var nextPath = sessionStorage.getItem('vlatNextPath') || 'vlat-task.html';
    sessionStorage.removeItem('vlatNextPath');
    window.location.href = nextPath;
}

function saveVlatTlxAndContinue(tlxScores) {
    saveVlatTlx(tlxScores);
    advanceVlatAfterTlx();
}

function escapeCsvValue(value) {
    var text = String(value == null ? '' : value);
    if (/[",\r\n]/.test(text)) {
        return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
}

function downloadVlatCsv(results) {
    var header = [
        'taskID',
        'chartType',
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
            result.taskNumber,
            result.visualization,
            result.startTime,
            result.responseTime,
            result.answer,
            result.accuracy
        ].concat(result.tlx || []);
        csv += row.map(escapeCsvValue).join(',') + '\r\n';
    });

    var downloadLink = document.createElement('a');
    var blob = new Blob([csv], {type: 'text/csv;charset=utf-8'});
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'VLAT_' + formatTimestamp(new Date()) + '.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
