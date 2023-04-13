//project setup:
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const startButton = document.querySelector('#startButton')
const restartButton = document.querySelector('#restartButton')



canvas.height = 480
canvas.width = 1022


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.9

class Game {
  constructor() {
    this.timer = 60; // in seconds
    this.timerId = null; // reference to the timer interval

    this.startButton = document.querySelector('#startButton')
    this.restartButton = document.querySelector('#restartButton')

    this.startButton.addEventListener('click', () => this.startGame())
    this.restartButton.addEventListener('click', () => this.restartGame())
  }

  startGame() {
    this.timerId = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerId)
        this.timerId = null
        this.showRestartButton()
      } else {
        this.updateTimer()
      }
    }, 1000)
    this.startButton.classList.remove('hidden')
  }

  restartGame() {
    this.hideRestartButton()
    this.resetTimer()
    this.startGame()
  }

  updateTimer() {
    // update the timer display
    const timerElement = document.querySelector('#timer')
    timerElement.textContent = `Time left: ${this.timer}`
  }

  resetTimer() {
    // reset the timer value and update the display
    this.timer = 60
    this.updateTimer()
  }

  showRestartButton() {
    // show the restart button
    this.restartButton.classList.remove('hidden')
  }

  hideRestartButton() {
    // hide the restart button
    this.restartButton.classList.add('hidden')
  }
}
const game = new Game()


 
class Sprite {
  constructor({position,imageSrc, scale = 1, framesMax = 1, offset ={ x:0, y: 0} }){ //add more properties and wrap them with{ } to make them pass as properties within an argument
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
    this.offset = offset


  }

  draw(){
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
      ) 
  }

  update() {
    this.draw()
    this.framesElapsed++

    if(this.framesElapsed % this.framesHold ===0){
      if(this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      }else {
        this.framesCurrent= 0
      }
    }
    
  }
    
}

class Fighter extends Sprite{
  constructor({position, velocity, color = 'red', imageSrc, scale = 1, framesMax = 1, offset ={ x:0, y: 0} }){ //add more properties and wrap them with{ } to make them pass as properties within an argument
    super({ //copies the properties of the parent sprite, its super!
      position, imageSrc, scale, framesMax, offset
    })
    this.velocity = velocity
    this.width = 40
    this.height = 120
    this.lastKey
    this.attackBox = {    //===assign attack punch to player
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset: offset,
      width: 100,
      height: 50 
    }
    this.color = color
    this.isAttacking
    this.health = 100
    this.timer
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 5
  }


  draw(){
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    //attack box:
    if (this.isAttacking){  //adds attackbox
    c.fillStyle = 'green'
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
      )
    }
  }
  update(){
    this.draw()
    this.attackBox.position.x =this.position.x + this.attackBox.offset.x //players facing each other
    this.attackBox.position.y =this.position.y 
   
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    //adding gravity to players:
    if (this.position.y + this.height +this.velocity.y >= canvas.height - 12){
      this.velocity.y = 0
    } else  this.velocity.y += gravity
    
  }
  attack(){ //attack for a brief period of time
    this.isAttacking = true
    setTimeout(() =>{
      this.isAttacking = false
    }, 100)
  }
}

const background = new Sprite({
  position:{
    x: 0, y: 0
  },
  imageSrc: 'img/BG.png'
})

//create players:
const player = new Fighter({
  position: {
    x: 140,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
  
})
player.draw()

const enemy = new Fighter({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
})
enemy.draw()

console.log(player, enemy)
//more keys:
const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}
//detect rectangle collision
function rectangularCollision({rectangle1, rectangle2}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
/*
//who wins & display
function determineWinner({player, enemy }) {
  clearTimeout(timerId)
  document.querySelector('#displaytext').style.display = 'flex'
  if (player.health === enemy.health) {
      document.querySelector('#displaytext').innerHTML = 'TIE'
  }else if (player.health > enemy.health){
      document.querySelector.('#displayText').innerHTML = 'PLAYER 1 WINS'
  }else if (player.health < enemy.health){
      document.querySelector.('#displayText').innerHTML = 'PLAYER 2 WINS'
  }
}
*/


//create an infinite loop to animate players
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width, canvas.height)
  background.update()
  player.update()
  enemy.update()

  //velocity keys:
  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  if (keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -5    
  } else if (keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = 5
  }
  //enemy movement:
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5    
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
  }
  //detect for collision between players:
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    } ) &&
     player.isAttacking){
      player.isAttacking = false //to hit player only once
      enemy.health -= 20
      document.querySelector('#enemyHealth').style.width = enemy.health +'%'  //reduces health from enemy
    console.log ('PIM');
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    } ) &&
     enemy.isAttacking){
      enemy.isAttacking = false //to hit player only once
      player.health -= 20
      document.querySelector('#playerHealth').style.width = player.health +'%'  //reduces health from player
    
  }

  /*
  //end game based on health

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({player ,enemy})
  }
  */

}
animate()




//moving characters with event listerners + assgning keys
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
      break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
      break
      case 'w':
      player.velocity.y = -20
      break  
     case ' ':
      player.attack() 
      break
    //enemy  
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break
    case 'ArrowUp':
      enemy.velocity.y = -20
      break
    case 'Enter':
      enemy.attack ()
      break       
  }
  
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
  }
  //enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
  
})
