import React, { useState } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { IconButton, Input } from '@material-ui/core'

const SearchButton = () => {
  const [extended, changeExtended] = useState(false)
  return (
    <IconButton color="inherit" onClick={() => changeExtended(!extended)}>
      <SearchIcon />
    </IconButton>
  )
}
export default SearchButton
