import React from 'react';
import ReactDOM from 'react-dom';

let gameOver = (board) => {
    if(hasWon(board, 'X') || hasWon(board,'O') || availableMoves(board).length===0){
        return true;
    }
}

// @ params: board to check available columns
// returns list of available columns
let availableMoves = (board) => {
    let available_moves = [];
    for(let i=0; i<board[0].length; i++){
        // check if column is available
        if(validMove(board, i)){
            // add column to the available moves list
            available_moves.push(i)
        }
    }
    return available_moves;
}

let evaluateBoard = (board) => {
    if(hasWon(board,'X'))
        return 1000;
    else if(hasWon(board, 'O'))
        return -1000;

    let xStreak = 0;
    let oStreak = 0;

    // check streak horizontal
    for (let col = 0; col < board[0].length; col++){
        for(let row = 0; row < board.length; row++){
            if (board[row][col] === 'X' && board[row][col+1] === 'X'){
                xStreak +=1;
            }
            else if(board[row][col] === 'O' && board[row][col+1] === 'O'){
                oStreak +=1;
            }
        }
    }



    return xStreak - oStreak;
}// evaluate

function minimax(board, player, depth, alpha, beta){
    if(gameOver(board) || depth === 0){
        return [evaluateBoard(board), ''];
    }

    // get list of available moves
    let openMoves = availableMoves(board);
    // set player symbol
    let symbol = player ? 'X':'O';

    // player is x
    if(player){
        let bestVal = -1000;
        // set best move to a random column
        let bestMove = openMoves[Math.floor(Math.random() * openMoves.length)];
        
        for(let i=0; i<openMoves.length; i++){
            let newBoard = JSON.parse(JSON.stringify(board));
            selectMinMax(newBoard, openMoves[i], symbol);
            let hypoVal = minimax(newBoard, false, depth-1, alpha, beta);

            if(hypoVal[0] > bestVal){
                bestVal = hypoVal[0];
                bestMove = openMoves[i];
            }

            // set alpha to largest of alpha and bestval
            alpha = alpha > bestVal ? alpha : bestVal;

            if(alpha >= beta)
                break;

        }

        return [bestVal, bestMove];
    }
    // player is o
    else{
        let bestVal = 1000;
        // set best move to a random column
        let bestMove = openMoves[Math.floor(Math.random() * openMoves.length)];
        for(let i=0; i<openMoves.length; i++){
            let newBoard = JSON.parse(JSON.stringify(board));
            selectMinMax(newBoard, openMoves[i], symbol);
            let hypoVal = minimax(newBoard, true, depth-1, alpha, beta);

            // check if hypothetical value is smaller than best value: want small for o player
            if(hypoVal[0] < bestVal){
                bestVal = hypoVal[0];
                bestMove = openMoves[i];
            }

            // set beta to min of beta and bestVal
            beta = beta < bestVal ? beta : bestVal;
            if(alpha >= beta)
                break;
        }

        return [bestVal, bestMove];
    }
}// minimax
 
