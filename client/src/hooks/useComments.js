/* eslint-disable prefer-const */
import { useState, useEffect } from 'react';
/**
 *
 * @param {*} setLoading
 * @param {*} getComments
 * @param {*} comments
 * @param {*} auth
 * @param {*} timeoutMS
 * @param {*} numberOfCommentsAdd
 * @param {*} preloadSomeComments
 * @description useComments returns the checkBottom function to check whenever it hits bottom of the web and it loads more comments.
 *              comments has attribute comment that is an array, it will use the current useComment the last item.
 * @returns {Function} checkBottom
 */
export default function useComments(
  setLoading,
  getComments,
  comments,
  auth,
  timeoutMS = 2000,
  numberOfCommentsAdd = 50,
  preloadSomeComments = true,
) {
  let { comment, loaded } = comments;
  const [, setCurrentNOfComments] = useState(0);
  let timeoutForLoading = false;
  const [check, setCheck] = useState(function() {});
  useEffect(() => {
    function checkBottom() {
      const commentItem = comment.length && comment[comment.length - 1];
      // When scrolling to the bottom of the component, reload comments.
      return e => {
        if (
          commentItem &&
          e.target.scrollTop >=
            e.target.scrollHeight - e.target.clientHeight - 10 &&
          loaded &&
          !timeoutForLoading
        ) {
          setLoading();
          // We do the update of the comments here because otherwise I don't know how we will get the prev value.
          setCurrentNOfComments(prev => {
            getComments(
              commentItem._id,
              0,
              prev + numberOfCommentsAdd,
              auth.apiUser ? auth.apiUser.id : null,
            );
            // Tell the browser not to load again in 2s.
            timeoutForLoading = true;
            setTimeout(() => {
              timeoutForLoading = false;
            }, timeoutMS);
            // Update.
            return prev + numberOfCommentsAdd;
          });
        }
      };
    }
    setCheck(() => checkBottom());
  }, [comment.length]);
  useEffect(() => {
    const commentItem = comment.length && comment[comment.length - 1];
    if (commentItem && comment.length) {
      setLoading();
      setCurrentNOfComments(prev => {
        getComments(
          commentItem._id,
          0,
          prev + numberOfCommentsAdd,
          auth.apiUser ? auth.apiUser.id : null,
        );
        return prev + numberOfCommentsAdd;
      });
    }
    return () => setCurrentNOfComments(0);
  }, [comment.length]);

  return [check];
}
