import React, { Component } from 'react'
import { PixelRatio, StyleSheet, Text, View } from 'react-native';
import CCircleButton from './CCircleButton';

class ScoreBoard extends Component {


	render() {
		const { server, current_status, incrementBlue, decrementBlue, incrementRed, decrementRed } = this.props
		const serving = current_status == 0 ? server : 2; // 2 means no one is currently serving
		console.log(serving)

    return (
      <View style={styles.maincontainer}>
				<View style={[styles.bluecorecontainer, serving == 1 ? styles.bluegrayed : {}]}>
					<CCircleButton
						image={require('./icons/up_arrow.png')}
						inactivecolor={"gray"}
						onPress={incrementBlue}
					></CCircleButton>
					<Text style={styles.leftscore}>{this.props.leftscore}</Text>
					<CCircleButton
						image={require('./icons/down_arrow.png')}
						inactivecolor={"gray"}
						onPress={decrementBlue}
					></CCircleButton>
				</View>
				<View style={[styles.redcorecontainer, serving == 0 ? styles.redgrayed : {}]}>
					<CCircleButton
						image={require('./icons/up_arrow.png')}
						inactivecolor={"gray"}
						onPress={incrementRed}
					></CCircleButton>
					<Text style={styles.rightscore}>{this.props.rightscore}</Text>
					<CCircleButton
						image={require('./icons/down_arrow.png')}
						inactivecolor={"gray"}
						onPress={decrementRed}
					></CCircleButton>
				</View>
      </View>
    )
  }
}
const redh = "#ff2957", redl = "#9c9c9c", blueh = "#297eff", bluel = "#9c9c9c"
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
		backgroundColor: redh,
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