import React, { Component } from 'react'
import { LinearProgress } from '@material-ui/core'
import AlbumItem from './AlbumItem'
import { searchThingsForSearchBar } from '../../actions/searchActions'
import { connect } from 'react-redux'
import store from '../../store'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const __propTypes = {
  searchThingsForSearchBar: PropTypes.func.isRequired,
  search: PropTypes.object.isRequired
}

class LoadList extends Component {
  static propTypes = __propTypes

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
          this.props.searchThingsForSearchBar(nextProps.searchValue)
        }, 800)
    }
  }

  render() {
    const { className, search, searchValue } = this.props
    const { albums, loading } = search
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
          <div className={'row ' + className}>
            {albumsSearchResult && albumsSearchResult.length > 0 ? (
              albumsSearchResult
            ) : (
              <h3 style={{ marginLeft: '15%', marginTop: '5%' }}>
                No results available...
              </h3>
            )}
            <Link
              to={`/search/${searchValue}`}
              onClick={() => store.dispatch({ type: 'CLEAN_SEARCH_PAGE' })}
              className="btn btn-secondary"
            >
              <h2 className="mt-3">Search more</h2>
            </Link>
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
