/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import "reflect-metadata";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
} from 'react-native';
import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';
import { Button } from '@rneui/base';
import { registerDependencies, registerCoreDependencies } from '@di/module/Core';

registerDependencies();
registerCoreDependencies();

import { getBankAccounts } from '@core/api/mobileClient';
import { ErrorResponse } from '@core/exception';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
 
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Button onPress={() => networkCall()}>
            Click Me
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const networkCall = () => {
  console.log('Btn click: ');
  // signIn({ username: 'admin', password: 'admin' }).then(res => 
  //   console.log('final signIn resquest res: ' + res)
  // ).catch((err:ErrorResponse) => 
  //   console.log('actual signIn error: ' + errerr.errors)
  // );
  getBankAccounts().then(res => 
    console.log('final getBankAccounts resquest res: ' + JSON.stringify(res))
  ).catch((err: ErrorResponse) => 
    console.log('actual getBankAccounts error: ', err.errors)
  );
}


export default App;
