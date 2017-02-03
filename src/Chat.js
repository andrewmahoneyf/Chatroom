import React from 'react';
import Time from 'react-time'
import firebase from 'firebase';
import noUserPic from './img/no-user-pic.png';

export class Input extends React.Component {
  constructor(props){
    super(props);
    this.state = {post:''};
  }
  updatePost(event) {
    this.setState({post: event.target.value});
  }
  postMessage(event){
    event.preventDefault();    
    var chatsRef = firebase.database().ref('chats');
    var newMessage = {
      text: this.state.post,
      userId: firebase.auth().currentUser.uid,
      time: firebase.database.ServerValue.TIMESTAMP 
    };
    chatsRef.push(newMessage);
    this.setState({post:''});
  }
  render() {
    var currentUser = firebase.auth().currentUser;
    return (
      <div>
        <form role="form">
          <textarea placeholder="What's on your mind?" name="text" value={this.state.post} className="form-control" onChange={(e) => this.updatePost(e)}></textarea>
          {this.state.post.length > 140 &&
            <p className="help-block">140 character limit!</p>
          }        
          <div>
            <button className="btn btn-primary share" 
                    disabled={this.state.post.length === 0 || this.state.post.length > 140}
                    onClick={(e) => this.postMessage(e)} >
              <i aria-hidden="true"></i> Share
            </button> 					
          </div>
        </form>
      </div>
    );
  }
}

export class Messages extends React.Component {
  constructor(props){
    super(props);
    this.state = {chats:[]};
  }
  componentDidMount() {
    var usersRef = firebase.database().ref('users');
    usersRef.on('value', (snapshot) => {
      this.setState({users:snapshot.val()});
    });
    var chatsRef = firebase.database().ref('chats');
    chatsRef.on('value', (snapshot) => {
      var messageArray = []; 
      snapshot.forEach(function(child){
        var message = child.val();
        message.key = child.key; 
        messageArray.push(message); 
      });
      messageArray.sort((a,b) => b.time - a.time);
      this.setState({chats:messageArray});
    });
  }
  componentWillUnmount() {
    firebase.database().ref('users').off();
    firebase.database().ref('chats').off();
  }
  render() {
    if(!this.state.users){
      return null;
    }
    var messageItems = this.state.chats.map((message) => {
      return <MessageItem message={message} 
                        user={this.state.users[message.userId]} 
                        key={message.key} />
    })
    return (<div>{messageItems}</div>);
  }
}

class MessageItem extends React.Component { 
  render() {
    var avatar = (this.props.user.avatar !== '' ? this.props.user.avatar : noUserPic);
    return (
      <div>
          <img className="image" src={avatar} role="presentation" />
          <span className="handle">{this.props.user.handle} {/*space*/}</span>
          <span className="time"><Time value={this.props.message.time} relative/></span>
          <div className="message">{this.props.message.text}</div>
      </div>      
    );
  }
}

MessageItem.propTypes = {
  message: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired,
};

export default Messages;