import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'
import Rating from './Rating';

function Ratings({ ratings, username }) {
  const [albums, setAlbums] = useState([])

  useEffect(() => {
    (async () => {
      let promiseRating = []
      for (let rating of ratings) {
        promiseRating.push(axios.get(`/api/album/${rating}`))        
      }
      let albumsSet = (await Promise.all(promiseRating)).map(promise => promise.data)      
      albumsSet.forEach(album => album.rating = album.ratings.filter(r => r.user === username)[0])
      setAlbums(albumsSet)
    })()
  }, [ratings])
  return (
    <div>
      {albums && albums.length > 0 ? albums.map(rating => 
      (rating.rating ? <Rating
        albumName={rating.name} 
        artistName={rating.artist} key={rating._id} 
        rating={rating.rating.puntuation} 
        generalScore={10}
      /> : null)) : null}
    </div>
  )
}

const mapStateToProps = (state) => ({
  ratings: state.auth.apiUser.ratedAlbums,
  username: state.auth.apiUser.user
})
export default connect(mapStateToProps, {})(Ratings)