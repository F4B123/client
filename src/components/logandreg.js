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
            setReady('Register')
          }
    })

    useEffect(() => {
        ShowInfo()
    },[Address])

    //Initialize web3 connected to ETH
    const start = async() =>{
        console.log(window.ethereum)
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

    function toogleButton(e,functionality){
        e.preventDefault()
        if (ready === 'Register'){
            start()
            loginWithEth(functionality);
        }
    }

    async function loginWithEth(f){
        if(window.web3){
            try{
                const accounts = await window.web3.eth.getAccounts();
                window.localStorage.setItem('userAddress', accounts[0]);
                setAddress(accounts[0]);
                if(f == "register"){
                    connectApiRegister(accounts[0])
                }
                else if (f == "login"){
                    connectApiLogin(accounts[0])
                }
                
            } catch{
                console.error("error")
            }
        }
    }

    async function connectApiRegister(address){
        await fetch("http://localhost:3001/register", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        }).then((res)=> res.json())
        .then((data)=> {
            if (data.msg){
                window.alert(data.msg)
            }
        })
    }


    async function connectApiLogin(address){
        await fetch("http://localhost:3001/login", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        })
        .then((res)=> res.json())
        .then((data) => {
            //getnonce(address)
            handleNonce(address)
            //handleSignMessage(address)
        })

    }

    async function handleNonce(address){
        console.log("ARRIVED")
        await fetch("http://localhost:3001/nonce", {
            method:'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({address: address})

        }).then((res)=> res.json())
        .then((data)=>{
            console.log(data.nonce)
            handleSignMessage(address,data.nonce)
        })
    }

    async function handleSignMessage (address,nonce) {
        return new Promise((resolve, reject) =>
            personal.sign(`I am loging with nonce:${nonce}`,
            address,
            nonce,
            (err, signature) => {
              if (err) return reject(err);
              resolve(  
                 fetch(`http://localhost:3001/login`, 
                 {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        address:address,
                        nonce:nonce,
                        signature:signature})
                }).then((res)=> res.json())
                .then((data)=> window.alert(data.loged))        //function that shows that i'm loged
                );
            }
          )
        );

    } 


    function Loged(){
        return(
            <>
                <p>You have logIn</p>
            </>
        )
    }
    function ShowInfo(){
        console.log(window.ethereum)
        if(typeof window.ethereum !== 'undefined'){
            return(
                <><div className='mt-4 mb-4'>
                    <button className='btn btn-lg btn-primary' onClick={(e) => toogleButton(e,"register")} id="button-1">Register</button>
                </div>
                <div className='mt-4 mb-4'>
                    <button className='btn btn-lg btn-primary' onClick={(e) => toogleButton(e,"login")} id="button-1">Login</button>
                </div>    
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
                    <p>Login or Register</p>
                    <ShowInfo/>
                </div>
            </div>     
        </div>
        
    );

}


export default LogandReg;