import { useState } from "react";
import axios from 'axios';
import useRequest from "@/hooks/useRequest";
import Router from "next/router";
const SignIn = ()=>{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [err,setErr] = useState(null);
    const {doRequest, errors} = useRequest({url:'/api/users/signin',
    method:'post',
    body:{email,password},
    onSuccess:()=>Router.push('/')
});

    console.log(email,password);

    const handleSubmit = async(event)=>{
        event.preventDefault();
        doRequest();
        setPassword("");
        setEmail("");
    }

    return(<div>
    <form className="w-50 p-5">
        <h1>Create new account</h1>
        <div className="form-group mb-2">
            <input type='text' placeholder="email" className="form-control" value={email}
            onChange={(e)=>setEmail(e.target.value)}></input>
        </div>
       
        <div className="form-group mb-2">
            <input type='password' placeholder="password" className='form-control' value={password}
            onChange={(e)=>setPassword(e.target.value)}></input>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>Sign Up</button>
    </form>
    {errors};
</div>)
}


export default SignIn;