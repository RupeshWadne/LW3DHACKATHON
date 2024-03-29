import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract PostNFT: NonFungibleToken {

  pub var totalSupply: UInt64
  pub var mintedNFTs: {UInt64: Address}
  // keep track of all minters
  pub var minters: {UInt64: Address}

  pub event ContractInitialized()
  pub event Withdraw(id: UInt64, from: Address?)
  pub event Deposit(id: UInt64, to: Address?)

  pub resource NFT: NonFungibleToken.INFT {
    pub let id: UInt64 
    pub let ipfsHash: String
    pub var metadata: {String: String}
    pub var likeCount: UInt64
    pub var stringDictionary: {String: String}

    init(_ipfsHash: String, _metadata: {String: String}, _stringDictionary: {String: String}, _likeCount: UInt64) {
      self.id = PostNFT.totalSupply
      PostNFT.totalSupply = PostNFT.totalSupply + 1

      self.likeCount= _likeCount
      self.stringDictionary = _stringDictionary
      self.ipfsHash = _ipfsHash
      self.metadata = _metadata
    }

    pub fun increaseLikeCount() {
      self.likeCount = self.likeCount + 1
    }

    pub fun mutateStringDictionary(key: String, value: String) {
      self.stringDictionary[key] = value
    }
  }

  pub resource interface CollectionPublic {
    pub fun borrowEntireNFT(id: UInt64): &PostNFT.NFT
  }

  pub resource Collection: NonFungibleToken.Receiver, NonFungibleToken.Provider, NonFungibleToken.CollectionPublic, CollectionPublic {
    // the id of the NFT --> the NFT with that id
    pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

    pub fun deposit(token: @NonFungibleToken.NFT) {
      let myToken <- token as! @PostNFT.NFT
      emit Deposit(id: myToken.id, to: self.owner?.address)
      self.ownedNFTs[myToken.id] <-! myToken
    }

    pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
      let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("This NFT does not exist")
      emit Withdraw(id: token.id, from: self.owner?.address)
      return <- token
    }

    pub fun getIDs(): [UInt64] {
      return self.ownedNFTs.keys
    }

    pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
      return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
    }

    pub fun borrowEntireNFT(id: UInt64): &PostNFT.NFT {
      let reference = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
      return reference as! &PostNFT.NFT
    }

    init() {
      self.ownedNFTs <- {}
    }

    destroy() {
      destroy self.ownedNFTs
    }
  }

  pub fun createEmptyCollection(): @Collection {
    return <- create Collection()
  }

  pub fun createToken(ipfsHash: String, metadata: {String: String}, stringDictionary: {String: String}, likeCount: UInt64): @PostNFT.NFT {
    var NewNFT <- create NFT(_ipfsHash: ipfsHash, _metadata: metadata, _stringDictionary: stringDictionary, _likeCount: likeCount)
    PostNFT.mintedNFTs[NewNFT.id] = NewNFT.owner?.address
    PostNFT.minters[NewNFT.id] = NewNFT.owner?.address
    return <- NewNFT
  }

  pub fun getMinters(id: UInt64): Address? {
    return PostNFT.minters[id]
  }

  pub fun getMintedNFTs(): {UInt64: Address} {
    return PostNFT.mintedNFTs
  }

  init() {
    self.totalSupply = 0
    self.mintedNFTs = {}
    // Initialize the minters dictionary
    self.minters = {}
  }
}