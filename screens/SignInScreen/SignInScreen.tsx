import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView, Alert, TextInput } from 'react-native';

import Logo from '../../assets/images/img/newIconWhite.png';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';

import { Auth } from 'aws-amplify';

const SignInScreen = () => {
    
    const { control, handleSubmit, formState: {errors} } = useForm();

    const [loading, setLoading] = useState(false);
    const { height } = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = async data => {
        if (loading){
            return;
        }
        setLoading(true);
        try {
            await Auth.signIn(data.username, data.password);
        }catch(e) {
            Alert.alert('Error', e.message);
        }
        navigation.navigate('Home');
        setLoading(false);
    };

    const onForgotPassword = () => {
        // console.warn('Forgot password');

        navigation.navigate('Forgot Password');
    }

    const onGoogle = () => {
        console.warn('Google Sign in pressed');
    }

    const onFacebook = () => {
        console.warn('Facebook Sign In');
    }

    const onSignUpPressed = () => {
        // console.warn('Sign Up');

        navigation.navigate('Create Account');
    }

    return(
        <ScrollView>
        <View style={styles.container}>
            <Image source={Logo} style={[styles.img, {height: height * 0.2}]} resizeMode='contain' />
            
            <CustomInput placeholder='Username' name='username' control={control} rules={{required: 'Username is required'}} />
            
            <CustomInput 
            placeholder='Password' 
            name='password' 
            control={control} 
            secureTextEntry 
            rules={{required: 'Password is required',
                minLength: {value: 6, message: 'Password should be atleast 6 characters long'}}} />
            
            <CustomButton text={loading ? 'Loading...' : 'Log In'} onPress={handleSubmit(onSignInPressed)} btn='signin' cont='container' />
            
            <CustomButton text='Forgot password?' onPress={onForgotPassword} btn='forgot' cont='container' />

            <Text style={styles.or}>-- OR --</Text>

            <CustomButton text='Sign in with Google' onPress={onGoogle} btn='google' cont='container' />
            <CustomButton text='Sign in with Facebook' onPress={onFacebook} btn='facebook' cont='container' />

            <View style={styles.bottomContainer}>
                <Text style={styles.text}>Don't have an account? </Text>
                <CustomButton text="Create one" onPress={onSignUpPressed} btn='signup' />
            </View>

            <Text style={styles.copyr}>{'\u00A9'} AIRF Inc., 2022</Text>
        </View>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center',
        // backgroundColor: 'black',
    },
    img: {
        width: '45%',
        maxWidth: 400,
        maxHeight: 400,
        marginBottom: 15,
        // backgroundColor: 'white',
    },
    text: {
        color: 'white',
    },
    or: {
        color: 'orange',
        fontSize: 20,
        fontWeight: 'bold',
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginTop: 25,
    },
    copyr: {
        color: 'grey',
        fontSize: 10,
        marginTop: 33,
    },
});

export default SignInScreen;