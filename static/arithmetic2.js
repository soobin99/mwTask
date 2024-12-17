var cnt = 0;
var maxCnt = 40;//200;
var numberSequence = [];
var userAns = [];
var num1 = 1;
var num2 = 1;
var sum=0;
var ansCheck = [];
var startTime = [];
var endTime = [];

function getRandomInt() {
    if (sum == 0)
        sum = num1+num2;
    if(cnt%3==0){
        console.log(num1, num2);
        num1 = Math.floor(Math.random() * 9) + 1; // num1을 1~9 사이에서 랜덤하게 선택
        num2 = 20 - sum - num1; 
        if (num2 < 1)
            num2 = 1;
        else if (num2 > 9)
            num2 = 9;
        
        console.log(sum, num1, num2);
    }
    else{    
        num1 = Math.floor(Math.random() * 9) + 1;
        num2 = Math.floor(Math.random() * 9) + 1;
    }
    sum = num1+num2;
}
/*
function getRandomInt() {
    num1 = Math.floor(Math.random() * 9) + 1;
    num2 = Math.floor(Math.random() * 9) + 1;
    if (numberSequence[cnt] + num1 + num2 != 20) {
        if (numberSequence[cnt] > 10) {
            if (num1 + num2 > 10) {
                if (num1 > num2) num1 = Math.floor(Math.random() * 6) + 2;
                else num2 = Math.floor(Math.random() * 6) + 2;
            }
        } else {
            if (num1 + num2 < 10) {
                if (num1 > num2) num2 = Math.floor(Math.random() * 6) + 2;
                else num1 = Math.floor(Math.random() * 6) + 2;
            }
        }

    }
}
*/
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
    if (cnt == 0) {
        userAns.push(0);
    } else if (numberSequence[cnt] + numberSequence[cnt - 1] == 20) {
        userAns.push(-1);
    } else {
        userAns.push(1);
    }
    ansCheck.push(0);
    startTime.push(Date.now());
    endTime.push(0);
}

function userAnsCheck() {
    if (numberSequence[cnt] + numberSequence[cnt - 1] == 20) {
        userAns[cnt] = 1;
    } else {
        userAns[cnt] = -1;
    }
    ansCheck[cnt] = 1;
    endTime[cnt] = Date.now();
    return;
}
/*
function userAnsCheck() {
    if (numberSequence[cnt-1] + numberSequence[cnt - 2] == 20) {
        userAns[cnt-1] = 1;
    } else {
        userAns[cnt-1] = -1;
    }
    console.log('userAns Update');
    console.log(cnt-1, numberSequence[cnt-1] + numberSequence[cnt - 2], userAns[cnt-1]);
    return;
}
*/
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
    else{
        setTimeout(function () {
            hideNum();
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


function downloadCSV(){
		var array = [];

        array.push({cnt:'cnt', numberSequence: 'numberSequence', userAns: 'userAns',
            ansCheck:'ansCheck',startTime:'startTime',endTime:'endTime'});
        for(var i=0;i<numberSequence.length;i++){
            array.push({cnt:i, numberSequence: numberSequence[i], userAns: userAns[i],
            ansCheck:ansCheck[i], startTime: startTime[i], endTime: endTime[i]});
        }

		var a = "";
		$.each(array, function(i, item){
			a += item.cnt + "," + item.numberSequence + "," + item.userAns + "," +
                item.ansCheck + "," + item.startTime + "," + item.endTime + "\r\n";
		});

		var downloadLink = document.createElement("a");
		var blob = new Blob([a], { type: "text/csv;charset=utf-8" });
		var url = URL.createObjectURL(blob);
		downloadLink.href = url;
        let today = new Date();
		downloadLink.download = "arithmetic2_"+today.toString()+".csv";

		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}

//setTimeout(function () {alert("hello");}, 3000);