import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    lastWinner: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.getLastWinner().call();

    this.setState({ manager, players, balance, lastWinner });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    this.setState({ message: 'Waiting on transaction success...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'You have been entered!' });
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'Waiting on transaction success...' });
    console.log(accounts);

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: 'A winner has been picked !' });
  }

  render() {
    const renderPeopleEntered = this.state.players.map((player, index) =>
          <li key={index}>
            {player}
          </li>
        );

    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Lottery Contract</h2>
        <p>
          Contract managed by : {this.state.manager} <br />
          People entered : {this.state.players.length} <br />
        </p>
          <ul>{renderPeopleEntered}</ul>
        <p>
          <br />
          Balance ether to win : {web3.utils.fromWei(this.state.balance, 'ether')}
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try ?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
            <button>Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner ?!</h4>
        <button onClick={this.onClick}>Pick a winner !</button>

        <hr />

        <h1>{this.state.message}</h1>

        <h3>The last winner of this contract is : {this.state.lastWinner}</h3>
      </div>
    );
  }
}

export default App;
