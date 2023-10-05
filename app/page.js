"use client"

import Image from 'next/image'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import Navbar from "./components/Navbar"
import Post from './components/Post';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"


import { mintNFT } from "./cadence/transactions/mint_nft"
import { setupUserTx } from "./cadence/transactions/setup_user"
import { getUsersProfile } from "./cadence/scripts/get_users.js"
import { getAllPosts } from "./cadence/scripts/get_all_posts.js"


fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

export default function Home() {
  const [user, setUser] = useState();
  const [profile, setProfile] = useState({});
  const [username, setUsername] = useState("");
  const [show, setShow] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser);
    getPosts()
  }, [])

  const logIn = async () => {
    // log in through Blocto
    fcl.authenticate();
  }

  const logOut = async () => {
    // log in through Blocto
    fcl.unauthenticate()
    setProfile({})
  }

  const getUserProfile = async (address) => {
    try{
    const result = await fcl.send([
      fcl.script(getUsersProfile),
      fcl.args([
        fcl.arg(address, t.Address)
      ])
    ]).then(fcl.decode);

    console.log(result);
    setProfile(result);
  }catch(error){
    console.log(error)
  }
  }

  const getPosts = async () => {
    try{
    const result = await fcl.send([
      fcl.script(getAllPosts),
      fcl.args([])
    ]).then(fcl.decode);

    console.log(result);
  }catch(error){
    console.log(error)
  }
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
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  const setupUser = async (username) => {
    try {
      const transactionId = await fcl.send([
        fcl.transaction(setupUserTx),
        fcl.args([
          fcl.arg(username, t.String),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999)
      ]).then(fcl.decode);

      console.log(transactionId);
      return fcl.tx(transactionId).onceSealed();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>

      <div className="flex justify-between m-4">
        <div>
          {
            user && user.addr ?
              <div className="flex items-center">
                <Button onClick={() => logOut()}>
                  Log Out
                </Button>
                <Button variant="link" className="text-white">{user && user.addr ? <Link href="/">{user.addr}</Link> : "You are not logged in"}</Button>
              </div>
              :
              <>
                <Button onClick={() => logIn()}>Login</Button>
              </>
          }
        </div>
        <Navbar />
      </div>

      <div className="shadow-[5px_5px_0px_0px_rgba(109,40,217)] border border-purple-700 h-72 w-80 top-64 left-28 fixed">
        <div className="flex justify-center items-center flex-col m-12">
          {user && user.addr
            ? <div>{profile.name ? <div></div> : <Button onClick={() => getUserProfile(user?.addr)}>Sign In</Button>}</div>
            : <p className="text-center">Please Connect Wallet. click login button</p>
          }
          <div className="flex">
            {
              profile.id ?
                <div className="flex justify-between items-center flex-col p-6">
                  <p className="mb-4">Username: {profile.name}</p>
                  <Button variant="link" className="text-white mb-4"><p>Address: <Link href={`/profile/${user?.addr}`}>{user?.addr}</Link></p></Button>
                  <div className={`fixed z-10 overflow-auto ml-4  bg-[rgba(0,0,0,0.4) left-10 right-10 top-10 w-full h-full] ${show ? "flex justify-center items-center" : "hidden"}`}>
                    <Post mint={mint} show={show} setShow={setShow}  profileName={profile.name}/>
                  </div>
                  <Button onClick={() => !show ? setShow(true) : setShow(false)}>Post</Button>
                </div>
                :
                <div>
                  {
                    user && user.addr ?
                      <div className="flex flex-col justify-center items-center">
                        <p className="text-xs font-medium text-red-500">*Sign in if you already have an account</p>
                        <p>OR</p>
                        <div>
                          <Input type="text" className="mb-4" onChange={(e) => setUsername(e.target.value)} />
                          <Button onClick={() => setupUser(username)}>Setup User</Button>
                        </div>
                      </div> :
                      ""
                  }

                </div>
            }
          </div>
        </div>
      </div>

      <div>



      </div>



    </div>
  )
}
