const words='unlikely restaurant freedom present population complete courage truth isolation attack progress speed comfortable spend belong breakfast writer glory industry model current pressure blue blood cooperation include rule finished leader warm space hand permission replacement find notice pocket hurt situation peace separate average economy concentrate article government possible light guess smile reduce daily believe public naughty colour mind love know market refuse solid reuse hilarious end hungry word come suppose body animate knock unused skillful knee forgive lose sample position joke history complex teeth error fresh install discussion flower familiar increase loss huge physical development worried smoke willing regular quick useless understood boring garden normal interest respect question agree upset handsome yummy female exchange support clever mountain previous discovery short cover sugar trouble dark rain uncle grade partner hobbies complain attractive simple purpose unhealthy messy impress amount calculator trust graceful awake suggestion happen careful wish provide silent finger move convince responsible game drop care homeless injure ancient accept remove decision forget recognize miss actually delete helpless delicious brave quiet challenge enjoy economic texture report legal condition display disappear dangerous advice typical serious selfish connection sweet alive company awesome matter wonderful answer religion helpful outgoing unusual painful science intelligent knowledge peaceful invention'.split(' ');
const wordsCount = words.length;
const gameTime = 60 * 1000;
window.timer = null;
window.gameStart = null;

function addClass(el,name) {
    el.className += ' '+name;
}
function removeClass(el,name) {
    el.className = el.className.replace(name,'');
}



function randomWord() {
    const randomIndex = Math.ceil(Math.random() * wordsCount);
    return words[randomIndex - 1];
}

function formatWord(word) {
    return `<div class="word"><span class="letter">${word.split('').join('</span><span class="letter">')}</span></div>`;
}




function newGame() {
    document.getElementById('words').innerHTML = '';
    for (let i =0; i < 200; i++) {
        document.getElementById('words').innerHTML += formatWord(randomWord());
    }
    addClass(document.querySelector('.word'), 'current');
    addClass(document.querySelector('.letter'), 'current');
    window.timer = null;
    window.gameStart = null;
   
}


function getWpm() {
    const words = [...document.querySelectorAll('.word')];
    const lastTypedWord = document.querySelector('.word.current');
    const lastTypedWordIndex = words.indexOf(lastTypedWord) + 1;
    const typedWords = words.slice(0, lastTypedWordIndex);
    const correctWords = typedWords.filter(word => {
        const letters = [...word.children];
        const incorrectLetters = letters.filter(letter => letter.className.includes('incorrect'));
        const correctLetters = letters.filter(letter => letter.className.includes('correct'));
        return incorrectLetters.length === 0 && correctLetters.length === letters.length;
    });
    return correctWords.length / gameTime * 60000;
}


function gameOver() {
    clearInterval(window.timer);
    addClass(document.getElementById('game'), 'over');
    const result = getWpm();
    document.getElementById('info').innerHTML = `WPM: ${result}`;
}




document.getElementById('game').addEventListener('keyup', ev => {
    const key = ev.key;
    const currentWord = document.querySelector('.word.current');
    const currentLetter = document.querySelector('.letter.current');
    const expected = currentLetter?.innerHTML || ' ';
    const isLetter = key.length === 1 && key !== ' ';
    const isSpace = key === ' ';
    const isBackspace = key === 'Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;

if (document.querySelector('#game.over')) {
}


    
    console.log({key,expected});

    if (!window.timer && isLetter) {
        window.timer = setInterval(() => {
            if (!window.gameStart) {
                window.gameStart = (new Date()).getTime();
            }
            const currentTime = (new Date()).getTime();
            const msPassed = currentTime - window.gameStart;
            const sPassed = Math.round(msPassed / 1000);
            const sLeft = (gameTime / 1000) - sPassed;
            if (sLeft <= 0) {
                gameOver();
                return;
            }



            document.getElementById('info').innerHTML = sLeft + '';
        }, 1000);
    }



    
    if (isLetter) {
        if (currentLetter) {
            addClass(currentLetter, key === expected ? 'correct' : 'incorrect');
            removeClass(currentLetter, 'current');
            if (currentLetter.nextSibling) {
                addClass(currentLetter.nextSibling, 'current');
            }
            
        }
    }
    
    if (isSpace) {
        if (expected !== ' ') {
            const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct)')];
            lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
            })
        }
        removeClass(currentWord, 'current');
        addClass(currentWord.nextSibling, 'current');
        if (currentLetter) {
            removeClass(currentLetter, 'current');
        }
        addClass(currentWord.nextSibling.firstChild, 'current');
    }

    if (isBackspace) {
        if (currentLetter && isFirstLetter) {
            // make prev word current, last letter current
            removeClass(currentWord, 'current');
            addClass(currentWord.previousSibling, 'current');
            removeClass(currentLetter, 'current');
            addClass(currentWord.previousSibling.lastChild, 'current');
            removeClass(currentWord.previousSibling.lastChild, 'incorrect');
            removeClass(currentWord.previousSibling.lastChild, 'correct');
        }
        if(currentLetter && !isFirstLetter) {
            // move back one letter, invalidate letter
            removeClass(currentLetter, 'current');
            addClass(currentLetter.previousSibling, 'current');
            removeClass(currentLetter.previousSibling, 'incorrent');
            removeClass(currentLetter.previousSibling, 'correct');
        }
        if(!currentLetter) {
            addClass(currentWord.lastChild, 'current');
            removeClass(currentWord.lastChild, 'incorrect');
            removeClass(currentWord.lastChild, 'correct');
        }
    }


    // move lines / words
    if (currentWord.getBoundingClientRect().top > 350) {
        const words = document.getElementById('words');
        const margin = parseInt(words.style.marginTop || '0px');
        words.style.marginTop = (margin - 35) + 'px';
    }


    // move cursor
    const nextLetter = document.querySelector('.letter.current')
    const nextWord = document.querySelector('.word.current');
    const cursor = document.getElementById('cursor')
    if (nextLetter) {
        cursor.style.top = nextLetter.getBoundingClientRect().top + 'px';
        cursor.style.left = nextLetter.getBoundingClientRect().left + 'px';
    } else {
        cursor.style.top = nextWord.getBoundingClientRect().top + 5 + 'px';
        cursor.style.left = nextWord.getBoundingClientRect().right + 'px';

    }


})



document.getElementById('game').addEventListener('click', function(){
    // game start
});


document.getElementById('newGameBtn').addEventListener('click', () => {
    gameOver();
    newGame();
});
document.getElementById('far').focus();
newGame();

