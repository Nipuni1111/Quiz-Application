const quizContainer = document.querySelector(".quiz-container");
const answerOptions = document.querySelector(".answer-options");
const questionText = document.querySelector(".question-text");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer = document.querySelector(".result-container");
const tryAgainBtn = document.querySelector(".try-again-btn");

// Quiz state variables
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;
let quizCategory = "programming";
let numberOfQuestions = 10;
let currentQuestion = null;
let correctAnswersCount = 0;
const questionIndexHistory = [];

// Function to show the quiz results
const showResult = () => {
    quizContainer.style.display = "none";  // Hide the quiz container
    resultContainer.style.display = "block";  // Show result container

    // Update result message
    resultContainer.querySelector(".result-message").innerHTML =
        `You answered <b>${correctAnswersCount}</b> out of <b>${numberOfQuestions}</b> questions correctly! Great effort! Thank you!`;
};

// Function to reset timer
const resetTimer = () => {
    clearInterval(timer);
    currentTime = QUIZ_TIME_LIMIT;
    timerDisplay.textContent = `${currentTime}s`;
};

// Function to start the timer
const startTimer = () => {
    timer = setInterval(() => {
        currentTime--;
        timerDisplay.textContent = `${currentTime}s`;

        if (currentTime <= 0) {
            clearInterval(timer);
            highlightCorrectAnswer();

            answerOptions.querySelectorAll(".answer-option").forEach(option => option.style.pointerEvents = "none");
        }
    }, 1000);
};

// Function to fetch a random question
const getRandomQuestion = () => {
    const categoryQuestions = questions.find(cat => cat.category.toLowerCase() === quizCategory.toLowerCase())?.questions || [];

    // Stop and show result if all questions have been asked
    if (questionIndexHistory.length >= Math.min(categoryQuestions.length, numberOfQuestions)) {
        showResult();
        return null;
    }

    // Filter out already asked questions
    const availableQuestions = categoryQuestions.filter((_, index) => !questionIndexHistory.includes(index));

    if (availableQuestions.length === 0) {
        showResult();
        return null;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    questionIndexHistory.push(categoryQuestions.indexOf(randomQuestion));
    return randomQuestion;
};

// Function to highlight the correct answer
const highlightCorrectAnswer = () => {
    const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
    correctOption.classList.add("correct");

    // Add a tick mark (✓) to the correct answer
    const iconHTML = '<span class="material-symbols-rounded">check_circle</span>';
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
};

// Function to handle user's answer selection
const handleAnswer = (option, answerIndex) => {
    clearInterval(timer);
    const isCorrect = currentQuestion.correctAnswer === answerIndex;

    // Highlight the selected option (correct or incorrect)
    option.classList.add(isCorrect ? 'correct' : 'incorrect');

    // If incorrect, highlight the correct answer
    if (!isCorrect) {
        highlightCorrectAnswer();
    } else {
        correctAnswersCount++; // Increment correct answer count
    }

    // Add an icon (tick or cross) to the selected option
    const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
    option.insertAdjacentHTML("beforeend", iconHTML);

    // Disable further clicks on answer options
    answerOptions.querySelectorAll(".answer-option").forEach(opt => {
        opt.style.pointerEvents = "none";
    });
    nextQuestionBtn.style.visibility = "visible";
};

// Function to render a new question
const renderQuestion = () => {
    currentQuestion = getRandomQuestion();
    if (!currentQuestion) return;

    resetTimer();
    startTimer();

    // Update question text
    questionText.textContent = currentQuestion.question;

    // Clear previous options
    answerOptions.innerHTML = "";
    nextQuestionBtn.style.visibility = "hidden";
    questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

    // Create and append new answer options
    currentQuestion.options.forEach((option, index) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        answerOptions.appendChild(li);

        // Add click event listener to each option
        li.addEventListener("click", () => handleAnswer(li, index));
    });
};

// Function to restart the quiz
const restartQuiz = () => {
    questionIndexHistory.length = 0;
    correctAnswersCount = 0;
    resultContainer.style.display = "none";
    quizContainer.style.display = "block";
    renderQuestion();
};

// Add event listener for the "Next" button
nextQuestionBtn.addEventListener("click", renderQuestion);

// Add event listener for the "Try Again" button
tryAgainBtn.addEventListener("click", restartQuiz);

// Initial render
renderQuestion();


// Add event listener for the "Next" button
nextQuestionBtn.addEventListener("click", renderQuestion);