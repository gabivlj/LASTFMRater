import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addAlbumRating } from '../../actions/albumActions';

const __propTypes = {
  album: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addAlbumRating: PropTypes.func.isRequired,
};

const buttonStyle = {
  textDecoration: 'none',
  border: 'none',
  background: 'none',
  cursor: 'pointer',
};

class AlbumRating extends Component {
  static propTypes = __propTypes;

  constructor() {
    super();
    this.state = {
      // rating (the rating showcase)
      rating: 0,
      // rating (the rating that should be displayed when not hovering)
      actualRating: 0,
      // grampy rating
      generalRating: 0,
      // detect real changes
      currentVersion: 0,
      error: null,
    };
  }

  componentDidMount() {
    this.ratingUpdate();
  }

  componentDidUpdate() {
    this.ratingUpdate();
  }

  ratingUpdate = () => {
    const { album } = this.props.album.album;
    if (album && album.score && album.__v !== this.state.currentVersion) {
      actualRating = album.score;
      const userRating = album.userScore;
      this.setState({
        generalRating: actualRating,
        rating: userRating,
        actualRating: userRating,
        currentVersion: album.__v,
      });
      this.changedRating = true;
    }
  };

  handleClick = i => {
    const { auth } = this.props.auth;
    if (auth) {
      this.setState({ actualRating: i });
      this.props.addAlbumRating(
        this.props.album.album.album._id,
        i,
        this.props.auth.apiUser.user,
        this.props.auth.apiUser.id,
      );
    } else {
      this.setState({
        error: 'You cannot rate an album if you are not logged!',
      });
      setTimeout(() => this.setState({ error: null }), 2000);
    }
  };

  render() {
    const stars = [];
    const { album } = this.props.album.album;
    if (album && album.ratings.length >= 0) {
      for (let i = 0; i < 10; i++) {
        if (i >= this.state.rating) {
          stars.push(
            <button
              style={buttonStyle}
              onPointerEnter={() => this.setState({ rating: i + 1 })}
              onPointerLeave={() =>
                this.setState({ rating: this.state.actualRating })
              }
              key={i}
              onClick={() => this.handleClick(i + 1)}
            >
              <i className="far fa-star" id={i} style={{ color: '#b29600' }} />
            </button>,
          );
        } else {
          stars.push(
            <button
              style={buttonStyle}
              onPointerEnter={() => this.setState({ rating: i + 1 })}
              onPointerLeave={() =>
                this.setState({ rating: this.state.actualRating })
              }
              key={i}
              onClick={() => this.handleClick(i + 1)}
            >
              <i className="fas fa-star" id={i} style={{ color: '#FFD700' }} />
            </button>,
          );
        }
      }
    }
    return (
      <div>
        {stars}{' '}
        <div className="badge badge-primary">{this.state.generalRating}</div>
        {this.state.error ? (
          <div className="badge badge-danger ml-3">{this.state.error}</div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  album: state.album,
  auth: state.auth,
  ratings: state.album.album.album.ratings,
});
export default connect(
  mapStateToProps,
  { addAlbumRating },
)(AlbumRating);
