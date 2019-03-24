import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = {
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  }
}
const __propTypes = {
  album: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
}

const Album = ({ album, className, ...props }) => {
  const { classes } = props
  return (
    <Card className={classes.card + ' ' + className}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={album.image[3]['#text']}
          title={album.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {album.name}
          </Typography>
          <Typography component="p">
            {album.artist} <br />
            {album.mbid}
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
  )
}

Album.propTypes = __propTypes

export default withStyles(styles)(Album)
