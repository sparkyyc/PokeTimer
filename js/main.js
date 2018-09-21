document.addEventListener('DOMContentLoaded', () => {
  // Get/set local storage
  loadStorage()


  let picked = 'egg'
  let chainNum
  // welcome message and instruction close and open
  let closeButton = document.getElementById('delete-button')
  let messages = document.getElementById('message-container')
  // if visited site before(true) hide welcome message/Instructions
  if (JSON.parse(localStorage.getItem('visitedSite')) === true) {
    messages.classList.add('hide')
  }
  // when close button clicked close message/instructions
  closeButton.addEventListener('click', () => {
    messages.classList.add('hide')
    setStorage('visitedSite', true)
  })
  let instructionButton = document.getElementById('instruction-button')
  instructionButton.addEventListener('click', () => {
    messages.classList.remove('hide')
  })
  // pokedex
  createPokedex(totalPokemon, pokedexDisplay, 0)
  createPokedex(gen1Total, gen1Display, 0)
  createPokedex(gen2Total, gen2Display, gen1Total)
  createPokedex(gen3Total, gen3Display, gen2Total)

  fillPokedexCollected()
  fillPokedexAllEvo()
  // pokedex tabs
  let allTabContent = document.getElementsByClassName('tab-content')
  let allTabs = document.querySelector('tabs')
  let pokedexTab = document.getElementById('pokedex-tab')
  let gen1Tab = document.getElementById('gen1-tab')
  let gen2Tab = document.getElementById('gen2-tab')
  let gen3Tab = document.getElementById('gen3-tab')
  let pokedexTabContent = document.getElementById('pokedex-tab-content')
  let gen1TabContent = document.getElementById('gen1-tab-content')
  let gen2TabContent = document.getElementById('gen2-tab-content')
  let gen3TabContent = document.getElementById('gen3-tab-content')
  pokedexTab.addEventListener('click', () => {
    closeTab()
    removeActive()
    pokedexTabContent.classList.add('current')
    pokedexTab.classList.add('is-active')
  })
  gen1Tab.addEventListener('click', () => {
    closeTab()
    removeActive()
    gen1TabContent.classList.add('current')
    gen1Tab.classList.add('is-active')
  })
  gen2Tab.addEventListener('click', () => {
    closeTab()
    removeActive()
    gen2TabContent.classList.add('current')
    gen2Tab.classList.add('is-active')
  })
  gen3Tab.addEventListener('click', () => {
    closeTab()
    removeActive()
    gen3TabContent.classList.add('current')
    gen3Tab.classList.add('is-active')
  })

  // Timer
  let timerButton = document.getElementById('timer-button')
  let timerAmount = document.getElementById('timer-amount')
  let countdownDisplay = document.getElementById('countdown-display')
  let ticker

  timerButton.addEventListener('click', () => {
    // if button is stop button
    if (timerButton.classList.contains('stop-button')) {
      ticker.stop()
      countdownDisplay.innerText = '00:00'
      timerButton.classList.remove('stop-button')
      timerButton.classList.add('start-button')
      timerButton.value = 'Start'
      return
    }
    // get timer input & convert it
    else if (timerAmount.value === '') {
      document.getElementById("timer-amount").focus()
      let errorImage = document.getElementById('adventure-status-image')
      let errorMessage = document.getElementById('status-name')
      errorImage.src = "https://cdn.vox-cdn.com/thumbor/vd0xeeKgRvzDI8HirSqC0UrOftQ=/0x0:729x517/1200x800/filters:focal(246x345:362x461)/cdn.vox-cdn.com/uploads/chorus_image/image/52916683/Screen_Shot_2017_01_25_at_1.27.36_PM.0.png"
      errorMessage.innerText = "Please set timer amount!"
      return console.log('Error')
    }
    let statusInfo = document.getElementById('status-name')
    picked = statusInfo.dataset.statusName
    chainNum =  statusInfo.dataset.statusId
    let lastChain = statusInfo.dataset.statusId
    // set ticker object & duration to seconds
    let duration = timerAmount.value * 60
    ticker = new AdjustingTimer(appendTimer, duration, countdownDisplay, picked, chainNum, lastChain)
    // if button is start button
    if (timerButton.classList.contains('start-button')) {

      console.log(picked)
      ticker.start()
      timerButton.classList.remove('start-button')
      timerButton.classList.add('stop-button')
      timerButton.value = 'Stop'

    }
  })

  // Click on collected or egg pokemon in pokedex
  let pokedex = document.getElementById('pokedex-section')
  let status = document.getElementById('adventure-status-image')
  let statusName = document.getElementById('status-name')
  pokedex.addEventListener('click', (event) => {
    if (event.target.classList.contains('collected')) {
      status.src = event.target.src
      picked = event.target.id
      chainNum = event.target.dataset.chainId
      statusName.innerText = picked
      statusName.setAttribute('data-status-id', chainNum)
      statusName.setAttribute('data-status-name', picked)

      let lastActive = pokedex.getElementsByClassName('active')
      for (let i = 0; i < lastActive.length; i++) {
        lastActive[i].classList.remove('active')
      }
      event.target.classList.add('active')
    } else if (event.target.classList.contains('egg')) {
      status.src = "https://vignette.wikia.nocookie.net/fantendo/images/b/bf/Pokemon_Egg.png/revision/latest?cb=20161106162613"
      picked = 'egg'
      statusName.innerText = 'New Pokemon'
      // statusName.setAttribute('data-status-id', chainNum)
      statusName.setAttribute('data-status-name', 'egg')

      let lastActive = pokedex.getElementsByClassName('active')
      for (let i = 0; i < lastActive.length; i++) {
        lastActive[i].classList.remove('active')
      }
      event.target.classList.add('active')
    }
  })



})


