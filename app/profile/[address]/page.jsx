"use client"

import React, {useState, useEffect} from 'react'
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

import {getNFTsScript} from "../../cadence/scripts/get_user_nfts.js"
import {getUsersProfile} from "../../cadence/scripts/get_users.js"
import {likePostTx} from "../../cadence/transactions/like_post.js"

fcl.config()
  .put("accessNode.api", "https://access-testnet.onflow.org")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

const page = ({params}) => {
    const [nfts, setNFTs] = useState([]);
    const [user, setUser] = useState({})

  useEffect(() => {
    getUserNFTs()
    getUserProfile()
  }, [])

  const getUserNFTs = async () => {
      const result = await fcl.send([
          fcl.script(getNFTsScript),
          fcl.args([
              fcl.arg(params.address, t.Address)
          ])
      ]).then(fcl.decode);

      console.log(result);
      setNFTs(result);
  }
 
  const getUserProfile = async () => {
    const result = await fcl.send([
        fcl.script(getUsersProfile),
        fcl.args([
            fcl.arg(params.address, t.Address)
        ])
    ]).then(fcl.decode);

    console.log(result);
    setUser(result);
}

const likePost = async (nftId) => {
  const transactionId = await fcl.send([
    fcl.transaction(likePostTx),
    fcl.args([
      fcl.arg(params.address, t.Address),
      fcl.arg(nftId, t.UInt64)
    ]),
    fcl.payer(fcl.authz),
    fcl.proposer(fcl.authz),
    fcl.authorizations([fcl.authz]),
    fcl.limit(9999)
  ]).then(fcl.decode);

  console.log(transactionId);
  return fcl.tx(transactionId).onceSealed();
}

  return (
    <>
    <div>
      <p>{user.address}</p>
      <p>{user.name}</p>
    </div>
    <div style={{backgroundColor: 'lightgreen'}}>
      {
          nfts ?
      nfts.map(nft => (
          <div key={nft.id}>
              <h1>Post ID: {nft.id}</h1>
              <img style={{width: "100px"}} src={`${nft.ipfsHash}`} />
              <h1>Post Name: {nft.metadata.name}</h1>
              <h1>Post Description: {nft.metadata.description}</h1>
              <h1>Comments :{nft.stringDictionary.owner}</h1>
              <h1>Likes: {nft.likeCount}</h1>
              <button onClick={() => likePost(nft.id)}>Like</button>
          </div>
      )) : "no nfts"}
    </div>
    
    </>
  );
}

export default page
