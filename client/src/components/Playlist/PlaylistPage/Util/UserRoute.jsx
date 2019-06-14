import React from 'react';
import { Link } from 'react-router-dom';

export default function UserRoute({ user }) {
	return (
		<Link to={`/profile/${user}`}>
			<div>{user}</div>
		</Link>
	);
}
