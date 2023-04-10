//project setup:
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.height = 576
canvas.width = 1024

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

class Sprite {
  constructor({position, velocity, color = 'red'}){ //add more properties to argument and wrap them with{ } to make them pass as properties within an object
    this.position = position
    this.velocity = velocity
    this.height = 150
    this.lastKey
    this.attackBox = {    //===assign punch to player
      position: this.position,
      width: 100,
      height: 50 
    }
    this.color = color
  }


  draw(){
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, 50, this.height)
    //attack box
    c.fillStyle = 'green'
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
      )
    
  }
  update(){
    this.draw()
   
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    //adding gravity to players:
    if (this.position.y + this.height +this.velocity.y >= canvas.height){
      this.velocity.y = 0
    } else  this.velocity.y += gravity
    
  }
}

//create players:
const player = new Sprite({
  position: {
    x: 0,
    y: 10
  },
  velocity: {
    x: 0,
    y: 0
  }
})
player.draw()

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue'
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


//create an infinite loop to animate players
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width, canvas.height)
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
  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -5    
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = 5
  }
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
  }
  console.log(event.key);
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
  console.log(event.key);
})