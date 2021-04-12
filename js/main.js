const main = document.querySelector("#main");
const intro = document.querySelector("#intro");
const examUi = document.querySelector("#exam-ui");
const examHeader = document.querySelector("#exam-header");
const resultUi = document.querySelector("#result-ui");
const questionNav = document.querySelector("#question-nav");
const startButton = document.querySelector("#start-exam");
const confirmButton = document.querySelector("#confirm-button");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const saveAndNextButton = document.querySelector("#save-button");
const endButton = document.querySelector("#end-button");

var correctAnswers = 0;
var examType = 1;
var userName;
var currentQuestionIndex = 0;
var questions = [];
var answers;
var answeredQuestions = 0;
var selectedAnswers = [];
var timer;
var elapsedTime;

startButton.addEventListener("click", () => {
    userName = document.getElementById("full-name").value;
    if(userName==""){
        document.getElementById("name-error").classList.remove("hidden");
    }
    else{
        main.classList.add('hidden');
        intro.classList.remove('hidden');
    }
    
});

confirmButton.addEventListener("click", () => {
    examType = document.getElementById("exam-type").value;
    if(examType>1){
        intro.classList.add('hidden');
        examUi.classList.remove('hidden');
        examHeader.classList.remove('hidden');
        document.getElementById("user-display").innerHTML = userName;
        examUi.classList.add('grid');
        loadExam(loadQuestions, examType-1);
        startTimer();
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

saveAndNextButton.addEventListener("click", () => {
    saveAndNext();
});

endButton.addEventListener("click", () => {
    endExam();
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
    questions = JSON.parse(data);
    answers = Array(questions.length);
    loadQuestionNav();
    correctAnswers = 0;
    document.getElementById("question-count-display").innerHTML = answeredQuestions + "/" + questions.length;
    loadQuestion()
 }

 function loadQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    selectedAnswers = [];
    const options = document.querySelector("#options");
    options.innerHTML = "";
    document.querySelector("#question-text").innerHTML = currentQuestion.text;
    document.querySelector("#type").innerHTML =  '<span class="font-bold text-gray-400 mt-10">' + ((currentQuestion.type == 'SINGLE') ? "Select only one answer.":"Multiple answers can be selected.") + "</span>";
    document.querySelector("#question-header").innerHTML = "Question "+(currentQuestionIndex+1)+"/10";
    currentQuestion.options.forEach(element => {
        const currentOption = document.createElement("span");
        currentOption.textContent = element;
        currentOption.classList.add('flex','bg-gray-200', 'hover:bg-gray-300', 'rounded-md', 'px-6', 'py-2', 'my-2', 'qn-option');
        options.appendChild(currentOption);
    });
    document.querySelectorAll('.qn-option').forEach((element) => {
        if(answers[currentQuestionIndex]!=undefined){
            if(answers[currentQuestionIndex].indexOf(element.textContent)!=-1)
                {
                    element.classList.remove('bg-gray-200', 'hover:bg-gray-300');
                    element.classList.add('bg-gray-500', 'hover:bg-gray-600');
                    element.classList.add("text-white");

                }
        }
        element.addEventListener("click", () => {
            if(element.classList.contains('qn-selected')){
                element.classList.remove("bg-gray-500");
                element.classList.add("bg-gray-200");
                element.classList.remove("hover:bg-gray-600");
                element.classList.add("hover:bg-gray-300");
                element.classList.remove("text-white");
                element.classList.remove("qn-selected");
                removeAnswer(element, questions[currentQuestionIndex].type == "SINGLE");
            }
            else{
                selectAnswer(element, questions[currentQuestionIndex].type == "SINGLE");
                element.classList.remove("bg-gray-200");
                element.classList.add("bg-gray-500");
                element.classList.add("text-white");
                element.classList.remove("hover:bg-gray-300");
                element.classList.add("hover:bg-gray-600");
                element.classList.add("qn-selected");
            }
            
        });
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

 function selectAnswer(answer, is_single){
    if(is_single) {
        selectedAnswers = [];
        document.querySelectorAll('.qn-option').forEach((element => {
            element.classList.remove("bg-gray-500");
            element.classList.add("bg-gray-200");
            element.classList.remove("hover:bg-gray-600");
            element.classList.add("hover:bg-gray-300");
            element.classList.remove("text-white");
            element.classList.remove("qn-selected");
        }));

    }
    if(selectedAnswers.indexOf(answer.textContent)===-1) {
        selectedAnswers.push(answer.textContent);
    }
    
 }

 function removeAnswer(answer, is_single){
    if(is_single) {
        selectedAnswers = [];
        document.querySelectorAll('.qn-option').forEach((element => {
            element.classList.remove("bg-gray-500");
            element.classList.add("bg-gray-200");
            element.classList.remove("hover:bg-gray-600");
            element.classList.add("hover:bg-gray-300");
            element.classList.remove("text-white");
            element.classList.remove("qn-selected");
        }));
    }
        
    else {
        selectedAnswers = selectedAnswers.filter((element)=>{return answer.textContent != element;});    
    }
}

function saveAndNext() {
    if(selectedAnswers.length>0)
        answers[currentQuestionIndex] = selectedAnswers;
    answeredQuestions = 0;
    answers.forEach(()=>{answeredQuestions++;});
    document.getElementById("question-count-display").innerHTML = answeredQuestions + "/" + questions.length;
    if(answeredQuestions == questions.length) {
        endButton.classList.remove('bg-red-400', 'hover:bg-red-500');
        endButton.classList.add('bg-green-400', 'hover:bg-green-500');
        endButton.textContent = "Submit Exam";
    }
    nextQuestion();
    loadQuestionNav();

}

function startTimer() {
    var countDownDate = new Date().getTime();
    timer = setInterval(function() {
    var now = new Date().getTime();
    var distance = now - countDownDate;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    elapsedTime = ((hours<10)?'0'+hours:hours) + ":"
    + ((minutes<10)?'0'+minutes:minutes) + ":" + ((seconds<10)?'0'+seconds:seconds);
    document.getElementById("time-view").innerHTML =  elapsedTime;

    }, 1000);
}

function endExam() {
        for(i=0;i<questions.length;i++){
            if(answers[i]!=undefined){
                let is_correct = true;
                answers[i].forEach((e)=>{if(questions[i].answers.indexOf(e)==-1)is_correct=false;});
                if(is_correct)
                    correctAnswers++;
            }
        }
        document.getElementById("result-body").innerHTML = 'Name: ' + userName + '<br>' + 'Elapsed Time:' + elapsedTime + '<br>' + correctAnswers + '/' + questions.length + ' Are Correct'; 
        examUi.classList.remove('flex');
        examUi.classList.add('hidden');
        examHeader.classList.add('hidden');
        resultUi.classList.remove("hidden");
        resultUi.classList.add("flex");
        clearInterval(timer);
}

function loadQuestionNav() {
    questionNav.innerHTML = "";
    for(let i=1;i<=questions.length;i++){
        let currentQuestionNav = document.createElement("div");
        currentQuestionNav.classList.add('rounded','border-2', 'flex', 'justify-center', 'm-2', 'cursor-pointer');
        currentQuestionNav.addEventListener("click", ()=>{gotoQuestion(i);});
        if(answers[i-1]!=undefined){
            currentQuestionNav.classList.add('bg-green-400');
            currentQuestionNav.classList.add('text-white');
        }
        else {
            currentQuestionNav.classList.add('bg-gray-200');
        }
        if(currentQuestionIndex==i-1)
            currentQuestionNav.classList.add( 'border-blue-400');
        currentQuestionNav.textContent = i;
        questionNav.appendChild(currentQuestionNav);
    }
}

function gotoQuestion(index) {
    currentQuestionIndex = index - 1;
    loadQuestion();
    loadQuestionNav();
}

 