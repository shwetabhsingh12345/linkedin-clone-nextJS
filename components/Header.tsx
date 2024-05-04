import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Briefcase, HomeIcon, Link, MessageSquare, SearchIcon, UserIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "./ui/button"

function Header() {
  return (
    <div className='flex items-center p-2 max-w-6xl mx-auto'>
      <Image 
      className='rounded-lg'
      src='https://links.papareact.com/b3z'
      width={40}
      height={40}
      alt="Logo" 
      />
    
    <div className="flex-1">
      <form className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
        <SearchIcon className="h-4 text-gray-600"/>
        <input
          type="text"
          placeholder="Search"
          className="bg-transparent flex-1 outline-none"
        />
      </form>
    </div>

    <div className="flex items-center space-x-4 px-4">

      <div className="icon">
      <HomeIcon className="h-5"/>
      <p>Home</p>
      </div>

      <div className="icon hidden md:flex">
      <UserIcon className="h-5"/>
      <p>Network</p>
      </div>

      <div className="icon hidden md:flex">
      <Briefcase className="h-5"/>
      <p>Jobs</p>
      </div>

      <div className="icon">
      <MessageSquare className="h-5"/>
      <p>Messaging</p>
      </div>

      {/*User Button if signed in */}
      <SignedIn>
        <UserButton/>
      </SignedIn>

      {/*Sign in Button if not signed in */}
      <SignedOut>
        <Button asChild variant="secondary">
          <SignInButton/>
        </Button>
      </SignedOut>
    </div>
  </div>
  )
}

export default Header