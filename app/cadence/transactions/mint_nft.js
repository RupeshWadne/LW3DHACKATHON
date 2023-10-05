export const mintNFT = `
import PostNFT from 0x80ea21971a7ab25b

transaction(ipfsHash: String, name: String, description: String, comment: String) {

  prepare(acct: AuthAccount) {
    let likeCount: UInt64 = 0
    let collection = acct.borrow<&PostNFT.Collection>(from: /storage/PostNFTCollection)
                        ?? panic("This collection does not exist here")

    let nft <- PostNFT.createToken(ipfsHash: ipfsHash, metadata: {"name": name, "description": description}, stringDictionary: {"owner":comment}, likeCount: likeCount)

    collection.deposit(token: <- nft)
  }

  execute {
    log("A user minted an NFT into their account")
  }
}
`