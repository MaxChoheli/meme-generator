'use strict'

var gIsEditorOpen = false
var gIsDragging = false
var gStartPos

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
            ctx.font = `${line.size}px ${line.font}`
            ctx.fillStyle = line.color
            ctx.textAlign = 'center'

            let y
            if (idx === 0) y = 50
            else if (idx === 1) y = canvas.height - 20
            else y = canvas.height / 2 + (idx - 2) * 50

            if (!line.pos.x) line.pos.x = canvas.width / 2
            if (!line.pos.y) line.pos.y = y

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
    document.getElementById('txt-input').value = meme.lines[meme.selectedLineIdx]?.txt || ''
    renderMeme()
}

function onRemoveLine() {
    removeSelectedLine()
    const meme = getMeme()
    document.getElementById('txt-input').value = meme.lines[meme.selectedLineIdx]?.txt || ''
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
    const pos = getEvPos(ev)
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const left = line.pos.x - line.width / 2 - 10
        const right = line.pos.x + line.width / 2 + 10
        const top = line.pos.y - line.height
        const bottom = line.pos.y + 10

        if (pos.x >= left && pos.x <= right && pos.y >= top && pos.y <= bottom) {
            meme.selectedLineIdx = idx
            document.getElementById('txt-input').value = line.txt
            renderMeme()
        }
    })
}

function onKeyMove(ev) {
    switch (ev.key) {
        case 'ArrowUp':
            moveLine(0, -10)
            break
        case 'ArrowDown':
            moveLine(0, 10)
            break
        case 'ArrowLeft':
            moveLine(-10, 0)
            break
        case 'ArrowRight':
            moveLine(10, 0)
            break
        default:
            return
    }
    renderMeme()
}

function onStartDrag(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = getLineClicked(pos)
    if (clickedLineIdx === -1) return
    gMeme.selectedLineIdx = clickedLineIdx
    gStartPos = pos
    gIsDragging = true
}

function onMoveDrag(ev) {
    if (!gIsDragging) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onStopDrag() {
    gIsDragging = false
}

function getEvPos(ev) {
    const canvas = document.getElementById('meme-canvas')
    const rect = canvas.getBoundingClientRect()
    return {
        x: ev.clientX - rect.left,
        y: ev.clientY - rect.top
    }
}

function getLineClicked(pos) {
    const meme = getMeme()
    for (let i = 0; i < meme.lines.length; i++) {
        const line = meme.lines[i]
        const left = line.pos.x - line.width / 2 - 10
        const right = line.pos.x + line.width / 2 + 10
        const top = line.pos.y - line.height
        const bottom = line.pos.y + 10
        if (pos.x >= left && pos.x <= right && pos.y >= top && pos.y <= bottom) {
            return i
        }
    }
    return -1
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
document.getElementById('btn-remove-line').addEventListener('click', onRemoveLine)
document.getElementById('meme-canvas').addEventListener('click', onCanvasClick)
document.getElementById('font-picker').addEventListener('change', ev => {
    setFont(ev.target.value)
    renderMeme()
})

document.addEventListener('keydown', onKeyMove)
const canvas = document.getElementById('meme-canvas')
canvas.addEventListener('mousedown', onStartDrag)
canvas.addEventListener('mousemove', onMoveDrag)
canvas.addEventListener('mouseup', onStopDrag)