// Timer

// to accurrately time without skips must check against current time using Date
// expected = date.now + interval
// if time becomes off or drifts, do something
// function with params what to do, how long, and what to do if there is an error(drift)
function AdjustingTimer(doThisFunc, duration, display, picked, chainNum) {
  let that = this
  let expected
  let timeout
  this.interval = 1000
  let timer = duration,
    minutes, seconds

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
    // if (drift > that.interval) {
    //   if (errorFunc) erroFunc()
    // }
    let countdownScreen = display
    doThisFunc(timer, countdownScreen)
    timer--
    if (timer < 0) {
      console.log(picked)
      if (picked === 'egg') {
        try {
          randomPokemonGenerator(picked, chainNum)
        } catch (oops) {
          console.log(oops)
          let errorImage = document.getElementById('adventure-status-image')
          errorImage.src = "http://elaccki.weebly.com/uploads/8/9/4/8/8948680/8705065_orig.png"
        }
      } else {
        try {
          evolve(chainNum, picked, lastChain)
        } catch (oops) {
          console.log(oops,'something went wrong or no more evolutions. Attempting to find new pokemon for you.')
          // let errorImage = document.getElementById('adventure-status-image')
          // errorImage.src = "http://elaccki.weebly.com/uploads/8/9/4/8/8948680/8705065_orig.png"
          randomPokemonGenerator()
        }
      }
      let timerButton = document.getElementById('timer-button')
      timerButton.classList.remove('stop-button')
      timerButton.classList.add('start-button')
      timerButton.value = 'Start'

      let lastActive = document.getElementsByClassName('active')
      for (let i = 0; i < lastActive.length; i++) {
        lastActive[i].classList.remove('active')
      }

      return
    }
    expected += that.interval
    timeout = setTimeout(step, Math.max(0, that.interval - drift))
  }
}


function appendTimer(timer, display) {
  minutes = parseInt(timer / 60, 10)
  seconds = parseInt(timer % 60, 10)

  minutes = minutes < 10 ? `0${minutes}` : minutes
  seconds = seconds < 10 ? `0${seconds}` : seconds

  // append to display
  display.innerText = minutes + ":" + seconds
  console.log(minutes + ":" + seconds)
}

// Pokedex
let pokedexDisplay = document.getElementById('pokedex-tab-content')
let gen1Display = document.getElementById('gen1-tab-content')
let gen2Display = document.getElementById('gen2-tab-content')
let gen3Display = document.getElementById('gen3-tab-content')

let gen1Total = 151
let gen2Total = 251
let gen3Total = 386
let totalPokemon = 386