function hasWon(board, player){
    // check horizontally, // i iterates rows
    for(let i=0; i<board.length; i++){
        // j iterates columns: only need to check 4 spaces
        for(let j=0; j<4; j++){
            if(board[i][j] === player && board[i][j+1]===player && board[i][j+2]===player && board[i][j+3]===player)
            {
                return true;
            }
        }

    }

    // check down, // i iterates rows
    for(let i=0; board.length-i >= 4; i++){
        // j iterates columns
        for(let j=0; j<board[0].length; j++){
            if(board[i][j]===player && board[i+1][j]===player && board[i+2][j]===player && board[i+3][j]===player)
            {
                return true;
            }
        }

    }

    // check diagonal: top right -> bottom left: i=row j=col
    for(let i=0; board.length-i >= 4; i++){
        for(let j=board[0].length-1; j >= 3; j--){
            if(board[i][j]===player && board[i+1][j-1]===player && board[i+2][j-2]===player && board[i+3][j-3]===player)
            {
                return true;
            }
        }
    }

    // check diagonal: top left -> bottom right: i=row j=col
    for (let i=0; i<2; i++){
        for(let j=0; j<4; j++){
            if(board[i][j]===player && board[i+1][j+1]===player && board[i+2][j+2]===player && board[i+3][j+3]===player)
            {
                return true;
            }
        }
    }

    return false
}// hasWon

 
// @ params: board & column number
// returns true or false
let validMove = (board, col) => {
  
   // check if top row of column is available
   if(board[0][col] !== 'X' && board[0][col] !== 'O')
       return true;
   else return false;
}
 
 
// @ params: board of player
// @ params: column selected to play
// @ params: current player: alternates between ( X & O)
function selectMinMax(board, col, player){
       // loop through all rows : only checks column selected
       for(let i = board.length - 1; i >= 0; i -= 1){
           if(board[i][col] !== 'X' && board[i][col] !== 'O'){
               board[i][col] = player;
                if(arguments.length > 3)
                    return i;
                else
                    return true;
           }
       }

       return false;
}
 
 
class FourSquare extends React.Component {
   constructor(props){
       super(props);
 
       this.state = {
           gameboard:[['0','1', '2','3','4','5','6'],['0','1','2','3','4','5','6'],
           ['0','1','2','3','4','5','6'],['0','1','2','3','4','5','6'],
           ['0','1','2','3','4','5','6']], symbol:'X', player_wins:0, pc_wins:0
       }
 
       this.selectMove = this.selectMove.bind(this);
   }
 
 
   // event handler for user column choice in game
   // @ params col defines column to implement chip
   // fctn will initiate a minimax to produce best choice for computer
   // assumes player value to X and pc to O
   selectMove(column){
        // set level 
        let depth = document.getElementById('connect_4level').value;
        if(depth === 'Medium')
            depth = 5;
        else if(depth === 'Hard')
            depth = 8;
        else depth = 3;
       
       // used to set color according to player
       let game_squares = document.getElementsByClassName('row-item');
        console.log(game_squares.length);
       // loop through all rows : only checks column selected
       for(let i = this.state.gameboard.length - 1; i >= 0; i -= 1){
           if(this.state.gameboard[i][column] !== 'X' && this.state.gameboard[i][column] !== 'O'){

               let new_board = JSON.parse(JSON.stringify(this.state.gameboard));
               new_board[i][column] = this.state.symbol;

                // add x square color
                game_squares[(i*7) + parseInt(column)].classList.add('xSquare');

               // check if there is winner in new board
               if(hasWon(new_board, this.state.symbol)){
                   alert(' Winner: ', this.state.symbol);
                   this.setState((state)=>{
                       return {player_wins: state.player_wins+1}
                   })
                   return;
               }
               else{

                    // retrieve pc move from minimax decision
                    // starting parameters are updated board from player x, false: O, depth, alpha, beta
                    let pc_move = minimax(JSON.parse(JSON.stringify(new_board)), false, depth, -1000, 1000);
                    console.log('************ pc move', pc_move);
                    let o_row = selectMinMax(new_board, pc_move[1], 'O', 1);
                    // add x square color
                    game_squares[(o_row*7) + pc_move[1]].classList.add('oSquare');

                    this.setState(() => {
                        return {gameboard : new_board}
                    });

                    if(hasWon(new_board, 'O')){
                        alert(' Winner: O');
                        this.setState((state)=>{
                            return {pc_wins: state.pc_wins+1}
                        })
                    }
               }
               return true;
           }
       }

       return false;
   }
 
   // handler for setting move
   setMove(){
      
       this.setState(()=>{
          return {move: document.getElementById('col').value}
       }, ()=>{
           console.log('changing move state ', this.state.move);
 
       });
 
       console.log('done');
   }
 
   resetHandler(){
       let new_gameboard = [['0','1', '2','3','4','5','6'],['0','1','2','3','4','5','6'],
       ['0','1','2','3','4','5','6'],['0','1','2','3','4','5','6'],
       ['0','1','2','3','4','5','6']];

       let reset_squares = document.getElementsByClassName('row-item');
       for(let i=0; i<reset_squares.length; i++){
           reset_squares[i].classList.remove('oSquare');
           reset_squares[i].classList.remove('xSquare');
       }

       this.setState(()=>{
           return {gameboard: new_gameboard}
       })
   }

   render(){
       let that = this;
       let game = that.state.gameboard.map((item, index) => {
           return <section className='game-row' key={index}> {item.map((sub_item, sub_index) => {
               return <div className='row-item' key={sub_index}> {sub_item} </div>
           })}
           </section>
       });
 
       // button event handler fctn: selectMove(col)
       let chooseCol = this.state.gameboard[0].map((item,index)=>{
           return <button id='chooseBtn' key={index} onClick={(e)=>this.selectMove(index, e)}>
               Col: {index} </button>
       })

 
       return <section className='connect4_grid'>
            <section className='four-sqrBoard'> 
                {game} <br />
                <div className='game-row'>{chooseCol}</div>
            </section>
            
            <section className='connect_4_stats'>
                <div>
                <button onClick={this.resetHandler.bind(this)}> Reset </button>
                </div>
                <div>
                <select id='connect_4level'>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
                </div>
                <div>
                    <p> Pc Wins: {this.state.pc_wins} </p>
                    <p> Player Wins: {this.state.player_wins} </p>
                </div>
            </section>
        </section>;
   }
};
 
export default FourSquare;
