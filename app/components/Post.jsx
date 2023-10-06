import React, { useState } from 'react'
// import { create } from 'kubo-rpc-client'
// import axios from 'axios'
// import FormData from 'form-data'
require('dotenv').config()
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// const auth =
//   'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

// const client = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: auth,
//   },
// })

const Post = ({ mint, show, setShow, profileName }) => {
  const [name, setName] = useState(profileName)
  const [comment, setComment] = useState('')
  const [description, setDescription] = useState('')
  // const [file, setFile] = useState(null)
  const [ipfsHash, setIpfsHash] = useState('')

  // function retrieveFile(e) {
  //   const data = e.target.files[0]
  //   const reader = new window.FileReader()
  //   reader.readAsArrayBuffer(data)

  //   reader.onloadend = () => {
  //     setFile(Buffer(reader.result))
  //   }

  //   e.preventDefault()
  // }

  // async function handleSubmit(e) {
  //   e.preventDefault()

  //   try {
  //     const created = await client.add(file)
  //     const url = `https://infura-ipfs.io/ipfs/${created.path}`

  //     setIpfsHash(url)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

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
      <div className="bg-black text-white flex flex-col gap-2 w-[50rem] p-2 rounded-2xl mr-2 h-[40rem] shadow-[5px_5px_0px_0px_rgba(52,211,153)] border border-white">
        <span
          className="text-white cursor-pointer"
          onClick={() => closeModal()}
        >
          X
        </span>

        <h2>What is on your mind:<span className="text-emerald-400">{profileName}</span></h2>

        <Textarea
          value={description}
          className="text-emerald-500"
          type="text"
          required
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Share how's your day!! 🤩"
        />

        <Textarea
          value={comment}
          className="text-emerald-500"
          type="text"
          required
          onChange={(e) => setComment(e.target.value)}
          placeholder="PS: 😉"
        />

        {/* <form className="text-emerald-500" onSubmit={handleSubmit}>
          <Label htmlFor="picture">Picture</Label>
          <Input className="w-56 text-emerald-500 bg-white mb-3" id="picture" type="file" onChange={retrieveFile} />
          <Button type="submit" className="text-emerald-500">
            Submit
          </Button>
        </form> */}

        <Input
          value={ipfsHash}
          className="text-emerald-500"
          type="text"
          required
          placeholder="ipfsHash"
          onChange={(e) =>setIpfsHash(e.target.value)}
        />

        <Button
          varient="outline"
          disabled={!name || !description || !ipfsHash || !comment}
          onClick={submitMintNft}
          className="w-36 m-auto bg-gray-50 text-emerald-400"
        >
          Post
        </Button>
      </div>
    </div>
  )
}

export default Post
