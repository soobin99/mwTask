var cnt = 0;
var maxCnt = 20;
var numberSequence = [];
var userAns = [];
var num1 = 1;
var num2 = 1;


function getRandomInt() {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * 9) + 1;
    if (num1 + num2 != 10) {
        if (num1 + num2 > 10) {
            if (num1 > num2) num1 = Math.floor(Math.random() * 7) + 2;
            else num2 = Math.floor(Math.random() * 7) + 2;
        } else {
            if (num1 > num2) num2 = Math.floor(Math.random() * 7) + 3;
            else num1 = Math.floor(Math.random() * 7) + 3;
        }

    }
}

function changeNum() {
    $('#number').show();
    numberSequence.push(num1 + num2);
    addUserAns();
    return;
}

function hideNum() {
    $('#number').hide();
    getRandomInt();
    $('#num1').text(num1.toString());
    $('#num2').text(num2.toString());

}

function addUserAns() {
    if (numberSequence[cnt] == 10) {
        userAns.push(-1);
    } else {
        userAns.push(1);
    }
    console.log(cnt, numberSequence[cnt], userAns[cnt]);
}

function userAnsCheck() {
    if (numberSequence[cnt] == 10) {
        userAns[cnt] = 1;
    } else {
        userAns[cnt] = -1;
    }
    console.log('userAns Update');
    console.log(userAns);
    return;
}

function updateSystem() {
    if (cnt < maxCnt) {
        setTimeout(function () {
            hideNum();
        }, 500); //0.5초 뒤 이미지 삭제
        setTimeout(function () {
            changeNum();
            cnt += 1;
        }, 2500); //2.5초 뒤 이미지 생성
    }
    else {
        setTimeout(function () {
            hideNum();
            clearInterval(timerId);
        }, 500);
        setTimeout(function () {
            window.location.href = '../main.html';
        }, 2500); //2.5초 뒤 이미지 생성
    }
    return;
}

$(document).ready(function () {
    $('#number').hide();
    $('#userAnsButton').hide();

    setTimeout(function () {
        $('#description').css("fontSize", '30px');
        $('#description').css("margin-top", '2%');
        $('#userAnsButton').show();
    }, 3000);

    timerId = setInterval(updateSystem, 3000);
    //while (cnt <= maxCnt) {}
});


//setTimeout(function () {alert("hello");}, 3000);