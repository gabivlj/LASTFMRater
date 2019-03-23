import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { searchAlbums } from '../../../actions/searchActions'
import store from '../../../store'

const __propTypes = {
  search: PropTypes.object.isRequired,
  searchAlbums: PropTypes.func.isRequired
}

class SearchRoute extends Component {
  static propTypes = __propTypes

  componentDidMount() {
    const { searchquery } = this.props.match.params
    this.props.searchAlbums(searchquery, 5, 1)
  }

  componentWillUnmount() {
    store.dispatch({ type: 'CLEAN_SEARCH_PAGE' })
  }
  render() {
    const { searchquery } = this.props.match.params
    return (
      <div className="container">
        <h1>
          You searched:{' '}
          <span className="badge badge-primary">{searchquery}</span>
        </h1>
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
