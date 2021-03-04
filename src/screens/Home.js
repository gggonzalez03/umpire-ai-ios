import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode, encode } from 'base-64'
import Base64Binary from '../helper_functions/base64_binary';

class Home extends Component {
  constructor() {
    super()
    this.manager = new BleManager()
    this.state = {
      ble_device: {},
      ble_status: "",
      game_state: {
        score_status: null,
        black_score: null,
        red_score: null,
        server: null,
      },
    };
  }

  componentWillMount() {
      if (Platform.OS === 'ios') {
          this.manager.onStateChange((state) => {
              if (state === 'PoweredOn') this.scanAndConnect()
          })
      } else {
          this.scanAndConnect()
      }
  }

  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      
      if (error) {
        return
      }

      

      if (device.name === 'UmpireAI') {
        this.setState({ ble_status: "Connecting device"})
        this.manager.stopDeviceScan()
        device.connect()
          .then((device) => {
            this.setState({ ble_status: "Discovering services and characteristics"})
            return device.discoverAllServicesAndCharacteristics()
          })
          .then((device) => {
            this.setState({ ble_status: "Setting Notifications"})
            return this.readFromUmpireAI(device)
          })
          .then(() => {
            this.setState({ ble_status: "Listening...", ble_device: device })
          }, (error) => {
            return
          })
      }
    });
  }

  async readFromUmpireAI(device) {
    const service = "4a220a7a-8094-435b-8b3e-b19682b41381"
    const rx_characteristic = "638b6661-6196-4efc-82f4-e90a59e6e8a3"
    const tx_characteristic = "30ab87d1-2e52-4874-a519-888c6fc54bcc"

    device.monitorCharacteristicForService(service, tx_characteristic, (error, characteristic) => {
        if (error) {
          console.log(error)
          return
        }
        
        var rx_value = Base64Binary.decode(characteristic.value);

        this.setState({ game_state: {
          score_status: rx_value[0],
          black_score: rx_value[1],
          red_score: rx_value[2],
          server: rx_value[3],
        } })
    })
  }

  async writeToUmpireAI(device) {
    const service = "4a220a7a-8094-435b-8b3e-b19682b41381"
    const rx_characteristic = "638b6661-6196-4efc-82f4-e90a59e6e8a3"

    await this.manager.writeCharacteristicWithResponseForDevice(device.id, service, rx_characteristic, encode("ABCDE"))
      .then((e) => {
        console.log(e)
      })
  }

  render() {
    return (
      <View style={styles.maincontainer}>
        <Text>{this.state.ble_status}</Text>
        <Text>Status: {this.state.game_state.score_status}</Text>
        <Text>Black Score: {this.state.game_state.black_score}</Text>
        <Text>Red Score: {this.state.game_state.red_score}</Text>
        <Text>Server: {this.state.game_state.server}</Text>
        <Text onPress={() => this.writeToUmpireAI(this.state.ble_device)}>Send Hello</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Home