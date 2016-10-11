import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ListView,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import NavBar from './NavBar';
import Globals from './Globals';

const Buffer = require('buffer/').Buffer;
const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});
let bearerToken = '';

class Search extends Component {

  constructor(props) {
    super(props);
    this.fetchTweets = this.fetchTweets.bind(this);
    this.state = {
      loading: false,
      message: '',
      searchQuery: '',
      dataSource: ds.cloneWithRows([])
    };
  }

  searchResults(tweet, sectionID, rowID) {
    return (
      <View style={{ flexDirection: 'row', margin: 12 }}>
        <Image source={{ uri: tweet.user.profile_image_url_https }} style={styles.profilePic} />
        <View style={{ marginLeft: 16, flexDirection: 'column', flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '600' }}>{tweet.user.screen_name}</Text>
          <Text style={{ flexWrap: 'wrap', flex: 1 }}>{tweet.text}</Text>
        </View>
      </View>
    );
  }

  searchTweets() {
    this.setState({ loading: true });
    if (bearerToken !== '') {
      return this.fetchTweets();
    }

    let credentials = new Buffer( Globals.CONSUMER_KEY+ ':' + Globals.CONSUMER_SECRET).toString('base64');

    fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        "Authorization": "Basic " + credentials,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: "grant_type=client_credentials"
    })
      .then(response => response.json())
      .then(result => {
        bearerToken = result.access_token;
        this.fetchTweets();
      })
      .catch((error) => { console.error(error); });
  }

  fetchTweets() {
    that = this;
    let url = 'https://api.twitter.com/1.1/search/tweets.json?q=%23' + this.state.searchQuery
      + "&count=20";
    fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + bearerToken
      }
    })
      .then(response => response.json())
      .then(result => {
        that.setState({
          loading: false,
          message: result.statuses.length === 0 ? 'No statuses found' : '',
          dataSource: ds.cloneWithRows(result.statuses)
        })
      })
      .catch((error) => { console.error(error); });
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View style={styles.separator} key={sectionID + rowID} />
    );
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5FCFF' }}>
          <ActivityIndicator animating={true} size='large' />
        </View>
      );
    }

    let tweets = this.state.message === '' ?
      (<ListView
        dataSource={this.state.dataSource}
        renderRow={this.searchResults.bind(this)}
        renderSeparator={this.renderSeparator}
        enableEmptySections={true}
        />) : 
        (<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F5FCFF' }}>
          <Text>{this.state.message}</Text>
        </View>);
    
    return (
      <View style={styles.container}>
        <NavBar />
        <View style={styles.searchContainer}>
          <TextInput
            placeholder='Enter hashtag'
            defaultValue={this.state.searchQuery}
            onChangeText={text => this.setState({ searchQuery: text })}
            style={styles.searchInput}
            />
          <TouchableOpacity onPress={this.searchTweets.bind(this)}>
            <Image source={require('../images/ic_search.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        {tweets}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  searchInput: {
    flexDirection: 'column',
    flex: 1,
    height: 45,
    borderWidth: 2,
    borderColor: 'grey',
    margin: 6,
    padding: 6
  },
  searchIcon: {
    height: 28,
    width: 28,
    marginRight: 6,
    alignSelf: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    height: 36,
    width: 36
  },
  separator: {
    height: 1,
    backgroundColor: '#CCC'
  },
});

module.exports = Search;