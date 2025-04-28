'use strict'

var gIsEditorOpen = false

function renderMeme() {
    const meme = getMeme()
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    img.src = `gallery/${meme.selectedImgId}.jpg`

    img.onload = () => {
        const fixedCanvasWidth = 400
        canvas.width = fixedCanvasWidth
        canvas.height = (img.height * fixedCanvasWidth) / img.width

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        meme.lines.forEach((line, idx) => {
            ctx.font = `${line.size}px Impact`
            ctx.fillStyle = line.color
            ctx.textAlign = 'center'
            const y = idx === 0 ? 50 : idx === 1 ? canvas.height - 20 : canvas.height / 2
            ctx.fillText(line.txt, canvas.width / 2, y)

            if (idx === meme.selectedLineIdx) {
                const textMetrics = ctx.measureText(line.txt)
                const textHeight = line.size
                ctx.strokeStyle = 'white'
                ctx.lineWidth = 2
                ctx.strokeRect(
                    canvas.width / 2 - textMetrics.width / 2 - 10,
                    y - textHeight,
                    textMetrics.width + 20,
                    textHeight + 10
                )
            }
        })
    }
}

function onTxtInput(ev) {
    setLineTxt(ev.target.value)
    renderMeme()
}

function onColorChange(ev) {
    setLineColor(ev.target.value)
    renderMeme()
}

function onIncreaseFont() {
    changeFontSize(2)
    renderMeme()
}

function onDecreaseFont() {
    changeFontSize(-2)
    renderMeme()
}

function onAddLine() {
    addLine()
    document.getElementById('txt-input').value = ''
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    const meme = getMeme()
    document.getElementById('txt-input').value = meme.lines[meme.selectedLineIdx].txt
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

function onDownloadMeme() {
    const canvas = document.getElementById('meme-canvas')
    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/jpeg')
    link.download = 'my-meme.jpg'
    link.click()
}

renderGallery()
renderMeme()

document.getElementById('txt-input').addEventListener('input', onTxtInput)
document.getElementById('btn-back').addEventListener('click', onBackToGallery)
document.getElementById('btn-download').addEventListener('click', onDownloadMeme)
document.getElementById('color-picker').addEventListener('input', onColorChange)
document.getElementById('btn-increase-font').addEventListener('click', onIncreaseFont)
document.getElementById('btn-decrease-font').addEventListener('click', onDecreaseFont)
document.getElementById('btn-add-line').addEventListener('click', onAddLine)
document.getElementById('btn-switch-line').addEventListener('click', onSwitchLine)
