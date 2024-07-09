import Link from "next/link";
import useRequest from "@/hooks/useRequest";
import Router
 from "next/router";
const Header=({currentUser})=>{
    const {doRequest, errors} = useRequest({url:'/api/users/signout',
    method:'get',
    body:{},
    onSuccess:()=>Router.push('/')
    });

    const handleSignOut= async()=>{
        await doRequest();
    }

    return <div className='nav-bar'>
        <div><Link href="/" className="nav-brand">TICKET-PASS</Link></div>
        {currentUser?
        <div>
        <button className="btn btn-primary nav-btn" onClick={()=>handleSignOut()}>Sign out</button>
        <Link href="/tickets/new" className="btn btn-primary nav-btn">Create Ticket</Link>
        <Link href="/orders" className="btn btn-primary nav-btn">My Orders</Link>
        </div>
        :<div>
        <Link href ="/auth/signin" className="btn btn-primary nav-btn" >Sign in</Link>
        <Link href="/auth/signup" className="btn btn-primary nav-btn">Sign up</Link>
        </div>
        }
  </div>
}

export {Header};