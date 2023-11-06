"use client"
import Modal from '@/components/ui/modal'
import { UserButton } from '@clerk/nextjs'
import { useStoreModal } from 'hooks/useStoreModal'
import { useEffect } from 'react'


export default function Home() {

  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  useEffect(() => {
    if (!isOpen) onOpen()
  }, [isOpen, onOpen])

  return (
    <div className='min-h-screen flex flex-col justify-center items-center p-5'>
      Root Page
    </div>
  )
}
