import { SignUp } from '@clerk/nextjs'
import React from 'react'

const Page = () => {
  return <SignUp
    appearance={{
      elements: {
        card: {
          backgroundColor: "rgb(2 6 23)", // Change this to your desired color
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
      variables: {
        colorBackground: "rgb(2 6 23)", // fallback/global background
      },
    }}
  
  />
}

export default Page
