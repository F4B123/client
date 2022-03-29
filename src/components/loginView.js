import React from "react";
import Register from "./register";
import Login from "./login";
import LogandReg from "./logandreg";
import Logo from '../images/download.png';
import '../styles/loginview.css'


//TODO: make it cute
function LoginView(){

    //just to see if it s working
    const [data, setData] = React.useState(null);


    React.useEffect(()=> {
        fetch("/api")
        .then((res)=>res.json())
        .then((data)=>setData(data.message))
    })
    //----------------------

    return(
        <>
        
        <div className=" bg">
            <div className="d-flex align-items-center justify-content-center">
            <div className="mt-4 col-sm-4">
                <div className="text-center">   
                    <form className="form-container">
                        <img className="mt-4 mb-4" src={Logo} height=""/>
                        <h1 className="h2">Sign in</h1>
                        <p>{!data? "loading..": data}</p>    
                        <Register/>
                        <Login/>
                    </form>
                </div>
            </div>
            </div>
        </div>
        
        </>
    );
}


export default LoginView;