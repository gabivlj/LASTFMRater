import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';

export default function DialogMe({
  open,
  handleClose,
  title,
  Render,
  propsRender,
  renderActions,
  image
}) {
  // useEffect(() => {
  //   if (onRender && open) {
  //     onRender();
  //   }
  // }, []);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{ borderBottom: '1px solid #dce7f2' }}
        >
          {image}
          {title}
          <Button
            onClick={handleClose}
            className="ml-3"
            type="button"
            color="secondary"
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent
          style={{ paddingTop: '80%' }}
          modal="false"
          dividers="true"
        >
          <Render {...propsRender} />
        </DialogContent>
        <DialogActions style={{ borderTop: '1px solid #dce7f2' }}>
          {renderActions}
        </DialogActions>
      </Dialog>
    </div>
  );
}
