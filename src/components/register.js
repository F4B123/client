import React,{useEffect, useState} from 'react';

//TODO: not use windowslocal storage
//TODO: connect with the API

function Register(){

    const Web3 = require('web3');
    let [ready, setReady]= useState('Metamask is not installed');
    let [Address, setAddress] = useState(null);

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
        if (ready === 'Register'){
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
        await fetch("/register", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        })
    }

    function ShowInfo(){
        if(typeof window.ethereum !== 'undefined'){
            return(
                <><div className='mt-4 mb-4'>
                        <button className='btn btn-lg btn-primary' onClick={toogleButton} id="button-1">{ready}</button>
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

export default Register;