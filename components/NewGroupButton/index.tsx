import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const NewGroupButton = () => {
    return (
        <Pressable style={{ 
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginTop: 5,
            // backgroundColor: 'green',
            }}>
            <View style={{ 
                flexDirection: 'row',
                paddingVertical: 4,
                alignItems: 'center',
                justifyContent: 'center',
                marginVertical: 10,
                // backgroundColor: '#303030',
                width: '60%',
                borderRadius: 10,
                borderWidth: 1,
                borderColor: 'red',
             }}>
                <FontAwesome  name='group' size={25} color={'white'} style={{ 
                    borderRightWidth: 2,
                    borderColor: 'red',
                    paddingRight: 10,
                 }} />

                <Text style={{ 
                    color: 'white',
                    paddingLeft: 7,
                    fontSize: 17,
                    fontWeight: 'bold',
                    }}>
                    Create New Group
                </Text>
            </View>
        </Pressable>
    )
}

export default NewGroupButton;