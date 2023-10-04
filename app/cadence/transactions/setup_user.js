export const setupUserTx = `
import PostNFT from 0x80ea21971a7ab25b
import NonFungibleToken from 0x631e88ae7f1d7c20
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import NewNFTMarketplace from 0x80ea21971a7ab25b
import NewProfile from 0x80ea21971a7ab25b

transaction(name: String) {

  prepare(acct: AuthAccount) {
    let newUserProfile <- NewProfile.createUserProfile(name, acct.address.toString());
    acct.save(<- newUserProfile, to: NewProfile.storageProfileStoragePath);
    acct.link<&NewProfile.UserProfile{NewProfile.IUserProfilePublic}>(NewProfile.publicProfileStoragePath, target: NewProfile.storageProfileStoragePath);

    acct.save(<- PostNFT.createEmptyCollection(), to: /storage/PostNFTCollection)
    acct.link<&PostNFT.Collection{PostNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/PostNFTCollection, target: /storage/PostNFTCollection)
    acct.link<&PostNFT.Collection>(/private/PostNFTCollection, target: /storage/PostNFTCollection)
    
    let PostNFTCollection = acct.getCapability<&PostNFT.Collection>(/private/PostNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)

    acct.save(<- NewNFTMarketplace.createSaleCollection(PostNFTCollection: PostNFTCollection, FlowTokenVault: FlowTokenVault), to: /storage/PostSaleCollection)
    acct.link<&NewNFTMarketplace.SaleCollection{NewNFTMarketplace.SaleCollectionPublic}>(/public/PostSaleCollection, target: /storage/PostSaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`