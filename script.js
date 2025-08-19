const container = document.getElementById('puzzle-container');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const completeImage = document.getElementById('complete-image');
const continueBtn = document.getElementById('continue-btn');
const endBtn = document.getElementById('end-btn');

const image = 'zaku.png'; // パズル画像
const size = 3; // 3x3
let pieces = [];

// パズル生成
function createPuzzle(doShuffle) {
    container.innerHTML = "";
    pieces = [];

    const order = [...Array(size * size).keys()];
    if (doShuffle) shuffle(order);

    order.forEach((index, pos) => {
        const x = index % size;
        const y = Math.floor(index / size);

        const piece = document.createElement('div');
        piece.className = 'piece';
        piece.style.backgroundImage = `url(${image})`;
        piece.style.backgroundPosition = `-${x * 100}px -${y * 100}px`;
        piece.dataset.correct = index;
        piece.dataset.current = pos;

        piece.draggable = true;
        piece.addEventListener('dragstart', handleDragStart);
        piece.addEventListener('dragover', e => e.preventDefault());
        piece.addEventListener('drop', handleDrop);
        piece.addEventListener("touchstart", handleTouchStart, { passive: false });

        container.appendChild(piece);
        pieces.push(piece);
    });
}

// シャッフル関数
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// ドラッグ開始
let draggedPiece = null;
function handleDragStart(e) {
    draggedPiece = this;
}

// ドロップ処理
function handleDrop(e) {
    const targetPiece = this;
    if (draggedPiece === targetPiece) return;

    const draggedIndex = pieces.indexOf(draggedPiece);
    const targetIndex = pieces.indexOf(targetPiece);

    // 配列入れ替え
    [pieces[draggedIndex], pieces[targetIndex]] =
        [pieces[targetIndex], pieces[draggedIndex]];

    // dataset.current 更新
    pieces.forEach((p, i) => p.dataset.current = i);

    // DOMを再描画
    pieces.forEach(p => container.appendChild(p));

    checkClear();
}

// クリア判定
function checkClear() {
    const isClear = pieces.every(p => p.dataset.correct == p.dataset.current);
    if (isClear) {
        message.textContent = "🎉 パズル完成！お見事ったい！";

        // パズルのピースを全部消す
        container.innerHTML = "";

        completeImage.style.display = "block";
        shuffleBtn.style.display = "none";
        document.getElementById("puzzle-container").style.display = "none";
        document.getElementById("complete-image").style.display = "block";
    }
}

// スタートボタン
startBtn.addEventListener('click', () => {
    createPuzzle(true);
    document.getElementById('start-screen').style.display = "none";
    shuffleBtn.style.display = "inline-block";
});

// シャッフルボタン
shuffleBtn.addEventListener('click', () => createPuzzle(true));

// 続けるボタン
continueBtn.addEventListener('click', () => {
    completeImage.style.display = "none";
    createPuzzle(true);
    shuffleBtn.style.display = "inline-block";
    container.style.display = "grid";

    // メッセージを消す
    message.textContent = "";
});

// 終わるボタン
endBtn.addEventListener('click', () => {
    completeImage.style.display = "none";
    container.innerHTML = "";
    message.textContent = "また遊んでくれっとや！";
    shuffleBtn.style.display = "none";
});

let firstSelected = null;

function handleTouchStart(e) {
    e.preventDefault(); // スクロール防止
    const piece = e.currentTarget;

    if (!firstSelected) {
        // 1つ目選択
        firstSelected = piece;
        piece.classList.add("selected");
    } else {
        // 2つ目選択→入れ替え
        swapPieces(firstSelected, piece);
        firstSelected.classList.remove("selected");
        firstSelected = null;
    }
}

function swapPieces(p1, p2) {
    if (p1 === p2) return;

    const i1 = pieces.indexOf(p1);
    const i2 = pieces.indexOf(p2);

    [pieces[i1], pieces[i2]] = [pieces[i2], pieces[i1]];

    pieces.forEach((p, i) => p.dataset.current = i);
    pieces.forEach(p => container.appendChild(p));

    checkClear();
}

// ページ読み込み時は完成状態を表示
createPuzzle(false);
