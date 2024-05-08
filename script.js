const humanPlayer = "X";
const aiPlayer = "O";
let currentPlayer = humanPlayer;
let board;


const boxes = document.querySelectorAll(".box");
const resetBtn = document.querySelector(".resetGame");
const newGameBtn = document.querySelector(".newGame");
const msgContainer = document.querySelector(".msg-container");
const msg = document.querySelector("#msg");


const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];


const checkWinner = (currentBoard, player) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;    // array distraction pattern to track each value of the winPattern
        if (
            currentBoard[a] === player &&
            currentBoard[a] === currentBoard[b] &&
            currentBoard[b] === currentBoard[c] // this can also be written as (currentBoard[a] === currentBoard[b]==currentBoard[c] === X ya O)
        ) {
            return true; // Player wins
        }
    }
    return false; // No winner
};


const handlePlayerMove = (box) => {
    if (box.innerText === "" && currentPlayer === humanPlayer) {
        const index = [...boxes].indexOf(box);// here the ...boxes is using spread operator:  
                                            //([...boxes]) by which the nodde can be converted into 
                                            //array for using array method like indexOf
        board[index] = humanPlayer;
        box.innerText = humanPlayer;
        currentPlayer = aiPlayer;
        if (!checkWinner(board, humanPlayer) && !isBoardFull()) {
            setTimeout(handleAiMove, 500); // Delay AI move for better UX
        } else {
            endGame();
        }
    }
};


const handleAiMove = () => {
    const bestMove = minimax(board, aiPlayer).index;
    if (bestMove !== -1) {
        boxes[bestMove].innerText = aiPlayer;
        board[bestMove] = aiPlayer;
        currentPlayer = humanPlayer;
        if (!checkWinner(board, aiPlayer) && !isBoardFull()) {
            currentPlayer = humanPlayer;
        } else {
            endGame();
        }
    }
};

// Minimax algorithm function
const minimax = (currentBoard, player) => {
    const availableMoves = getEmptyIndexes(currentBoard);

    // Base cases
    if (checkWinner(currentBoard, humanPlayer)) {
        return { score: -10 };
    } else if (checkWinner(currentBoard, aiPlayer)) {
        return { score: 10 };
    } else if (availableMoves.length === 0) {
        return { score: 0 };
    }

    
    const moves = [];

    
    for (let i = 0; i < availableMoves.length; i++) {
        const move = {};  //Creating Move Objects we do {}
        const index = availableMoves[i];
        move.index = index;  // move me jo emply space ka index aaye usko ndex variable me dal lo
        currentBoard[index] = player; // player mtlb X ya O, is line se hm game state ko update krre h
                                    //hm player ki value ko khali index pe update krre h

        // Recursive call to minimax for opponent's turn; isme agar player AI h to hm minimax 
        //function ko call krte hain humanPlayer ke move ko evaluate krne liye and vica versa
        //ye recursive call hme har state ko evaluate krne me madad krta h
        if (player === aiPlayer) {
            const result = minimax(currentBoard, humanPlayer);//the result var will store the score by minimax function
            move.score = result.score;// isse har move ke liye minimax function se calculate kiya gaya score move object me store ho jata hai. 
        } else {
            const result = minimax(currentBoard, aiPlayer);
            move.score = result.score;
        }

        currentBoard[index] = '';//mtlb ki minimax function ki wajah se jo har bar change ho rha h uskoi initial state me lane ke liye ye kiya gya

        // Store the move object in array
        moves.push(move);
    }

    // Select best move based on player
    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity; // ai ke liye best move mtlb min no liya initially taki usko maximum no se replace kr ske
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }// isme basically hm array se maximum no nikal rhe h 
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }// isme basically hm array se minimum no nikal rhe h 
        }
    }

    // Return the best move object
    return moves[bestMove];
};

// Function to get empty indexes on the board
const getEmptyIndexes = (board) => {
    return board.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);
};

// Function to check if the board is full
const isBoardFull = () => {
    return board.every(cell => cell !== '');
};

// Function to end the game and display the result
const endGame = () => {
    if (checkWinner(board, humanPlayer)) {
        msg.innerText = `Congratulations, winner is ${humanPlayer}`;
    } else if (checkWinner(board, aiPlayer)) {
        msg.innerText = `Sorry, winner is ${aiPlayer}`;
    } else {
        msg.innerText = "It's a Draw!";
    }
    msgContainer.classList.remove("hide");
    disableGame();
};

// Function to disable the game after ending
const disableGame = () => {
    boxes.forEach(box => {
        box.removeEventListener("click", handleBoxClick);
    });
};

// Function to enable the game for a new round
const enableGame = () => {
    board = ['', '', '', '', '', '', '', '', '']; // Reset board
    boxes.forEach(box => {
        box.addEventListener("click", handleBoxClick);
        box.innerText = ""; // Clear box content
    });
    currentPlayer = humanPlayer; // Human starts first
    msgContainer.classList.add("hide");
};

// Event listener for handling player's click on a box
const handleBoxClick = (event) => {
    const box = event.target;
    handlePlayerMove(box);
};

// Event listener for reset button
resetBtn.addEventListener("click", enableGame);

// Event listener for new game button
newGameBtn.addEventListener("click", enableGame);

// Initialize the game
enableGame();
