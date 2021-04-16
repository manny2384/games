import React from 'react';
import ReactDOM from 'react-dom';
import Monty from './monty.js';
import FourSquare from './four-square.js';
import TicTacToe from './tic-tac-toe.js';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            games:['TicTacToe', 'Connect 4', 'Monty Hall'],
            show: <TicTacToe />
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(target) {
        console.log('clicked button ', target);
        let Temp;
        switch(target){
            case "TicTacToe":
                Temp = <TicTacToe />
                break;
            case "Connect 4":
                Temp = <FourSquare />
                break;
            case "Monty Hall":
                Temp = <Monty />
                break;
            default:
                Temp = <TicTacToe />;
                break;
        }

        this.setState(() => {
           return {show: Temp}
        });
    }

    render(){
        
        let that = this;
        let NavBar = this.state.games.map((item, index) => {
            return <li key={item} >
                <button onClick={(e) => this.handleClick(item, e)}>
                    {item}
                </button>
            </li>
        })

        
        return (<> 
        <section className='navbar'> <ul> {NavBar} </ul> </section> 
        <section> {this.state.show} </section> 
        </>);
    }
}

export default App;