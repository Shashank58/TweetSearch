import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  ListView,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import NavBar from './NavBar';

const Buffer = require('buffer/').Buffer;
const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
});

class Search extends Component {

  constructor(props) {
    super(props);
    this.fetchTweets = this.fetchTweets.bind(this);
    this.state = {
      loading: false,
      searchQuery: '',
      dataSource: ds.cloneWithRows([])
    };
  }

  searchResults(tweet, sectionID, rowID) {
    return(
      <View style={{ flexDirection: 'row' }}>
      <Image source={{ uri: tweet.user.profile_image_url_https }} style={styles.profilePic} />
      <View style={{ flexDirection: 'column' }}>
        <Text>{tweet.user.screen_name}</Text>
        <Text>{tweet.text}</Text>
      </View>
    </View>
    );
  }

  searchTweets() {
    let credentials = new Buffer('JLUkNqnadVdBHXBdSquJLUbcO' + ':' +
      'FbAeLWvmYjViphrHE5DnexbwOlGtDyi4KRjFh7zDEzLWMrMMyU').toString('base64');
    //'JLUkNqnadVdBHXBdSquJLUbcO:FbAeLWvmYjViphrHE5DnexbwOlGtDyi4KRjFh7zDEzLWMrMMyU';
    fetch('https://api.twitter.com/oauth2/token', {
      method: 'POST',
      headers: {
        "Authorization": "Basic " + credentials,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: "grant_type=client_credentials"
    })
      .then(response => response.json())
      .then(result => { this.fetchTweets(result.access_token) })
      .catch((error) => { console.error(error); });
  }

  fetchTweets(bearerToken) {
    that = this;
    let url = 'https://api.twitter.com/1.1/search/tweets.json?q=' + this.state.searchQuery;
    fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + bearerToken
      }
    })
      .then(response => response.json())
      .then(result => that.setState({ dataSource: ds.cloneWithRows(result.statuses) }))
      .catch((error) => { console.error(error); });
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar />
        <View style={styles.searchContainer}>
          <TextInput
            placeholder='Enter hashtag'
            onChangeText={text => this.setState({ searchQuery: text })}
            style={styles.searchInput}
            />
          <TouchableOpacity onPress={this.searchTweets.bind(this)}>
            <Image source={require('../images/ic_search.png')} style={styles.searchIcon} />
          </TouchableOpacity>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.searchResults.bind(this)}
          enableEmptySections={true}
          />
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
  }
});

module.exports = Search;