import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { searchAlbums } from '../../../actions/searchActions'
import store from '../../../store'
import Albums from './albums/Albums'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import Search from '../../../utils/searchFunctions'

const __propTypes = {
  search: PropTypes.object.isRequired,
  searchAlbums: PropTypes.func.isRequired
}

class SearchRoute extends Component {
  static propTypes = __propTypes
  constructor() {
    super()
    this.state = { albums: { currentItems: 10 } }
    this.searchHandler = null
  }

  componentDidMount() {
    const { searchquery } = this.props.match.params
    this.searchHandler = new Search(searchquery, store)
    // We set cleaned: false to inform that we populated lists.
    store.dispatch({ type: 'POPULATE_SEARCH' })
    this.add('albums', this.props.searchAlbums)
  }

  componentWillReceiveProps(next) {
    if (next.search.cleaned) {
      // This means that the user has searched another thing in the searchbar and it has cleaned every lists.
      // So we need to get the items that the user is searching. So now we set to cleaned: false to say: "Hey, we searched things"
      store.dispatch({ type: 'POPULATE_SEARCH' })
      // Change the query param in the Search class.
      this.searchHandler.searchquery = next.match.params.searchquery
      // Find albums
      this.add('albums', this.props.searchAlbums)
      // TODO search other stuff
    }
  }

  add = (type, functionprops) => {
    this.searchHandler.search(
      type,
      this.state[type].currentItems + 10,
      functionprops,
      1
    )
    this.setState({
      [type]: { currentItems: this.state[type].currentItems + 10 }
    })
  }

  componentWillUnmount() {
    store.dispatch({ type: 'CLEAN_SEARCH_PAGE' })
  }

  render() {
    const { searchquery } = this.props.match.params
    const { albums } = this.props.search
    return (
      <div className="container">
        <h1>
          You searched:{' '}
          <span className="badge badge-primary">{searchquery}</span>
        </h1>
        {/* Albums */}
        <Albums albums={albums} />
        <Fab
          color="primary"
          aria-label="Add"
          onClick={() => {
            this.add('albums', this.props.searchAlbums)
          }}
        >
          <AddIcon />
        </Fab>
        {/* Artists */}

        {/* Playlists */}

        {/* Users */}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  search: state.search.searchData
})
export default connect(
  mapStateToProps,
  { searchAlbums }
)(SearchRoute)
