// import { FontAwesome } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Colors from '../constants/Colors';
// import useColorScheme from '../hooks/useColorScheme';
// import ModalScreen from '../screens/ModalScreen';
// import NotFoundScreen from '../screens/NotFoundScreen';
// import TabTwoScreen from '../screens/TabTwoScreen';

// React and navigation setup
import React, { useEffect, useState } from 'react';
import { Text, ColorSchemeName, Pressable, View, Image, useWindowDimensions, ActivityIndicator } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// icon styling
import { Feather } from '@expo/vector-icons';

// all screens of the app
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

// required components
import ChatRoomHeader from './ChatRoomHeader';
import companyLogo from '../assets/images/img/icon_final.png';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

// backend
import { Auth, Hub } from 'aws-amplify';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [user, setUser] = useState(undefined);

  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
      setUser(authUser);
    } catch (e) {
      setUser(null);
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = (data) => {
      if(data.payload.event === 'signIn' || data.payload.event === 'signOut'){
        checkUser();
      }
    }

    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);

  if (user === undefined){
    return(
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color='red' />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerTitle: HomeHeader, headerBackVisible: false }} />
          <Stack.Screen 
            name="ChatRoom" 
            component={ChatRoomScreen} 
            options={({ route }) => ({ headerTitle: () => <ChatRoomHeader id={route.params?.id} /> })} />
            <Stack.Screen 
            name="UsersScreen" 
            component={UsersScreen} 
            options={{ title: 'Users' }} />
        </>
        
      ) : (
        <>
          <Stack.Screen 
            name="Sign In" 
            component={SignInScreen}
            options={{ headerTitle: AuthHeader, headerBackVisible: false }}/>
          <Stack.Screen 
            name="Create Account" 
            component={SignUpScreen}
            options={{ headerTitle: AuthHeader, headerBackVisible: false }}/>
          <Stack.Screen 
            name="Confirm Your Email" 
            component={ConfirmEmailScreen}
            options={{ headerTitle: AuthHeader, headerBackVisible: false }}/>
          <Stack.Screen 
            name="Forgot Password" 
            component={ForgotPasswordScreen}
            options={{ headerTitle: AuthHeader, headerBackVisible: false }}/>
          <Stack.Screen 
            name="Create New Password" 
            component={NewPasswordScreen}
            options={{ headerTitle: AuthHeader, headerBackVisible: false }}/>
        </>
      )}
    </Stack.Navigator>
  );
}

const HomeHeader = (props) => {

    const { width } = useWindowDimensions();
    const navigation = useNavigation();

    return(
        <View style={{
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          width, 
          paddingLeft: 0, 
          paddingRight: 15,
          alignItems: 'center', }}>
          <Image source={ {uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg' }}
            style={{ left: -3, width: 32, height: 32, borderRadius: 16, 
              // borderWidth: 1, 
              // borderColor: '#09ff00' 
            }}
          />
          <Text style={{
            color: 'white', 
            flex: 1, 
            textAlign: 'center', 
            marginLeft: 40, 
            fontWeight: 'bold', 
            fontSize: 20,
            }}>Chats</Text>
          <Feather name='camera' size={24} color='white' style={{marginHorizontal: 10, }}/>
          <Pressable onPress={() => navigation.navigate('UsersScreen') }>
            <Feather name='edit-2' size={24} color='white' style={{marginHorizontal: 10, }}/>
          </Pressable>
        </View>
    )
};

const AuthHeader = (props) => {

  const { width } = useWindowDimensions();

  return(
    <View style={{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      width: '100%',
      alignItems: 'center',
      }}>
        <Text style={{
          color: 'white',
          fontWeight: 'bold', 
          fontSize: 24,
          }}>{props.children}</Text>

          <Image source={ companyLogo }
          style={{ width: 30, height: 30, borderRadius: 2, borderWidth: 1, borderColor: '#1c1c1c', marginRight: 20, top: 2}}
        />
    </View>
  )
};