const timerBox = document.querySelector('.timer-inner');
const question = document.querySelector('.question');
const answers = document.querySelector('.answers');
const correctWrong = document.querySelector('.correct-wrong');
const explanation = document.querySelector('.explanation');
const correctVal = document.querySelector('.correct-total');
const wrongVal = document.querySelector('.wrong-total');
const playAgain = document.querySelector('.play-again');
const modeOptions = document.querySelectorAll('.mode-option');
const beginButton = document.querySelector('.begin');
const overview = document.querySelector('.overview');

let time = 30;
let round = 0;
let correct = 0;
let wrong = 0;
const questions = [
  {
    question: 'In what year was JavaScript created?',

    answers: [
      {
        answer: '1994',
        correct: false,
      },
      {
        answer: '1995',
        correct: true,
      },
      {
        answer: '1996',
        correct: false,
      },
      {
        answer: '1997',
        correct: false,
      },
    ],
    explanation: 'Brendan Eich wrote JavaScript in May of 1995',
  },
  {
    question: 'What will be logged to the console?',
    snippet: `console.log( typeof null );`,
    answers: [
      {
        answer: 'null',
        correct: false,
      },
      {
        answer: 'undefined',
        correct: false,
      },
      {
        answer: 'object',
        correct: true,
      },
      {
        answer: 'string',
        correct: false,
      },
    ],
    explanation: 'Null is an object. The output would be "object"',
  },
  {
    question: 'Which of these is not a reserved word in JavaScript?',
    // snippet: `console.log( typeof null )`,
    answers: [
      {
        answer: 'default',
        correct: false,
      },
      {
        answer: 'undefined',
        correct: true,
      },
      {
        answer: 'throw',
        correct: false,
      },
      {
        answer: 'finally',
        correct: false,
      },
    ],
    explanation:
      'Undefined is not defined in JavaScript, and is not a reserved word',
  },
  {
    question: 'What will be logged to the console?',
    snippet: `console.log( typeof NaN );`,
    answers: [
      {
        answer: 'number',
        correct: true,
      },
      {
        answer: 'undefined',
        correct: false,
      },
      {
        answer: 'NaN',
        correct: false,
      },
      {
        answer: 'string',
        correct: false,
      },
    ],
    explanation:
      'JavaScript considers NaN a number. The output would be "number"',
  },
  {
    question: 'What will be logged to the console?',
    snippet: `console.log([] == ![]);`,
    answers: [
      {
        answer: 'true',
        correct: true,
      },
      {
        answer: 'false',
        correct: false,
      },
      {
        answer: 'nothing',
        correct: false,
      },
      {
        answer: 'undefined',
        correct: false,
      },
    ],
    explanation:
      'Through coercion, both "empty array" and "not array" simplify to 0. The output is "true"',
  },
  {
    question: 'What will be logged to the console?',
    snippet: `console.log(Math.min() < Math.max());`,
    answers: [
      {
        answer: 'true',
        correct: false,
      },
      {
        answer: 'false',
        correct: true,
      },
      {
        answer: 'an error',
        correct: false,
      },
      {
        answer: 'undefined',
        correct: false,
      },
    ],
    explanation:
      'With no arguments, Math.min() returns infinity and Math.max() returns -infinity. The output is "false"',
  },
];

overview.style.display = 'none';
playAgain.disabled = true;

