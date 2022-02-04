import React, {useState} from 'react';
import { Text, View, Image, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useNavigation } from '@react-navigation/native';

import { useForm } from 'react-hook-form';

import { Auth } from 'aws-amplify';

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const SignUpScreen = () => {    
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, watch } = useForm();

    const pwd = watch('password');

    // const [username, setUsername] = useState('');
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [passwordRepeat, setPasswordRepeat] = useState('');

    const { height } = useWindowDimensions();

    const navigation = useNavigation();

    const onRegisterPressed = async(data) => {

        if (loading){
            return;
        }

        setLoading(true);

        const { username, password, email, name } = data;

        try {
            await Auth.signUp({
                username,
                password,
                attributes: {email, name, preferred_username: username},
            });
        } catch (e) {
            Alert.alert('Error', e.message);
        }
        navigation.navigate('Confirm Your Email', {username});
        setLoading(false);
    }

    const onGoogle = () => {
        console.warn('Google Sign in pressed')
    }

    const onFacebook = () => {
        console.warn('Facebook Sign In')
    }

    const onSignInPressed = () => {
        console.warn('Sign In');

        navigation.navigate('Sign In');
    }

    const onTerms = () => {
        console.warn('Terms of use');
    }

    const onPrivacy = () => {
        console.warn('privacy policy');
    }

    return(
        <ScrollView>
        <View style={styles.container}>

            <CustomInput 
                name='name'
                control={control}
                placeholder='Full Name'
                secureTextEntry={false}
                rules={{
                        required: 'Name of user is required',
                        minLength: {value: 3, message: 'Name should be of atleast 3 characters'},
                        maxLength: {value: 50, message: 'Name should not exceed 50 characters'}
                    }
                }
            />

            <CustomInput 
                name='username'
                control={control}
                placeholder='Username'
                secureTextEntry={false}
                rules={{
                        required: 'Username is required',
                        minLength: {value: 3, message: 'Username should be of atleast 3 characters'},
                        maxLength: {value: 15, message: 'Username should not be of more than 15 characters'}
                    }
                }
            />

            <CustomInput 
                name='email'
                control={control}
                placeholder='Email' 
                secureTextEntry={false}
                rules={{
                        required: 'Email is required',
                        pattern: {value: EMAIL_REGEX, message: 'Invalid email'},
                    }
                }
            />

            <CustomInput 
                name='password'
                control={control}
                placeholder='Password' 
                secureTextEntry
                rules={{
                        required: 'Password is required',
                        minLength: {value: 6, message: 'Password should have atleast 6 characters, including 1 number'},
                    }
                }
            />

            <CustomInput 
                name='confirm-password'
                control={control}
                placeholder='Confirm password' 
                secureTextEntry 
                rules={{
                        validate: value =>
                            value==pwd || 'Passwords do not match',
                    }
                }
            />
            
            <CustomButton text={loading ? 'Loading...' : 'Register'} onPress={handleSubmit(onRegisterPressed)} btn='signin' cont='container' />

            <Text style={styles.terms}>By registering, you accept our{' '}
            <Text style={styles.link} onPress={onTerms}>Terms of Use</Text> and{' '}
            <Text style={styles.link} onPress={onPrivacy}>Privacy Policy.</Text></Text>

            <Text style={styles.or}>Skip registration with following :</Text>

            <CustomButton text='Sign in with Google' onPress={onGoogle} btn='google' cont='container' />
            <CustomButton text='Sign in with Facebook' onPress={onFacebook} btn='facebook' cont='container' />

            <View style={styles.bottomContainer}>
                <Text style={styles.text}>Have an account? </Text>
                <CustomButton text="Sign in" onPress={onSignInPressed} btn='signup' />
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
        flex: 1,
        height: '100%',
        // backgroundColor: '#1c1c1c',
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    terms: {
        color: 'lightgrey',
        fontSize: 13,
        width: '90%',
        marginTop: 15,
    },
    link: {
        // color: '#FDB075',
        color: 'orange',
    },
    text: {
        color: 'white',
    },
    or: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 35,
    },
    bottomContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
    },
    copyr: {
        color: 'grey',
        fontSize: 10,
        marginTop: 30,
    },
});

export default SignUpScreen;