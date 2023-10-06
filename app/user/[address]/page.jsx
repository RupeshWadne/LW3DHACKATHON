'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'
// import Navbar from '../../components/Navbar'
import Post from '../../components/Post'
import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { useToast } from '@/components/ui/use-toast'
// import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

import { mintNFT } from '../../cadence/transactions/mint_nft'
// import { setupUserTx } from '../../cadence/transactions/setup_user'
import { getUsersProfile } from '../../cadence/scripts/get_users.js'
// import { getAllPosts } from '../../cadence/scripts/get_all_posts.js'

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

const Page = ({ params }) => {
  const [user, setUser] = useState(params)
  const [profile, setProfile] = useState({})
//   const [username, setUsername] = useState('')
  const [show, setShow] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // sets the `user` variable to the person that is logged in through Blocto
    fcl.currentUser().subscribe(setUser)
    getUserProfile(user?.addr)
    // getPosts()
  }, [user?.addr])

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
    } catch (error) {
      console.log(error)
    }
  }

  const mint = async (name, description, ipfsHash, comment) => {
    try {
      const transactionId = await fcl
        .send([
          fcl.transaction(mintNFT),
          fcl.args([
            fcl.arg(ipfsHash, t.String),
            fcl.arg(name, t.String),
            fcl.arg(description, t.String),
            fcl.arg(comment, t.String),
          ]),
          fcl.payer(fcl.authz),
          fcl.proposer(fcl.authz),
          fcl.authorizations([fcl.authz]),
          fcl.limit(9999),
        ])
        .then(fcl.decode)

      console.log(transactionId)
      return fcl.tx(transactionId).onceSealed()
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between m-4">
        <h1 className="text-emerald-400 font-bold">Flowtter</h1>
        <div>{<Button onClick={() => logOut()}>Disconnect</Button>}</div>

        {/* <Navbar /> */}
      </div>

      <div className="shadow-[5px_5px_0px_0px_rgba(109,40,217)] border border-purple-700 h-[400px] w-[400px] top-64 left-28 fixed">
        <div className="flex justify-center items-center flex-col m-12">
          <div className="flex">
            {user && user.addr && profile.id ? (
              <div className="flex justify-between items-center flex-col p-6">
                <p className="mb-4">
                  Welcome{' '}
                  <span className="text-emerald-400">{profile.name}</span> 🫡{' '}
                </p>
                <Button variant="link" className="text-white mb-4">
                  <p>
                    Address:{' '}
                    <Link href={`/profile/${user?.addr}`}>
                      <span className="text-emerald-400 underline">
                        {user?.addr}
                      </span>
                    </Link>
                  </p>
                </Button>
                <div
                  className={`fixed z-10 overflow-auto ml-4  bg-[rgba(0,0,0,0.4) left-10 right-10 top-10 w-full h-full] ${
                    show ? 'flex justify-center items-center' : 'hidden'
                  }`}
                >
                  <Post
                    mint={mint}
                    show={show}
                    setShow={setShow}
                    profileName={profile.name}
                  />
                </div>
                <p>
                  {' '}
                  Let's create a post:
                  <Button
                    onClick={() => (!show ? setShow(true) : setShow(false))}
                  >
                    Post
                  </Button>
                </p>
              </div>
            ) : (
              <div>No user Found</div>
            )}
          </div>
        </div>
      </div>

      <div></div>
    </div>
  )
}

export default Page
