import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "@/hooks/useRequest";
import Router from "next/router";

const ShowOrder = ({order, currentUser})=>{

    const [timeLeft, setTimeLeft] = useState(0);
    const [paymentId, setPaymentId] = useState('');

    const {doRequest, errors} = useRequest({
        url:'/api/payments',
        method:'post',
        body:{orderId:order.id},
        // onSuccess:(order)=>Router.push('/orders/[orderId]',`/orders/${order.id}`)
        onSuccess:(payment)=>{setPaymentId(payment.id);setTimeLeft(0)}
    });

    useEffect(()=>{
        const computeTimeLeft = ()=>{
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft/1000));
        }

        const timerId = setInterval(computeTimeLeft,1000);

        return ()=>{
            clearInterval(timerId);
        }
    },[order.id]);

    return <div>
    <div className="border border-dark rounded-2 w-25 p-2 m-2">
        <h1>{`Purchasing ${order.ticket.title}`}</h1>
        <h2>{`Order Status: ${order.status}`}</h2>

        {timeLeft>0?
        <>
        <p>You have {timeLeft} seconds left to make the payment</p>
        <StripeCheckout
            token={async(token)=>await doRequest({token:token.id})}
            stripeKey="pk_test_51MnIMcEDnPfxhLq1SmrlbGopqEuoc4fJQRNef0fukrRCJGuty19ORXMOL5R302gtu3NNTcsGMeCMTw71xP4qBZ6X00aSv1IwIf"
            amount={order.ticket.price*100}
            email={currentUser.email}
        /></>
        :<div>Order Expired</div>
        }
        {paymentId&&<div>Payment Completed With ID{paymentId}</div>}
        {errors}
    </div>
    </div>
}

ShowOrder.getInitialProps = async(context,client)=>{
    const {orderId} = context.query;
    console.log("OrderId from context",orderId);
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order:data}
}
export default ShowOrder;