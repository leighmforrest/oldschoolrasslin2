var quiz_container = document.getElementById('quiz_container');
var next_button = document.getElementById("next");
var back_button =document.getElementById("back");
//Remove the quiz from the quiz_container
//quiz: Reference to the node containing the question
function removeElement(node){
	var removeEl = node;
	var parentEl = removeEl.parentNode;
	parentEl.removeChild(removeEl);
}
//inserts new question div in quiz_container
function insertQuestion(quiz){
	var newEl = document.createElement("div");
	newEl.setAttribute('id','quiz');
	quiz.appendChild(newEl);
}

//replaces an old node with a new one
//assumes quiz_container exists
function replaceQuestion(){
	//create a new node
	var newNode = document.createElement("div");
	newNode.setAttribute('id','quiz');
	//get the old node. Assumes quiz_container is not null
	var oldNode = quiz_container.lastChild;
	quiz_container.replaceChild(newNode,oldNode);
}
//Draws a quesion onto a div
//quiz: div element containing the question
//question: an object with a question
function drawQuestion(quiz,question){
	var frag= document.createDocumentFragment();
	//draw the question
	var questionTag = document.createElement("p");
	var questionText = document.createTextNode(question.question);
	questionTag.appendChild(questionText);
	frag.appendChild(questionTag);
	//draw the radio buttons
	question.choices.forEach(function(val,i){
		var answerSel = document.createElement("input");
		answerSel.setAttribute('type', 'radio');
		answerSel.setAttribute('name', 'answer');
		answerSel.setAttribute('value', i);
		if(Quiz.answerSheet[Quiz.getIterator()()] == i){
			answerSel.setAttribute('checked','true');
			console.log("Item " + i + " has been checked.")
		}//end if
		//add the label
		var label= document.createElement("label");
		label.innerHTML = val;
		frag.appendChild(answerSel);
		frag.appendChild(label);
		frag.appendChild(document.createElement("br"));
	});
	//append the fragment to the child
	quiz.appendChild(frag);
}

//Get the value of the radio button group
function getAnswersFromRadioButtons(){
	var radio = document.getElementsByName('answer');
	for(var i = 0; i < radio.length; i++){ 
		if(radio[i].checked == true) return i; 
		else continue;
	}
	return -1;
}

//Shows back button if iterator is over 0; else hide button; shows next button always
function showButton(){
	if(Quiz.getIterator()() > 0){
		back_button.className = '';
	}else{
		back_button.className = 'hideButton';
	}

	next_button.className = '';

}

/*
Here are the event listeners
onload->load the first question
onclick->if iterator less than questions, replace the old question with the new
	else, display the score
*/

EventUtil.addHandler(window,"load",function(event){
	removeElement(quiz_container.lastChild);//remove the fallback <p> element
	replaceQuestion();
	drawQuestion(quiz_container.lastChild,Quiz.getQuestion());
	showButton(); 
});

//The next_button event handler
EventUtil.addHandler(next_button,"click",function(event){
			var answer = getAnswersFromRadioButtons();
			if(answer == -1){
				alert("You cannot proceed unless the question is answered.");
			}else{
			Quiz.answerQuestion(answer);
			replaceQuestion();//replace old question div with a blank one
			//if(Quiz.getIterator() < Quiz.allQuestions.length){
			if(Quiz.moreQuestions()){
				drawQuestion(quiz_container.lastChild,Quiz.getQuestion());
				showButton();
			}else{
				//score the quiz
				var score = Quiz.scoreQuiz();
				//use removeQuestion function to remove buttons
				removeElement(next_button.parentNode);
				//insert paragraph to display score
				var scoreDisp = document.createElement("p");
				var scoreDispTxt = document.createTextNode("Your score is " + score);
				scoreDisp.appendChild(scoreDispTxt);
				quiz_container.lastChild.appendChild(scoreDisp);
			}
		}
});

//The back_button event handler
EventUtil.addHandler(back_button,"click",function(event){
	var iterator = Quiz.getIterator()();
	if(iterator > -1 ){
		//if it is the last question, remember the button
		//Score the answer before decrementing iterator
		if(iterator == (Quiz.allQuestions.length-1))
		{
			var answer = getAnswersFromRadioButtons();
			Quiz.answerSheet[iterator] = answer;

		}
		//decrement iterator
		Quiz.decrementIterator();
		//draw question
		replaceQuestion();
		drawQuestion(quiz_container.lastChild,Quiz.getQuestion());
		showButton();
	}
});