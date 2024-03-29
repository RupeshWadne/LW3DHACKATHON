'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
// import Navbar from '../../components/Navbar'
import Post from '../../components/Post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

import { mintNFT } from '../../cadence/transactions/mint_nft'
import { setupUserTx } from '../../cadence/transactions/setup_user'
import { getUsersProfile } from '../../cadence/scripts/get_users.js'
import { getAllPosts } from '../../cadence/scripts/get_all_posts.js'

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

const Page = ({ params }) => {
  const [user, setUser] = useState(params)
  const [profile, setProfile] = useState({})
  const [username, setUsername] = useState('')
  const [show, setShow] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser)
  }, [])

  const logOut = async () => {
    // log in through Blocto
    fcl.unauthenticate()
    router.push('/')
  }

  const getUserProfile = async (address) => {
    try {
      const result = await fcl
        .send([
          fcl.script(getUsersProfile),
          fcl.args([fcl.arg(address, t.Address)]),
        ])
        .then(fcl.decode)

      console.log(result)
      setProfile(result)
      router.push(`/user/${result.name}${result.id}`)
    } catch (error) {
      console.log(error)
    }
  }

  const setupUser = async (username) => {
    try {
      const transactionId = await fcl
        .send([
          fcl.transaction(setupUserTx),
          fcl.args([fcl.arg(username, t.String)]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode)

      console.log(transactionId)
      return fcl.tx(transactionId).onceSealed()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <div className="flex justify-around m-4">
        <h1 className="text-emerald-400 font-bold">Flowtter</h1>
        <div>{<Button onClick={() => logOut()}>Disconnect</Button>}</div>

        {/* <Navbar /> */}
      </div>

      <div className="shadow-[5px_5px_0px_0px_rgba(109,40,217)] border border-purple-700 h-[400px] w-[600px] flex mx-auto my-40">
        <div className="flex flex-col m-12">
          <div className="mb-10">
            <Button onClick={() => getUserProfile(user?.addr)}>Sign In</Button>
            <p className="text-xs font-medium text-red-500">
              *Sign in if you already have an account
            </p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                className="mb-4"
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button onClick={() => setupUser(username)}>Setup User</Button>
            </div>
          </div>
        </div>
      </div>

      <div></div>
    </div>
  )
}

export default Page
