import { useState } from 'react'
import Link from 'next/link'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const Navbar = () => {
  const [address, setAddress] = useState("")
  return (
    <div className="flex">
        <Input onChange={(e) => setAddress(e.target.value)} type="text"/>
        <Button><Link href={`/profile/${address}`}>Search</Link></Button>
    </div>
  )
}

export default Navbar