let createPokedex = function(whichGen, display, i) {
  // create ancestor div
  let ancestor = document.createElement('div')
  ancestor.classList.add('columns')
  ancestor.classList.add('is-multiline')
  ancestor.classList.add('is-mobile')
  // append ancestor div to display
  display.appendChild(ancestor)
  // create child div for egg
  let eggChild = document.createElement('div')
  eggChild.classList.add('column')
  // eggChild.classList.add('is-2')
  eggChild.classList.add('pokedex-entry')
  eggChild.classList.add('box')
  eggChild.classList.add('has-text-centered')
  eggChild.classList.add('is-one-third-mobile')
  eggChild.classList.add('active')
  // append child egg div to ancestor
  ancestor.appendChild(eggChild)
  // create div for egg
  let eggDiv = document.createElement('div')

  // append egg div to child egg
  eggChild.appendChild(eggDiv)
  // create egg image
  let eggImage = document.createElement('img')
  eggImage.setAttribute("src", "data:image/png;base64,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")
  eggImage.classList.add('egg')
  // append egg image to egg div
  eggDiv.appendChild(eggImage)
  // for loop for 151 pokemon
  for (i = i + 1; i <= whichGen; i++) {
    // create child div
    let childDiv = document.createElement('div')
    childDiv.classList.add('column')
    childDiv.classList.add('is-one-third-mobile')
    // childDiv.classList.add('is-2')
    // childDiv.setAttribute('id', i)
    childDiv.classList.add(i)
    childDiv.classList.add('pokedex-entry')
    childDiv.classList.add('box')
    childDiv.classList.add('has-text-centered')
    // append child div to ancestor
    ancestor.appendChild(childDiv)
    // create paragraph element with innerText set to i
    let pokeNumber = document.createElement('p')
    pokeNumber.classList.add('pokeNumber')
    pokeNumber.innerText = i
    // append paragraph element to child div
    childDiv.appendChild(pokeNumber)
  }
}

// pokedex tabs
function closeTab() {
  let allTabContent = document.getElementsByClassName('tab-content')
  for (let i = 0; i < allTabContent.length; i++) {
    allTabContent[i].classList.remove('current')
  }
}

function removeActive() {
  let allTabs = document.getElementsByClassName('tab')
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].classList.remove('is-active')
  }
}

// get Pokemon
function getAllPokemon() {
  let interval = {
    limit: 386,
  }
  P.getPokemonsList(interval)
    .then(function(response) {
      // let allPokemon = parsePokedex(response)
      setStorage('pokedexStorage', response.results)
    })

}

function getEvolutions() {
  let interval = {
    limit: 202,
  }
  P.getEvolutionChainsList(interval)
    .then(function(response) {
      // let pokemonEvolution = parseEvolution(response)
      setStorage('evolutionStorage', response.results)
    })
}

function getSpecies() {
  let interval = {
    limit: 386,
  }
  P.getPokemonSpeciesList(interval)
    .then(function(response) {
      // let pokemonSpecies = parseSpecies(response)
      setStorage('speciesStorage', response.results)
    })
}

// parse response

//  local storage
//first get storage to use in app or if none set it
// create function to set storage with params
function getStorage(label) {
  return JSON.parse(localStorage.getItem(label))
}
// then set storage when event triggered
function setStorage(label, value) {
  localStorage.setItem(label, JSON.stringify(value))
}

// localStorage.setItem(`visitedSite`, JSON.stringify(false))
// function setVisitedSite() {
//   localStorage.setItem('visitedSite', JSON.stringify(true))
// }
// function to load storage items if they exist and set them if they don't

function loadStorage() {
  if (!getStorage('pokedexStorage')) {
    getAllPokemon()
  } else {
    console.log('got it!')
  }

  if (!getStorage('evolutionStorage')) {
    getEvolutions()
  }

  if (!getStorage('speciesStorage')) {
    getSpecies()
  }

  if (!getStorage('pokemonCollected')) {
    setStorage('pokemonCollected', [])
  }

  if (!getStorage('pokemonEvosCollected')) {
    setStorage('pokemonEvosCollected', [])
  }
  if (!getStorage('pokemonEvolutionDataCollected')) {
    setStorage('pokemonEvolutionDataCollected', [])
  }
  if (!getStorage('sprites')) {
    setStorage('sprites', [])
  }
  if (!getStorage('evoSprites')) {
    setStorage('evoSprites', [])
  }
}

// function to get random number
function randomNumber() {
  return Math.floor(Math.random() * 202)
}
// function to check object equality
function checkObjectEquality(collectedArr, firstStage, pickedNumber) {
  console.log('checking if you have it')
  if (collectedArr.length === 0) {
    return false
  }
  for (let i = 0; i < collectedArr.length; i++) {
    if (collectedArr[i].url === firstStage[pickedNumber].url) {
      return true
    }
  }
  return false
}
// function to get random pokemon
function randomPokemonGenerator(picked, chainNum) {
  console.log('Getting encounter')
  let firstStage = getStorage('evolutionStorage')
  let collectedEvos = getStorage('pokemonEvosCollected')
  let collected = getStorage('pokemonCollected')
  let pickedNumber = randomNumber()
  console.log(firstStage[pickedNumber])
  while (checkObjectEquality(collectedEvos, firstStage, pickedNumber)) {
    pickedNumber = randomNumber()
  }
  let newPokemon = firstStage[pickedNumber]
  collectedEvos.push(newPokemon)
  setStorage('pokemonEvosCollected', collectedEvos)
  parseFound(newPokemon, collected, picked, chainNum)
}

