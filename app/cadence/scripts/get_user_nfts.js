export const getNFTsScript = `
import PostNFT from 0x80ea21971a7ab25b
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&PostNFT.NFT] {
  let collection = getAccount(account).getCapability(/public/PostNFTCollection)
                    .borrow<&PostNFT.Collection{NonFungibleToken.CollectionPublic, PostNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&PostNFT.NFT] = []

  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowEntireNFT(id: id))
  }

  return returnVals
}
`