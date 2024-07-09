import useRequest from "@/hooks/useRequest";
import Router from "next/router";
const TicketShow=({ticket})=>{

    const {doRequest, errors} = useRequest({
        url:'/api/orders/',
        method:'post',
        body:{ticketId:ticket.id},
        onSuccess:(order)=>Router.push('/orders/[orderId]',`/orders/${order.id}`)
        // onSuccess:(order)=>console.log(order.id)
    });

    const createOrder=async()=>{
       await doRequest();
    }

    return <div>
    <div className="border border-dark rounded-2 w-25 p-2 m-2">
        <h1>{ticket.title}</h1>
        <p>{`Price: ${ticket.price}`}</p>
        <button type="button" className="btn btn-primary" onClick={()=>createOrder()}>Order</button>
    </div>
    {errors}
    </div>
}

TicketShow.getInitialProps=async(context,client)=>{
    const {ticketId} = context.query;
    const {data} = await client.get(`/api/tickets/${ticketId}`);
    return {ticket:data}
}
export default TicketShow;