function countDown(num) {
  timerBox.innerHTML = '';
  for (let i = 0; i <= time; i++) {
    const numBlock = document.createElement('div');
    numBlock.textContent = i;
    numBlock.classList.add('num-block');
    timerBox.prepend(numBlock);
  }
  TweenMax.to('.result', 1, {
    transformOrigin: '50% 50%',
    y: '120vh',
    rotation: '+=180',
    scale: 0,
    ease: Back.easeIn.config(1),
  });
  question.textContent = questions[num].question;
  const snippet = document.querySelector('.snippet');
  if (questions[num].snippet) {
    snippet.style.display = 'block';
    const code = document.querySelector('.code');
    code.textContent = questions[num].snippet;
    Prism.highlightAll();
  } else {
    snippet.style.display = 'none';
  }
  answers.innerHTML = '';
  questions[num].answers.forEach(answer => {
    const answerButton = document.createElement('button');
    answerButton.disabled = true;
    answerButton.classList.add('answer');
    answerButton.textContent = answer.answer;
    answers.append(answerButton);
    answerButton.addEventListener('click', () => {
      timer.pause();
      endRound(answer.correct, questions[num].explanation);
    });
  });
  TweenMax.to('.timer', 1, { y: 0, ease: Elastic.easeOut, delay: 1 });

  const timer = TweenMax.to('.timer-inner', time, {
    x: `-=${150 * time + 65}`,
    delay: 1,
    ease: Linear.easeNone,
    onComplete: endRound,
    onCompleteParams: ['time', questions[num].explanation],
  });
  TweenMax.to('.round', 1, {
    y: 0,
    ease: Elastic.easeOut.config(0.3),
    opacity: 1,
    delay: 1,
  });
  TweenMax.staggerTo(
    '.answer',
    0.6,
    {
      y: 0,
      scale: 1,
      ease: Back.easeOut.config(0.7),
      delay: 1,
      onComplete: enableAnswers,
    },
    0.1
  );
}
function enableAnswers() {
  const answerButtons = document.querySelectorAll('.answer');
  answerButtons.forEach(button => {
    button.disabled = false;
  });
}
modeOptions.forEach(mode => {
  mode.addEventListener('click', () => {
    modeOptions.forEach(button => button.classList.remove('selected'));
    mode.classList.add('selected');
    if (mode.classList.contains('easy')) {
      time = 30;
    } else if (mode.classList.contains('medium')) {
      time = 20;
    } else if (mode.classList.contains('hard')) {
      time = 10;
    }
  });
});
beginButton.addEventListener('click', () => {
  modeOptions.forEach(button => (button.disabled = true));
  beginButton.disabled = true;
  TweenMax.to('.intro', 1, {
    x: '120vw',
    ease: Elastic.easeIn,
  });
  countDown(round);
});

function endRound(why, exp) {
  const answerButtons = document.querySelectorAll('.answer');
  answerButtons.forEach(button => {
    button.disabled = true;
  });
  TweenMax.staggerTo(
    '.answers > *',
    1,
    { y: '120vh', scale: 0, ease: Power1.easeIn },
    0.1
  );
  TweenMax.to('.round', 1, { y: '120vh', opacity: 0, delay: 0.3 });

  explanation.textContent = exp;
  if (why === true) {
    correct += 1;
    correctWrong.textContent = 'Correct!';
  } else if (why === false) {
    wrong += 1;
    correctWrong.textContent = 'Wrong!';
  } else {
    wrong += 1;
    correctWrong.textContent = 'Out of time!';
  }
  TweenMax.to('.result', 2, {
    transformOrigin: '50% 50%',
    y: 0,
    rotation: 0,
    opacity: 1,
    scale: 1,
    delay: 0.1,
    ease: Elastic.easeOut.config(0.2, 0.2),
  });
  round += 1;
  if (round < questions.length) {
    TweenMax.to('.timer-inner', 3, {
      x: '50vw',
      ease: Elastic.easeInOut,
      onComplete: countDown,
      onCompleteParams: [round],
    });
  } else {
    TweenMax.to('.timer-inner', 3, {
      x: '50vw',
      ease: Elastic.easeInOut,
      onComplete: gameOver,
      // onCompleteParams: [round],
    });
  }
}
function gameOver() {
  correctVal.textContent = correct;
  wrongVal.textContent = wrong;
  TweenMax.to('.result', 2, {
    transformOrigin: '50% 50%',
    y: '120vh',
    opacity: 0,
    scale: 0,
    delay: 0.1,
    ease: Elastic.easeOut,
  });
  playAgain.disabled = false;
  overview.style.display = 'flex';
  TweenMax.to('.overview', 2, {
    y: 0,
    opacity: 1,
    delay: 0.1,
    ease: Elastic.easeOut.config(0.3),
  });
}

playAgain.addEventListener('click', () => {
  round = 0;
  correct = 0;
  wrong = 0;
  playAgain.disabled = true;
  
  document.querySelector('.begin').disabled = true;
  TweenMax.to('.overview', 1, {
    y: '120vh',
    opacity: 1,
    delay: 0.1,
    ease: Elastic.easeIn.config(0.3),
    onComplete(){
      overview.style.display = 'none';
    }
  });
  countDown(round);
});
