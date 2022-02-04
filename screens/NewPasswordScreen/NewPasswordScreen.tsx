import React, {useState} from 'react';
import { Text, View, StyleSheet, useWindowDimensions, ScrollView, Alert } from 'react-native';

import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

import { useNavigation } from '@react-navigation/native';

import { useForm } from 'react-hook-form';

import { Auth } from 'aws-amplify';

const NewPasswordScreen = () => {
    const { control, handleSubmit, watch } = useForm();
    const { height } = useWindowDimensions();
    const navigation = useNavigation();
    const pwd = watch('password');
    const [loading, setLoading] = useState(false);

    const onSubmitPressed = async data => {
        if (loading){
            return;
        }
        setLoading(true);
        try {
            await Auth.forgotPasswordSubmit(data.username, data.code, data.password);
            navigation.navigate('Sign In');
        }catch(e) {
            Alert.alert('Error', e.message);
        }
        setLoading(false);
    };

    const onBack = () => {
        navigation.navigate('Sign In');
    };

    return(
        <ScrollView>
        <View style={styles.container}>
            <CustomInput 
                name='username'
                control={control}
                placeholder='Username' 
                secureTextEntry={false}
                rules={{required: 'Username is required'}}
            />
            <CustomInput 
                name='code'
                control={control}
                placeholder='Code' 
                secureTextEntry={false}
                rules={{required: 'Security code from Email is required'}}
            />
            <CustomInput 
                name='password'
                control={control}
                placeholder='Enter new password' 
                secureTextEntry={false}
                rules={{required: 'Password is required'}}
            />
            <CustomInput 
                name='confirm-password'
                control={control}
                placeholder='Confirm new password' 
                secureTextEntry={false}
                rules={{
                    validate: value =>
                        value==pwd || 'Passwords do not match',
                    }
                }
            />
            
            <CustomButton text={loading ? 'Loading...' : 'Submit'} onPress={handleSubmit(onSubmitPressed)} btn='signin' cont='container' />

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
        marginTop: 375,
    },
});

export default NewPasswordScreen;