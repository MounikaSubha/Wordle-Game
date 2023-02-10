// step1: get the event and handle 
const letters = document.querySelectorAll('.scoreboard');
const loadingDiv = document.querySelector('.info-bar');
const ANSWER_LENGTH =5;
let currentLetters = '';
let currentRow =0;
const ROUNDS = 6;
let isLoading = false;
const heading = document.getElementsByTagName('h2');
let done=false;
let alright = false;

async function init(){  
    isLoading = true;
    setLoading(isLoading);
    const res = await fetch("https://words.dev-apis.com/word-of-the-day");
    const {word} = await res.json();
    isLoading = false;
    setLoading(isLoading); 
    // lisen to keyprress events and route accordingly
 document.addEventListener('keydown', function handleKeyPress(event)
 {
    if(done || isLoading)
    {
        // do nothing
        return;
    }
    // check if event is letter or other symbol
      if(isLetter(event.key))
      {
        handleLetters(event.key.toUpperCase())
      }
      else{
        handleOtherKeys(event.key,word.toUpperCase());
      }
 });

}

function isLetter(letter)
{
    return  /^[a-zA-Z]$/.test(letter);
}

function handleLetters(letter)
{
    // keep track of letters as 5 letter word
    // at each addition length of word increases and its length can be used 
    // to update the actual letters inner text
    // at length > 5 , erase last letter and replace with new letter
    // update this functionality for every row [for this code for commit code]
    // only after equals key is pressed and length > 5 commit happens and input allowed for next row 
   if(currentLetters.length < ANSWER_LENGTH)
   {
      currentLetters += letter;
 
   } 
   else{
         currentLetters = currentLetters.substring(0,currentLetters.length-1) + letter;
       }

    letters[currentRow * ANSWER_LENGTH + currentLetters.length-1].innerText = letter;
   
}

async function handleOtherKeys(key,word)
{
    
    if(key === "Backspace")
    { 
        currentLetters = currentLetters.substring(0,currentLetters.length-1);
        letters[currentRow * ANSWER_LENGTH + currentLetters.length].innerText="";

    }
   if(key === "Enter")
   {
        if(currentLetters.length === ANSWER_LENGTH)
        {
           let guess = currentLetters;      
                isLoading = true;
                 setLoading(isLoading);
                const res = await fetch("https://words.dev-apis.com/validate-word", 
                 {
                    method:"POST",
                    body:JSON.stringify({ word: guess }), 
                });
                const {validWord} = await res.json();
                isLoading = false;
                setLoading(isLoading);
               
                if(!validWord)
              {  
                 markAsInvalid();
                 if(lostGame(word)){
                    return;
                 }
             }
             else{
                commitCheck(word);
                
            }   
             currentRow++;
             currentLetters ='';
                
        }
         if(currentRow >= ROUNDS)
        {
            done = true;
        }
   }
      
}


function makeMap(array)
{
    const obj = {};
    for(let i=0; i<array.length;i++)
    {
        if(obj[array[i]])
        {
            obj[array[i]]++;
        }
        else{
            obj[array[i]] =1;
        }
    }
    return obj;
}


function markAsInvalid()
{
    
    for(let j=0; j<ANSWER_LENGTH;j++)
    {
        letters[currentRow * ANSWER_LENGTH + j].classList.add("invalid");
       
    }
    alright=false;
}


function commitCheck(word)
{
   let guessWord = currentLetters.split("");
   const map = makeMap(word); 
   
  
   for(let i=0; i<word.length;i++)
   {
      if(guessWord[i] === word[i])
      {
         letters[currentRow * ANSWER_LENGTH + i].classList.add('correct');
         map[guessWord[i]]--;
         alright=true;
      }
    }
    for(let i=0; i<word.length;i++)
   {
      if(guessWord[i] === word[i] )
      {
        // do nothing
       }
       else if(map[guessWord[i]] && map[guessWord[i]] > 0)
       {
         letters[currentRow * ANSWER_LENGTH + i].classList.add('close');
         map[guessWord[i]]--;
         alright=false;
        }

      else{
        letters[currentRow * ANSWER_LENGTH + i].classList.add('wrong');
        alright=false;
      }
   }

   if(alright)
   {
      
       heading[0].classList.add('winner');
       alert("you win");
       done = true;
   }
    
   lostGame(word)
}

function lostGame(word)
{
     if(!alright && currentRow >= ROUNDS-1)
   {
    
    alert(`you lose! The correct word is ${word}`);
    done=true;
    return true;
   }
}
function setLoading(isLoading)
{
      loadingDiv.classList.toggle("hidden", !isLoading);    
}



init();
