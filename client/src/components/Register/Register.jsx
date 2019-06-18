import React, { Component } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions/authActions';
import InputBorderline from '../Common/InputBorderline';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import store from '../../store';

const propTypes = {
	auth: PropTypes.object.isRequired
};

class Register extends Component {
	static propTypes = propTypes;

	state = {
		email: '',
		password: '',
		password2: '',
		username: ''
	};

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	componentDidMount() {
		if (this.props.auth.auth) {
			this.props.history.push('/me/profile');
		}
	}

	componentWillUnmount() {
		this.cleanErrors();
	}

	componentSubmit = e => {
		e.preventDefault();
		const { email, password, password2, username } = this.state;
		this.props.register(
			email,
			password,
			password2,
			username,
			this.props.history
		);
	};

	cleanErrors = () => {
		store.dispatch({
			type: 'CLEAN_ERRORS'
		});
	};

	render() {
		const { errors } = this.props.auth;
		return (
			<div className="container jumbotron mt-3">
				<h1 className="ml-3">Register</h1>
				<form onSubmit={this.componentSubmit}>
					<InputBorderline
						type="email"
						name="email"
						value={this.state.email}
						onChange={this.onChange}
						label="Your email"
						multiline={false}
						error={errors['exist'] || errors['email'] || ''}
						fullWidth
						cleanErrors={this.cleanErrors}
					/>
					<InputBorderline
						type="username"
						name="username"
						value={this.state.username}
						onChange={this.onChange}
						label="Your username"
						multiline={false}
						error={errors['exist'] || errors['username'] || ''}
						fullWidth
						cleanErrors={this.cleanErrors}
					/>
					<InputBorderline
						type="password"
						name="password"
						value={this.state.password}
						onChange={this.onChange}
						label="Your password"
						multiline={false}
						fullWidth
						error={errors['password'] || ''}
						cleanErrors={this.cleanErrors}
					/>
					<InputBorderline
						type="password"
						name="password2"
						value={this.state.password2}
						onChange={this.onChange}
						error={errors['password2'] || ''}
						label="Repeat your password"
						multiline={false}
						fullWidth
					/>
					<input type="submit" value="Submit" className="btn btn-primary" />
				</form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	auth: state.auth
});
export default withRouter(
	connect(
		mapStateToProps,
		{ register }
	)(Register)
);
