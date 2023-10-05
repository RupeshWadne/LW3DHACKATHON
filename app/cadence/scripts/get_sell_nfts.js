export const getSaleNFTsScript = `
import PostNFT from 0x80ea21971a7ab25b
import NonFungibleToken from 0x631e88ae7f1d7c20
import NewNFTMarketplace from 0x80ea21971a7ab25b

pub fun main(account: Address): {UInt64: NewNFTMarketplace.SaleItem} {
  let saleCollection = getAccount(account).getCapability(/public/PostSaleCollection)
                        .borrow<&NewNFTMarketplace.SaleCollection{NewNFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/PostNFTCollection) 
                    .borrow<&PostNFT.Collection{NonFungibleToken.CollectionPublic, PostNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()

  let returnVals: {UInt64: NewNFTMarketplace.SaleItem} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowEntireNFT(id: saleID)

    returnVals.insert(key: nftRef.id, NewNFTMarketplace.SaleItem(_price: price, _nftRef: nftRef))
  }

  return returnVals
}
`