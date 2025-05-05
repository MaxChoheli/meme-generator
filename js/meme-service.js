'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Your Meme Text',
            size: 30,
            color: 'white',
            font: 'Impact',
            align: 'center',
            pos: { x: 0, y: 50 },
            width: 0,
            height: 0,
            rotate: 0
        },
        {
            txt: 'Bottom Text',
            size: 30,
            color: 'white',
            font: 'Impact',
            align: 'center',
            pos: { x: 0, y: 0 },
            width: 0,
            height: 0,
            rotate: 0
        }
    ]
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
}

function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function addLine() {
    gMeme.lines.push({
        txt: 'New Line',
        size: 30,
        color: 'white',
        font: 'Impact',
        align: 'center',
        pos: { x: 0, y: 0 },
        width: 0,
        height: 0,
        rotate: 0
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function removeSelectedLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function setAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function moveLine(dx, dy) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.pos.x += dx
    line.pos.y += dy
}

function rotateLine(deg) {
    gMeme.lines[gMeme.selectedLineIdx].rotate += deg
}

function saveMeme() {
    const memeCopy = structuredClone(gMeme)

    if (typeof memeCopy.selectedImgId === 'string' && memeCopy.selectedImgId.startsWith('user-')) {
        const img = new Image()
        img.src = memeCopy.selectedImgId
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)
            memeCopy.selectedImgId = canvas.toDataURL('image/jpeg')
            persistMeme(memeCopy)
        }
    } else {
        persistMeme(memeCopy)
    }
}

function persistMeme(meme) {
    const memes = loadFromStorage('saved-memes') || []
    memes.push(meme)
    saveToStorage('saved-memes', memes)
}

function getSavedMemes() {
    return loadFromStorage('saved-memes') || []
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
}
