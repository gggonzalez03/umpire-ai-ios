import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View, Modal } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import base64 from 'react-native-base64'
import Base64Binary from '../helper_functions/base64_binary';
import ScoreBoard from '../components/ScoreBoard';
import CButton from '../components/CButton';
import KeepAwake from 'react-native-keep-awake';

const score_status_e = {
  GAME_ONGOING: 0,
  BLACK_WINS_GAME: 1,
  RED_WINS_GAME: 2,
  BLACK_WINS_MATCH: 3,
  RED_WINS_MATCH: 4,
  DEUCE: 5,
  BLACK_ADVANTAGE: 6,
  RED_ADVANTAGE: 7,
}

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
        current_status: null,
        black_match_score: null,
        red_match_score: null,
      },
      restart_match_command: 1,
      restart_game_command: 2,
      increment_black_score_command: 3,
      decrement_black_score_command: 4,
      increment_red_score_command: 5,
      decrement_red_score_command: 6,
      start_data_transfer_command: 7,
      collect_hit_data_command: 8,
      collect_non_hit_data_command: 9,
      stop_data_collection: 10,

      gameDoneModalVisible: false,
      matchDoneModalVisible: false,

      gamewinner: null,
      matchwinner: null
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

  incrementBlue = () => {
    this.writeToUmpireAI(this.state.ble_device, [this.state.increment_black_score_command])
	}

	decrementBlue = () => {
    this.writeToUmpireAI(this.state.ble_device, [this.state.decrement_black_score_command])
	}

	incrementRed = () => {
    this.writeToUmpireAI(this.state.ble_device, [this.state.increment_red_score_command])
	}

	decrementRed = () => {
    this.writeToUmpireAI(this.state.ble_device, [this.state.decrement_red_score_command])
	}

  setGameDoneModalVisible = (visible) => {
    this.setState({ gameDoneModalVisible: visible });
  }

  setMatchDoneModalVisible = (visible) => {
    this.setState({ matchDoneModalVisible: visible });
  }

  decideUIUpdate = (score_status) => {
    switch(score_status) {
      case score_status_e.GAME_ONGOING:
        break;
      case score_status_e.BLACK_WINS_GAME:
        this.setState({ gamewinner: "Blue"}, () => {
          this.setGameDoneModalVisible(true);
        })
        break;
      case score_status_e.RED_WINS_GAME:
        this.setState({ gamewinner: "Red"}, () => {
          this.setGameDoneModalVisible(true);
        })
        break;
      case score_status_e.BLACK_WINS_MATCH:
        this.setState({ matchwinner: "Blue"}, () => {
          this.setMatchDoneModalVisible(true);
        })
        break;
      case score_status_e.RED_WINS_MATCH:
        this.setState({ matchwinner: "Red"}, () => {
          this.setMatchDoneModalVisible(true);
        })
        break;
      case score_status_e.DEUCE:
        break;
      case score_status_e.BLACK_ADVANTAGE:
        break;
      case score_status_e.RED_ADVANTAGE:
        break;
    }
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
          server: rx_value[3] & 0x0F,
          current_status: rx_value[3] >> 4,
          black_match_score: rx_value[4],
          red_match_score: rx_value[5],
        } }, () => {
          this.decideUIUpdate(rx_value[0]);
        })
    })
  }

  async writeToUmpireAI(device, value) {
    const service = "4a220a7a-8094-435b-8b3e-b19682b41381"
    const rx_characteristic = "638b6661-6196-4efc-82f4-e90a59e6e8a3"

    await this.manager.writeCharacteristicWithResponseForDevice(device.id, service, rx_characteristic, base64.encodeFromByteArray(value))
      .then((e) => {
        console.log(e)
      })
  }

  render() {
    return (
      <View style={styles.maincontainer}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.gameDoneModalVisible}
          onRequestClose={() => {
            this.setGameDoneModalVisible(!this.state.gameDoneModalVisible);
          }}
        >
          <View style={styles.gamedonemodalcontainer}>
            <View style={styles.gamedonemodal}>
              <Text>{this.state.gamewinner} {"wins the game"}</Text>
              <CButton
                style={styles.controlbuttons}
                text={"Continue"}
                onPress={() => {
                  this.writeToUmpireAI(this.state.ble_device, [this.state.restart_game_command]);
                  this.setGameDoneModalVisible(!this.state.gameDoneModalVisible);
                }}
                selected={true}
                color={"#46c27a"}
              ></CButton>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.matchDoneModalVisible}
          onRequestClose={() => {
            this.setMatchDoneModalVisible(!this.state.matchDoneModalVisible);
          }}
        >
          <View style={styles.gamedonemodalcontainer}>
            <View style={styles.gamedonemodal}>
              <Text>{this.state.matchwinner} {"wins the match"}</Text>
              <CButton
                style={styles.controlbuttons}
                text={"Continue"}
                onPress={() => {
                  this.writeToUmpireAI(this.state.ble_device, [this.state.restart_match_command]);
                  this.setMatchDoneModalVisible(!this.state.matchDoneModalVisible);
                }}
                selected={true}
                color={"#46c27a"}
              ></CButton>
            </View>
          </View>
        </Modal>
        <ScoreBoard
          leftscore={this.state.game_state.black_score ? this.state.game_state.black_score : 0}
          rightscore={this.state.game_state.red_score ? this.state.game_state.red_score : 0}
          server={this.state.game_state.server ? this.state.game_state.server : 0}
          score_status={this.state.game_state.score_status ? this.state.game_state.score_status : 0}
          current_status={this.state.game_state.current_status ? this.state.game_state.current_status : 0}
          incrementBlue = {this.incrementBlue}
          decrementBlue = {this.decrementBlue}
          incrementRed = {this.incrementRed}
          decrementRed = {this.decrementRed}
        ></ScoreBoard>
        <View style={styles.matchscorescontainer}>
          <Text style={styles.matchscores}>{this.state.game_state.black_match_score}</Text>
          <Text style={styles.matchscores}>{this.state.game_state.red_match_score}</Text>
        </View>
        <View style={styles.controlbuttonscontainer}>
          <CButton
            style={styles.controlbuttons}
            text={"Reset Game"}
            onPress={() => this.writeToUmpireAI(this.state.ble_device, [this.state.restart_game_command])}
            selected={true}
            color={"#46c27a"}
          ></CButton>
          <CButton
            style={styles.controlbuttons}
            text={"Reset Match"}
            onPress={() => this.writeToUmpireAI(this.state.ble_device, [this.state.restart_match_command])}
            selected={true}
            color={"#46c27a"}
          ></CButton>
          <CButton
            style={styles.controlbuttons}
            text={"Collect Hit Data"}
            onPress={() => this.writeToUmpireAI(this.state.ble_device, [this.state.collect_hit_data_command])}
            selected={true}
            color={"#46c27a"}
          ></CButton>
          <CButton
            style={styles.controlbuttons}
            text={"Collect Non Hit Data"}
            onPress={() => this.writeToUmpireAI(this.state.ble_device, [this.state.collect_non_hit_data_command])}
            selected={true}
            color={"#46c27a"}
          ></CButton>
        </View>
        <Text style={{position: 'absolute', left: 20, top: 10}}>{this.state.ble_status}</Text>
        <KeepAwake/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  maincontainer: {
    display: 'flex',
    flex: 1,
  },
  controlbuttonscontainer: {
    position: 'absolute',
    bottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: "100%",
  },
  controlbuttons: {
    margin: 10,
  },
  matchscorescontainer: {
    position: 'absolute',
    top: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },
  matchscores: {
    fontSize: 50,
		color: "white",
    margin: 20
  },
  gamedonemodalcontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  gamedonemodal: {
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})

export default Home