import React from 'react';
import PropTypes from 'prop-types';
import Profile from './Profile';

function ProfileShowcase({ profiles }) {
	let show = null;

	if (profiles && Array.isArray(profiles)) {
		show = profiles.map(profile => (
			<div key={profile._id} className="col-md-4 m-3">
				<Profile profile={profile} />
			</div>
		));
	}

	return <div className="row">{show}</div>;
}

ProfileShowcase.propTypes = {
	profiles: PropTypes.array.isRequired
};

export default ProfileShowcase;
