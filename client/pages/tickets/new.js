import { useState } from "react";
import useRequest from "@/hooks/useRequest";
import Router from "next/router";
const NewTicket = ()=>{
    const [title,setTitle] = useState("");
    const [price,setPrice] = useState("");
    const [err,setErr] = useState(null);

    const {doRequest, errors} = useRequest({
        url:'/api/tickets/',
        method:'post',
        body:{title,price},
        onSuccess:()=>Router.push('/')
        // onSuccess:(ticket)=>console.log(ticket)
    });

    console.log(title,price);

    const handleSubmit = async(event)=>{
        event.preventDefault();
        const ticket = await doRequest();
        console.log(ticket);
        setTitle("");
        setPrice("");
    }

    return(<div>
    <form className="w-50 p-5">
        <h1>Create new account</h1>
        <div className="form-group mb-2">
            <input type='text' placeholder="title" className="form-control" value={title}
            onChange={(e)=>setTitle(e.target.value)}></input>
        </div>
       
        <div className="form-group mb-2">
            <input type='text' placeholder="price" className='form-control' value={price}
            onChange={(e)=>setPrice(e.target.value)}></input>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>Create new ticket</button>
    </form>
    {errors};
</div>)
}


export default NewTicket;