function parseFound(newPokemon, collected, picked ,chainNum) {
  try {
    axios.get(newPokemon.url)
      .then(function(response) {
        collected.push(response.data)
        setStorage('pokemonCollected', collected)
        fillPokedexRando(picked, chainNum)
      })
      return picked, chainNum
  } catch(error) {
    console.log('error')
  }
}

// function to append sprite to pokedex
function fillPokedexRando(picked,chainNum) {
  // from pokemonCollected get name from last array element, obj.chain.species.name
  let collected = getStorage('pokemonCollected')
  let name = collected[collected.length - 1].chain.species.name
  let chainId = collected[collected.length - 1].id
  let spritesStorage = getStorage('sprites')
  // get pokemon using getpokemonbyname and name from above
  P.getPokemonByName(`${name}`)
    .then(function(response) {
      // get sprite wanted from that response
      let sprite = response.sprites.front_default
      // find pokedex number
      let pokedexNumber = response.id
      // create and append image to pokedex spot (may need to give html element class or id)
      let spot = document.getElementsByClassName(`${pokedexNumber}`)
      // console.log(spot)
      // console.log(spot.length)
      for (let j = 0; j < spot.length; j++) {
        spot[j].removeChild(spot[j].childNodes[0])
        let pokeImg = document.createElement('img')
        pokeImg.setAttribute('src', sprite)
        pokeImg.classList.add('sprite')
        pokeImg.setAttribute('data-chain-id', chainId)
        pokeImg.classList.add('collected')
        pokeImg.setAttribute('id', name)
        spot[j].appendChild(pokeImg)
      }
      let spriteObj = {
        sprite: sprite,
        pokedexNumber: pokedexNumber,
      }
      spritesStorage.push(spriteObj)
      setStorage('sprites', spritesStorage)

      let status = document.getElementById('adventure-status-image')
      let statusName = document.getElementById('status-name')
      status.src = sprite
      statusName.innerText = name
      statusName.setAttribute('data-status-id', chainId)
      statusName.setAttribute('data-status-name', name)
      // picked = name
      // chainNum = chainId
      // console.log(picked, chainNum)
      // picked, chainNum
    })
}

function fillPokedexCollected() {
  // from pokemonCollected get name from last array element, obj.chain.species.name
  let collected = getStorage('pokemonCollected')
  let spriteStorage = getStorage('sprites')
  if (collected.length !== 0) {
    for (let i = 0; i < collected.length; i++) {
      let name = collected[i].chain.species.name
      let chainId = collected[i].id
      // get sprite wanted from storage

      let sprite = spriteStorage[i].sprite
      // find pokedex number
      let pokedexNumber = spriteStorage[i].pokedexNumber
      // create and append image to pokedex spot
      let spot = document.getElementsByClassName(`${pokedexNumber}`)
      // console.log(spot.length)
      for (let j = 0; j < spot.length; j++) {
        spot[j].removeChild(spot[j].childNodes[0])
        let pokeImg = document.createElement('img')
        pokeImg.setAttribute('src', sprite)
        pokeImg.classList.add('sprite')
        pokeImg.setAttribute('data-chain-id', chainId)
        pokeImg.classList.add('collected')
        pokeImg.setAttribute('id', name)
        spot[j].appendChild(pokeImg)
      }
    }
  }
}

// evolve - what to do when
function evolve(chainNum, picked, lastChain) {
  let evolution
  let collectedEvos = getStorage('pokemonEvolutionDataCollected')
  let collected = getStorage('pokemonCollected')
  let chainPicked
  chainNum = parseInt(chainNum, 10)
  // check if pokemon evolution is already collected
  // get evolution chain
  for (let i = 0; i < collected.length; i++) {
    if (collected[i].id === chainNum) {
      chainPicked = collected[i]
    }
  }
  // for each
  // if name key of array [0] is pokemon picked, set evolution to array[1] name
  console.log('chain picked: ', chainPicked)
  if (chainPicked.chain.species.name === picked) {
    if (chainPicked.chain.evolves_to[0].species.name !== []) {
      evolution = chainPicked.chain.evolves_to[0].species.name
      console.log(evolution)
    } else {
      console.log('this pokemon has no more evolutions')
    }
    console.log(`it's the unevolved stage`)
  } else if (chainPicked.chain.evolves_to[0].species.name === picked) {
    if (chainPicked.chain.evolves_to[0].evolves_to[0].species.name !== []) {
      evolution = chainPicked.chain.evolves_to[0].evolves_to[0].species.name
      console.log(evolution)
    } else {
      console.log('this pokemon has no more evolutions')
    }
    console.log(`it's the first stage`)
  } else if (chainPicked.chain.evolves_to[0].evolves_to[0].species.name === picked) {
    if (chainPicked.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name !== []) {
      evolution = chainPicked.chain.evolves_to[0].evolves_to[0].evolves_to[0].species.name
      console.log(evolution)
    } else {
      console.log('this pokemon has no more evolutions')
    }
    console.log(`it's the third stage`)
  }  else {
    console.log(`Error`)
  }
  // })
  // else if name key of array[1] is pokemon picked, set evolution to array[2] name etc.

  // get pokemon from main pokemon list
  console.log(chainNum)
  parseEvolution(evolution, collectedEvos, chainNum)
  // push into collected
  // set collected

  // parseEvolution(evolution, collected)
}

