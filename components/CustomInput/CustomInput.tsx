import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

import { Controller } from 'react-hook-form';

const CustomInput = ({ control, rules={}, name, placeholder, secureTextEntry }) => {
    return(
        <Controller 
            control={control}
            rules={rules}
            name={name}
            render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
                <>
                    <View style={[styles.container, {borderColor: error ? 'red' : 'grey'}]}>
                        <TextInput 
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            placeholderTextColor='grey'
                            style={styles.inputStyle}
                            secureTextEntry={secureTextEntry}
                        />
                    </View>
                    {error && (<Text style={{color: 'red', fontSize: 10,}}>{error.message || Error}</Text>)}
                </>
            )}
        />
    )
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
        width: '90%',
        backgroundColor: '#1c1c1c',
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
    },
    inputStyle: {
        fontSize: 16,
        color: 'white',
    },
});

export default CustomInput;