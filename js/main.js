const main = document.querySelector("#main");
const intro = document.querySelector("#intro");
const examUi = document.querySelector("#exam-ui");
const resultUi = document.querySelector("#result-ui");
const startButton = document.querySelector("#start-exam");
const confirmButton = document.querySelector("#confirm-button");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");
const saveAndNextButton = document.querySelector("#save-button");
var correctAnswers = 0;
var examType = 1;
var userName;
var currentQuestionIndex = 0;
var questions = [];
var selectedAnswers = [];

startButton.addEventListener("click", () => {
    userName = document.getElementById("full-name").value;
    main.classList.add('hidden');
    intro.classList.remove('hidden');
});

confirmButton.addEventListener("click", () => {
    examType = document.getElementById("exam-type").value;
    if(examType>1){
        intro.classList.add('hidden');
        examUi.classList.remove('hidden');
        examUi.classList.add('flex');
        loadExam(loadQuestions, examType-1);
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
    correctAnswers = 0;
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
        currentOption.classList.add('flex', 'bg-gray-200', 'hover:bg-gray-300', 'rounded-md', 'px-6', 'py-2', 'my-2', 'qn-option');
        options.appendChild(currentOption);
    });
    document.querySelectorAll('.qn-option').forEach((element) => {
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
    if(currentQuestionIndex==questions.length-1) {
        document.getElementById("result-body").innerHTML = 'Name: ' + userName + '<br>' + correctAnswers + '/' + questions.length + ' Are Correct'; 
        examUi.classList.remove('flex');
        examUi.classList.add('hidden');
        resultUi.classList.remove("hidden");
        resultUi.classList.add("flex");
    }
    else{
        let is_correct = selectedAnswers.length>0 ? true : false;
        selectedAnswers.forEach((element)=>{
            if(questions[currentQuestionIndex].answers.indexOf(element)==-1){
                is_correct = false;
            }
        });
        if(is_correct)
            correctAnswers++;
        nextQuestion();
    }
}
        

 