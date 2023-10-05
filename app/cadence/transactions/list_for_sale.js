export const listForSaleTx = `
import NewNFTMarketplace from 0x80ea21971a7ab25b

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&NewNFTMarketplace.SaleCollection>(from: /storage/PostSaleCollection)
                            ?? panic("This SaleCollection does not exist")

    saleCollection.listForSale(id: id, price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`