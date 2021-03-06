import {
  Button,
  Text,
  View,
  Image,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  NetInfo,
} from 'react-native';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import EStyleSheet from 'react-native-extended-stylesheet';

import Controllers from '../controller/controller.js';
import myAlert from '../components/myAlert.js';


export default class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      showAlert: false,
      title: '',
      msg: ''
    }
  }


  static navigationOptions = {
    headerTransparent: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'change',
      this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ isConnected }); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'change',
      this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  };

  showAlert = (title, msg) => {
    this.setState({
      ...this.state,
      showAlert: true,
      title,
      msg
    });
  }

  onLoginPressed() {
    // Validation
    if (this.state.isConnected) {
      if (validateEmail(this.state.email, this.showAlert)
        && validateFilled(this.state.password, this.showAlert)) {
        this.loginUser();
      }
    }

    else {
      this.showAlert('ERROR', 'Connect to internet please!');
    }
  }

  loginUser() {
    let url = 'http://69778130.ngrok.io/'

    fetch(url + 'login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then((response) => response.json())
      .then((responseJson) => {
        this.showAlert('', responseJson.message);
        if (responseJson.error == false) {
          this.props.navigation.navigate('_HomeScreen');
        }
      });
  }

  renderMyAlert = (showAlert, title, msg) => (
    myAlert({ showAlert, title, msg, onDismiss: () => this.setState({ ...this.state, showAlert: false }) })
  )


  render() {
    const { showAlert, title, msg } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>

        <View
          style={styles.loginPageTop}>
          <Image
            source={require('../img/logo_top.png')}
            style={styles.loginPageLogo}
          />

        </View>

        <View style={styles.loginPageMiddle} >
          <TextInput
            style={styles.input}
            placeholder='Email'
            underlineColorAndroid='transparent'
            keyboardType="email-address"
            onChangeText={(text) => this.setState({ email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({ password: text })}
          />
        </View>

        <KeyboardAvoidingView style={styles.loginPageBottom} behavior='position'>
          <TouchableHighlight
            onLongPress={() => this.props.navigation.navigate('_HomeScreen')}
            onPress={this.onLoginPressed.bind(this)}
            style={styles.button}
            underlayColor='#1E90FF'>
            <Text style={styles.buttonText}>
              Login
                </Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={() => this.props.navigation.navigate('_Register')}
            style={styles.button}
            underlayColor='#1E90FF'>
            <Text style={styles.buttonText}>
              Register
                </Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>

        {this.renderMyAlert(showAlert, title, msg)}

      </KeyboardAvoidingView>
    )
  }
}



const styles = EStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F0FFFF',
  },

  loginPageTop: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
  },

  loginPageLogo: {
    width: 150,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },

  loginPageMiddle: {
    flex: 5,
    justifyContent: 'center',
  },

  loginPageBottom: {
    flex: 3.5,
    justifyContent: 'center'
  },

  input: {
    alignSelf: 'stretch',
    height: 50,
    margin: 10,
    marginHorizontal: 15,
    padding: 3,
    textAlign: 'center',
    fontSize: 18,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#00BFFF',
  },

  button: {
    height: 50,
    margin: 5,
    marginHorizontal: 13,
    borderRadius: 25,
    alignSelf: 'stretch',
    justifyContent: 'center',
    backgroundColor: '#00BFFF',
  },

  buttonText: {
    fontSize: 22,
    color: '#FFFFFF',
    alignSelf: 'center'
  },

  errorText: {
    fontSize: 14,
    color: '#1DBC5C',
    alignSelf: 'center',
  }
});