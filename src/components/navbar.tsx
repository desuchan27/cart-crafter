import { UserButton } from '@clerk/nextjs'
import { FC } from 'react'
import { MainNav } from '@/components/mainNav'

interface navbarProps {
  
}

const navbar: FC<navbarProps> = ({}) => {
  return (
  <div className='border-b'>
    <div className='flex h-16 items-center px-4'>
        <div>
            Store switcher
        </div>
        <div>
            Store routes
        </div>
        <MainNav className='m-6' />
        <div className="ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl='/' />
        </div>
    </div>
  </div>
  )
}

export default navbar