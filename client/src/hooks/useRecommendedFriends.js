import { useState, useEffect } from 'react';
import Axios from 'axios';
import handleError from '../utils/handleError';

export default function useRecommendedFollowers() {
  const [recommendedFollowers, setRecommendedFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [res, err] = await handleError(
        Axios.get('/api/profile/recommendedFollowers'),
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
