
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const Home=({tickets,currentUser}) => {

  return (
    <div>
      <div className="w-50">
      {tickets.map((ticket)=>
      <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
      <div className="border border-dark rounded-2 p-2 mt-1">
      <div className="">{ticket.title}</div>
      <div>{ticket.price}</div>
      </div>
      </Link>)}
      </div>
    </div>
  );
}

Home.getInitialProps=async(context, client, currentUser)=>{
  // const client = buildClient(context); //Decide the place where the client send request from (browser or server),
  const {data} = await client.get('/api/tickets/');
  console.log(data);
  return {tickets:data,currentUser};
}

export default Home
