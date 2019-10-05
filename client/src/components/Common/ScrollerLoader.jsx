import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import guidGenerator from '../../utils/idCreator';

/**
 *
 * @description Box where you can scroll and make actions when things get into the bottom or top or while scrolling the screen.
 * You really should pass a width and a height to make it work.
 *
 */
function ScrollerLoader({
  children,
  actionWhenScrolling,
  actionWhenBottom,
  actionWhenTop,
  timeoutMS,
  preload,
  onUnload,
  style,
  uuid,
}) {
  let ___TIMEOUT = false;
  useEffect(() => {
    if (!uuid) {
      console.error(
        'If you are using more ScrollerLoaders in the same page they wont work properly if you dont pass a uuid',
      );
    }
    if (
      !style ||
      (style.height == null &&
        style.minHeight == null &&
        style.maxHeight == null) ||
      style.width == null
    ) {
      console.warn(
        'You REALLY should put your own height and width if you want ScrollerLoader to work...',
      );
    }
    // !! Maybe use refs? They have been 0 effective for me and prop. to failures but...
    const __LOADER_ELEMENT = document.getElementById(
      `GRAMPY_SCROLLER_LOADER_${uuid}`,
    );
    if (!__LOADER_ELEMENT) {
      console.error('FATAL ERROR: __LOADER_ELEMENT Not found!!');
      throw new Error('Error finding scroller loader.');
    }
    if (preload) actionWhenBottom(true);
    __LOADER_ELEMENT.addEventListener('scroll', e => {
      if (!e || !e.target) {
        console.error('Target not working in ScrollerLoader!!');
        return;
      }
      actionWhenScrolling(e);
      if (e.target.scrollTop <= 0) {
        actionWhenTop();
      }
      if (
        e.target.scrollTop >=
          e.target.scrollHeight - e.target.clientHeight - 10 &&
        !___TIMEOUT
      ) {
        ___TIMEOUT = true;
        setTimeout(() => {
          ___TIMEOUT = false;
        }, timeoutMS);
        actionWhenBottom();
      }
    });
    return () => {
      onUnload();
      __LOADER_ELEMENT.removeEventListener('scroll', e => {});
    };
  }, []);
  return (
    <div
      id={`GRAMPY_SCROLLER_LOADER_${uuid}`}
      style={{ ...style, overflowY: 'scroll' }}
    >
      {children}
    </div>
  );
}

ScrollerLoader.propTypes = {
  children: PropTypes.element.isRequired,
  actionWhenScrolling: PropTypes.func,
  actionWhenBottom: PropTypes.func,
  onUnload: PropTypes.func,
  timeoutMS: PropTypes.number,
  preload: PropTypes.bool,
  actionWhenTop: PropTypes.func,
  style: PropTypes.shape({
    height: PropTypes.string,
    width: PropTypes.string,
  }).isRequired,
  uuid: PropTypes.string.isRequired,
};

ScrollerLoader.defaultProps = {
  actionWhenScrolling: () => {},
  actionWhenBottom: () => {},
  onUnload: () => {},
  actionWhenTop: () => {},
  timeoutMS: 1000,
  preload: false,
};

export default ScrollerLoader;
