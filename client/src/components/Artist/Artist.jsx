import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { LinearProgress } from '@material-ui/core';
import { getArtist, cleanArtist } from '../../actions/artistActions';
import ArtistAlbums from './ArtistAlbums';

const __propTypes = {
  getArtist: PropTypes.func.isRequired,
  cleanArtist: PropTypes.func.isRequired,
  artist: PropTypes.object.isRequired
};

class Artist extends Component {
  static propTypes = __propTypes;

  constructor(props) {
    super(props);
    this.state = {
      artist: null
    };
    this.loadedArtist = false;
  }

  componentWillUnmount() {
    this.props.cleanArtist();
  }

  componentDidMount() {
    this.props.getArtist({
      name: this.props.match.params.name
    });
  }

  componentDidUpdate() {
    if (
      !this.loadedArtist &&
      this.props.artist &&
      this.props.artist.artist &&
      Object.keys(this.props.artist.artist).length > 0 &&
      !this.props.artist.artist.error
    ) {
      this.loadedArtist = true;
      this.setState({
        artist: this.props.artist.artist
      });
    }
  }

  render() {
    const { artist } = this.state;

    return (
      <div>
        {artist && !artist.error ? (
          <div className="jumbotron">
            <div className="container">
              <h1 className="display-4">{artist.name}</h1>
              <div className="container m-4">
                <img
                  src={artist.image[4]['#text']}
                  style={{
                    height: 'auto',
                    width: '40%'
                  }}
                  className="rounded"
                  alt="Responsive"
                />
              </div>
            </div>
            <p className="lead">{artist.bio.summary.split('<')[0]}</p>
            {artist.tags.tag.map((t, index) => (
              <span key={index} className="badge badge-primary ml-3">
                {t.name}
              </span>
            ))}
            <br />

            <hr className="my-4" />

            <div
              className={`badge ${
                artist.ontour > 0 ? 'badge-success' : 'badge-danger'
              } mb-2`}
            >
              <h6 className="m-2">
                {artist.ontour > 0 ? 'On tour!' : 'Not on tour...'}
              </h6>
            </div>

            <div className="badge badge-primary ml-2 mt-2 mb-2">
              <i
                style={{ color: 'white' }}
                className="fa fa-play mt-3"
                aria-hidden="true"
              />
              <p className="mt-2" style={{ fontSize: '13px' }}>
                {artist.stats.playcount} plays
              </p>
            </div>
            <p className="lead">
              <a className="btn btn-primary btn-lg" href="/" role="button">
                Learn more
              </a>
            </p>
          </div>
        ) : (
          <LinearProgress />
        )}
        {this.props.artist.albums && artist ? (
          <ArtistAlbums
            album={this.props.artist.albums.album}
            image={artist.image[4]['#text']}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  artist: state.artist
});
export default connect(
  mapStateToProps,
  { getArtist, cleanArtist }
)(Artist);
