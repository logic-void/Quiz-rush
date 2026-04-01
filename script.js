let questionIndex = 0;
let questions;
let score = 0;
const optionLabel = document.getElementById("options-dropdown");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const optionDropdown = document.getElementsByClassName("option-container")[0];
const categoryOptions = Array.from(document.querySelectorAll(".option"));
const categoryText = document.getElementById("category-text");
const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const questionTrack = document.getElementById("question-track");
const scoreText = document.getElementById("score-text");
const btnContainer = document.querySelector(".button-container");
const resultText = document.getElementById("result-text");
const endScreen = document.getElementById("end-screen");
const restartBtn = document.getElementById("restart-btn");
const finalScore = document.getElementById("final-score");
const resultTexts = [
    "Oops! Better luck next time!",
    "Don't give up, keep trying!",
    "You're learning, keep going!",
    "Not bad, keep practicing!",
    "Getting there, nice effort!",
    "Good job, you know your stuff!",
    "Well done, solid knowledge!",
    "Great work, impressive!",
    "Awesome! You're really good at this!",
    "Excellent! You really know your stuff!",
    "Perfect score! You're a quiz master!"
];
const triviaCategories = {
    "General Knowledge": 9,
    Books: 10,
    Film: 11,
    Music: 12,
    Television: 14,
    "Video Games": 15,
    "Board Games": 16,
    "Science & Nature": 17,
    "Science: Computers": 18,
    "Science: Mathematics": 19,
    Mythology: 20,
    Sports: 21,
    Geography: 22,
    History: 23,
    Politics: 24,
    Arts: 25,
    Celebrities: 26,
    Animals: 27,
    Vehicles: 28,
    Comics: 29,
    Gadgets: 30,
    "Anime & Manga": 31,
    "Cartoon & Animations": 32
};
const url = "https://opentdb.com/api.php?amount=10&category={id}&type=multiple";
optionLabel.addEventListener("click", () => {
    document.body.style.pointerEvents = "none";
    optionDropdown.classList.toggle("active");
    setTimeout(() => {
        document.body.style.pointerEvents = "auto";
    }, 1200);
});
categoryOptions.forEach(option => {
    option.addEventListener("click", e => {
        e.stopPropagation();
        const clicked = e.target;
        categoryText.textContent = clicked.textContent + " ⌵";
        optionDropdown.classList.remove("active");
        document.body.style.pointerEvents = "auto";
    });
});
restartBtn.addEventListener("click", () => {
    restartBtn.disabled = true;
    setTimeout(() => {
        endScreen.classList.remove("active");
        startScreen.classList.add("active");
        questionIndex = 0;
        score = 0;
    }, 500);
});
function loadNextQuestion() {
    const currentQuestion = questions[questionIndex];
    questionText.textContent = decodeHTML(currentQuestion.question);
    questionTrack.textContent = questionIndex + 1;
    scoreText.textContent = score;
    btnContainer.innerHTML = "";
    const questionOptions = shuffle([
        currentQuestion.correct_answer,
        ...currentQuestion.incorrect_answers
    ]);
    questionOptions.forEach(optionText => {
        const optionBtn = document.createElement("button");
        optionBtn.textContent = decodeHTML(optionText);
        if (optionText === currentQuestion.correct_answer) {
            optionBtn.dataset.correct = true;
        }
        optionBtn.addEventListener("click", e => {
            const clickedBtn = e.target;
            const buttons = document.querySelectorAll(
                ".button-container button"
            );

            buttons.forEach(btn => (btn.disabled = true));

            if (clickedBtn.dataset.correct) {
                clickedBtn.classList.add("correct");
                score++;
            } else {
                clickedBtn.classList.add("incorrect");
                buttons.forEach(btn => {
                    if (btn.dataset.correct) btn.classList.add("correct");
                });
            }
            questionIndex++;
            questionIndex < questions.length
                ? setTimeout(loadNextQuestion, 1000)
                : setTimeout(endQuiz, 2000);
        });
        btnContainer.appendChild(optionBtn);
    });
}
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function endQuiz() {
    resultText.textContent = resultTexts[score];
    finalScore.textContent = score;
    quizScreen.classList.remove("active");
    endScreen.classList.add("active");
}
function startQuiz() {
    const category = categoryText.textContent.trim().slice(0, -2);
    const readyURL = url.replace("{id}", triviaCategories[category]);
    fetch(readyURL)
        .then(res => res.json())
        .then(data => {
            questions = data.results;
            startScreen.classList.remove("active");
            quizScreen.classList.add("active");
            loadNextQuestion();
        })
        .catch(error => {
            error("Promise Catch:", error);
        });
}
startBtn.addEventListener("click", startQuiz);
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
