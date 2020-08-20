import React from 'react';
import ReactDOM from 'react-dom';

//@ params: board, current player
// checks if there is a winner by comparing all possible wins in board
// returns true if ^, false otherwise
let has_won = (board, player) =>{
    for(let i=0; i<3; i++){
        if(board[0][i]===player && board[1][i]===player && board[2][i]===player)
            return true;
        else if(board[i][0]===player && board[i][1]===player && board[i][2]===player)
            return true;
        
    }
    
    if(board[0][0]===player && board[1][1]===player && board[2][2]===player)
        return true;
    else if(board[2][0]===player && board[1][1]===player && board[0][2]===player)
        return true;
   
    return false;
}
   // performs minimax decision making: recursive
    // @ params board = recursive board
    // @ player = current player: switches on each recursion
function minimax(board, player, depth){
        if(gameOver(board) || depth === 0){
            return [evaluateBoard(board), ''];
        }

        // performs oscillates player to perform best calcution of turn

        let best_move;
        if(player){
            var best_value = -1000;
            var symbol = 'X';
        } 
        else{
            var best_value = 1000;
            var symbol = 'O';
        }
        // get available moves list
        let availableMoves = moves_available(board);

        
        for(let i=0; i<availableMoves.length; i++){
            // new deep copy of board
            let new_board = JSON.parse(JSON.stringify(board));

            select_Square_minimax(new_board, availableMoves[i], symbol);
            // recurse with opposing player turn
            let hypotheticalVal = minimax(new_board, !player, depth-1)[0];
            // checks comparison on x-player
            if(player && hypotheticalVal > best_value){
                best_value = hypotheticalVal;
                best_move = availableMoves[i];
            }
            // checks comparison on o-player
            else if(!player && hypotheticalVal < best_value){
                best_value = hypotheticalVal;
                best_move = availableMoves[i];
            }
            
        }


        // return list of best move and value
        return [best_value,best_move];
    }

// @ params board
// returns value of 1, -1, or 0 
// depending on whether x, o, or tie is foreseen
function evaluateBoard(board){
        if(has_won(board, "X")){
            return 1;
        }
        else if(has_won(board, "O")){
            return -1;
        }
        else return 0;
}

// @ params board, player
// performs selection on board depending on player
// function does not set state, only for calculating minimax decision
function select_Square_minimax(board, square, player){
        // set gameboard to user's decision square
        let row = Math.round((square - 1) / 3.0);
        let col = square % 3;

        if(board[row][col] !== "X" && board[row][col] !== "O"){
            board[row][col] = player; // setting board with users value
            return true;
        }else 
            return false;
}

// @ params: board = game
// checks available moves in current board
// returns list of available moves
function moves_available(board){
        let available_moves = [];
        for (let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if(board[i][j] !== 'X' && board[i][j] !== 'O')
                    available_moves.push(board[i][j]);
            }
        }

        return available_moves;
}

function gameOver(board){
        // game over if winner found or no moves available
        if(moves_available(board).length === 0 || has_won(board, "X") || has_won(board, "O")){
            return true;
        }
        else return false;
}

class TicTacToe extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            game : [['0','1','2'],['3','4','5'],['6','7','8']],
            turn : true, pc : "O", pc_wins:0, player_wins:0
        }
        this.selectSquare = this.selectSquare.bind(this);
    }

    // strictly for user selection only
    selectSquare(square){
        let chosen_squares = document.getElementsByClassName('ticBtns');
        // make a deep copy of the current state game board
        let new_board = JSON.parse(JSON.stringify(this.state.game));
        
        // set users decisionsquare
        let row = Math.round((square - 1) / 3.0);
        let col = square % 3;
        new_board[row][col] = 'X'; // setting board with users value
        chosen_squares[square].classList.add('xSquare');
        // check if user has won the game
        if(has_won(new_board, 'X')){
            alert("Player X has won the game");
            this.setState((state)=>{
                return {game: JSON.parse(JSON.stringify(new_board)),
                player_wins:state.player_wins+1}
            });
            return;
        }

        // set level of game
        let level = document.getElementById('tic_tac_level').value;
        let depth = 3;
        if(level === 'Hard')
            depth = 9;
        else if(level === 'Medium')
            depth = 6;

        if(moves_available(this.state.game).length > 1){
            // begin minimax decision making based on player 0 going next
            let decisions = minimax(JSON.parse(JSON.stringify(new_board)), false, depth);
            console.log('**************** Returned minimax decisions ', decisions);

            // set gameboard to pc's decision
            row = Math.round((decisions[1] - 1) / 3.0);
            col = parseInt(decisions[1], 10) % 3;
            new_board[row][col] = 'O'; // setting board with users value
            chosen_squares[decisions[1]].classList.add('oSquare');

    
            // check if pc won
            if(has_won(new_board, "O")){
                alert("Player O has won");
                this.setState((state)=>{
                    return {game: JSON.parse(JSON.stringify(new_board)),
                    pc_wins:state.pc_wins+1}
                });
                return;
            }

            // update game state board for player o
            else{
                this.setState((state)=>{
                    return {game: JSON.parse(JSON.stringify(new_board))}
                });
            }
        }
    }

    restartHandler(){
        let newGame = [['0','1','2'],['3','4','5'],['6','7','8']];
        let reset_buttons = document.getElementsByClassName('ticBtns');
        for(let i=0; i<9; i++){
            reset_buttons[i].classList.remove('xSquare');
            reset_buttons[i].classList.remove('oSquare');
        }

        this.setState(()=>{
            return {game: newGame}
        })
    }

    render(){

        // values of the game
        let that = this;
        let game = that.state.game.map((item, i) => {
            return item.map((square, index) => {
                return (<button key={(index+1) * (i+1)} className='ticBtns' onClick={(e)=>that.selectSquare(square, e)}> {square} </button>);
            })
        });

        return <> 

        <section className='main_Tac_grid' >
            <section className='tac_game' > {game} </section>
        </section>
        <section className='tic_tac_stats'>
            <button onClick={this.restartHandler.bind(this)}> Restart </button>
            <select id='tic_tac_level'>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
            </select>
            <div>
                <p> PC: {this.state.pc_wins}</p>
                <p> Player: {this.state.player_wins}</p>
            </div>
        </section>
        </>;
    }
};

export default TicTacToe;