export const purchaseTx = `
import PostNFT from 0x80ea21971a7ab25b
import NonFungibleToken from 0x631e88ae7f1d7c20
import NewNFTMarketplace from 0x80ea21971a7ab25b
import FlowToken from 0x7e60df042a9c0868

transaction(account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {
    let saleCollection = getAccount(account).getCapability(/public/PostSaleCollection)
                        .borrow<&NewNFTMarketplace.SaleCollection{NewNFTMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

    let recipientCollection = getAccount(acct.address).getCapability(/public/PostNFTCollection) 
                    .borrow<&PostNFT.Collection{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

    let price = saleCollection.getPrice(id: id)

    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault

    saleCollection.purchase(id: id, recipientCollection: recipientCollection, payment: <- payment)
  }

  execute {
    log("A user purchased an NFT")
  }
}

`