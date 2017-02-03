import React from 'react';
import { Link, hashHistory } from 'react-router';
import { Button } from 'react-bootstrap';
import SAMPLE_CHANNELS from './channel-data';
import _ from 'lodash';
import firebase from 'firebase';
import SignUpForm from './Join';
import SignInForm from './Login';


class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {channels: SAMPLE_CHANNELS};
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        console.log('Auth state changed: logged in as', user.email);
        this.setState({userId:user.uid});
      }
      else{
        console.log('Auth state changed: logged out');
        this.setState({userId: null}); //null out the saved state
      }
    })
  }
  signUp(email, password, handle, avatar) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function(firebaseUser) {
        var profilePromise = firebaseUser.updateProfile({
          displayName: handle,
          photoURL: avatar
        }); //return promise for chaining
				var userRef = firebase.database().ref('users/'+firebaseUser.uid); 
        var userData = {
          handle:handle,
          avatar:avatar
        }
        var userPromise = userRef.set(userData); //update entry in JOITC, return promise for chaining
        return Promise.all(profilePromise, userPromise); //do both at once!
      })
      .then(() => this.forceUpdate()) //bad, but helps demo
      .catch((err) => console.log(err));
  }
  signIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => console.log(err));
  }
  signOut(){
    firebase.auth().signOut();
  }

  render() {
    var content = null; //what main content to show
    if(!this.state.userId) { //if logged out, show signup form
      content = <SignUpForm signUpCallback={this.signUp} signInCallback={this.signIn} />;
    }
    else {
      content = (this.props.children);
    }




    var chats = Object.keys(_.groupBy(this.state.channels, 'name'));
    return (
      <div>
         <header className="well">
           <div className="container" role="banner" >
             <User />
             <h1>Slack Chat</h1>
             <p>Chat with your friends and classmates!</p>
             {this.state.userId &&
             <div className="logout">
              <button className="btn btn-warning signout" onClick={()=>this.signOut()}>Sign out {firebase.auth().currentUser.displayName}</button>
            </div>
          }
           </div>
         </header>
 
         <main className="container">
           <div className="row">
             <div className="col-xs-3" role="navigation">
             <Navigation chats={chats}/>
             </div>
             <div className="col-xs-9">
                {content}
             </div>
           </div>
         </main>
 
         <footer className="container" role="contentinfo">
           <small>Site Designed and Developed by  <a href="mailto:drew102@uw.edu" alt="Spotify link">Andrew Mahoney-Fernandes</a></small>
         </footer>
       </div>
    );
  }
}

class Navigation extends React.Component {
  constructor(props){
     super(props);
     this.handleClick = this.handleClick.bind(this);
   }
  handleClick(event){
    hashHistory.push('/channels/'+event.target.text.substring(1))
  }
  render() {
    var links = this.props.chats.map(function(chat){
      return <li key={chat}><Link activeClassName="activeLink">#{chat}</Link></li>;
    })   
    return (
      <nav>
        <h2><Link to="/channels" activeClassName="activeLink" className="head">Channels</Link></h2>
        <ul className="list-unstyled"   onClick={this.handleClick}>
          {links}
        </ul>
        <Link to="/channels" activeClassName="activeLink">Make New</Link>
      </nav>      
    );
  }
}

class User extends React.Component {
  render() {
    return (
      <div className="btn">
          <Button><Link to="/login" activeClassName="activeLink">Login</Link></Button>
          <Button><Link to="/join" activeClassName="activeLink">Sign Up</Link></Button>
      </div>      
    );
  }
}



export default App;