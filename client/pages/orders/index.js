const MyOrders=({myOrders})=>{
    console.log(myOrders[0].id);
    
    return (<div>
        <h1>My Orders</h1>
        {myOrders.map((order,idx)=>
            <div className="border border-black w-25 p-2 m-2" key={idx}>
                <h2>{order.ticket.title}</h2>
                <p>Order ID: {order.id}</p>
                <p>Order Status: {order.status}</p>
            </div>
        )}
    </div>)
}

MyOrders.getInitialProps=async(context,client)=>{
    const {data} = await client.get("/api/orders");
    // console.log(data);
    return {myOrders:data}
}

export default MyOrders