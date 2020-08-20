import React from 'react';
import ReactDOM from 'react-dom';
import Pic from './montyImg/logo.jpg';
import Pic2 from './montyImg/img.jpg';
const LosePic = <img className='door_img' src={Pic}></img>
const WinPic = <img className='door_img' src={Pic2}></img>

var door = Math.floor(Math.random()*3) + 1;
console.log('winning door ', door);

class Monty extends React.Component {
    constructor(props){
        super(props);
        this.state = {doorImg:[null,null,null], wins:0, plays:0, 
            switch_wins:0, switch_plays:0, win_stats:0, switch_stats:0};
        this.doorHandler = this.doorHandler.bind(this);

    }

    doorHandler(doorNum){
        var addSwitch = 0;
        var add_switch_Win = 0;
        var noSwitch = 1;
        var no_switch_Win = 0;
        var given_wrong_door = 0;
        while(true){
            given_wrong_door = Math.floor(Math.random() * 3) + 1;
            if(given_wrong_door !== doorNum && given_wrong_door !== door)
                break;
        }

        if(confirm(`Tell you what, it's not door ${given_wrong_door} \n Want to switch? If not, press cancel`)){
            var new_door = prompt('Enter the door number: 1, 2, or 3 \n keep same door by entering same door');
            // new door entered
            if(new_door && new_door != doorNum){
                doorNum = new_door;
                addSwitch = 1;
                noSwitch = 0;
            }
        }
        console.log('door clicked ', doorNum, ' ', doors);
        let doors = document.getElementById('img'+doorNum);

        if(doorNum == door){
            console.log('Win');
            if(addSwitch) 
                add_switch_Win = 1;
            else
                no_switch_Win = 1;

            doors.src = Pic;
        }
        else{
            doors.src=Pic2;
        }

        this.setState((state)=>{
            return{
                switch_plays: addSwitch ? state.switch_plays+1 : state.switch_plays,
                switch_wins: add_switch_Win ? state.switch_wins+1 : state.switch_wins,
                switch_stats: (state.switch_wins + add_switch_Win) / (state.switch_plays===0 ? 1:state.switch_plays+addSwitch),
                plays: noSwitch ? state.plays + 1 : state.plays,
                wins: no_switch_Win ? state.wins+1 : state.wins,
                win_stats: (state.wins + no_switch_Win) / (state.plays===0 ? 1:state.plays+noSwitch)
            }
        })

    }

    restartHandler(){
        // generate new winning door
        door = Math.floor(Math.random() * 3) + 1;
        console.log('new win ', door);

        // reset doors to blanks
        let doors = document.getElementsByClassName('door_img');
        for(let i=0; i<doors.length; i++){
            doors[i].src = '';
        }
    }

    render(){

        return <>
            <section className='monty_grid'>
                <button className='monty_door' onClick={(e) => this.doorHandler(1)}>
                    <img id='img1' className='door_img' src=''></img>
                </button>
                <button className='monty_door' onClick={(e) => this.doorHandler(2)}>
                    <img id='img2' className='door_img' src=''></img>
                </button>
                <button className='monty_door' onClick={(e) => this.doorHandler(3)}>
                    <img id='img3' className='door_img' src='' ></img>
                </button>

            </section>
            <section className='monty_stats'>
                <button onClick={this.restartHandler.bind(this)}>Restart</button>
                <section>
                    <div>
                        <p> Wins: {this.state.wins} </p>
                        <p> Total Plays: {this.state.plays} </p>
                        <p> Win Stats: {this.state.win_stats * 100} %</p>
                    </div>
                    <div>
                        <p> Switch Wins: {this.state.switch_wins} </p>
                        <p> Total Switches: {this.state.switch_plays} </p>
                        <p> Switch Win Stats: {this.state.switch_stats * 100} %</p>
                    </div>
                </section>
            </section>
        </>
    }
};

export default Monty;