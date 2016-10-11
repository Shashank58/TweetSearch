import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar
} from 'react-native';

class NavigationBar extends Component {
	render() {
		return (
			<View style={styles.container}>
				<StatusBar barStyle="light-content" />
				<View style={{ backgroundColor: 'lightblue', height: 20 }} />
				<View style={styles.navBar}>
					{this.props.children}
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		alignItems: 'stretch',
	},
	navBar: {
		flexDirection: 'row',
		height: 45,
		alignItems: 'center',
		backgroundColor: 'lightblue'
	},
})

NavigationBar.propTypes = {
	children: React.PropTypes.any
}

module.exports = NavigationBar;