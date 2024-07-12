import axios from "axios";

export default ({req})=>{
    if(typeof window === 'undefined'){
        // On the server
        return axios.create({
            baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            // baseURL:'http://tuananhpham.site/',
            headers:req.headers
        });
    }else{
        return axios.create({
            baseURL:'/'
        })
        // On the browser
    }
}