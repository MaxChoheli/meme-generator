'use strict'

function renderGallery(filter = '') {
    const elGallery = document.querySelector('.gallery')
    let strHTML = ''

    for (let i = 1; i <= 50; i++) {
        const tags = getTagForImage(i)
        if (!filter || tags.some(tag => tag.includes(filter.toLowerCase()))) {
            strHTML += `<img src="gallery/${i}.jpg" data-id="${i}" onclick="onImgSelect(${i})" alt="${tags.join(', ')}">`
        }
    }

    elGallery.innerHTML = strHTML
}

function getTagForImage(id) {
    const tags = {
        1: ['trump', 'great-deal'],
        2: ['dog'],
        3: ['baby', 'dog', 'sleep'],
        4: ['cat'],
        5: ['baby', 'success'],
        6: ['aliens', 'history'],
        7: ['baby', 'black'],
        8: ['wonka', 'willy'],
        9: ['baby', 'evil', 'laughing'],
        10: ['obama', 'barack'],
        11: ['kiss'],
        12: ['point', 'you'],
        13: ['leo', 'leonardo', 'dicaprio', 'cheers', 'gatsby', 'the-great-gatsby'],
        14: ['morpheus', 'what-if-i-told-you'],
        15: ['LOTR', 'one-does-not-simply', 'lord-of-the-rings'],
        16: ['kirk', 'patrick-stewart'],
        17: ['trash', '3day-operation', 'vladimir', 'putin'],
        18: ['toy-story', 'buzz', 'everywhere'],
        19: ['taken', 'i-will-find-you'],
        20: ['spider-man', 'im-ready'],
        21: ['astronaut', 'always-has-been'],
        22: ['comic', 'surprise'],
        23: ['argument'],
        24: ['tired-dad', 'computer'],
        25: ['batman', 'custom-character', 'pinkguy'],
        26: ['bernie', 'sanders', 'bernie-sanders'],
        27: ['blocked'],
        28: ['hail-hydra', 'avengers', 'captain-america'],
        29: ['cat', 'sad'],
        30: ['what'],
        31: ['cat'],
        32: ['mother', 'leopard'],
        33: ['comic', 'chad'],
        34: ['angry', 'clown'],
        35: ['burning', 'fire'],
        36: ['sad', 'jordan', 'crying-jordan'],
        37: ['what', 'surprise'],
        38: ['dicaprio', 'django', 'leonardo'],
        39: ['domino'],
        40: ['genious', 'brain'],
        41: ['arnold', 'dillon', 'predator'],
        42: ['harambe', 'monkey', 'gorilla'],
        43: ['harry-potter', 'dumbledor', 'voldemort'],
        44: ['zemo', 'falcon', 'hes-out-of-line'],
        45: ['harold', 'hide-the-pain'],
        46: ['invincible', 'omni-man', 'fraction-of-our-power'],
        47: ['skip-a-few-steps', 'stairs'],
        48: ['master', 'servant', 'gift'],
        49: ['star-wars', 'anakin', 'padme', 'wont-you?'],
        50: ['car', 'surprise']
    }

    return tags[id] || []
}
