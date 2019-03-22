import React, { Component } from 'react'
import { connect } from 'react-redux'

class SearchRoute extends Component {
  render() {
    const { searchquery } = this.props.match.params
    return (
      <div className="container">
        <h1>{searchquery}</h1>
      </div>
    )
  }
}

export default connect(null)(SearchRoute)
