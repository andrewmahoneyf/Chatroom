import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; //import our component
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import Join from './Join'
import Login from './Login'
import { ChannelList, Channel } from './Channels'
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyA9cKzYQXNDCXTo_o3ISCxL-_VWo-8uNi4",
  authDomain: "slack-chat-7e3e0.firebaseapp.com",
  databaseURL: "https://slack-chat-7e3e0.firebaseio.com",
  storageBucket: "slack-chat-7e3e0.appspot.com",
  messagingSenderId: "241276838274"
};
firebase.initializeApp(config);

//can load other CSS files (e.g,. Bootstrap) here
import '../node_modules/bootstrap/dist/css/bootstrap.css';
//load our CSS file
import './index.css';

//render the Application view
ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={ChannelList} />
      <Route path="join" component={Join} />
      <Route path="login" component={Login} />
      <Route path="channels" component={ChannelList} />
      <Route path="channels/:channelName" component={Channel} />
  </Route>
  </Router>,  document.getElementById('root')
);

firebase.auth();