function parseEvolution(evolve, collectedEvos, chainNum) {
  P.getPokemonByName(evolve)
    .then(function(response) {
      collectedEvos.push(response)
      // console.log(collectedEvos)
      setStorage('pokemonEvolutionDataCollected', collectedEvos)
      console.log(chainNum)
      fillPokedexEvo(chainNum)
    })
}

function fillPokedexEvo(picked, chainNum) {
  // from pokemonCollected get name from last array element, obj.chain.species.name
  // get pokemon using getpokemonbyname and name from above

  let collected = getStorage('pokemonCollected')
  let spriteStorage = getStorage('evoSprites')
  let evolutionData = getStorage('pokemonEvolutionDataCollected')
  let collectedChain = getStorage('pokemonCollected')

      let name = evolutionData[evolutionData.length - 1].name
      let chainId = collectedChain[collectedChain.length - 1].id
      console.log('chain Id: ', chainId)
      // get sprite wanted from storage
      let sprite = evolutionData[evolutionData.length -1].sprites.front_default
      // find pokedex number
      let pokedexNumber = evolutionData[evolutionData.length -1].id
      // create and append image to pokedex spot
      let spot = document.getElementsByClassName(`${pokedexNumber}`)
      // console.log(spot.length)
      for (let j = 0; j < spot.length; j++) {
        spot[j].removeChild(spot[j].childNodes[0])
        let pokeImg = document.createElement('img')
        pokeImg.setAttribute('src', sprite)
        pokeImg.classList.add('sprite')
        pokeImg.setAttribute('data-chain-id', chainId)
        pokeImg.classList.add('collected')
        pokeImg.setAttribute('id', name)
        spot[j].appendChild(pokeImg)
      }
      let spriteObj = {
        sprite: sprite,
        pokedexNumber: pokedexNumber,
        chainNumber: chainId,
      }

      spriteStorage.push(spriteObj)
      // setStorage('sprites', spriteStorage)
      setStorage('evoSprites', spriteStorage)

      let status = document.getElementById('adventure-status-image')
      let statusName = document.getElementById('status-name')
      status.src = sprite
      statusName.innerText = name
      statusName.setAttribute('data-status-id', chainId)
      statusName.setAttribute('data-status-name', name)
    }


function fillPokedexAllEvo(chainNum) {
  let collected = getStorage('pokemonEvolutionDataCollected')
  // let collectedChain = getStorage('pokemonCollected')
  let spriteStorage = getStorage('evoSprites')
  if (collected.length !== 0) {
    for (let i = 0; i < collected.length; i++) {
      let name = collected[i].species.name
      console.log('name: ', name)

      let chainId = spriteStorage[i].chainNumber
      console.log('id: ', chainId)
      // get sprite wanted from storage
      let sprite = spriteStorage[i].sprite
      console.log('sprite: ', sprite)
      // find pokedex number
      let pokedexNumber = spriteStorage[i].pokedexNumber
      console.log('pokedex number: ', pokedexNumber)
      // create and append image to pokedex spot
      let spot = document.getElementsByClassName(`${pokedexNumber}`)
      console.log(spot)
      // console.log(spot.length)
      for (let j = 0; j < spot.length; j++) {
        spot[j].removeChild(spot[j].childNodes[0])
        let pokeImg = document.createElement('img')
        pokeImg.setAttribute('src', sprite)
        pokeImg.classList.add('sprite')
        pokeImg.setAttribute('data-chain-id', chainId)
        pokeImg.classList.add('collected')
        pokeImg.setAttribute('id', name)
        spot[j].appendChild(pokeImg)
      }
    }
  }
}
