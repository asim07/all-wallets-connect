import './App.css'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'
import Web3 from 'web3'
import contractData from'./constants/contract';
import selective from './constants/selective';
import sequential from './constants/sequential';


const CoinbaseWallet = new WalletLinkConnector({
  url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  appName: 'Web3-react Demo',
  supportedChainIds: [1, 3, 4, 5, 42]
})


const WalletConnect = new WalletConnectConnector({
  rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})


const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
})
function App () {

const [CollectionName, setCollectionName] = useState('');
const [symbol, setSymbol] = useState('');
const [MintingCounter, setMinitngCounter] = useState('');
const [MintingPrice, setMintingPrice] = useState('');
const [MetadataURI, setMetadataURI] = useState('');
const [address,setAddress] = useState('');
const [mintingAddress,setMintingAddress] = useState('');
const [nftId,setNftid] = useState('');

 
  
  const deploySequential = async ()=>{
    
    const provider = await  Injected.activate();
    const web3 = new Web3(provider.provider);
    const contract = new web3.eth.Contract(contractData.abi,contractData.contractAddress)
    const address = await web3.eth.getAccounts();
  
    const tx = {
      to : contractData.contractAddress,
      from : address[0],
    }
    let gasfee = await contract.methods.deploySequential(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).estimateGas(tx);
  console.log(gasfee);
    tx.gas = web3.utils.toHex(gasfee)
  
    const transaction = await  contract.methods.deploySequential(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).send(tx);
    const newContractAddress = transaction.events[0].address; 
    if(typeof newContractAddress !== undefined){
      setAddress(newContractAddress);
    }else {
      setAddress("transaction failed");

    }  }


    const deploySelective = async ()=>{
    console.log("first Working")
      const provider = await  Injected.activate();
      // console.log(provider.provider);
      const web3 = new Web3(provider.provider);
      const contract = new web3.eth.Contract(contractData.abi,contractData.contractAddress)
      const address = await web3.eth.getAccounts();
    
      const tx = {
        to : contractData.contractAddress,
        from : address[0],
      }
      let gasfee = await contract.methods.deploySelective(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).estimateGas(tx);
    console.log(gasfee);
      tx.gas = web3.utils.toHex(gasfee)
    
      const transaction = await  contract.methods.deploySelective(CollectionName,symbol,MetadataURI,MintingCounter,MintingPrice).send(tx);
      const newContractAddress = transaction.events[0].address; 
      if(typeof newContractAddress !== undefined){
        setAddress(newContractAddress);
      }else {
        setAddress("transaction failed");
  
      }  }


  const mintSequentialNFt = async ()=>{
    const provider = await  Injected.activate();
    // console.log(provider.provider);
    const web3 = new Web3(provider.provider);
    const contract = new web3.eth.Contract(sequential.abi,mintingAddress)
    const address = await web3.eth.getAccounts();
    let price = await contract.methods.mintPrice.call().call();
    // price = web3.utils.fromWei(`${price}`,'ether');
    console.log("working : ",price);
    const tx = {
      to : mintingAddress,
      from : address[0],
      value : price
    }
    let gasfee = await contract.methods.safeMint(address[0]).estimateGas(tx);
    tx.gas = web3.utils.toHex(gasfee);
    const mint = await contract.methods.safeMint(address[0]).send(tx);
    const data = mint.events.Transfer.returnValues.tokenId;
    console.log(mint)
    console.log("Minted Id is ",data);
    setNftid(`Minted Token : ${data}`);



  }
  const SelectiveMint = async ()=>{
    const provider = await  Injected.activate();
    // console.log(provider.provider);
    const web3 = new Web3(provider.provider);
    const contract = new web3.eth.Contract(selective.abi,mintingAddress)
    const address = await web3.eth.getAccounts();
    let price = await contract.methods.mintPrice.call().call();
    // price = web3.utils.fromWei(`${price}`,'ether');
    console.log("working : ",price);
    const tx = {
      to : mintingAddress,
      from : address[0],
      value : price
    }
    let gasfee = await contract.methods.safeMint(address[0],nftId).estimateGas(tx);
    tx.gas = web3.utils.toHex(gasfee);
    const mint = await contract.methods.safeMint(address[0],nftId).send(tx);
    const data = mint.events.Transfer.returnValues.tokenId;
    console.log(mint)
    console.log("Minted Id is ",data);
    setNftid(`Minted Token : ${data}`);



  }
  const { active, chainId, account} = useWeb3React()


  console.log("active : ", active,"chainID : ",chainId,"Account : ",account);

  const { activate, deactivate } = useWeb3React()


  

  return (

    
    <div className='App'>

      <button
        onClick={() => {
          activate(CoinbaseWallet)
        }}
      >
        Coinbase Wallet
      </button>
      <button
        onClick={() => {
          activate(WalletConnect)
        }}
      >
        Wallet Connect
      </button>
      <button
        onClick={() => {
          activate(Injected)
        }}
      >
        Metamask
      </button>
      <button onClick={deactivate}>Disconnect</button>
      <div>{`Connection Status: ${active}`}</div>
      <div>{`Account: ${account}`}</div>
      <div>{`Network ID: ${chainId}`}</div>
<div><div style={{"display": "flex"
    }} ><form>
    <label>
      Collection Name
      <input type="text"  name="name" onChange={event => setCollectionName(event.target.value)} />
    </label><br></br>
    <label>
      Collection symbol 
      <input type="text" name="symbol" onChange={event => setSymbol(event.target.value)} />
    </label><br></br>
    <label>
      Minting count
      <input type="text" name="mintingCount" onChange={event => setMinitngCounter(event.target.value)}/>
    </label><br></br>
    <label>
      Minting Price 
      <input type="text" name="price" onChange={event => setMintingPrice(event.target.value)}/>
    </label><br></br>
    <label>
      Metadata URI 
      <input type="text" name="metadata" onChange={event => setMetadataURI(event.target.value)}/>
    </label><br></br>
  </form>
  </div>
  <div style={{"display": "flex","padding":"10px","paddingLeft":"116px"}}><form></form>
  <button onClick={deploySequential}>deploy Contract Sequential</button>
  <button onClick={deploySequential}>deploy Contract random</button>
  <button onClick={deploySelective}>deploy Contract Selective</button>
  </div>

  </div>    
  <div>
    <h4>Deployed Contract Address :</h4> <h2>{address}</h2>
  </div>
  <div style={{"display": "flex","marginTop":"100px"}}>
    <form>
    <label>
      Contract Address 
      <input type="text" name="name" onChange={event => setMintingAddress(event.target.value)} />
    </label>
    </form>
    <button onClick={mintSequentialNFt}>Mint</button>
</div >
<div style={{"display": "flex","marginTop":"100px"}}>
    <form>
    <label>
      Contract Address 
      <input type="text" name="name" onChange={event => setMintingAddress(event.target.value)} />
    </label>
    <label>
      NFT iD
      <input type="text" name="symbol" onChange={event => setNftid(event.target.value)} />
    </label><br></br>
    </form><br></br>
    <button onClick={SelectiveMint}>Mint</button>
    </div>
    <div>
      <h1>{nftId}</h1>
    </div>
    <div style={{"display": "flex","marginTop":"100px"}}>
    <a href={`https://testnets.opensea.io/assets/${mintingAddress}/${nftId}`}>view {nftId} of contract {mintingAddress}</a>

    </div>
  </div>
  )
}

export default App
