import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

const styles = theme => ({
  card: {
    display: 'flex'
  },
  details: {
    display: 'flex',
    flexDirection: 'column'
  },
  content: {
    flex: '1 0 auto'
  },
  cover: {
    width: '70px',
    height: '70px',
    marginTop: '1.5%'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  playIcon: {
    height: 38,
    width: 38
  }
})

function MediaControlCard(props) {
  const { classes, theme, name, artist, style, className, img } = props

  return (
    <Card className={classes.card + ' ' + className} style={style}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <h5 style={{ fontSize: '0.9rem' }}>
            <span className="badge badge-danger">{name}</span> by{' '}
            <span className="badge badge-warning">{artist}</span>
          </h5>
        </CardContent>
        <div className={classes.controls} />
      </div>

      <img
        className={classes.cover}
        src={img['#text']}
        alt="Live from space album cover"
      />
    </Card>
  )
}

MediaControlCard.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
}

export default withStyles(styles, { withTheme: true })(MediaControlCard)
