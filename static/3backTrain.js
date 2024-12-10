var cnt = 0;
var maxCnt = 20;
var imageSequence = [];
var userAns = [];
var num = 1;


function getRandomInt() {
    var randNum = Math.random();
    return Math.floor(randNum * 9) + 1;
}

function changeImage() {
    $('#nBackImage').show();
    imageSequence.push(num);
    addUserAns();
    return;
}

function hideImage() {
    console.log(imageSequence);
    $('#nBackImage').hide();
    num = getRandomInt();
    var imgUrl = '../static/nBackImage/' + num.toString() + '.svg';

    $('#nBackImage').attr('src', imgUrl);

}

function addUserAns() {
    if (cnt < 3) {
        userAns.push(0);
    } else if (imageSequence[cnt] == imageSequence[cnt - 3]) {
        userAns.push(-1);
    } else if (imageSequence[cnt] != imageSequence[cnt - 3]) {
        userAns.push(1);
    }
    console.log(userAns);
}

function userAnsCheck() {
    if (cnt < 3) return;
    if (imageSequence[cnt] == imageSequence[cnt - 3]) {
        userAns[cnt] = 1;
    } else if (imageSequence[cnt] != imageSequence[cnt - 3]) {
        userAns[cnt] = -1;
    }
    console.log('userAns Update');
    console.log(userAns);
    return;
}

function updateSystem() {
    if (cnt < maxCnt) {
        setTimeout(function () {
            hideImage();
        }, 500); //0.5초 뒤 이미지 삭제
        setTimeout(function () {
            cnt += 1;
            changeImage();
        }, 2500); //2.5초 뒤 이미지 생
        console.log(cnt);

    } else {
        setTimeout(function () {
            hideImage();
            clearInterval(timerId);
        }, 500);
        setTimeout(function () {
            window.location.href = '../main.html';
        }, 2500); //2.5초 뒤 이미지 생성
    }
    return;
}

$(document).ready(function () {
    $('#nBackImage').hide();
    $('#userAnsButton').hide();

    setTimeout(function () {
        $('#description').css("fontSize", '30px');
        $('#description').css("margin-top", '2%');
        $('#userAnsButton').show();

        changeImage();

        setTimeout(function () {
            hideImage();
        }, 500); //0.5초 뒤 이미지 삭제

    }, 3000);

    timerId = setInterval(updateSystem, 3000);
    //while (cnt <= maxCnt) {}
});


//setTimeout(function () {alert("hello");}, 3000);