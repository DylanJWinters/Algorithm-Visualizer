const n = 10;
const array=[];

init();

let audioCtx = null;

function playNote(freq) {
    if (audioCtx ==null) {
        audioCtx = new(
            AudioContext ||
            webkitAudioContext ||
            window.AudioContext
        )();
    }
    const dur =0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur); //gets rid of clicking noise
    osc.connect(node);
    node.connect(audioCtx.destination);
}


function init() {
    for(let i = 0; i < n; i++){
    array[i] = Math.random();
}
showBars();
}

function bubbleSortPlay() {
    const copy=[...array];
    const moves =bubbleSort(copy);
    animate(moves);
}

function selectionSortPlay() {
    const copy=[...array];
    const moves =selectionSort(copy);
    animate(moves);
}

function insertionSortPlay() {
    const copy=[...array];
    const moves =insertionSort(copy);
    animate(moves);
}

function mergeSortPlay() {
    const copy=[...array];
    const moves =mergeSort(copy);
    animate(moves);
}

function quickSortPlay() {
    const copy=[...array];
    const moves =quickSort(copy);
    animate(moves);
}

function animate(moves) {
    if(moves.length == 0){
        showBars();
        return;
    } 
    const move = moves.shift();
    const [i, j] = move.indices;
    
    if(move.type === 'swap') {
        [array[i], array[j]] = [array[j], array[i]];
    }

    playNote(200 + array[i] * 500);
    playNote(200 + array[j] * 500);

    showBars(move);
    setTimeout(function() {
        animate(moves);
    }, 100);
}


function showBars(move) {
    container.innerHTML = "";
    for(let i = 0; i < array.length; i++){
    const bar = document.createElement("div");
    bar.style.height = array[i]*100 + "%";
    bar.classList.add("bar");
    
    if(move && move.indices.includes(i)){
        bar.style.backgroundColor = 
            move.type === "swap" ? "red" : "green";
    }
    container.appendChild(bar);
}
}




//shuffle and algorithms

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function bubbleSort(array) {
    const moves =[];
    do {
        var swapped = false;
        for(let i = 1; i < array.length; i++) {
           moves.push({
                    indices: [i - 1, i],type: 'comp'
                });
            if(array[i - 1] > array[i]) {
                swapped = true;
                moves.push({
                    indices: [i - 1, i],type: "swap"
                });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    }while(swapped);
    return moves;
}

function selectionSort(array) {
    const moves = [];
    let n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            moves.push({
                    indices: [minIdx, j],type: 'comp'
                });
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        moves.push({
                    indices: [i, minIdx],type: 'swap'
                });
        let temp = array[i];
        array[i] = array[minIdx];
        array[minIdx] = temp;
    }
    return moves;
}

function insertionSort(array) {
    const moves = [];
    let n = array.length;
    for (let i = 1; i < n; i++) {
        moves.push({
                    indices: [i - 1, i],type: 'comp'
                });
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            moves.push({
                indices: [j, j + 1],type: "swap"
            });
            array[j + 1] = array[j];
            j = j - 1;
        }
        array[j + 1] = key;
    }
    return moves;
}

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
}
    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    let result = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
}
    return result.concat(left.slice(i)).concat(right.slice(j));
}

function quickSort(array) {
    const moves = [];
    if (array.length <= 1) {
        return moves;
    }
    const pivot = array[array.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] < pivot) {
            left.push(array[i]);
        } else {
            right.push(array[i]);
        }
        
    }
   return [...quickSort(left), pivot, ...quickSort(right)];
}
