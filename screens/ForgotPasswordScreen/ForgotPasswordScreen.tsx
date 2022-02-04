import React, {useState} from 'react';
import { Text, View, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useNavigation } from '@react-navigation/native';

import { useForm } from 'react-hook-form';

import { Auth } from 'aws-amplify';

const ForgotPasswordScreen = () => {

    const { control, handleSubmit } = useForm();
    const [loading, setLoading] = useState(false);

    const { height } = useWindowDimensions();

    const navigation = useNavigation();

    const onSendPressed = async (data) => {
        if (loading){
            return;
        }
        setLoading(true);
        try {
            await Auth.forgotPassword(data.username);
            setLoading(false);
            navigation.navigate('Create New Password');
        }catch(e) {
            Alert.alert('Error', e.message);
        }
    };

    const onBack = () => {
        // console.warn('back to sign in');

        navigation.navigate('Sign In');
    }

    return(
        <ScrollView>
        <View style={styles.container}>

            <CustomInput 
                name='username'
                control={control}
                placeholder='Enter username' 
                secureTextEntry={false}
                rules={{
                        required: 'Username is required',
                        minLength: {value: 3, message: 'Username should be of atleast 3 characters'},
                        maxLength: {value: 15, message: 'Username should not be of more than 15 characters'}
                    }
                }
            />
            
            <CustomButton text={loading ? 'Sending...' : 'Send code'} onPress={handleSubmit(onSendPressed)} btn='signin' cont='container' />

            <View style={styles.bottomContainer}>
                <CustomButton text='Back to Sign in >' onPress={onBack} btn='centBackSign' />
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
        marginTop: 20,
        justifyContent: 'center',
        // backgroundColor: '#1c1c1c',
    },
    bottomContainer: {
        width: '90%',
        marginTop: 40,
        justifyContent: 'center',
    },
    copyr: {
        color: 'grey',
        fontSize: 10,
        marginTop: 424,
    },
});

export default ForgotPasswordScreen;