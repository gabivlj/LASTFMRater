import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

import './trackSearch.styles.css'

const styles = theme => ({
  card: {
    display: 'flex',
    height: 180
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: 150
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 12,
    width: 12
  }
})

const TrackCard = ({ title, artist, className, ...props }) => {
  const { classes } = props
  return (
    <div className={className}>
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h6" variant="h6">
              {title}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {artist}
            </Typography>
            <div className="outter-trash">
              <i className="fa fa-trash trash" />
            </div>
          </CardContent>
        </div>
        <CardMedia
          className={classes.cover}
          image="https://img.apmcdn.org/80ef67f5910de61be7dbb1a1adfdb4253e08dad4/square/0b317c-20130929-arctic-monkeys-am-album-cover-art.jpg"
          title="Live from space album cover"
        />
      </Card>
    </div>
  )
}

export default withStyles(styles, { withTheme: true })(TrackCard)
