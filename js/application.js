$(function(){
	//cache important elements
	var quiz_container = $("#quiz_container");
	var back_button = $("#back");
	var next_button = $("#next");

//Draws a quesion onto a div
//quiz: jquery object containing the question
//question: an object with a question
function drawQuestion(quiz,question){
	var frag= document.createDocumentFragment();
	//draw the question
	var questionTag = document.createElement("p");
	questionTag.setAttribute('class', 'lead');
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
		}//end if
		//add the label
		var label= document.createElement("label");
		label.innerHTML = val;
		frag.appendChild(answerSel);
		frag.appendChild(label);
		frag.appendChild(document.createElement("br"));
	});
	//append the fragment to the child
	quiz.prepend(frag);
}
	//Get the value of the radio button group
	function getAnswersFromRadioButtons(){
		
		var answer = parseInt($("#quiz input[type='radio']:checked").val());
		if(!isNaN(answer)){ return answer;}else{return -1;}
		
	}
	//Shows back button if iterator is over 0; else hide button; shows next button always
	function showButtons(){
		if(Quiz.getIterator()() > 0){
			back_button.show();
		}else{
			back_button.hide();
		}
	}

	//replace old quiz div with a fresh one
	function replaceQuestion(){
		quiz_container.find('#quiz').fadeOut(500).remove();
  		quiz_container.append('<div id="quiz"></div>');
	}

	//event handlers
	//Runs when window loads
	$( window ).load(function() {
		//remove fallback p and hideButton class
  		next_button.removeClass('hideButton');
  		back_button.removeClass('hideButton');
  		replaceQuestion();
  		drawQuestion($('#quiz'),Quiz.getQuestion());
  		showButtons();
	});

	//next button event handler
	next_button.on('click', function(){
		answer = getAnswersFromRadioButtons();
		if(answer == -1){
				alert("You cannot proceed unless the question is answered.");
			}else{
			Quiz.answerQuestion(answer);
			//quiz_container.replaceWith('<div id="quiz"></div>');
			//replace old question div with a blank one
			//if(Quiz.getIterator() < Quiz.allQuestions.length){
			if(Quiz.moreQuestions()){
				replaceQuestion();
				drawQuestion($('#quiz'),Quiz.getQuestion());
				showButtons();
			}else{
				//score the quiz
				var score = Quiz.scoreQuiz();
				//use removeQuestion function to remove buttons
				$('#quiz_button').remove();
				//insert paragraph to display score
				var scoreDispTxt = "Your score is " + score;
				replaceQuestion();
				$("#quiz").append("<p class='lead'>"+ scoreDispTxt +"</p>");
			}
		}
	});

	//back button event handler
	back_button.on('click', function(){
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
			drawQuestion($('#quiz'),Quiz.getQuestion());
			//show the buttons
			showButtons();
		}
	});
});