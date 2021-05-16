import React, { Component } from 'react'
import { StyleSheet, Text, View, Image } from 'react-native';

class CCircleButton extends Component {

  state = {
      selected: false,
  }

  onPress = () => {
    this.setState({ selected: this.state.selected }, () => {
      if (this.props.onPress)
        this.props.onPress(this.state.selected);
    })
  }

  render() {

    let { style, onPress, activecolor, inactivecolor, image, imagestyle } = this.props
    let { selected } = this.state
    return (
      <View
        style={[styles.buttonContainer, {backgroundColor: selected == 1 ? activecolor : "white", borderColor: selected == 1 ? activecolor : inactivecolor}, style]}
        onTouchEnd={this.onPress}>
          <Image style={[styles.image, {tintColor: selected == 1 ? "white" : inactivecolor}, imagestyle]} source={image}></Image>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 1.5 * 14, 
        padding: 14,
        height: 2.5 * 14,
        width: 2.5 * 14,
    },
    image: {
        height: 14,
        width: 14,
        borderRadius: 14,
    }
})

export default CCircleButton