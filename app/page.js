"use client"

import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {create} from 'ipfs-http-client';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Navbar from "./components/Navbar"
import { Button } from "@/components/ui/button"

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

export default function Home() {
  const [user, setUser] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = async () => {
    // log in through Blocto
    const added = await client.add(file)
    const hash = added.path;
    console.log(hash)
    // fcl.authenticate();
  }

  const client = create('https://ipfs.infura.io:5001/api/v0');

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


    </div>
  )
}
