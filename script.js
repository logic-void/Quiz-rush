let questionIndex = 0;
let questions;
let score = 0;
let restartState = true;
let optionState = true;
let url;
const optionLabel = document.getElementById("options-dropdown");
const difficultyLabel = document.getElementById("difficulty-dropdown");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const optionDropdown = document.querySelector(".option-container");
const difficultyDropdown = document.querySelector(".difficulty-container");
const categoryOptions = Array.from(document.querySelectorAll(".option"));
const difficultyOptions = Array.from(document.querySelectorAll(".difficulty"));
const categoryText = document.getElementById("category-text");
const difficultyText = document.getElementById("difficulty-text");
const startBtn = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const questionTrack = document.getElementById("question-track");
const questionDifficulty = document.getElementById("questionDifficulty");
const scoreText = document.getElementById("score-text");
const btnContainer = document.querySelector(".button-container");
const resultText = document.getElementById("result-text");
const endScreen = document.getElementById("end-screen");
const restartBtn = document.getElementById("restart-btn");
const finalScore = document.getElementById("final-score");
const popupContainer = document.querySelector(".popup-container");
const highScoreText = document.getElementById("high-score");
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
const correctAudio = document.getElementById("correct-audio");
const incorrectAudio = document.getElementById("incorrect-audio");
const hintAudio = new Audio("assets/hint.wav");
let audioUnlocked = false;
const timerText = document.getElementById("timer-text");
const progress = document.querySelector(".progress");
let seconds = 0;
let timerId;
let removeId;
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
optionLabel.addEventListener("click", () => {
    document.body.style.pointerEvents = "none";
    optionDropdown.classList.toggle("active");
    setTimeout(() => {
        document.body.style.pointerEvents = "auto";
    }, 1200);
});
difficultyLabel.addEventListener("click", () => {
    document.body.style.pointerEvents = "none";
    difficultyDropdown.classList.toggle("active");
    setTimeout(() => {
        document.body.style.pointerEvents = "auto";
    }, 800);
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
difficultyOptions.forEach(difficulty => {
    difficulty.addEventListener("click", e => {
        e.stopPropagation();
        const clicked = e.target;
        difficultyText.textContent = clicked.textContent + " ⌵";
        difficultyDropdown.classList.remove("active");
        document.body.style.pointerEvents = "auto";
    });
});
restartBtn.addEventListener("click", () => {
    if (restartState) {
        restartState = false;
        setTimeout(() => {
            endScreen.classList.remove("active");
            startScreen.classList.add("active");
            questionIndex = 0;
            score = 0;
            restartState = true;
        }, 500);
    }
});
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = num => String(num).padStart(2, "0");

    return `Timer - ${pad(hrs)} : ${pad(mins)} : ${pad(secs)}`;
}
function addPopus() {
    popupContainer.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        const popup = document.createElement("div");
        popup.style.top = Math.random() * 80 + "vh";
        popup.style.left = Math.random() * 100 + "vw";
        popupContainer.appendChild(popup);
        setTimeout(() => {
            popup.style.transform = `translateY(-${Math.random() * 15 + 5}vh)`;
            setTimeout(() => {
                popup.style.transition = "all 3s ease";
                popup.style.transform = `translate(${
                    Math.random() * 40 - 20
                }vw,110vh) rotate(${Math.random() * 360}deg)`;
                popup.style.opacity = 0;
            }, 1000);
        }, 100);
    }
}
function loadNextQuestion() {
    const currentQuestion = questions[questionIndex];
    seconds = 0;
    setTimeout(() => {
        timerText.textContent = formatTime(seconds);
        seconds++;
        timerId = setInterval(() => {
            timerText.textContent = formatTime(seconds);
            seconds++;
        }, 1000);
    }, 100);
    clearTimeout(removeId);
    removeId = setTimeout(removeTwoOptions, 30200);
    optionState = true;
    timerText.textContent = formatTime(seconds);
    questionText.textContent = decodeHTML(currentQuestion.question);
    questionTrack.textContent = questionIndex + 1;
    progress.style.width = (questionIndex + 1) * 10 + "%";
    scoreText.textContent = score;
    questionDifficulty.textContent = currentQuestion.difficulty;
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
            clearInterval(timerId);
            if (optionState) {
                optionState = false;
                const clickedBtn = e.target;
                const buttons = document.querySelectorAll(
                    ".button-container button"
                );

                buttons.forEach(btn => (btn.disabled = true));

                if (clickedBtn.dataset.correct) {
                    clickedBtn.classList.add("correct");
                    correctAudio.play();
                    setTimeout(addPopus, 300);
                    score++;
                } else {
                    clickedBtn.classList.add("incorrect");
                    incorrectAudio.play();
                    buttons.forEach(btn => {
                        if (btn.dataset.correct) btn.classList.add("correct");
                    });
                }
                questionIndex++;
                questionIndex < questions.length
                    ? setTimeout(loadNextQuestion, 1000)
                    : setTimeout(endQuiz, 2000);
            }
        });
        btnContainer.appendChild(optionBtn);
    });
}
function removeTwoOptions() {
    hintAudio.play();
    const buttons = Array.from(
        document.querySelectorAll(".button-container button")
    );
    const incorrectBtns = buttons.filter(btn => !btn.dataset.correct);
    shuffle(incorrectBtns)
        .slice(0, 2)
        .forEach(btn => {
            btn.classList.add("remove");
            setTimeout(() => {
                btn.style.display = "none";
            }, 1000);
        });
    hintAudio.play();
}
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function endQuiz() {
    resultText.textContent = resultTexts[score];
    finalScore.textContent = score;
    if (score > highScore) {
        localStorage.setItem("highScore", score.toString());
        highScore = score;
    }
    highScoreText.textContent = highScore;
    quizScreen.classList.remove("active");
    endScreen.classList.add("active");
}
function startQuiz() {
    const category = categoryText.textContent.trim().slice(0, -2);
    hintAudio
        .play()
        .then(() => {
            hintAudio.pause();
            hintAudio.currentTime = 0;
        })
        .catch(() => {});
    const selectedDifficulty = difficultyText.textContent.trim().slice(0, -2);
    url =
        selectedDifficulty === "Mixed"
            ? `https://opentdb.com/api.php?amount=10&type=multiple&category={id}`
            : `https://opentdb.com/api.php?amount=10&type=multiple&difficulty=${selectedDifficulty.toLowerCase()}&category={id}`;
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
