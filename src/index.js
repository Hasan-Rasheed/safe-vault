import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import {Provider} from 'react-redux';
import store from './store';
import history from './history'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
// import { faUser} from '@fortawesome/free-solid-svg-icons'
 
// library.add(fab, faUser)

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";
import firebase from 'firebase';
import AdminLayout from "layouts/Admin";
import AuthLayout from "layouts/Auth";

{/* <script src="https://js.stripe.com/v3/"></script> */}
var firebaseConfig = {
  apiKey: "AIzaSyBkaxatZYWY4lcTOWMmizKVzQCxhNu6j4k",
  authDomain: "safevault-4bfe4.firebaseapp.com",
  databaseURL: "https://safevault-4bfe4.firebaseio.com",
  projectId: "safevault-4bfe4",
  storageBucket: "safevault-4bfe4.appspot.com",
  messagingSenderId: "669650035676",
  appId: "1:669650035676:web:6463c5194117814c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter history = {history}>
    <Switch>
      <Route path="/admin" render={props => <AdminLayout {...props} />} />
      <Route path="/auth" render={props => <AuthLayout {...props} />} />
      <Redirect from="/" to="/auth/login" />
    </Switch>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
