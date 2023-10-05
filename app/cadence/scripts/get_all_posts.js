export const getAllPosts = `
import PostNFT from 0x80ea21971a7ab25b

pub fun main(): {UInt64: Address} {

  let AllNFTs = PostNFT.getMintedNFTs()

  return AllNFTs
}
`