/* eslint-disable react/jsx-curly-brace-presence */
import classNames from 'classnames/bind';
import style from './LoginScreen.module.scss';
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import { AccountCircle, VpnKey } from '@material-ui/icons';
// var crypto = require('crypto');

var web_url = require('../../url')

const cx = classNames.bind(style);

export default function SignInSide(props) {
  function onClickSubmitAuthen() {
    //submit info to server 

    // let salt = crypto.randomBytes(4).readUInt32BE(0, true).toString()
    let url = web_url.user_login_url
    let username = document.getElementById('email').value
    let password = document.getElementById('password').value
    // let hashPassword = crypto.createHash('sha256').update(password).digest('hex')
    // let authenInfo = crypto.createHmac('sha256', salt).update(hashPassword).digest('hex')
    // const requestOptions = {
    //   method: 'POST',
    //   // headers: { 'Username': username, 'Salt': salt, 'AuthenInfo': authenInfo },
    //   headers: { 'Username': username,  'password': password },
    // };
    // fetch(url, requestOptions).then(async (response) => {
    //   if (response.status === 200) {
    //     let responseData = await response.json();
    //     props.onLoginSuccess(responseData)
    //   } else {
    //     //show incorrect username and password alert
    //     document.getElementById("message").style.display = 'block';
    //     props.onLoginFailure(response)
    //   }
    // })


    var axios = require('axios');
    var FormData = require('form-data');
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);

    var config = {
      method: 'post',
      url: url,
      headers: {

      },
      data: data
    };

    axios(config)
      .then(function (response) {
        if (response.status === 200) {
          props.onLoginSuccess(response)
        }
      })
      .catch(function (error) {
        //show incorrect username and password alert 
        document.getElementById("message").style.display = 'block';
        props.onLoginFailure()
        console.log(error);
      });

  }

  const [checked, setChecked] = useState(false)
  const [user, setUser] = useState("")
  const [pwd, setPwd] = useState("")

  const userLogin = {
    email: user,
    password: pwd,
  }
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  useEffect(() => {
    var checkData = JSON.parse(localStorage.getItem('user'))
    if (checked === true && checkData === null && user !== "" && pwd !== "") {
      localStorage.setItem("user", JSON.stringify(userLogin))
    } else if (checkData !== null && user === "" && pwd === "") {
      setPwd(checkData.password)
      setUser(checkData.email)
      setChecked(true)
    } else if (checked === false) {
      localStorage.removeItem("user")
    }

  }, [checked, user, pwd]); // eslint-disable-line react-hooks/exhaustive-deps

  document.onkeypress = function (e) {
    if (e.keyCode === 13) {
      onClickSubmitAuthen()
    }
  };

  return (
    <div>
      <div className={cx('container')} >
        <div className={cx('wrapper')} >
          <div className={cx('box-left')} >
            <div className={cx('header-box-left')}>
              <h2 className={cx("web-name")}>
                FACOTORY MANAGEMENT
              </h2>
            </div>

            <div className={cx('body-box-left')} >
              <div style={{ display: "flex", alignItems: "flex-end", fontSize: "20px" }}>
                <AccountCircle style={{ margin: "10px", color: "#434343" }} />
                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  style={{ backgroundColor: 'transparent' }}
                  size="medium"
                  value={user}
                  onChange={(newUser) => setUser(newUser.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <VpnKey style={{ margin: "10px", color: "#434343" }} />
                <TextField
                  variant="standard"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={pwd}
                  onChange={(newPwd) => setPwd(newPwd.target.value)}
                  style={{ backgroundColor: 'transparent' }}
                />
              </div>

              <div id="message" style={{ marginLeft: '40px', display: "none" }}>
                <h3 style={{ fontSize: 14, color: 'red' }}>Username or Password is inconrrect</h3>
              </div>

              <Button
                fullWidth
                variant="contained"
                color="primary"
                style={{ borderRadius: "30px", background: "#434343", marginTop: "10px", marginBottom: "10px" }}
                onClick={onClickSubmitAuthen} >

                Sign In
              </Button>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      checked={checked}
                      onChange={handleChange}
                      style={{ color: "#434343" }}
                    />}
                  label="Remember me"
                />
                <Link href="#" variant="body2" style={{ marginTop: "-10px" }}>
                  Forgot password?
                </Link>
              </div>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Link href='#/' variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </div>
            </div>

            <div>
              <span className={cx('footer-box-left')} >
                XOR - 2022
              </span>
            </div>
          </div>

          <div className={cx('box-right')}>
            <div style={{ display: "flex", justifyContent: 'center' }}>
              <img
                src="https://static.xorinc.uk/themes/images/v2.2_noline/newLogo.png"
                alt="..."
                style={{ transform: "rotate(270deg)", }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
