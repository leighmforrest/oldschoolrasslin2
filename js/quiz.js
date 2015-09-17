
var allQuestions = [{"question": "Who is Prime Minister of the United Kingdom?", "choices": ["David Cameron",
 "Gordon Brown", "Winston Churchill", "Tony Blair"], "correctAnswer":0},
 {"question": "Who is buried in Grant's Tomb?", "choices": ["George Washington",
 "Ulysses S. Grant", "Thomas Jefferson", "Nobody; it's an above ground mausoleum"], "correctAnswer":3},
 {"question": "Is this quiz bogus?", "choices": ["true",
 "false"], "correctAnswer":1}];

//Data Model for the quiz
var Quiz = new function(){
	this.allQuestions = allQuestions;
 	this.answerSheet = this.allQuestions.map(function(){return -1;});
	var iterator = 0;
	//returns the iterators value
	this.getIterator = function(){return function(){return iterator};};
	//flag for more questions
	this.moreQuestions = function(){return iterator < this.allQuestions.length;};
	//get the current question
	this.getQuestion = function(){
		var q = this.allQuestions[iterator];
		return {question: q.question, choices: q.choices};
	};
	//function to advance the iterator one
	this.advanceIterator = function(){if(this.moreQuestions())iterator += 1};
	//function to have iterator go back one
	this.decrementIterator = function(){if(iterator > 0)iterator -= 1;};
	// answer the question and advance iterator
	this.answerQuestion= function(answer){
			var i = iterator;
			this.answerSheet[i] = answer;
			this.advanceIterator();
		
	};
	//Compare correct answers to answer sheet
	this.correctAnswers = function(){
		var x = [];
		for(var i=0; i < this.allQuestions.length; i++){
			x.push(this.allQuestions[i].correctAnswer === this.answerSheet[i]);
		}
		return x;
	}
	//Score the answers to the quiz
	this.scoreQuiz = function(){
		//remove the -1 values
		var sum = this.correctAnswers().filter(function(x ){return x !== -1;});
		//get the sum of the correct answers
		var total = sum.reduce(function(x,y){return x + y;});
		//return raw score for the quiz
		return (100 * (total / this.allQuestions.length)).toFixed(2);
	}

};	//end Quiz data object