"use client"

import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react';
// import {create} from 'ipfs-http-client';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Navbar from "./components/Navbar"
import Post from './components/Post';
import { Button } from "@/components/ui/button"

import {mintNFT} from "./cadence/transactions/mint_nft"

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

export default function Home() {
  const [user, setUser] = useState();
  const [file, setFile] = useState();
  const [show, setShow] = useState(false)

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = async () => {
    // log in through Blocto
    fcl.authenticate();
  }

  const mint = async (name, description, ipfsHash, comment) => {

    try {
      const transactionId = await fcl.send([
        fcl.transaction(mintNFT),
        fcl.args([
          fcl.arg(ipfsHash, t.String),
          fcl.arg(name, t.String),
          fcl.arg(description, t.String),
          fcl.arg(comment, t.String)
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);
  
      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
    } catch(error) {
      console.log('Error uploading file: ', error);
    }
  }

  // const client = create('https://ipfs.infura.io:5001/api/v0');

  return (
    <div>

      <div className="flex justify-between m-4">
        <div>
          {
              user && user.addr ?
              <div className="flex items-center">
              <Button onClick={() => fcl.unauthenticate()}>
                Log Out
              </Button>
              <Button variant="link" className="text-white">{user && user.addr ? <Link href="/login">{user.addr}</Link> : "You are not logged in"}</Button>
              </div> 
              :
              <>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <Button onClick={() => logIn()}>Login</Button>
              </>
          }
        </div>
        <Navbar />
      </div>

      <div>
        <div className={`fixed z-10 overflow-auto ml-4  bg-[rgba(0,0,0,0.4) left-0 right-0 w-full h-full] ${show ? "flex justify-center items-center" : "hidden"}`}>
          <Post mint={mint} show={show} setShow={setShow}/>
        </div>
        <button onClick={() => !show ? setShow(true) : setShow(false)}>make it</button>
      </div>

    </div>
  )
}
