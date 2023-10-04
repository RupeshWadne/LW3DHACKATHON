export const likePostTx = `
import PostNFT from 0x80ea21971a7ab25b
import NonFungibleToken from 0x631e88ae7f1d7c20

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let collection = getAccount(account).getCapability(/public/PostNFTCollection)
                    .borrow<&PostNFT.Collection{NonFungibleToken.CollectionPublic, PostNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

    let nft = collection.borrowEntireNFT(id: id)
    nft.increaseLikeCount()
  }

  execute {
    
  }
}
`