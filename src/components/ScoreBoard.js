import React, { Component } from 'react'
import { PixelRatio, StyleSheet, Text, View } from 'react-native';

class ScoreBoard extends Component {

	render() {
		const { server, current_status } = this.props
		const serving = current_status == 0 ? server : 2; // 2 means no one is currently serving
		console.log(serving)

    return (
      <View style={styles.maincontainer}>
				<View style={[styles.bluecorecontainer, serving == 1 ? styles.bluegrayed : {}]}>
					<Text style={styles.leftscore}>{this.props.leftscore}</Text>
				</View>
				<View style={[styles.redcorecontainer, serving == 0 ? styles.redgrayed : {}]}>
					<Text style={styles.rightscore}>{this.props.rightscore}</Text>
				</View>
      </View>
    )
  }
}
const redh = "#ff2957", redl = "#ff9999", blueh = "#297eff", bluel = "#99c2ff"
const styles = StyleSheet.create({
	maincontainer: {
		display: 'flex',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	bluecorecontainer: {
		display: 'flex',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: blueh
	},
	redcorecontainer: {
		display: 'flex',
		flex: 1,
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: redh
	},
	leftscore: {
		fontSize: 300,
		color: "white"
	},
	rightscore: {
		fontSize: 300,
		color: "white"
	},
	redgrayed: {
		backgroundColor: redl
	},
	bluegrayed: {
		backgroundColor: bluel
	}
})

export default ScoreBoard