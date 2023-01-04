import React from 'react';
// import SideMenu from "../app/Sidemenu"

import Login from "../auth/Login";
import Test from "../pages/Test/Test";
import LookUpInfo from "../pages/LookUpInfo/LookUpInfo";
import Statistics from "../pages/Statistics/Statistics";


import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
const PageContent = () => {
  return (
    <div>
      <Router>
        {/* page content */}
        <Switch>
          <Route path="/" exact component={Login} ></Route>
          <Route path="/login" exact component={Login}></Route>
          <Route path="/Test" exact component={Test}></Route>
          <Route path="/LookUpInfo" exact component={LookUpInfo}></Route>
          <Route path="/Statistics" exact component={Statistics}></Route>
          <Redirect to="/"></Redirect>
        </Switch>
        {/* /page content */}
      </Router>
    </div>
  );
};

export default PageContent;