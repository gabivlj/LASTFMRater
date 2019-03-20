import React, { Component } from 'react'
import { LinearProgress } from '@material-ui/core'
import AlbumItem from './AlbumItem'
import { searchThingsForSearchBar } from '../../actions/searchActions'
import { connect } from 'react-redux'
import store from '../../store'

class LoadList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
    this.timeout = null
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      // Clear timeouts because we wanna send to api when
      // the user has stopped typing.
      store.dispatch({
        type: 'SET_LOADING_SEARCH'
      })
      if (this.timeout) clearTimeout(this.timeout)
      // We check for empty values.
      if (nextProps.searchValue.trim() !== '')
        this.timeout = setTimeout(() => {
          console.log('SEND API')
          this.props.searchThingsForSearchBar(nextProps.searchValue)
        }, 800)
    }
  }

  render() {
    const { albums, loading } = this.props.search
    let albumsSearchResult
    if (albums.length > 0) {
      albumsSearchResult = albums.map((album, index) => (
        // TODO: Basically, load artists, playlists, and users...
        <AlbumItem
          key={index}
          className="col-md-4"
          style={{ height: '90px' }}
          artist={album.artist}
          name={album.name}
          img={album.image[3]}
        />
      ))
    }
    return (
      <div>
        {loading ? (
          <LinearProgress
            color="secondary"
            style={{ marginLeft: '', marginBottom: '0%' }}
          />
        ) : (
          <div className={'row ' + this.props.className}>
            {albumsSearchResult}
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  search: state.search
})
export default connect(
  mapStateToProps,
  { searchThingsForSearchBar }
)(LoadList)
