import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import { User, Message as MessageModel } from '../../src/models';
import { Ionicons } from '@expo/vector-icons';

const MessageReply = (props) => {
    const { message: propMessage } = props;
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [message, setMessage] = useState<MessageModel>(propMessage);

    const { width } = useWindowDimensions();

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        setMessage(propMessage);
    }, [propMessage]);

    useEffect(() => {
        const checkMe = async () => {
            if(!user){
                return;
            }
            const authUser = await Auth.currentAuthenticatedUser();
            setIsMe(user.id === authUser.attributes.sub);
        }
        checkMe();
    }, [user]);

    if(!user){
        return <ActivityIndicator />
    }

    return(
        <View 
        style={{ flexDirection: 'row' }}>
            <View
                style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>

                {message.image && (
                    <View style={{ 
                        marginTop: message.content ? 1 : 10,
                        marginBottom: message.content ? 10 : 0, 
                        borderWidth: message.content ? 1 : 0, 
                        borderColor: isMe ? 'white' : 'black',
                        borderRadius: 10,
                        alignItems: 'center',
                        overflow: 'hidden'
                         }} >
                            <S3Image imgKey={message.image} style={{ width: width * 0.5, aspectRatio: 4 / 3, }}
                            resizeMode='contain'/>
                    </View>
                )}

                <Text style={{color: isMe ? 'white' : 'black', fontSize: 12, }}>{ message.content }</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 10,
        marginBottom: 5,
    },
    leftContainer: {
        borderRadius: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
    },
    rightContainer: {
        backgroundColor: 'black',
        marginRight: 2,
        borderWidth: 1,
        borderColor: 'white',
    },
});

export default MessageReply;