export const unlistFromSaleTx = `
import NewNFTMarketplace from 0x80ea21971a7ab25b

transaction(id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NewNFTMarketplace.SaleCollection>(from: /storage/PostSaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.unlistFromSale(id: id)
  }

  execute {
    log("A user unlisted an NFT for Sale")
  }
}

`