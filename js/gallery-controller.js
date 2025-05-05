'use strict'

const gTagClicks = {}
const gUserImages = []

function renderGallery(filter = '') {
    const elGallery = document.querySelector('.gallery')
    let strHTML = ''

    for (let i = 1; i <= 50; i++) {
        const tags = getTagForImage(i)
        if (!filter || tags.some(tag => tag.includes(filter.toLowerCase()))) {
            strHTML += `<img src="gallery/${i}.jpg" data-id="${i}" onclick="onImgSelect(${i})" alt="${tags.join(', ')}">`
        }
    }

    gUserImages.forEach((img, idx) => {
        strHTML += `<img src="${img}" data-id="user-${idx}" onclick="onUserImgSelect('${img}')">`
    })

    elGallery.innerHTML = strHTML
}

function getTagForImage(id) {
    const tags = {
        1: ['trump'], 2: ['dog'], 3: ['baby', 'dog'], 4: ['cat'],
        5: ['baby'], 6: ['aliens'], 7: ['baby'], 8: ['buzz'],
        9: ['baby'], 10: ['obama'], 11: ['kiss'], 12: ['you'],
        13: ['gatsby'], 14: ['what'], 15: ['LOTR'], 16: ['captain'],
        17: ['trash'], 18: ['buzz'], 19: ['taken'], 20: ['spider-man'],
        21: ['always-has-been'], 22: ['comic'], 23: ['argument'], 24: ['tired'],
        25: ['batman'], 26: ['bernie'], 27: ['blocked'], 28: ['avengers'],
        29: ['sad'], 30: ['what'], 31: ['cat'], 32: ['leopard'],
        33: ['chad'], 34: ['clown'], 35: ['fire'], 36: ['crying-jordan'],
        37: ['what'], 38: ['django'], 39: ['domino'], 40: ['brain'],
        41: ['predator'], 42: ['harambe'], 43: ['harry-potter'], 44: ['zemo'],
        45: ['harold'], 46: ['invincible'], 47: ['stairs'], 48: ['gift'],
        49: ['padme'], 50: ['car']
    }

    return tags[id] || []
}

function renderTagCloud() {
    const tagMap = {}
    for (let i = 1; i <= 50; i++) {
        const tags = getTagForImage(i)
        tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = 0
            tagMap[tag]++
        })
    }

    const elCloud = document.querySelector('.tag-cloud')
    elCloud.innerHTML = ''

    Object.entries(tagMap).forEach(([tag, count]) => {
        if (!gTagClicks[tag]) gTagClicks[tag] = count
        const fontSize = 12 + gTagClicks[tag] * 2
        const btn = document.createElement('button')
        btn.textContent = tag
        btn.style.fontSize = `${fontSize}px`
        btn.onclick = () => {
            gTagClicks[tag]++
            document.getElementById('filter-input').value = tag
            renderGallery(tag)
            renderTagCloud()
        }
        elCloud.appendChild(btn)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-toggle-tags').addEventListener('click', () => {
        const el = document.querySelector('.tag-cloud')
        el.style.display = el.style.display === 'flex' ? 'none' : 'flex'
    })

    document.getElementById('user-img-input').addEventListener('change', ev => {
        const reader = new FileReader()
        reader.onload = ev => {
            gUserImages.push(ev.target.result)
            renderGallery()
        }
        reader.readAsDataURL(ev.target.files[0])
    })

    renderTagCloud()
})
