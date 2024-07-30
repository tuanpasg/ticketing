// import "@/styles/globals.css";
import "@/styles/myGlobal.css";
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "./api/build-client";
import Link from "next/link";
import { Header } from "./header";

function App({ Component, pageProps, currentUser}) {
  // console.log(pageProps);
  // console.log(currentUser);
  console.log("Rendering ...");
  return <>
  <Header currentUser={currentUser}/>
  <Component currentUser={currentUser} {...pageProps} />;
  </>
}

App.getInitialProps = async(appContext)=>{
  const client = buildClient(appContext.ctx); //Decide the place where the client send request from (browser or server),
  
  const {data} = await client.get('/api/users/currentuser');

  let pageResp={};

  if(appContext.Component.getInitialProps){
    pageResp = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
  }

  return {pageProps:pageResp, currentUser : data.currentUser};
}

export default App
