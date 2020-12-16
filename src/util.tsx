import React from 'react'
import { Link } from '@chakra-ui/core'

export const getLink = (name: string, link: string) => {
  return (
    <Link href={link} isExternal>
      {name}
    </Link>
  )
}
