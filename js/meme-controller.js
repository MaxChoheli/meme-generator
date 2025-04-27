'use strict'

function renderMeme() {
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = 'gallery/1.jpg'

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        ctx.font = '30px Impact'
        ctx.fillStyle = 'white'
        ctx.textAlign = 'center'
        ctx.fillText('testing', canvas.width / 2, 50)
    }
}

renderMeme()