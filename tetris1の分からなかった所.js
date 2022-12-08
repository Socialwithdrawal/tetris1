/* addEventListener() は EventTarget インターフェイスのメソッドで、ターゲットに特定のイベントが配信されるたびに呼び出される関数を設定します。
DOMContentLoaded イベントは、 HTML の初期文書が完全に読み込まれ解釈された時点で発生し、スタイルシート、画像、サブフレームの読み込みが完了するのを待ちません。 */
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
/* Array.from() メソッドは、反復可能オブジェクトや配列風オブジェクトからシャローコピー(コピー元と同じ参照をする)された、新しい Array インスタンスを生成します。
この場合.gridクラスのついたdiv(200個)を配列に入れた変数squaresを作る */
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
      'orange',
      'red',
      'purple',
      'green',
      'blue'
    ]
  
    //The Tetrominoes
    const lTetromino = [
      [1, width+1, width*2+1, 2],
      [width, width+1, width+2, width*2+2],
      [1, width+1, width*2+1, width*2],
      [width, width*2, width*2+1, width*2+2]
    ]
  
    const zTetromino = [
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1],
      [0,width,width+1,width*2+1],
      [width+1, width+2,width*2,width*2+1]
    ]
  
    const tTetromino = [
      [1,width,width+1,width+2],
      [1,width+1,width+2,width*2+1],
      [width,width+1,width+2,width*2+1],
      [1,width,width+1,width*2+1]
    ]
  
    const oTetromino = [
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1],
      [0,1,width,width+1]
    ]
  
    const iTetromino = [
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3],
      [1,width+1,width*2+1,width*3+1],
      [width,width+1,width+2,width+3]
    ]
  
    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
  
    let currentPosition = 4
    let currentRotation = 0
  
    console.log(theTetrominoes[0][0])
  
    //テトロミノとその一回転をランダムに選択する。
/*  Math.floor() 関数は与えられた数値以下の最大の整数を返します。
    Math.random() 関数は、 0 以上 1 未満 (0 は含むが、 1 は含まない) の範囲で浮動小数点の擬似乱数を返します。
    この場合はtheTetrominoesのlength = 5なので0,1,2,3,4をランダムに返します */
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
  
    //テトロミノを描写
/*  forEach() メソッドは、与えられた関数を、配列の各要素に対して一度ずつ実行します。
    classListとは特定の要素のクラス名を追加したり、参照したり出来るプロパティです。classList.addはクラスを追加するメソッドです。
    style.backgroundColorは、要素のスタイル属性のbackground-colorプロパティの値を取得、もしくは、設定するプロパティです。 */
    function draw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')//配列から一つずつ取り出して、[]に指定されたdivにtetrominoを追加する
        squares[currentPosition + index].style.backgroundColor = colors[random]//生成されたtetrominoクラスの色をランダムに変える
      })
    }
  
    //テトロミノを外す
    //classList.removeは指定された要素のクラスを削除するメソッドです
    function undraw() {
      current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')//drawで追加されたtetrominoを削除する
        squares[currentPosition + index].style.backgroundColor = ''//backgroudcolorを消さないとテトロミノの轍跡が残るので、それを消す
      })
    }
  
    //keyCodeに関数を割り当てる
    //37は左の矢印キーが押された時のキーコード、その他も同様
    function control(e) {
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDown()
      }
    }
    /* keyupイベントは、キーが離れた時に発生します。keyupはキーを話した時、keydownはキーを押下した時にイベントが発生します
    keydownでは押しっぱなしで入力されたキー情報が取得できますが、keyupでは取得することができません。
    今回の場合押下ごとに移動するので、keyupを使ってるっぽい */
    document.addEventListener('keyup', control)
    
    //テトロミノが降ってくるようにする
    function moveDown() {
      undraw()
      currentPosition += width
      draw()
      freeze()
    }
  
    //フリーズ機能
    function freeze() {
      if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        //テトリスを開始する
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
      }
    }
  
    //テトロミノを左に移動させる。フィールドの端、もしくはブロックがある場合は動かないようにする。
    function moveLeft() {
      undraw()
      const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
      if(!isAtLeftEdge) currentPosition -=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
      }
      draw()
    }
  
    //テトロミノを右に移動させる。フィールドの端、もしくはブロックがある場合は動かないようにする。
    function moveRight() {
      undraw()
      const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
      if(!isAtRightEdge) currentPosition +=1
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
      }
      draw()
    }
  
    
    //テトロミノの回転を固定化する。
    function isAtRight() {
      return current.some(index=> (currentPosition + index + 1) % width === 0)  
    }
    
    function isAtLeft() {
      return current.some(index=> (currentPosition + index) % width === 0)
    }
    
    function checkRotatedPosition(P){
      P = P || currentPosition       //現在の位置を取得します。 そして、駒が左側に寄っているかどうかを確認します。
      if ((P+1) % width < 4) {         //位置インデックスは、ピースの位置よりも 1 小さい可能性があるため、1 を追加します (インデックスの付け方により)。     
        if (isAtRight()){            //実際の位置を使用して、右側に裏返されているかどうかを確認します
          currentPosition += 1    //その場合は、1 つ追加して元に戻します
          checkRotatedPosition(P) //再び確かめる。 長いブロックはもっと動く必要があるかもしれないので、最初からポジションをパスしてください。
          }
      }
      else if (P % width > 5) {
        if (isAtLeft()){
          currentPosition -= 1
        checkRotatedPosition(P)
        }
      }
    }
    
    //テトロミノを回す
    function rotate() {
      undraw()
      currentRotation ++
      if(currentRotation === current.length) { //現在のローテーションが 4 になったら、0 に戻します
        currentRotation = 0
      }
      current = theTetrominoes[random][currentRotation]
      checkRotatedPosition()
      draw()
    }
    /////////
  
    
    
    //ミニグリッド表示で次のテトロミノを表示
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0
  
  
    //回転のないテトロミノス
    const upNextTetrominoes = [
      [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
      [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
      [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
      [0, 1, displayWidth, displayWidth+1], //oTetromino
      [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
    ]
  
    //ミニグリッド表示で形状を表示する
    function displayShape() {
      //グリッド全体からテトロミノの痕跡を取り除く
      displaySquares.forEach(square => {
        square.classList.remove('tetromino')
        square.style.backgroundColor = ''
      })
      upNextTetrominoes[nextRandom].forEach( index => {
        displaySquares[displayIndex + index].classList.add('tetromino')
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
      })
    }
  
    //ボタンに機能を追加する
    startBtn.addEventListener('click', () => {
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
      }
    })
  
    //スコアを追加
    function addScore() {
      for (let i = 0; i < 199; i +=width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
  
        if(row.every(index => squares[index].classList.contains('taken'))) {
          score +=10
          scoreDisplay.innerHTML = score
          row.forEach(index => {
            squares[index].classList.remove('taken')
            squares[index].classList.remove('tetromino')
            squares[index].style.backgroundColor = ''
          })
          const squaresRemoved = squares.splice(i, width)
          squares = squaresRemoved.concat(squares)
          squares.forEach(cell => grid.appendChild(cell))
        }
      }
    }
  
    //game over
    function gameOver() {
      if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
      }
    }
  
  })