import React, {useState} from 'react';
import { Text, View, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { useRoute } from '@react-navigation/native';

import { Auth } from 'aws-amplify';

const ConfirmEmailScreen = () => {

    const route = useRoute();

    const { control, handleSubmit, watch } = useForm({defaultValues: {username: route?.params?.username}});
    const { height } = useWindowDimensions();
    const navigation = useNavigation();

    const username = watch('username');

    const [loading, setLoading] = useState(false);

    const onConfirmPressed = async(data) => {

        if (loading){
            return;
        }

        setLoading(true);

        try {
            await Auth.confirmSignUp(data.username, data.code);
        } catch (e) {
            Alert.alert('Error', e.message);
        }
        navigation.navigate('Sign In');
        setLoading(false);
    }

    const onResend = async () => {
        if (loading){
            return;
        }
        setLoading(true);

        try {
            await Auth.resendSignUp(username);
            Alert.alert('Success', 'Code was resent to your email');
        } catch (e) {
            Alert.alert('Error', e.message);
        }

        setLoading(false);
    }

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
                placeholder='Username' 
                secureTextEntry={false}
                rules={{
                        required: 'Username is required',
                    }
                }
            />

            <CustomInput 
                name='code'
                control={control}
                placeholder='Enter security code from email' 
                secureTextEntry={false}
                rules={{
                        required: 'Code is required',
                    }
                }
            />
            
            <CustomButton text={loading ? 'Loading...' : 'Confirm'} onPress={handleSubmit(onConfirmPressed)} btn='signin' cont='container' />

            <View style={styles.bottomContainer}>
                <CustomButton text='Resend code' onPress={onResend} btn='resend' />
                
                <CustomButton text='Back to Sign in >' onPress={onBack} btn='backSign' />
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
    },
    bottomContainer: {
        width: '90%',
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    copyr: {
        color: 'grey',
        fontSize: 10,
        marginTop: 415,
    },
});

export default ConfirmEmailScreen;