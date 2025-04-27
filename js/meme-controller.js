'use strict'

var gIsEditorOpen = false

function renderMeme() {
    const meme = getMeme()
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = `gallery/${meme.selectedImgId}.jpg`

    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const line = meme.lines[meme.selectedLineIdx]
        ctx.font = `${line.size}px Impact`
        ctx.fillStyle = line.color
        ctx.textAlign = 'center'
        ctx.fillText(line.txt, canvas.width / 2, 50)
    }
}

function onTxtInput(ev) {
    setLineTxt(ev.target.value)
    renderMeme()
}

function onImgSelect(imgId) {
    setImg(imgId)
    renderMeme()

    if (!gIsEditorOpen) {
        document.querySelector('.gallery').classList.add('hidden')
        document.querySelector('.editor').classList.remove('hidden')
        gIsEditorOpen = true
    }
}

function onBackToGallery() {
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.gallery').classList.remove('hidden')
    gIsEditorOpen = false
}

renderGallery()
renderMeme()

document.getElementById('txt-input').addEventListener('input', onTxtInput)
document.getElementById('btn-back').addEventListener('click', onBackToGallery)
