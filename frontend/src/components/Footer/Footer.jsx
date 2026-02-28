import React from 'react'

function Footer({className="bg-indigo-50"}) {
  return (
   <>  <footer className={`py-4 text-center ${className} text-gray-500 text-sm border-t-2`}>
        © {new Date().getFullYear()} Naulej. All Rights Reserved.
      </footer>
      </>
  )
}

export default Footer