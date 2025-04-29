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
            height: 0
        },
        {
            txt: 'Bottom Text',
            size: 30,
            color: 'white',
            font: 'Impact',
            align: 'center',
            pos: { x: 0, y: 0 },
            width: 0,
            height: 0
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
        height: 0
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

function moveLine(dx, dy) {
    const line = gMeme.lines[gMeme.selectedLineIdx]
    line.pos.x += dx
    line.pos.y += dy
}
