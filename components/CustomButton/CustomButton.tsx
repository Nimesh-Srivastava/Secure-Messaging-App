import React from 'react';
import { Text, StyleSheet, Pressable } from 'react-native';

const CustomButton = ({ onPress, text, btn, cont }) => {
    return(
        <Pressable onPress={onPress} style={styles[`${cont}`]}>
            <Text style={styles[`${btn}`]}>{text}</Text>
        </Pressable>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 5,
        alignItems: 'center',
        // textAlign: 'center',
    },
    signin:{
        color: 'white',
        fontSize: 16,
        backgroundColor: '#363636',
        width: '90%',
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginTop: 5,
    },
    forgot: {
        marginTop: 10,
        marginBottom: 20,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    google: {
        color: '#dd4d44',
        fontSize: 16,
        backgroundColor: '#fae9ea',
        fontWeight: 'bold',
        width: '90%',
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 2,
    },
    facebook: {
        color: '#4765A9',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: '#e7eaf4',
        width: '90%',
        padding: 10,
        textAlign: 'center',
        borderRadius: 5,
        marginTop: 2,
        marginBottom: 10,
    },
    signup: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#ff3c00',
    },
    resend: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
        backgroundColor: 'orange',
        paddingHorizontal: 5,
        borderRadius: 5,
    },
    backSign: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'orange',
    },
    centBackSign: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'orange',
        textAlign: 'center',
    }
})

export default CustomButton;