import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-5'>
      <p>work in progress...</p>
      <UserButton afterSignOutUrl='/'/>
    </div>
  )
}
