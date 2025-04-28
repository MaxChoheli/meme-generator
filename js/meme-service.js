'use strict'

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Your Meme Text',
            size: 30,
            color: 'white'
        },
        {
            txt: 'Bottom Text',
            size: 30,
            color: 'white'
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
        color: 'white'
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
}
