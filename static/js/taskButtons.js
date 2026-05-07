function showAnswerButtons() {
    $('.answer-actions').css('display', 'grid');
}

function hideAnswerButtons() {
    $('.answer-actions').hide();
}

function resetAnswerButtons() {
    $('.answer-button').removeClass('is-correct-selected is-incorrect-selected');
}

function markAnswerButton(isCorrectAnswer) {
    resetAnswerButtons();
    if (isCorrectAnswer) {
        $('#correctAnsButton').addClass('is-correct-selected');
    } else {
        $('#incorrectAnsButton').addClass('is-incorrect-selected');
    }
}

function submitAnswer(isCorrectAnswer) {
    if (typeof userAnsCheck === 'function') {
        userAnsCheck(isCorrectAnswer);
        markAnswerButton(isCorrectAnswer);
    }
}

function showTrainFeedback(isAnswerCorrect) {
    var feedback = $('#trainFeedback');
    if (!feedback.length) return;
    feedback
        .removeClass('correct incorrect')
        .addClass(isAnswerCorrect ? 'correct' : 'incorrect')
        .text(isAnswerCorrect ? '정답입니다' : '정답이 아닙니다');
}

function resetTrainFeedback() {
    $('#trainFeedback').removeClass('correct incorrect').text('');
}

function showTrainTarget(isTargetTrial) {
    var feedback = $('#trainFeedback');
    if (!feedback.length) return;
    feedback
        .removeClass('correct incorrect')
        .addClass(isTargetTrial ? 'correct' : 'incorrect')
        .text(isTargetTrial ? '정답입니다' : '정답이 아닙니다');
}
