import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import NotiWrap from './NotiWrap';

export default function CustomizedSnackbars({
  variant,
  message,
  autoHideDuration,
  closeNotification,
  isOpen
}) {
  const [open, setOpen] = React.useState(true);
  function handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    closeNotification();
  }

  React.useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        open={open}
        autoHideDuration={parseInt(autoHideDuration, 10)}
        onClose={handleClose}
      >
        <NotiWrap onClose={handleClose} variant={variant} message={message} />
      </Snackbar>
    </div>
  );
}
