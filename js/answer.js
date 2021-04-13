/*
    Author:Rijfas
    Date: 13/04/21
    PS: Code is kinda crap, but it atleast works(maybe?)
*/
const intro = document.querySelector("#intro");
const answerUi = document.querySelector("#answer-ui");
const confirmButton = document.querySelector("#confirm-button");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

var currentQuestionIndex = 0;
var examType = 1;
var questions = [];

confirmButton.addEventListener("click", () => {
    examType = document.getElementById("exam-type").value;
    if(examType>1){
        intro.classList.add('hidden');
        answerUi.classList.remove('hidden');
        answerUi.classList.add('flex');
        loadExam(loadQuestions, examType-1);
    }
    else{
        document.getElementById("course-error").classList.remove("hidden");
    }
});

prevButton.addEventListener("click", () => {
    prevQuestion();
});

nextButton.addEventListener("click", () => {
    nextQuestion();
});

function loadExam(callback, week) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'json/week_'+week+'.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 function loadQuestions(data){
    document.getElementById('loader').classList.remove('flex');
    document.getElementById('loader').classList.add('hidden');
   questions = JSON.parse(data);
   loadQuestion();
}

function loadQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    const options = document.querySelector("#options");
    options.innerHTML = "";
    document.querySelector("#question-text").innerHTML = currentQuestion.text;
    document.querySelector("#question-header").innerHTML = "Question "+(currentQuestionIndex+1)+"/10";
    currentQuestion.options.forEach(element => {
        const currentOption = document.createElement("span");
        currentOption.textContent = element;
        currentOption.classList.add('flex',(currentQuestion.answers.indexOf(element)!=-1)?'bg-green-200':'bg-gray-200', 'rounded-md', 'px-6', 'py-2', 'my-2', 'qn-option');
        options.appendChild(currentOption);
    });
 }

 function nextQuestion() {
    if(currentQuestionIndex<questions.length-1){
        currentQuestionIndex++;
        loadQuestion();
    }
}

function prevQuestion() {
    if(currentQuestionIndex>0){
        currentQuestionIndex--;
        loadQuestion();
    }
}