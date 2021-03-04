import React, { Component } from 'react'
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

class ScoreBoard extends Component {

	render() {
		const { server } = this.props
    return (
      <View style={styles.maincontainer}>
				<View style={[styles.leftscorecontainer, server ? styles.grayedoutblue : {}]}>
					<Text style={styles.leftscore}>{this.props.leftscore}</Text>
				</View>
				<View style={[styles.rightcorecontainer, server ? {} : styles.grayedoutred]}>
					<Text style={styles.rightscore}>{this.props.rightscore}</Text>
				</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
	maincontainer: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	leftscorecontainer: {
		display: 'flex',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#12b8ff'
	},
	rightcorecontainer: {
		display: 'flex',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#ff5e74'
	},
	leftscore: {
		fontSize: 300,
		color: "white"
	},
	rightscore: {
		fontSize: 300,
		color: "white"
	},
	grayedoutred: {
		backgroundColor: '#ff8f98'
	},
	grayedoutblue: {
		backgroundColor: "#99ddff"
	}
})

export default ScoreBoard