import React, { useEffect, useState } from 'react'
import $ from "jquery"
import debounce from 'react-debouncing';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { checkRole } from '../utils/route/route';

import Tippy from '@tippyjs/react/headless';
import Wrapper from '../../src/element/Popper/Wrapper';

function Sidemenu(props) {
	const dispatch = useDispatch();
	const [isLogin, setIsLogin] = useState(false);
	// const [init, setInit] = useState(false);
	const [isFirstTime, setIsFirstTime] = useState(true);
	const [email, setEmail] = useState("");




	// Sidebar
	const initSidebar = () => {
		const CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
			$BODY = $('body'),
			$SIDEBAR_MENU = $('#sidebar-menu'),
			$SIDEBAR_FOOTER = $('.sidebar-footer'),
			$LEFT_COL = $('.left_col'),
			$RIGHT_COL = $('.right_col'),
			$NAV_MENU = $('.nav_menu'),
			$FOOTER = $('footer');
		// TODO: This is some kind of easy fix, maybe we can improve this

		// console.log("nhatnt", CURRENT_URL)
		var setContentHeight = function () {
			// reset height
			$RIGHT_COL.css('min-height', $(window).height());

			var bodyHeight = $BODY.outerHeight(),
				footerHeight = $BODY.hasClass('footer_fixed')
					? -10
					: $FOOTER.height(),
				leftColHeight = $LEFT_COL
					.eq(1)
					.height() + $SIDEBAR_FOOTER.height(),
				contentHeight = bodyHeight < leftColHeight
					? leftColHeight
					: bodyHeight;

			// normalize content
			contentHeight -= $NAV_MENU.height() + footerHeight;

			$RIGHT_COL.css('min-height', contentHeight);
		};
		$SIDEBAR_MENU
			.find('a')
			.on('click', function (ev) {
				console.log('clicked - sidebar_menu');
				var $li = $(this).parent();
				if ($li.is('.active')) {
					$(this).find('.rotate').removeClass('down');
					$('ul:first', $li).slideUp('slow', function () {
						$li.removeClass('active active-sm');
						setContentHeight();
					});

				} else {
					if (!$li.parent().is('.child_menu')) {
						$SIDEBAR_MENU
							.find('li')
							.removeClass('active active-sm')
							.children('a').find('.rotate').removeClass('down')
						$SIDEBAR_MENU
							.find('li ul')
							.slideUp('slow')
					} else {
						if ($BODY.is(".nav-sm")) {
							$li
								.parent()
								.find("li")
								.removeClass("active active-sm");
							$li
								.parent()
								.find("li ul")
								.slideUp('slow');
						}
					}

					$li.addClass('active');
					$(this).find('.rotate').addClass('down');
					$('ul:first', $li).slideDown('slow', function () {
						setContentHeight();
					});
				}
			});
		//deboucing
		$(window).bind("resize", debounce(setContentHeight, 100));

		// check active menu
		$SIDEBAR_MENU
			.find('a[href="' + CURRENT_URL + '"]')
			.parent('li')
			.addClass('current-page');


		let currentTab = Object.values($SIDEBAR_MENU
			.find('a')).filter(function (element) {
				return element.href === CURRENT_URL;
			})[0];


		$(currentTab)
			.parent('li')
			.addClass('current-page')
			.parents('ul')
			.slideDown(function () {
				setContentHeight();
			})
			.parent()
			.addClass('active')
			.children('a').find('.rotate').addClass('down')

		setContentHeight();

		// fixed sidebar
		if ($.fn.mCustomScrollbar) {
			$('.menu_fixed').mCustomScrollbar({
				autoHideScrollbar: true,
				theme: 'minimal',
				mouseWheel: {
					preventDefault: true
				}
			});
		}
	};
	// /Sidebar

	const handleLogout = () => {
		const { cookies } = props;
		cookies.set("Authentication", null);
		dispatch({
			type: 'LOGOUT_SUCCESS',
			payload: null,
		})
	}

	useEffect(() => {
		initSidebar();
		const { cookies } = props;
		let user = cookies.get("Authentication")
		if (user === undefined || user === null) {
			setIsLogin(false);
			return;
		}

		setIsLogin(true);
		setIsFirstTime(false);
		setEmail(user.email);
	}, [props])

	function sidemenuRender() {
		const { cookies } = props;
		let user = cookies.get("Authentication");
		if (user === null || user === undefined) {
			return;
		}
		return (
			<div style={{ background: "#2A3F54", minHeight: "100vh", paddingLeft: "15px" }}>
				<div className="navbar nav_title" >
					
					<Tippy
						placement='bottom-start'
						render={attrs => (
							<div  tabIndex="-1" {...attrs}>
								<Wrapper menuSquare >  Log out </Wrapper>
							</div>
						)}
					>
						<div
							className="site_title"
							onClick={handleLogout}
						>
							<i className="fa fa-paw" />
							<span>Ginno Admin!</span>
						</div>
					</Tippy>
					{/* </a> */}
				</div>
				<div className="clearfix" /> {/* menu profile quick info */}
				<div className="profile clearfix">
					<div className="profile_pic">
						<img src="images/img.jpg" alt="..." className="img-circle profile_img" />
					</div>
					<div className="profile_info">
						<span>Welcome,</span>
						<h2>{email}</h2>
					</div>
				</div>
				{/* /menu profile quick info */}
				<br /> {/* sidebar menu */}
				<div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
					<div className="menu_section">
						<h3>LOOK UP INFOMATION</h3>
						<ul className="nav side-menu">
							<li>
								<a href="#/">
									<i className="fa fa-edit" />
									<span className="name-op">Menu</span>
									<span className="fa fa-chevron-down" />
								</a>
								<ul className="nav child_menu">
									<li style={{ marginLeft: "22px", fontSize: "14px" }}>
										<span className="fa fa-circle" />
										<a href="/LookUpInfo">Look Up Infomation</a>
									</li>
									<li style={{ marginLeft: "22px", fontSize: "14px" }}>
										<span className="fa fa-circle" />
										<a href="/Statistics">Statistics</a>
									</li>
								</ul>
							</li>
						</ul>
					</div>
				</div>
				{/* /sidebar menu */}
				{/* /menu footer buttons */}
				{/* <div className="sidebar-footer hidden-small">
						<a href="#/" data-toggle="tooltip" data-placement="top" title="Settings">
							<span className="glyphicon glyphicon-cog" aria-hidden="true" />
						</a>
						<a href="#/" data-toggle="tooltip" data-placement="top" title="FullScreen">
							<span className="glyphicon glyphicon-fullscreen" aria-hidden="true" />
						</a>
						<a href="#/" data-toggle="tooltip" data-placement="top" title="Lock">
							<span className="glyphicon glyphicon-eye-close" aria-hidden="true" />
						</a>

						<div id="logout-sidemenu" onClick={handleLogout}>
							<a data-toggle="tooltip" data-placement="top" title="Logout" href="login.html">

								<span className="glyphicon glyphicon-off" aria-hidden="true" />
							</a>
						</div>
					</div> */}
				{/* /menu footer buttons */}
			</div>
		)
	}


	return (
		<div>
			{sidemenuRender()}
			{checkRole(isLogin, isFirstTime)}
		</div>
	);
}

Sidemenu.propTypes = {
	cookies: instanceOf(Cookies).isRequired
}

export default (withCookies(Sidemenu));