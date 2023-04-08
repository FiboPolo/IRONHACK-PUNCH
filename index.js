//proect setup:
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.height = 1024
canvas.width = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

class Sprite {
  constructor({position, velocity}){ //add more properties to argument and wrap them with{ } to make them pass as properties within an object
    this.position = position
    this.velocity = velocity
    this.height = 150
  }
  draw(){
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, 50, this.height)
  }
  update(){
    this.draw()
   
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

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
  }
})
enemy.draw()

console.log(player, enemy)
//more 
//create an infinite loop to animate players
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0,0, canvas.width, canvas.height)
  player.update()
  enemy.update()
}
animate()

//moving characters with event listerners + assgning keys
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
    player.velocity.x = 1
    break
    case 'a':
    player.velocity.x = -1
    break
  }
  console.log(event.key);
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
    player.velocity.x = 0
    break
    case 'a':
    player.velocity.x = 0
    break
  }
  console.log(event.key);
})