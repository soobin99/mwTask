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
