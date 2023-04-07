//proect setup:
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.height = 1024
canvas.width = 576

c.fillRect(0, 0, canvas.width, canvas.height)


class Sprite {
  constructor({position, velocity}){ //add more properties to argument and wrap them with{ } to make them pass as properties within an object
    this.position = position
    this.velocity = velocity
  }
  draw(){
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, 50, 150)
  }
  update(){
    this.draw()
    this.position.y += 10
  }
}

//create players:
const player = new Sprite({
  position: {
    x: 0,
    y: 0
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
//create an infinite loop to animate players
function animate() {
  window.requestAnimationFrame(animate)
  player
}
animate()
