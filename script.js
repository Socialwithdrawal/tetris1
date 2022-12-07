document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const ScoreDisplay = document.querySelector('#score');
    const StartBtn = document.querySelector('#start-button');
    const width = 10;

    //テトロミノ5種
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ];

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ];

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];

    const theTetrominoes = [iTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
    let currentPosition = 4;//divの位置を指定
    let currentRotation = 0;//図形の回転の指定

    console.log(theTetrominoes[0][0]);

    //テトロミノとその最初の回転をランダムに選択します
    let random = Math.floor(Math.random()*theTetrominoes.length);//theTetrominoes.lengthの5をランダムで返し、小数点を切り捨てる。
    let current = theTetrominoes[random][currentRotation];//randamで選ばられた数字をtheTetrominoesの配列に指定する。

    //テトロミノを描写する
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');//
        });
    };
    draw()

});