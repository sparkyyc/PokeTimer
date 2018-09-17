document.addEventListener('DOMContentLoaded', () => {
  function AdjustingInterval(workFunc, interval, errorFunc) {
    let that = this;
    let expected;
    let timeout;
    this.interval = interval;

    this.start = function() {
      expected = Date.now() + this.interval;
      timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
      clearTimeout(timeout);
    }

    function step() {
      let drift = Date.now() - expected;
      if (drift > that.interval) {
        // You could have some default stuff here too...
        if (errorFunc) errorFunc();
      }
      workFunc();
      expected += that.interval;
      timeout = setTimeout(step, Math.max(0, that.interval - drift));
    }
  }
  // For testing purposes, we'll just increment
  // this and send it out to the console.
  let justSomeNumber = 0;

  // Define the work to be done
  const doWork = function() {
    console.log(++justSomeNumber);
  };

  // Define what to do if something goes wrong
  const doError = function() {
    console.warn('The drift exceeded the interval.');
  };

  // (The third argument is optional)
  let ticker = new AdjustingInterval(doWork, 1000, doError);
  console.log(ticker);
})

function startTimer(duration) {
  var timer = duration,
    minutes, seconds;
  setInterval(function() {
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    console.log(minutes + ":" + seconds)

    --timer
  if (timer < 0) {
    clearInterval()
  }
  }, 1000);
}

let time = 25 * 60


// repl practice
function AdjustingTimer(doThisFunc, interval, display, errorFunc) {
  let that = this
  let expected
  let timeout
  this.interval = interval

  // create start function
  this.start = function() {
    expected = Date.now() + this.interval
    timeout = setTimeout(step, this.interval)
  }

  // create stop function
  this.stop = function() {
    clearTimeout(timeout)
  }
  // create a function to adjust interval in setTimeout and doThisFunc
  function step() {
    let drift = Date.now() - expected
    if (drift > that.interval) {
      if (errorFunc) erroFunc()
    }
    doThisFunc(interval, display)
    expected += that.interval
    timeout = setTimeout(step, Math.max(0, that.interval - drift))
  }
}

function appendTimer(interval, display) {
  let timer = interval,
    minutes, seconds
  minutes = parseInt(timer / 60, 10)
  seconds = parseInt(timer % 60, 10)

  minutes = minutes < 10 ? "0" + minutes : minutes
  seconds = seconds < 10 ? "0" + seconds : seconds

  // append to display
  console.log(minutes + ":" + seconds)

    --timer
}

let tickerCount = 0;
let logItOut = function() {
  console.log(tickerCount++)
}

let time = function (timeInput) {
  return timeInput * 60
}


const ticker = new AdjustingTimer(logItOut, 5)
ticker.start()
ticker.stop()
// <!-- <div class="tile is-ancestor">
//   <div class="tile is-parent">
//     <div class="tile is-child box has-text-centered">
//       <div class="egg">
//         <img src="data:image/png;base64,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">
//       </div>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">1</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">2</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">3</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">4</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">5</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">6</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">7</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">8</p>
//     </div>
//     <div class="tile is-child box has-text-centered">
//       <p class="title">9</p>
//     </div>
//   </div>
// </div> -->
let createPokedex = function() {
  // create ancestor div
  let ancestor = document.createElement('div')
  ancestor.classList.add('tile')
  ancestor.classList.add('is-ancestor')
  // append ancestor div to display
  pokedexDisplay.appendChild(ancestor)
  // create parent div
  let parent = document.createElement('div')
  parent.classList.add('tile')
  parent.classList.add('is-parent')
  // append parent div to ancestor
  ancestor.appendChild(parent)
  // create child div for egg
  let eggChild = document.createElement('div')
  eggChild.classList.add('tile')
  eggChild.classList.add('is-child')
  eggChild.classList.add('box')
  eggChild.classList.add('has-text-centered')
  // append child egg div to parent
  parent.appendChild(eggChild)
  // create div for egg
  let eggDiv = document.createElement('div')
  eggDiv.classList.add('egg')
  // append egg div to child egg
  eggChild.appendChild(eggDiv)
  // create egg image
  let eggImage = document.createElement('img')
  eggImage.setAttribute("src", "data:image/png;base64,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")
  // append egg image to egg div
  eggDiv.appendChild(eggImage)
  // for loop for 151 pokemon
  for (let i = 1; i <= totalPokemon; i++) {
    // create child div
    let childDiv = document.createElement('div')
    childDiv.classList.add('tile')
    childDiv.classList.add('is-child')
    childDiv.classList.add('box')
    childDiv.classList.add('has-text-centered')
    // append child div to parent
    parent.appendChild(childDiv)
    // create paragraph element with innerText set to i
    let pokeNumber = document.createElement('p')
    pokeNumber.classList.add('title')
    pokeNumber.classList.add('is-4')
    pokeNumber.classList.add('pokeNumber')
    pokeNumber.innerText = i
    // append paragraph element to child div
    childDiv.appendChild(pokeNumber)
  }
}
