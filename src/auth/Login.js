import React, { useEffect, useState } from "react";
import { Redirect } from 'react-router-dom'
import { withCookies, Cookies } from 'react-cookie';
import { instanceOf } from 'prop-types';
import "./loginContent/loginScreen"
import SignInSide from "./loginContent/loginScreen";
import { useDispatch, useSelector } from "react-redux";
import CustomNotification from "../element/CustomNotification/notification";
import { LoginSuccess, Logout } from "../utils/redux/actions/ActionLogin";

const Login = (props) => {
	const dispatch = useDispatch();
	const { loginState, authentication, timestamp } = useSelector(state => state.login)

	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [redirect, setRedirect] = useState(null);
	// const [token, setToken] = useState('');
	const [message, setMessage] = useState("Message");
	const [visible, setVisible] = useState(false);

	const logout = () => {
		setIsAuthenticated(false);
		// setToken('');
		setUser(null);
		dispatch(Logout())
	};

	const renderRedirect = () => {
		if (redirect) {
			return <Redirect to='/Statistics' />
			// return <Redirect to='/' />

		}
	}

	const onLoginSuccess = (response) => {
		console.log("token", response)
		// let user = { username: response.username};
		const { cookies } = props;

		const authenInfo = {
			accessToken: response.data.token,
		}

		const ONE_HOUR = 3600 * 1000;
		cookies.set("Authentication", authenInfo, { expires: new Date(new Date().getTime() + ONE_HOUR) });
		dispatch(LoginSuccess(authenInfo))

		setIsAuthenticated(true);
		// setToken(response.data.token);
		// setUser(user);
		setRedirect(true);
	}

	const onLoginFailure = (error) => {
		setMessage("Login failure. Please Login again!");
		setVisible(true);
	}

	useEffect(() => {
		if (new Date().getTime() - timestamp > 3600 * 1000) {
			dispatch(Logout())
			return
		}
		if (loginState) {
			if (authentication !== undefined && authentication !== null) {
				setIsAuthenticated(true);
				setUser({ username: authentication.username, email: authentication.email })
				setRedirect(true);
				const { cookies } = props;
				cookies.set("Authentication", authentication,
					{ expires: new Date(new Date().getTime() + 1 * 3600 * 1000) });
			}
		}
	}, [])// eslint-disable-line react-hooks/exhaustive-deps

	const content = !!isAuthenticated ?
		(
			<div>
				<p>Authenticated</p>
				<div>
					{user?.email}
				</div>
				<div>
					<button onClick={logout} className="button">
						Log out
					</button>
				</div>
			</div>
		) :
		(
			<div>
				<SignInSide
					onLoginSuccess={onLoginSuccess}
					onLoginFailure={onLoginFailure}
				/>
			</div>
		);

	return (
		<div className="right_col" role="main" style={{ minHeight: 944 }}>
			<CustomNotification type="error" message={message} visible={visible} setVisible={setVisible} duration={3000}></CustomNotification>
			{renderRedirect()}
			<div className="App">
				{content}
			</div>
		</div>
	);
}

Login.propTypes = {
	cookies: instanceOf(Cookies).isRequired
}

export default withCookies(Login);