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

            let y
            if (idx === 0) y = 50
            else if (idx === 1) y = canvas.height - 20
            else y = canvas.height / 2 + (idx - 2) * 50

            line.pos.x = canvas.width / 2
            line.pos.y = y

            ctx.fillText(line.txt, line.pos.x, line.pos.y)

            const metrics = ctx.measureText(line.txt)
            line.width = metrics.width
            line.height = line.size

            if (idx === meme.selectedLineIdx) {
                ctx.strokeStyle = 'white'
                ctx.lineWidth = 2
                ctx.strokeRect(
                    line.pos.x - line.width / 2 - 10,
                    line.pos.y - line.height,
                    line.width + 20,
                    line.height + 10
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

function onCanvasClick(ev) {
    const canvas = document.getElementById('meme-canvas')
    const meme = getMeme()
    const rect = canvas.getBoundingClientRect()
    const clickX = ev.clientX - rect.left
    const clickY = ev.clientY - rect.top

    meme.lines.forEach((line, idx) => {
        const left = line.pos.x - line.width / 2 - 10
        const right = line.pos.x + line.width / 2 + 10
        const top = line.pos.y - line.height
        const bottom = line.pos.y + 10

        if (clickX >= left && clickX <= right && clickY >= top && clickY <= bottom) {
            meme.selectedLineIdx = idx
            document.getElementById('txt-input').value = line.txt
            renderMeme()
        }
    })
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
document.getElementById('meme-canvas').addEventListener('click', onCanvasClick)
