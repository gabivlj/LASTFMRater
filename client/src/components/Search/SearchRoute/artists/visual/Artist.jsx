import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
};
const __propTypes = {
  artist: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const Artist = ({ artist, className, ...props }) => {
  const { classes } = props;
  return (
    <Card className={`${classes.card} ${className}`}>
      <CardActionArea
        onClick={() => {
          window.location.href = `/artist/${encodeURIComponent(
            artist.name,
          )}/${encodeURIComponent(artist.mbid)}`;
        }}
      >
        <CardMedia
          className={classes.media}
          image={
            artist.image[3]['#text'] ||
            'https://www.mompetit.com/wp-content/themes/holalady/img/img_placeholder.png'
          }
          title={artist.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {artist.name}
          </Typography>
          <Typography component="p">
            {artist.artist} 
{' '}
<br />
            {artist.mbid}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

Artist.propTypes = __propTypes;

export default withStyles(styles)(Artist);
