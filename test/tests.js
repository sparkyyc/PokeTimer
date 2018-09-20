const expect = chai.expect

describe("Check tests are running", () => {
  it("Ran a test", () => {
    expect(true).to.equal(true);
  })

})

describe("Check intructions are accessible", () => {
  it("Opens instruction", () => {
    let notifications = document.getElementById('message-container')
    let instructionsButton = document.getElementById('instruction-button')

    instructionsButton.click()

    expect(notifications.classList.contains('hide')).to.equal(false)
  })
})

describe("Pick get new pokemon", () => {
  it("Sets egg to status", () => {
    let pokedex = document.getElementsByClassName('pokedex-entry')
    let eggPic = pokedex[0]
    let status = document.getElementById('status-name')

    eggPic.click()

    expect(status.dataset.statusName).to.equal('egg')
  })
})

describe("Check if site remembers if you've visited", () => {
  it("Sets site visited in local storage to true", () => {
    let siteStatus = getStorage('visitedSite')

    expect(siteStatus).to.equal(true)
  })
})
