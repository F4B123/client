import React,{useEffect, useState} from 'react';
function LogandReg(){
    const Web3 = require('web3');
    let [ready, setReady]= useState('Metamask is not installed');
    let [Address, setAddress] = useState(null);
    var Personal = require('web3-eth-personal');
    var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');

    window.userAddress = null;
    
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setReady('Login')
        }
    })

    useEffect(() => {
        ShowInfo()
    },[Address])

    //Initialize web3 connected to ETH
    const start = async() =>{
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            try{
                await window.ethereum.enable();
            } catch{
                console.error("error");
            }
        }
        
        //load in Localstorage
        window.userAddress = window.localStorage.getItem('userAddress');
    }

    function toogleButton(cas){
        if (ready === 'Login'){
            loginWithEth(cas);
        }
    }

    async function loginWithEth(cas){
        if(window.web3){
            try{
                const accounts = await window.web3.eth.getAccounts();
                window.localStorage.setItem('userAddress', accounts[0]);
                setAddress(accounts[0]);
                if(cas=="Login"){
                    connectApiLogin(accounts[0])
                }
                else{
                    connectApiRegister(accounts[0])
                }
            } catch{
                console.error("error")
            }
        }   
    }

    async function connectApiRegister(address){
        await fetch("/register", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        })
    }

    async function connectApiLogin(address){
        await fetch("/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        })
        .then(handleSignMessage(address))
    }

    async function handleSignMessage (address) {
        return new Promise((resolve, reject) =>
            personal.sign("I am loging in:",
            address,
            (err, signature) => {
              if (err) return reject(err);
              //send data to API to verify
              resolve(  
                 fetch(`/login`, 
                 {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address:address,
                        signature:signature})
                })
                );
            }
          )
        );

    } 
        
    function ShowInfo(){
        if(typeof window.ethereum !== 'undefined'){
            return(
                <>
                    <button onClick={toogleButton("Register")} id="button-1">Register</button>
                    <button onClick={toogleButton("Login")} id="button-1">Login</button>
                </>
            )  
        }
        else{
            return(
                <button onClick={toogleButton} id="button-1" disabled>{ready}</button>
            )
        }      
    }

    return(
        <div className='container-component'>
            <div className='login-card'>
                <div className='sign-in-container'>
                    <ShowInfo/>
                </div>
            </div>     
        </div>
        
    ); 
}

export default LogandReg;