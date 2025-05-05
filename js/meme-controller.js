'use strict'

var gIsEditorOpen = false
var gIsDragging = false
var gStartPos = null

function renderMeme() {
    const meme = getMeme()
    const canvas = document.getElementById('meme-canvas')
    const ctx = canvas.getContext('2d')

    const img = new Image()
    const isUserImg = meme.selectedImgId.toString().startsWith('user-')
    img.src = isUserImg ? meme.selectedImgId : `gallery/${meme.selectedImgId}.jpg`

    img.onload = () => {
        canvas.width = img.width > 600 ? 600 : img.width
        canvas.height = (img.height * canvas.width) / img.width

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        meme.lines.forEach((line, idx) => {
            ctx.save()
            ctx.font = `${line.size}px ${line.font}`
            ctx.fillStyle = line.color
            ctx.textAlign = line.align

            if (!line.pos.x) line.pos.x = canvas.width / 2
            if (!line.pos.y) line.pos.y = 50 + idx * 50

            const textWidth = ctx.measureText(line.txt).width
            line.width = textWidth
            line.height = line.size

            ctx.translate(line.pos.x, line.pos.y)
            ctx.rotate((line.angle || 0) * Math.PI / 180)
            ctx.fillText(line.txt, 0, 0)

            if (idx === meme.selectedLineIdx) {
                const padding = 10
                const xOffset = line.align === 'left' ? 0 : line.align === 'right' ? -line.width : -line.width / 2
                ctx.strokeStyle = 'white'
                ctx.lineWidth = 2
                ctx.strokeRect(xOffset - padding, -line.size, line.width + padding * 2, line.height + 10)
            }

            ctx.restore()
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

function onRotateLine() {
    const line = getMeme().lines[getMeme().selectedLineIdx]
    line.angle = (line.angle || 0) + 15
    renderMeme()
}

function onResizeLine(diff) {
    changeFontSize(diff)
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
    openEditor()
}

function onUserImgSelect(src) {
    setImg(src)
    renderMeme()
    openEditor()
}

function openEditor() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    gIsEditorOpen = true
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
        const elInput = document.getElementById('txt-input')
        elInput.value = gMeme.lines[clickedLineIdx].txt
        elInput.focus()
        renderMeme()
    }
}

function onCanvasDblClick(ev) {
    const pos = getEvPos(ev)
    const clickedLineIdx = getLineClicked(pos)
    if (clickedLineIdx !== -1) {
        gMeme.selectedLineIdx = clickedLineIdx
        const elInput = document.getElementById('txt-input')
        elInput.value = gMeme.lines[clickedLineIdx].txt
        elInput.focus()
    }
}

function onKeyMove(ev) {
    switch (ev.key) {
        case 'ArrowUp': moveLine(0, -10); break
        case 'ArrowDown': moveLine(0, 10); break
        case 'ArrowLeft': moveLine(-10, 0); break
        case 'ArrowRight': moveLine(10, 0); break
        default: return
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
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
        x: (ev.clientX - rect.left) * scaleX,
        y: (ev.clientY - rect.top) * scaleY
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
        if (pos.x >= rectX && pos.x <= right && pos.y >= top && pos.y <= bottom) return i
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
    openEditor()
}
function saveMeme() {
    const meme = structuredClone(getMeme())
    const canvas = document.getElementById('meme-canvas')
    meme.imgDataUrl = canvas.toDataURL('image/jpeg')

    const savedMemes = loadFromStorage('saved-memes') || []
    savedMemes.push(meme)
    saveToStorage('saved-memes', savedMemes)
}

function renderSavedMemes() {
    const memes = loadFromStorage('saved-memes') || []
    const elList = document.querySelector('.saved-list')
    const elSection = document.querySelector('.saved-memes')

    if (!memes.length) {
        elSection.classList.add('hidden')
        return
    }

    elSection.classList.remove('hidden')
    elList.innerHTML = ''

    memes.forEach((meme, idx) => {
        const container = document.createElement('div')
        container.classList.add('saved-meme')

        const img = new Image()
        img.src = meme.imgDataUrl
        img.onload = () => {
            const canvas = document.createElement('canvas')
            canvas.width = 100
            canvas.height = 100
            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            canvas.addEventListener('click', () => {
                gMeme = structuredClone(meme)
                renderMeme()
                openEditor()
            })
            container.appendChild(canvas)
        }

        const btnDelete = document.createElement('button')
        btnDelete.classList.add('delete-meme-btn')
        btnDelete.innerHTML = '<img src="icon-gallery/trash.png" alt="Delete">'
        btnDelete.onclick = () => {
            memes.splice(idx, 1)
            saveToStorage('saved-memes', memes)
            renderSavedMemes()
        }

        container.appendChild(btnDelete)
        elList.appendChild(container)
    })
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
}

document.getElementById('btn-save').addEventListener('click', () => {
    saveMeme()
    renderSavedMemes()
})

async function onShareMeme() {
    const canvas = document.getElementById('meme-canvas')
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const file = new File([blob], 'meme.png', { type: 'image/png' })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                title: 'Check out my meme!',
                files: [file]
            })
        } catch (err) {
            console.error('Share canceled or failed', err)
        }
    } else {
        alert('Sharing not supported on this device or browser.')
    }
}

document.getElementById('txt-input').addEventListener('input', onTxtInput)
document.getElementById('btn-share').addEventListener('click', onShareMeme)
document.getElementById('btn-back').addEventListener('click', onBackToGallery)
document.getElementById('btn-download').addEventListener('click', onDownloadMeme)
document.getElementById('color-picker').addEventListener('input', onColorChange)
document.getElementById('btn-increase-font').addEventListener('click', () => onResizeLine(2))
document.getElementById('btn-decrease-font').addEventListener('click', () => onResizeLine(-2))
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
document.querySelectorAll('.sticker-button').forEach(btn => {
    btn.addEventListener('click', () => {
        addLine()
        setLineTxt(btn.textContent)
        renderMeme()
    })
})
document.addEventListener('keydown', onKeyMove)
document.getElementById('btn-flexible').addEventListener('click', onFlexibleMeme)

document.getElementById('filter-input').addEventListener('input', ev => {
    renderGallery(ev.target.value)
})
document.getElementById('btn-clear-filter').addEventListener('click', () => {
    document.getElementById('filter-input').value = ''
    renderGallery()
})
document.getElementById('btn-rotate-line')?.addEventListener('click', onRotateLine)

const canvas = document.getElementById('meme-canvas')
canvas.addEventListener('mousedown', onStartDrag)
canvas.addEventListener('mousemove', onMoveDrag)
canvas.addEventListener('mouseup', onStopDrag)
canvas.addEventListener('dblclick', onCanvasDblClick)
canvas.addEventListener('touchstart', ev => onStartDrag(ev.touches[0]))
canvas.addEventListener('touchmove', ev => {
    ev.preventDefault()
    onMoveDrag(ev.touches[0])
}, { passive: false })
canvas.addEventListener('touchend', onStopDrag)


renderGallery()
renderMeme()
renderSavedMemes()
