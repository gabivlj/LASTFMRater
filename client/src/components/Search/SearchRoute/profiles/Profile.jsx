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
		maxWidth: 345
	},
	media: {
		height: 140
	}
};

function Profile({ profile, classes, className }) {
	return (
		<div>
			<Card className={`${classes.card} ${className}`}>
				<CardActionArea
					onClick={() => (window.location.href = `/profile/${profile._id}`)}
				>
					<CardMedia
						className={classes.media}
						image={
							profile.img ||
							'https://www.mompetit.com/wp-content/themes/holalady/img/img_placeholder.png'
						}
						title={playlist.name}
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="h2">
							{profile.user}
						</Typography>
						<Typography component="p">
							Followers: {profile.followers || 0}
							{typeof profile.lastfm === 'string' && profile.lastfm.length > 0
								? `Lastfm: ${profile.lastfm}`
								: 'Has no Lastfm account linked.'}
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
		</div>
	);
}

Profile.propTypes = {
	profile: PropTypes.object.isRequired
};

export default withStyles(styles)(Profile);
