import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, IconButton } from '@material-ui/core';
import ProfilesShowcase from './ProfilesShowcase';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function Profiles({ profiles, ...props }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<div className="mt-2">
			<h1 className="mt-3">Profiles</h1>
			<div className="mt-2">
				{profiles.loading ? (
					<LinearProgress />
				) : (
					<ProfilesShowcase
						profiles={expanded ? profiles.list : profiles.list.slice(0, 6)}
					/>
				)}
				<IconButton
					className={`${expanded ? 'expanded' : 'notexpanded'} mt-2`}
					aria-label="Show more"
					onClick={() => setExpanded(!expanded)}
				>
					<ExpandMoreIcon />
				</IconButton>
			</div>
		</div>
	);
}

Profiles.propTypes = {
	profiles: PropTypes.object.isRequired
};

export default Profiles;
