import React,{useEffect, useState} from 'react';

function LogandReg(){

    const Web3 = require('web3');
    let [ready, setReady]= useState('Metamask is not installed');
    let [Address, setAddress] = useState(null);
    var Personal = require('web3-eth-personal');
    var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');
    window.userAddress = null;
    window.nonce = window.localStorage.getItem('nonce');
    
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
                    //connectApiLogin(accounts[0])
                    handleSignMessage(accounts[0])
                }
                
            } catch{
                console.error("error")
            }
        }
    }

    async function connectApiRegister(address){
        await fetch("http://localhost:3001/login/nonce", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({address: address})
        }).then((res)=> res.json())
        .then((data)=> {
            console.log(address)
            console.log(data)
            if (data.nonce){
                window.localStorage.setItem('nonce', data.nonce);
                window.alert(data.nonce)
            }
            else{
                window.alert("Nonce not found")
            }
        })
        // fetch('http://localhost:3001/login/nonce', {
        //     method: 'POST',
        //     body: new URLSearchParams({
        //         'address': address,
        //         'password': 'Password!',
        //         'grant_type': 'password'
        //     })
        // });
    }



    async function handleSignMessage (address) {

        // await fetch("http://bcca-190-24-101-161.ngrok.io/login/login", {
        // method: "POST",
        // headers: {
        // Accept: "application/json",
        // "Content-Type": "application/json",
        // },
        // body: JSON.stringify({
        // signature: await personal.sign(
        //     "Signing nonce: " + window.nonce,
        //     address
        // ),
        // address: address,
        // }),
        // }).then((res) => res.json())
        // .then((data)=>window.alert(data.token))
        fetch('http://localhost:3001/login/login', {
        method: 'POST',
        body: new URLSearchParams({
            'address': address,
            'signature': await personal.sign(
                    "Signing nonce: " + window.nonce,
                    address
                ),
        })
    });
    } 

    function ShowInfo(){
        console.log(window.ethereum)
        if(typeof window.ethereum !== 'undefined'){
            return(
                <><div className='mt-4 mb-4'>
                    <button className='btn btn-lg btn-primary' onClick={(e) => toogleButton(e,"register")} id="button-1">get Nonce</button>
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
                    <p>to update the nonce, click on get nonce and then reload the page</p>
                    <ShowInfo/>
                </div>
            </div>     
        </div>
        
    );

}


export default LogandReg;