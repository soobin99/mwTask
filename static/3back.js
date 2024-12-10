var cnt = 0;
var maxCnt = 40;
var imageSequence = [];
var userAns = [];
var num = 1;
var ansCheck = [];
var startTime = [];
var endTime = [];

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
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
    console.log(userAns);
}

function userAnsCheck() {
    if (cnt < 3) return;
    if (imageSequence[cnt] == imageSequence[cnt - 3]) {
        userAns[cnt] = 1;
    } else if (imageSequence[cnt] != imageSequence[cnt - 3]) {
        userAns[cnt] = -1;
    }
    ansCheck[cnt] = 1;
    endTime[cnt] = Date.now();
    console.log('userAns Update');
    console.log(userAns);
    return;
}
function downloadCSV(){
		var array = [];

        array.push({cnt:'cnt', imageSequence: 'imageSequence', userAns: 'userAns',
            ansCheck:'ansCheck',startTime:'startTime',endTime:'endTime'});
        for(var i=0;i<imageSequence.length;i++){
            array.push({cnt:i, imageSequence: imageSequence[i], userAns: userAns[i],
            ansCheck:ansCheck[i], startTime: startTime[i], endTime: endTime[i]});
        }

		var a = "";
		$.each(array, function(i, item){
			a += item.cnt + "," + item.imageSequence + "," + item.userAns + "," +
                item.ansCheck + "," + item.startTime + "," + item.endTime + "\r\n";
		});

		var downloadLink = document.createElement("a");
		var blob = new Blob([a], { type: "text/csv;charset=utf-8" });
		var url = URL.createObjectURL(blob);
		downloadLink.href = url;
        let today = new Date();
		downloadLink.download = "3back_"+today.toString()+".csv";

		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
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
            window.location.href = '../index.html';
            downloadCSV();
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