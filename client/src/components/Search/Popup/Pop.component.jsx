import React, { Component, useState } from 'react'
import { Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, withStyles, IconButton } from '@material-ui/core';
import { Link } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import { connect } from 'react-redux'

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

function PopComponent({ auth }) {
  const [open, setOpen] = useState(false)
  let anchorEl 
  const handleClose = (e) => {          
    setOpen(!open)    
  }

  return (
    <>
     <IconButton color="inherit" aria-label="Open drawer" onClick={handleClose} buttonRef={(ref) => anchorEl = ref}>
        <MenuIcon />
      </IconButton>
      <Popper open={open} anchorEl={anchorEl} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            id="menu-list-grow"
            style={{ margin: '0 0% 200% -20%'}}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>                                
                  
                  {auth.auth ? 
                    <MenuItem                     
                      component={Link}
                      to="/me/profile"
                      onClick={handleClose}
                    >
                      Profile
                    </MenuItem> :
                    null
                  }

                  {auth.auth ? 
                    <MenuItem 
                    onClick={handleClose} 
                    component={Link}
                    to="/me/profile"
                    >
                      Configuration
                    </MenuItem> : 
                    <MenuItem 
                    onClick={handleClose}component={Link}
                    to="/auth/register"
                    >
                      Register
                    </MenuItem>
                  }
                  {auth.auth ? 
                    <MenuItem onClick={handleClose}>Logout</MenuItem> : 
                    <MenuItem 
                      onClick={handleClose} 
                      component={Link}
                      to="/auth/login"
                    >
                      Login
                    </MenuItem> 
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
  
}

const mapStateToProps = (state) => ({
  auth: state.auth,
})
export default  connect(mapStateToProps, {})(withStyles(styles)(PopComponent))