'use strict'

var gIsEditorOpen = false
var gIsDragging = false
var gStartPos = null

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
            ctx.textAlign = line.align

            if (!line.pos.x) line.pos.x = canvas.width / 2
            if (!line.pos.y) line.pos.y = 50 + idx * 50

            const maxWidth = canvas.width - 40
            const words = line.txt.split(' ')
            const testLine = words.join(' ')
            const textWidth = ctx.measureText(testLine).width

            if (textWidth > maxWidth) {
                let wordY = line.pos.y
                let maxWordWidth = 0
                words.forEach(word => {
                    ctx.fillText(word, line.pos.x, wordY)
                    const wordWidth = ctx.measureText(word).width
                    if (wordWidth > maxWordWidth) maxWordWidth = wordWidth
                    wordY += line.size + 5
                })
                line.width = maxWordWidth
                line.height = (line.size + 5) * words.length
            } else {
                ctx.fillText(line.txt, line.pos.x, line.pos.y)
                line.width = ctx.measureText(line.txt).width
                line.height = line.size
            }

            if (idx === meme.selectedLineIdx) {
                let rectX
                if (line.align === 'left') rectX = line.pos.x - 10
                else if (line.align === 'right') rectX = line.pos.x - line.width - 10
                else rectX = line.pos.x - line.width / 2 - 10

                ctx.strokeStyle = 'white'
                ctx.lineWidth = 2
                ctx.strokeRect(
                    rectX,
                    line.pos.y - line.size,
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
    const meme = getMeme()
    const selectedIdx = meme.selectedLineIdx
    meme.selectedLineIdx = -1
    renderMeme()

    setTimeout(() => {
        const canvas = document.getElementById('meme-canvas')
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/jpeg')
        link.download = 'my-meme.jpg'
        link.click()
        meme.selectedLineIdx = selectedIdx
        renderMeme()
    }, 100)
}

function onCanvasClick(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = getLineClicked(pos)
    if (clickedLineIdx !== -1) {
        gMeme.selectedLineIdx = clickedLineIdx
        document.getElementById('txt-input').value = gMeme.lines[clickedLineIdx].txt
        renderMeme()
    }
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
    document.body.style.cursor = 'grabbing'
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
    gStartPos = null
    document.body.style.cursor = 'default'
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
        const top = line.pos.y - line.size
        const bottom = top + line.height

        let rectX
        if (line.align === 'left') rectX = line.pos.x - 10
        else if (line.align === 'right') rectX = line.pos.x - line.width - 10
        else rectX = line.pos.x - line.width / 2 - 10

        const right = rectX + line.width + 20

        if (
            pos.x >= rectX && pos.x <= right &&
            pos.y >= top && pos.y <= bottom
        ) {
            return i
        }
    }
    return -1
}

function onFlexibleMeme() {
    const options = [
        { id: 6, txt: "I'm not saying that it's aliens... but it's aliens." },
        { id: 8, txt: "Please tell me more, I'm sooooo interested." },
        { id: 13, txt: "Cheers to you" },
        { id: 14, txt: "What if I told you" },
        { id: 15, txt: "One does not simply" },
        { id: 18, txt: "Coding mistakes, coding mistakes everywhere" },
        { id: 19, txt: "(Looking for the bug) I will find you, and I will fix you" },
        { id: 24, txt: "Me with 39°C working on this sprint" },
        { id: 25, txt: "Me showing up to the hospital still in my pajamas in the morning." },
        { id: 12, txt: "Guess who's looking at this meme now?" }
    ]

    const random = options[Math.floor(Math.random() * options.length)]
    setImg(random.id)

    gMeme.lines = [{
        txt: random.txt,
        size: 30,
        color: 'white',
        font: 'Impact',
        align: 'center',
        pos: { x: 0, y: 50 },
        width: 0,
        height: 0
    }]
    gMeme.selectedLineIdx = 0

    renderMeme()
    if (!gIsEditorOpen) {
        document.querySelector('.gallery').classList.add('hidden')
        document.querySelector('.editor').classList.remove('hidden')
        gIsEditorOpen = true
    }
}

function renderSavedMemes() {
    const memes = getSavedMemes()
    const elList = document.querySelector('.saved-list')
    const elSection = document.querySelector('.saved-memes')

    if (!memes.length) {
        elSection.classList.add('hidden')
        return
    }

    elSection.classList.remove('hidden')
    elList.innerHTML = ''

    memes.forEach(meme => {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 100
        const ctx = canvas.getContext('2d')

        const img = new Image()
        img.src = `gallery/${meme.selectedImgId}.jpg`

        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            meme.lines.forEach(line => {
                ctx.font = '12px Impact'
                ctx.fillStyle = 'white'
                ctx.textAlign = 'center'
                ctx.fillText(line.txt, canvas.width / 2, 20 + 20 * meme.lines.indexOf(line))
            })
        }

        canvas.addEventListener('click', () => {
            gMeme = structuredClone(meme)
            renderMeme()
            document.querySelector('.gallery').classList.add('hidden')
            document.querySelector('.editor').classList.remove('hidden')
            gIsEditorOpen = true
        })

        elList.appendChild(canvas)
    })
}

renderGallery()
renderMeme()
renderSavedMemes()

document.getElementById('txt-input').addEventListener('input', onTxtInput)
document.getElementById('btn-back').addEventListener('click', onBackToGallery)
document.getElementById('btn-download').addEventListener('click', onDownloadMeme)
document.getElementById('color-picker').addEventListener('input', onColorChange)
document.getElementById('btn-increase-font').addEventListener('click', onIncreaseFont)
document.getElementById('btn-decrease-font').addEventListener('click', onDecreaseFont)
document.getElementById('btn-add-line').addEventListener('click', onAddLine)
document.getElementById('btn-switch-line').addEventListener('click', onSwitchLine)
document.getElementById('btn-remove-line').addEventListener('click', onRemoveLine)
document.getElementById('font-picker').addEventListener('change', ev => {
    setFont(ev.target.value)
    renderMeme()
})
document.querySelectorAll('.align-controls button').forEach(btn => {
    btn.addEventListener('click', () => {
        setAlign(btn.dataset.align)
        renderMeme()
    })
})
document.addEventListener('keydown', onKeyMove)
document.getElementById('btn-flexible').addEventListener('click', onFlexibleMeme)
document.getElementById('btn-save').addEventListener('click', () => {
    saveMeme()
    renderSavedMemes()
})
document.getElementById('filter-input').addEventListener('input', ev => {
    renderGallery(ev.target.value)
})
document.getElementById('btn-clear-filter').addEventListener('click', () => {
    document.getElementById('filter-input').value = ''
    renderGallery()
})

const canvas = document.getElementById('meme-canvas')
canvas.addEventListener('mousedown', onStartDrag)
canvas.addEventListener('mousemove', onMoveDrag)
canvas.addEventListener('mouseup', onStopDrag)
