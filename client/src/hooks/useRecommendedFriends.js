import { useState, useEffect } from 'react';
import handleError from '../utils/handleError';
import { axiosAPI } from '../utils/axios';

export default function useRecommendedFollowers() {
  const [recommendedFollowers, setRecommendedFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [res, err] = await handleError(
        axiosAPI.get('/profile/recommendedFollowers'),
      );
      setLoading(false);
      if (err) {
        console.log(err);
        setRecommendedFriends([]);
        return null;
      }
      setRecommendedFriends(res.data.recommended);
      return res.data.recommended;
    })();
  }, []);

  useEffect(() => {
    if (refresh) {
      // api call for refresh
      console.log('TODO: API CALL TO REFRESH');
    }
  }, [refresh]);

  return [recommendedFollowers, loading, setRefresh];
}
