import axios from "axios";
import { useState } from "react"

export default ({url,method,body,onSuccess})=>{
    const [errors, setErrors] = useState(null);

    const doRequest=async(props={})=>{
    try{
        console.log({...body,...props});
        const res = await axios[method](url,{...body,...props});
        setErrors(null);
        if (onSuccess){
            onSuccess(res.data);
        }
        return res.data;
    }catch(err){
        console.log(err);
        setErrors(<div className="alert alert-danger">
        <h2>Ops...</h2>
        <ul>
            {err.response.data.errors.map((err)=><li>{err.message}</li>)}
        </ul>
        </div>);
    }};

    return {doRequest, errors};
}