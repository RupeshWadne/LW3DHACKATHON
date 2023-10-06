"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import { Button } from "@/components/ui/button"



fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

export default function Home() {
  const [user, setUser] = useState();

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
  }, [])

  const logIn = async () => {
    // log in through Blocto
    fcl.authenticate();
    fcl.currentUser().subscribe(setUser);
  }

  const logOut = async () => {
    // log in through Blocto
    fcl.unauthenticate()
  }

  return (
    <div className="flex justify-center items-center h-screen m-auto flex-col">
      {
        user && user.addr ?
        <div className="flex flex-col items-center">
          <Button className="m-4" onClick={() => logOut()}>
            Disconnect
          </Button>
          <Link href={`/signIn/${user?.addr}`}><p>Click to continue with this address: <span className="text-emerald-400 underline">{user?.addr}</span></p></Link>
        </div>
        :
        <div className="flex flex-col items-center">
        <Button className="m-4" onClick={() => logIn()}>Connect</Button>
        <p className="text-xs text-red-500">{!user?.addr && "Please Connect your wallet!!"}</p>
        </div>
      }
    </div>
  )
}
