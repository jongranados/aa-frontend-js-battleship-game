import Board from "./board.js";
window.onload = () => { 
    function startGame() { 
        // 1. instantiate new game boards for user and computer
        let userBoard = new Board(); 
        let compBoard = new Board(); 
        console.log(userBoard.grid);
        console.log(compBoard.grid); 

        // game header
        const headerElement = document.createElement('div');
        headerElement.setAttribute('id', 'logo');
        document.body.appendChild(headerElement);

        headerElement.innerHTML = '<div id="leftShip">🚢</div>BATTLESHIP<div id="rightShip">🚢</div>'

        // winner (hidden until a win is detected)
        const gameOverElement = document.createElement('div'); 
        gameOverElement.setAttribute('id', 'gameover'); 
        document.body.appendChild(gameOverElement); 
        gameOverElement.style.visibility = 'hidden'; 

        // wrapper for each game board
        const boardsWrapper = document.createElement('div');
        boardsWrapper.setAttribute('id', 'boards'); 
        boardsWrapper.innerHTML = '<div class="board" id="userBoard"></div><div class="board" id="compBoard"></div>'
        document.body.appendChild(boardsWrapper); 
        const userBoardWrapper = document.getElementById('userBoard');
        const compBoardWrapper = document.getElementById('compBoard'); 

        // html grid 
        const compBoardAvailableTiles =[]; // used to randomize computer move
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) { 

                const userTile = document.createElement('div');
                // storing row and column data from grid onto dom element
                userTile.setAttribute('data-row', row);
                userTile.setAttribute('data-col', col);
                userTile.setAttribute('class', 'tile');
                userBoardWrapper.appendChild(userTile); 

                const compTile = document.createElement('div');
                // storing row and column data from grid onto dom element
                compTile.setAttribute('data-row', row);
                compTile.setAttribute('data-col', col);
                compTile.setAttribute('class', 'tile');
                compBoardWrapper.appendChild(compTile); 
                compBoardAvailableTiles.push([row, col]); 
            }
        }

        // game logic:
        // event listener applied to outer wrapper to leverage bubbling feature for event delegation. 
        userBoardWrapper.addEventListener('click', event => { 

            // check if someone has already won - if so, don't process event. 
            if (gameOverElement.style.visibility === 'visible') { 
                return; 
            }

            const tileSelected = event.target; 

            // ensure tile hasn't already been clicked
            if (tileSelected.style.backgroundColor === document.body.style.backgroundColor) { 
                // reading grid data stored on dom element
                const row = tileSelected.dataset.row;
                const col = tileSelected.dataset.col;
                const val = userBoard.makeHit(row, col);

                // check whether tile selected resulted in a hit
                if (val) {
                    tileSelected.innerText = '💥'; 
                    tileSelected.style.backgroundColor = "lime";
                    setTimeout(() => tileSelected.innerText = val, 300); 

                    if (userBoard.isGameOver()) { 
                        headerElement.style.animationPlayState = 'paused'; 
                        gameOverElement.innerText = '👿 YOU WIN 👿'; 
                        gameOverElement.appendChild(killAll); 
                        gameOverElement.style.visibility = 'visible'; 
                        return;
                    }
                } else {
                    tileSelected.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
                    tileSelected.innerHTML = '<i class="fa-solid fa-x"></i>'
                    // window.location.reload(); // simple way to reset game - simply reload page
                }
            
                // computer logic: 
                setTimeout(() => {
                    const randomIndex = Math.floor(Math.random() * compBoardAvailableTiles.length);
                    const [row, col] = [compBoardAvailableTiles[randomIndex][0], compBoardAvailableTiles[randomIndex][1]]
                    compBoardAvailableTiles.splice(randomIndex, 1); 
                    const randomElement = compBoardWrapper.querySelector(`[data-row="${row}"][data-col="${col}"]`); // pay attention to syntax - parenthesis around number is critical

                    const val = compBoard.makeHit(row, col);

                    // check whether randomly selected tile resulted in a hit
                    if (val) {
                        randomElement.innerText = '💥'; 
                        randomElement.style.animation = "wiggle 2s linear infinite"
                        setTimeout(() => randomElement.innerText = val, 300); 
                        console.log('val: ', val);
                        randomElement.style.backgroundColor = "lime";

                        if (compBoard.isGameOver()) {
                            headerElement.style.animationPlayState = 'paused';
                            gameOverElement.innerText = '😈 YOU LOSE 😈';
                            gameOverElement.appendChild(killAll); 
                            gameOverElement.style.visibility = 'visible';
                            return;                    
                        }
                    } else {
                        randomElement.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
                        randomElement.innerHTML = '<i class="fa-solid fa-x"></i>'
                        // window.location.reload(); // simple way to reset game - simply reload page
                    }
                }, 250)
            }
        });

        // reset button - the only reason this approach works is because the entire HTML body 
        // is deleted and recreated right before startGame() is reinvoked. If the elements with
        // listeners on them were hardcoded into the html file, reinvoking startGame would
        // create additional listeners on top of existing listerners. That's the issue I ran into
        // in the tic-tac-toe project. There's two solutions: (1) wipe out the HTML page and
        // re-create every element via JS (as I've chosen to do here) anytime you want to reset 
        // the game (say after a player has won and you want a rematch) or (2) manually reset the
        // state content on the DOM elements you no longer wish to preserve BUT keeping the same 
        // elements and and therefore listeners and therefore not needing to reinvoke the outer
        // function and creating additional scopes that layer new listeners. Option 1 is wiser.
        const killAll = document.createElement('div');
        killAll.setAttribute('id', 'killDiv');
        killAll.innerHTML = '<button type="button" id="killButton">RESET</button>';
        document.body.appendChild(killAll);

        killAll.addEventListener('click', () => {
            // reset html body by removing each of its children 
            while (document.body.firstChild) {
                document.body.removeChild(document.body.firstChild);
            }
            // restart game 
            startGame()
        }); 
    }; 

    startGame(); 
}
