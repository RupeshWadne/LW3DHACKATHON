'use client'

import React, { useState, useEffect } from 'react'
import * as fcl from '@onflow/fcl'
import * as t from '@onflow/types'

import { getNFTsScript } from '../../cadence/scripts/get_user_nfts.js'
import { getUsersProfile } from '../../cadence/scripts/get_users.js'
import { likePostTx } from '../../cadence/transactions/like_post.js'
import { commentPostTx } from '@/app/cadence/transactions/comment_post.js'
import { listForSaleTx } from '../../cadence/transactions/list_for_sale.js'
import { unlistFromSaleTx } from '../../cadence/transactions/unlist_for_sale.js'
import { getSaleNFTsScript } from '../../cadence/scripts/get_sell_nfts.js'
import { purchaseTx } from '../../cadence/transactions/purchase.js'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

fcl
  .config()
  .put('accessNode.api', 'https://access-testnet.onflow.org')
  .put('discovery.wallet', 'https://fcl-discovery.onflow.org/testnet/authn')

const Page = ({ params }) => {
  const [nfts, setNFTs] = useState([])
  const [sellNFTs, setSellNFTs] = useState([])
  const [user, setUser] = useState({})
  const [id, setID] = useState(0)
  const [price, setPrice] = useState(0)
  const [showPost, setShowPost] = useState(true)
  const [comment, setComment] = useState('')
  const router = useRouter()

  useEffect(() => {
    getUserNFTs()
    getUserProfile()
    getUserSaleNFTs()
  }, [])

  const logOut = async () => {
    // log in through Blocto
    fcl.unauthenticate()
    router.push('/')
  }

  const getUserNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getNFTsScript),
        fcl.args([fcl.arg(params.address, t.Address)]),
      ])
      .then(fcl.decode)

    console.log(result)
    setNFTs(result)
  }

  const getUserSaleNFTs = async () => {
    const result = await fcl
      .send([
        fcl.script(getSaleNFTsScript),
        fcl.args([fcl.arg(params.address, t.Address)]),
      ])
      .then(fcl.decode)

    console.log(result)
    setSellNFTs(result)
  }

  const getUserProfile = async () => {
    const result = await fcl
      .send([
        fcl.script(getUsersProfile),
        fcl.args([fcl.arg(params.address, t.Address)]),
      ])
      .then(fcl.decode)

    console.log(result)
    setUser(result)
  }

  const likePost = async (nftId) => {
    const transactionId = await fcl
      .send([
        fcl.transaction(likePostTx),
        fcl.args([
          fcl.arg(params.address, t.Address),
          fcl.arg(nftId, t.UInt64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  const commentPost = async (nftId) => {
    const transactionId = await fcl
      .send([
        fcl.transaction(commentPostTx),
        fcl.args([
          fcl.arg(params.address, t.Address),
          fcl.arg(nftId, t.UInt64),
          fcl.arg(comment, t.String),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)
      setComment("")

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  const purchase = async (id) => {
    const transactionId = await fcl
      .send([
        fcl.transaction(purchaseTx),
        fcl.args([
          fcl.arg(params.address, t.Address),
          fcl.arg(parseInt(id), t.UInt64),
        ]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  const listForSale = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(listForSaleTx),
        fcl.args([fcl.arg(parseInt(id), t.UInt64), fcl.arg(price, t.UFix64)]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  const unlistFromSale = async () => {
    const transactionId = await fcl
      .send([
        fcl.transaction(unlistFromSaleTx),
        fcl.args([fcl.arg(parseInt(id), t.UInt64)]),
        fcl.payer(fcl.authz),
        fcl.proposer(fcl.authz),
        fcl.authorizations([fcl.authz]),
        fcl.limit(9999),
      ])
      .then(fcl.decode)

    console.log(transactionId)
    return fcl.tx(transactionId).onceSealed()
  }

  return (
    <>
      <div>
        <div className="flex justify-around m-4">
          <h1 className="text-emerald-400 font-bold">Flowtter</h1>
          <div>{<Button onClick={() => logOut()}>Disconnect</Button>}</div>

          {/* <Navbar /> */}
        </div>
        {user && user.address ? (
          <>
            <div className="flex justify-center items-center flex-col w-2/3 h-full mx-auto my-4 p-6 shadow-[5px_5px_0px_0px_rgba(52,211,153)] border border-white">
              <h1 className="mt-4 font-bold text-2xl">
                Welcome to <span className="text-emerald-400">{user.name}</span>{' '}
                Profile
              </h1>

              <h1 className="mt-4 font-semibold text-lg">
                Address :{' '}
                <span className="text-emerald-400">{user.address}</span>
              </h1>
            </div>
            <div className="flex justify-center p-8 flex-col w-2/3 mx-auto my-12 border border-white">
              <div className="flex justify-between">
                <Button onClick={() => !showPost && setShowPost(true)}>
                  Posts & Collections
                </Button>
                <Button onClick={() => showPost && setShowPost(false)}>
                  Sell Collection
                </Button>
              </div>
              <div className={`w-full ${showPost ? 'visible' : 'hidden'}`}>
                {nfts
                  ? nfts.map((nft) => {
                      let url = ''
                      if (nft.ipfsHash.includes('infura')) {
                        url = nft.ipfsHash
                      } else {
                        url = `https://ipfs.io/ipfs/${nft.ipfsHash}`
                      }
                      return (
                        <div
                          className="shadow-[5px_5px_0px_0px_rgba(100,100,100)] border border-white mt-4 w-fit rounded-xl p-6"
                          key={nft.id}
                        >
                          <div className="flex">
                            <h1 className="ml-4 mt-4">
                              Meme ID:{' '}
                              <span className="text-emerald-400">{nft.id}</span>
                            </h1>

                            <h1 className="ml-4 mt-4">
                              Owner:{' '}
                              <span className="text-emerald-400">
                                {nft.metadata.name}
                              </span>
                            </h1>
                          </div>

                          <img className="w-fit m-5" src={url} />

                          <h1 className="ml-4 mt-1">
                            Meme Description:{' '}
                            <span className="text-emerald-400">
                              {nft.metadata.description}
                            </span>
                          </h1>
                          <h1 className="ml-4 mt-1">
                            Likes:{' '}
                            <span className="text-emerald-400">
                              {nft.likeCount}
                            </span>
                          </h1>
                          <div className="flex justify-between items-center">
                            <Button
                              varient="outline"
                              className="w-36 ml-4 my-2 bg-gray-50 text-emerald-400"
                              onClick={() => likePost(nft.id)}
                            >
                              Like
                            </Button>
                            <div className="flex items-center">
                              
                              <Input
                              className="ml-5"
                                type="text"
                                onChange={(e) => setComment(e.target.value)}
                              />
                              <Button
                                varient="outline"
                                className="w-36 ml-4 my-2 bg-gray-50 text-emerald-400"
                                onClick={() => commentPost(nft.id)}
                              >
                                Comment
                              </Button>
                            </div>
                          </div>
                          {
                                Object.entries(nft.stringDictionary).map(
                                  (t, k) => (
                                    <div className="flex items-center mt-1">
                                      <h1 className="ml-4 mr-8">{t[0]}: </h1>
                                      <span className="text-emerald-400">
                                      {t[1]}
                                  </span>
                                    </div>
                                  ),
                                )
                                
                              }
                        </div>
                      )
                    })
                  : 'no nfts'}
              </div>

              <div className={showPost ? 'hidden' : 'visible'}>
                {Object.keys(sellNFTs).map((nftID) => {
                  let url = ''
                  if (sellNFTs[nftID].nftRef.ipfsHash.includes('infura')) {
                    url = sellNFTs[nftID].nftRef.ipfsHash
                  } else {
                    url = `https://ipfs.io/ipfs/${sellNFTs[nftID].nftRef.ipfsHash}`
                  }
                  return (
                    <div
                      className="shadow-[5px_5px_0px_0px_rgba(100,100,100)] border border-white mt-4 w-fit rounded-xl p-6"
                      key={nftID}
                    >
                      <h1 className="ml-4 mt-4">
                        Price:{' '}
                        <span className="text-emerald-400">
                          {sellNFTs[nftID].price}
                        </span>
                      </h1>
                      <h1 className="ml-4 mt-4">
                        Meme ID:{' '}
                        <span className="text-emerald-400">{nftID}</span>
                      </h1>
                      <h1 className="ml-4 mt-4">
                        Owner:{' '}
                        <span className="text-emerald-400">
                          {sellNFTs[nftID].nftRef.metadata.name}
                        </span>
                      </h1>
                      {}
                      <img className="w-fit m-5" src={`${url}`} />
                      <Button className="ml-4" onClick={() => purchase(nftID)}>
                        Purchase this NFT
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <h1>There is no account</h1>
        )}
      </div>
    </>
  )
}

export default Page
// 0x858a4319840af213
