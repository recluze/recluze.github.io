---
layout: post
title: Creating a dApp (Smart Contract) on Ethereum
date: 2021-10-13 12:14:00.000000000 +05:00
type: post
parent_id: '0'
published: true
password: ''
status: publish
categories: 
- Tutorials
- Blockchains
- dApps 
- Smart Contracts 
- Ethereum 
tags: []
meta:
  _wpas_done_all: '1'
author:
  login: recluze
  email: recluze@gmail.com
  display_name: recluze
  first_name: Mohammad
  last_name: Nauman
permalink: "/2021/10/13/dapp-ethereum-smart-contract/"
---

I recently created a video course on creating a dApp on top of the Ethereum framework. Along with the detailed videos, I prepared step-by-step notes for the course. So, I decided to share them here for those who wish to learn from text-based material instead. 

If you want to get discount coupnos for my video courses (including this dApp course), head over to [the courses page](https://recluze.net/learn). 

Find me on twitter [@recluze](http://twitter.com/recluze) if you have any questions. I'd be happy to help out. 

<!-- more -->

## Environment Setup 

Here's the stuff we'll need 

- NVM 
- Node 
- Hardhat 
- MetaMask Wallet 

Set up NVM first for 

```bash 
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
``` 

Add the environment variables for accesing node commands. 

```bash 
nvm install --lts
```


## Install MetaMask 

MetaMask will manage our wallet so that we can easily view our accounts and test our DApps easily. Go ahead and install MetaMask from `https://metamask.io/`. I'll use Firefox but you can just as well use Chrome. 

(I strongly suggest you use MetaMask for this tutorial so that you can follow along. There's a million wallets out there and it would be difficult to debug issues if you use something other than MetaMask.)

Just go ahead and create an account on MetaMask, set your password and then save the recovery keys as given in the instructions. 


## Setting up Hardhat 

In order to test out our smart contracts, we need an environment that simulates the etherium network locally. We will later try out our smart contract on a global testnet too. 

First, set up a react app that we will use to interact with our environment. 

```bash 
npx create-react-app react-dapp
cd react-dapp 
```

Now go ahead and set up hardhat along with all its dependencies. For now, let's not go into the details of what each part does and what alternatives are available. That would only slow you down and create confusions. It's best to get a hello world done and study options afterwards. 

```bash 
npm install ethers hardhat @nomiclabs/hardhat-waffle \
            ethereum-waffle chai \
            @nomiclabs/hardhat-ethers
```

Let's create basic hardhat configs and setup. 

```bash 
npx hardhat 
```

Accept all defaults. This will create a basic sample project for us. 

We need to edit the hardhat config file so that this works well with MetaMask. ChainId is a unique identifier for the blockchain. 

```bash 
vi hardhat.config.js
```

```javascript 
module.exports = {
  solidity: "0.8.4",
  paths: {                         // add this 
    artifacts: './src/artifacts',  // this is where our compiled contracts will go
  },
  networks: {                      // and this ... 
    hardhat: {
      chainId: 1337                // this is needed for MetaMask
    }
  }
};
```

Start a node using: 

```bash 
npx hardhat node 
``` 

And try to connect to it using MetaMask. 

## Smart Contract 

Once we have the environment set up, we actually need to create a basic contract. The hello world for DApps is a greeter contract that does both reading and writing to the chain. 


```javascript 
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Greeter {
  string greeting;

  constructor(string memory _greeting) {
    console.log("Deploying a Greeter with greeting:", _greeting);
    greeting = _greeting;
  }

  function greet() public view returns (string memory) {
    return greeting;
  }

  function setGreeting(string memory _greeting) public {
    console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
    greeting = _greeting;
  }
}
```


Our contract is in solidity. This cannot be accessed directly from our Javascript frameworks. For that, we need to "compile" it to Javscript (ABI). Think of this as a wrapper that connects to the contract and can help you call functions of the contract without having to worry about the details (marshalling etc.) yourself. 

The actual command is pretty simple: 

```bash
npx hardhat compile
```

A new file will be created in: 

```bash 
src/artifacts/contracts/Greeter.sol/Greeter.json
``` 

We will import this file when writing our react script. 


## Starting a Dummy Network and Deploying the Contract 

```bash 
npx hardhat node
``` 

These are test accounts created for the purpose of testing the local network. We'll use these for a while. Make sure you don't use them on actual Mainnet or even the public testnets.

Take note of the private key and address of the first test account. 

Let's go ahead and import these to our MetaMask Wallet. 

First, connect to the localhost network. To do this, click on the `Network` dropdown (top mid) of MetaMask and select `localhost`. Rest of the configurations are fine. 

Then, `Account -> Import Account`. Then paste your private key (for first test account) in there. You should have 10,000 ETH in there. They're not too useful though so don't get excited. Let's call this `hh-test0x` account.  


Let's create a new account outside of Hardhat and send it some Ether. 

Go to Metamask and `Account -> Create Account`. Give it a useful name. I'm using `recly-test0x`. Keep this account safe for now. We'll be using it later on. Save the private key by going to `...` menu (the dots menu), then `Account Details`. Click on `Export Private Key`. Enter the password for MetaMask and save your private key somewhere. All of these are test keys and should defnitely not be used on mainnet. 

Switch to `hh-test0x` account and send some ether to `recly-test0x`. (When you do this again the next time you start this tutorial from scratch, you will get a nonce error. For that, simply go to `Accounts -> Settings -> Advanced -> Reset Account`.)

Note the output in console as well as ether changes in your MetaMask accounts.




## Deploying the Greeter Smart Contract 

A deploy script is created for you by Hardhat automatically. Just change it to a more meaningful name. 

```bash 
mv scripts/sample-script.js scripts/deploy.js
```

Take a look at the script and then go ahead and deploy the contract. Since this is a hello world, there isn't anything we need to change. 

```bash 
npx hardhat run scripts/deploy.js --network localhost
```

We will get an output that tells us the address (or ID) of this contract. 

```bash 
Greeter deployed to: 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
``` 

Keep track of this address. We'll need it to interact with our contract. 


## Accessing from React App 

Use the following basic code to access the contract. We'll discuss the code in detail but for now, just put the following content in `src/App.js` file.

```javascript 
import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'   // acts like a backend for our Web3/DApp 
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'

// Update with the contract address logged out to the CLI when it was deployed 
// !!!!!!!! Change this ..... 
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  // store greeting in local state of react. Has nothing to do with the smart contract at the moment
  const [greeting, setGreetingValue] = useState()

  // request access to the user's account. This works regardless of the wallet you're using. 
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      </header>
    </div>
  );
}

export default App;
```

Go ahead and start the npm test server on your local machine. This will let us interact with out contract through a web frontend. 

```bash
npm start
```

The app should open in your browser. 

Open Developer console and then click on the `Get Greeting` button. Take a look at the console where hardhat will output transaction/read details for you. 

Then, enter some text in the textbox and click on `Set Greeting`. You should get a popup in MetaMask asking you to select an account. Select the account you have balance in and connect. MetaMask will show you the gas required to run this transaction. Click ahead to run the transaction. 

See the console for hardhat that looks like this: 

```bash
eth_sendRawTransaction
  Contract call:       Greeter#setGreeting
  Transaction:         0xf69ac559e520e58f5e647820a3a14cbd1f18861a8bc1b71911dfbb2da8e33a78
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0x5fbdb2315678afecb367f032d93f642f64180aa3
  Value:               0 ETH
  Gas used:            35330 of 35606
  Block #2:            0x098e048300fe12ae0812dd7c067bd274bd848481f57bcbbd94153f0b3b366636

  console.log:
    Changing greeting from 'Hello, Hardhat!' to 'New Greeting!'
```

Again, if you are re-doing the tutorial, reset the account in MetaMask to get rid of the stale state information in MetaMask. 




## Let's Mint a New Token

In this section, we are going to create a new Token called `REC`. This will be a subcurrency and will showcase reads and writes to the etherium blockchain. 

First, create a new contract by pasting the following code in `contracts/Token.sol`: 

```solidity 
//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
  string public name = "Recluze Token";
  string public symbol = "REC";
  uint public totalSupply = 1000;

  mapping(address => uint) balances;

  constructor() {
    balances[msg.sender] = totalSupply;
  }

  function transfer(address to, uint amount) external {
    require(balances[msg.sender] >= amount, "Insufficient tokens");
    balances[msg.sender] -= amount;
    balances[to] += amount;
  }

  function balanceOf(address account) external view returns (uint) {
    return balances[account];
  }
}
```

Compile the contract as before. 

```bash 
npx hardhat compile 
``` 

Make the needed changes in `scripts/deploy.js` so that this contract is also deployed alongside the greeter.  

```javascript
// in function main, add the following 
const Token = await hre.ethers.getContractFactory("Token");
const token = await Token.deploy();
await token.deployed();
console.log("Token deployed to:", token.address);
```


Then let's deploy it. 

```bash 
npx hardhat run scripts/deploy.js --network localhost
``` 

Take note of the token address. We'll need it. 

Go to MetaMask and click on `Import Token` in the main window. Paste the address of the token we just created. Set `Decimal` to 0 if needed. Now you should have the REC token added with the amount properly set. 

You can transfer REC token to another account as you can ETH. Of course, you'll need ETH for gas during transaction writing. Go ahead and transfer some RECs to `recly-test0x` account. 

## Sending and Receiving Tokens using Web Frontend 

Add the following two functions to `src/App.js`. 

```javascript 
// ... 

import Token from './artifacts/contracts/Token.sol/Token.json'
// ... 

const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"   // !!! Change this
// ... 

// Within App() 

const [userAccount, setUserAccount] = useState()
const [amount, setAmount] = useState()

async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }

// ... 

async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

// ...

```

Also add the following in the React template in the same file: 

```html
  <br />
  <button onClick={getBalance}>Get Balance</button>
  <button onClick={sendCoins}>Send Coins</button>
  <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
  <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
```


Start the npm server again. 

```bash 
npm start 
```

In the server, click on `Get Balance` to get the REC balance. Copy the Account ID of `recly-test0x` and send 20 REC to that account. MetaMask will ask you to connect your account if it's been a while. You can now go ahead and send the REC. Check the balance again on both accounts to ensure RECs have been transferred. 



## Deploying on the Public/Global Ropsten Network 

Now let's do the same with the online Ropsten Testnet because we actually want to have this app distributed! It is supposed to be a DApp after all! 

### Get Some Fake Ether on the Testnet 

The very first thing you need to do is get some ETH in your account. For this you need to use a `faucet`. These are available for free and can be found by searching for `"ropsten faucet"`. At the moment, the following faucets work:  

* https://faucet.ropsten.be/
* https://faucet.metamask.io/
* https://faucet.dimensions.network/

Request ETH on all the faucets. You'll need it for testing and it sometimes takes time to receive it. Make sure you give it an address that you created yourself. Hardhat accounts are publicly known and people will steal your (fake) ether from the testnet and you won't be able to test out your contracts. 

### Get Endpoints 

Next, let's create a project in Infura. This will give us an endpoint through which we can actually push our contract. Think of this as the equivalent of the `node` that we created locally. For the internet, you need some node to act on your behalf. We'll use infura but you can also use Alchemy. 

Go to `infura.io` and create a new Etherium project. You need the `Project ID`. Also select Ropsten from the Endpoints dropdown and get the endpoint URL. Save both of these somewhere. 

Also in the security tab, enter your public key (not the private key!) for the account `recly-test0x` account. This is because we have some test ETH in this account and we'll need that to deploy our contracts. 

Stop the hardhat node and let's configure it to use the Ropsten Testnet. 

Edit the `hardhat.config.js` file and add the configs for Ropsten. 

```javascript 
networks: {                   // and this ...
  hardhat: {
    chainId: 1337,
  },
  ropsten: {
    url: "https://ropsten.infura.io/v3/e5143812e60d4048a480d4fde5??????",  // Ropsten endpoint 
    accounts: [
      "0x261e20914b939aec2aa0529c115c8970dfa949e021bb6b0f3bef40faad??????" // private key with ETH
    ]
  }
}
```

```bash 
npx hardhat run scripts/deploy.js --network ropsten 
```

This will use up your ETH, which you can verify through MetaMask. Go to dots menu for `recly-test0x` account and click on `View on Etherscan`. 

You can now go ahead and import the REC token which is now on the Ropsten Testnet but is an actual DApp! 

Congrats! 

## Deploying on Mainnet 

Deploying on mainnet is exactly the same as with Ropsten. You can get an endpoint for mainnet from Infura. The difference is only that you will need real ETH to deploy your DApp on mainnet and it would take gas to write transactions to the block. 

So, test well on the testnets and only move to mainnet when you are sure everything is fine. 

Good luck! 
