import React,{useEffect, useState} from 'react';
import '../styles/loginview.css';

function Login(){

    const Web3 = require('web3');
    let [ready, setReady]= useState('Metamask is not installed');
    let [Address, setAddress] = useState(null);
    let [token, setToken] = useState(null)
    var Personal = require('web3-eth-personal');
    var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');

    window.userAddress = null;
    
    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            setReady('Login')
          }
        console.log(token)
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

    function toogleButton(){
        if (ready === 'Login'){
            start()
            loginWithEth();
        }
    }

    async function loginWithEth(){
        if(window.web3){
            try{
                const accounts = await window.web3.eth.getAccounts();
                window.localStorage.setItem('userAddress', accounts[0]);
                setAddress(accounts[0]);
                connectApi(accounts[0])
            } catch{
                console.error("error")
            }
        }   
    }

    async function connectApi(address){
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
                }).then((res)=> setToken(res.token))
                );
            }
          )
        );

    } 
        
    function ShowInfo(){
        if(typeof window.ethereum !== 'undefined'){
            return(
                <>
                    <button className='btn btn-lg btn-primary mb-4' onClick={toogleButton} id="button-1">{ready}</button>
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

export default Login;