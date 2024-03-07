/**
 * 解析歌詞字符串
 * 得到歌詞對象的數組
 * 歌詞對象:
 * {time: 開始時間, words: 歌詞內容}
 */
function parseLrc() {
    let lines = lrc.split('\n');
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        let str = lines[i];
        let parts = str.split(']');
        let obj = {
            time: parseTime(parts[0].substring(1)),
            words: parts[1]
        }
        result.push(obj);
    }
    return result;
}

/**
 * 將一個時間字符串解析為數字 (秒)
 * @param {String} timeStr 時間字符串
 * @returns 秒
 */
function parseTime(timeStr) {
    let parts = timeStr.split(':');
    return +parts[0] * 60 + +parts[1];
}

let lrcData = parseLrc();
let doms = {
    audio: document.querySelector("audio"),
    container: document.querySelector("div"),
    ul: document.querySelector("ul")
};

function createLrcElements() {
    let frag = document.createDocumentFragment();
    for (let i = 0; i < lrcData.length; i++) {
        let li = document.createElement("li");
        li.textContent = lrcData[i].words;
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

let containerHeight = doms.container.clientHeight;
let liHeight = doms.ul.children[0].clientHeight;
let maxOffset = doms.ul.clientHeight - containerHeight;

/**
 * 計算出，在當前播放器播放到第幾秒的情況下
 * lrcData數組中，應該高亮顯示的歌詞下標
 * 如果沒有一句歌詞需要顯示，則輸出-1
 */
function findIndex() {
    let curTime = doms.audio.currentTime;
    for (let i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }
    return lrcData.length - 1;
}

/**
 * 設置ul元素的偏移量
 */
function setOffset() {
    let index = findIndex();
    let offset = liHeight * index + liHeight / 2 - containerHeight / 2;
    if (offset < 0) {
        offset = 0;
    } else if (offset > maxOffset) {
        offset = maxOffset;
    }
    doms.ul.style.transform = `translateY(-${offset}px)`;
    doms.ul.querySelector(".active") ? doms.ul.querySelector(".active").classList.remove("active") : -1;
    doms.ul.children[index] ? doms.ul.children[index].classList.add("active") : -1;
}

doms.audio.addEventListener("timeupdate", setOffset);
