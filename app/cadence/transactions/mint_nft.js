export const mintNFT = `
import MyNFT from 0x80ea21971a7ab25b

transaction(ipfsHash: String, name: String, description: String, comment: String) {

  prepare(acct: AuthAccount) {
    let collection = acct.borrow<&MyNFT.Collection>(from: /storage/MyNFTCollection)
                        ?? panic("This collection does not exist here")

    let nft <- MyNFT.createToken(ipfsHash: ipfsHash, metadata: {"name": name, "description": description}, stringDictionary: {"owner":comment})

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`