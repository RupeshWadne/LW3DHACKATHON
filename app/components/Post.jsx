import React, { useState } from 'react'
import { create } from 'kubo-rpc-client'
// import axios from 'axios'
// import FormData from 'form-data'
require('dotenv').config()

const projectId = '2V4hWthxYCcZBjzD3SNmI2nyFun'

const projectSecret = 'f4ccbbc61e8df52aa126efb7796af098'

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
})

const Post = ({ mint, show, setShow }) => {
  const [name, setName] = useState('')
  const [comment, setComment] = useState('something')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState(null)
  const [ipfsHash, setIpfsHash] = useState('')

  function retrieveFile(e) {
    const data = e.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(data)

    reader.onloadend = () => {
      setFile(Buffer(reader.result))
    }

    e.preventDefault()
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const created = await client.add(file)
      const url = `https://infura-ipfs.io/ipfs/${created.path}`

      setIpfsHash(url)
    } catch (error) {
      console.log(error)
    }
  }

  const submitMintNft = async () => {
    mint(name, description, ipfsHash, comment)
    closeModalAndRemoveContents()
  }

  const closeModal = () => {
    !show ? setShow(true) : setShow(false)
  }

  const closeModalAndRemoveContents = () => {
    setName('')
    setDescription('')
    setIpfsHash('')
    closeModal()
  }
  return (
    <div>
      <div className="bg-white text-black flex flex-col gap-2 w-[50rem] p-2 rounded-2xl mr-2 h-[40rem]">
        <span
          className="text-black cursor-pointer"
          onClick={() => closeModal()}
        >
          &times;
        </span>

        <h2>Enter NFT Details</h2>

        <input
          value={name}
          className="p-1 h-8 rounded-md border-r-4 text-black"
          type="text"
          required
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          value={description}
          className="modal__description"
          type="text"
          required
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <input
          value={comment}
          className="modal__description"
          type="text"
          required
          onChange={(e) => setComment(e.target.value)}
          placeholder="comment"
        />

        <form onSubmit={handleSubmit}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>

        <input
          value={ipfsHash}
          className="modal__input"
          type="text"
          required
          placeholder="ipfsHash"
        />

        <button
          disabled={!name || !description || !ipfsHash}
          onClick={submitMintNft}
          className="modal__button"
        >
          Mint
        </button>
      </div>
    </div>
  )
}

export default Post
