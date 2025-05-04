'use strict'

function renderGallery() {
    const elGallery = document.querySelector('.gallery')

    let strHTML = ''
    for (let i = 1; i <= 50; i++) {
        strHTML += `<img src="gallery/${i}.jpg" data-id="${i}" onclick="onImgSelect(${i})">`
    }

    elGallery.innerHTML = strHTML
}
