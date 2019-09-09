import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from '@material-ui/core';

export default function DialogMe({
  open,
  handleClose,
  title,
  Render,
  propsRender,
  renderActions,
  image,
  handleBack,
  isLoading,
  handleFriend,
  titleButton,
  scrollableGeneral,
  onScroll,
}) {
  return (
    <div>
      <Dialog
        open={open}
        onScroll={onScroll || function() {}}
        onClose={handleClose}
        scroll={scrollableGeneral ? 'body' : 'paper'}
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
            onClick={handleFriend}
            className="ml-3"
            type="button"
            color="primary"
          >
            {titleButton}
          </Button>

          <Button
            onClick={handleClose}
            className="ml-3"
            type="button"
            color="secondary"
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent modal="false" dividers="true">
          {isLoading ? (
            <div style={{ padding: '10% 10% 10% 50%' }}>
              <CircularProgress />
            </div>
          ) : (
            <Render {...propsRender} />
          )}
        </DialogContent>
        <DialogActions
          disableActionSpacing
          style={{ borderTop: '1px solid #dce7f2', overflowX: 'hidden' }}
        >
          {renderActions}
        </DialogActions>
      </Dialog>
    </div>
  );
}
