import React from 'react';
import { Link, hashHistory } from 'react-router';
import _ from 'lodash';
import SAMPLE_CHANNELS from './channel-data';
import { Input, Messages } from './Chat';
import firebase from 'firebase';

class ChannelList extends React.Component {
    constructor(props){
        super(props);
        this.state = {channels: SAMPLE_CHANNELS};
    }
  render() {
      var chatsList = this.state.channels;
      var chatLinks = chatsList.map((channel) => {
          return <ChannelCard chat={channel} key={channel.name} />;
      })
    return (
      <div>
        <div className="container col-xs-12">
        <header className="well sub">
            <h1>Channels</h1>
        </header>
        <main>
            <h2>Welcome to Slack Chat! Select a Channel Below to Join:</h2>
            <div className="cards-container">
                {chatLinks}
            </div>        
        </main>
        </div>
      </div>
    );
  }
}

class ChannelCard extends React.Component {
  handleClick(){
    hashHistory.push('/channels/'+this.props.chat.name)
  }
  render() {
    var chat = this.props.chat; //shortcut
    return (
      <div className="card">
        <div className="content">
            <Link onClick={(e) => this.handleClick(e)}>#{chat.name}</Link>
        </div>
      </div>
    );
  }
}


class Channel extends React.Component {
  render() {
      var channelName = this.props.params.channelName;
      var channelObj =  _.find(SAMPLE_CHANNELS, {name: channelName}); //find dog in data (hack)
    return (
      <div>
        <div className="container col-xs-12">
        <header className="well sub">
            <h1>{channelObj.name}</h1>
        </header>
        <main>
          <Input />
          <Messages />
        </main>
        </div>
      </div>
    );
  }
}

export default ChannelList;

export { ChannelList, Channel };