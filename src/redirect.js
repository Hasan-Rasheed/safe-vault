import { Component } from "react";
import React from "react";
import {  Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin";
import AuthLayout from "layouts/Auth";
import { connect } from 'react-redux';

class Redirecting extends Component{
    constructor(props){
        super(props)
    }
    render(){
    return(
        <div>
            
            {(this.props.isLogin)?(
        <Switch>
<div><Route path="/admin" render={props => <AdminLayout {...props} />} />
<Route path="/auth" render={props => <AuthLayout {...props} />} />
<Redirect from="/" to="/auth/login" /></div>
        
      </Switch>
      ):(alert("error"))}
      </div>
    );

}
}
function mapStateToProp(state) {
    console.log(state);
    return ({
      isLogin: state.root.isLogin,
      errorMsg: state.root.errorMessage,
  
  
    })
  }
export default connect(mapStateToProp)(Redirecting);