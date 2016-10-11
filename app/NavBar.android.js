import React, { Component } from 'react';
import {
	StyleSheet,
  View,
  Text,
  StatusBar
} from 'react-native';

class NavigationBar extends Component {
	render() {
		return (
			<View style={styles.container}>
				<StatusBar
					backgroundColor= 'lightblue'
					/>
				<View style={styles.navBar}>
					{this.props.children}
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'stretch',
		height: 55
	},
	navBar: {
		flexDirection: 'row',
		height: 55,
		alignItems: 'center',
		backgroundColor: 'lightblue',
		elevation: 4
	}
})

NavigationBar.propTypes = {
	children: React.PropTypes.any
}

module.exports = NavigationBar;