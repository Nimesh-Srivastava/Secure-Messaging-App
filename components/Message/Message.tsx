import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, useWindowDimensions, Pressable } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import { User, Message as MessageModel } from '../../src/models';
import { Ionicons } from '@expo/vector-icons';
import MessageReply from '../MessageReply';

const Message = (props) => {
    const { setAsMessageReply, message: propMessage } = props;
    const [user, setUser] = useState<User | undefined>();
    const [isMe, setIsMe] = useState<boolean | null>(null);
    const [message, setMessage] = useState<MessageModel>(propMessage);
    const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(undefined);

    const { width } = useWindowDimensions();

    useEffect(() => {
        DataStore.query(User, message.userID).then(setUser);
    }, []);

    useEffect(() => {
        // console.log(propMessage);
        setMessage(propMessage);
    }, [propMessage]);

    useEffect(() => {
        if(message?.replyToMessageID){
            DataStore.query(MessageModel, message.replyToMessageID).then(setRepliedTo);
        }
    }, [message]);

    const fetchMessageReply = () => {

    }

    useEffect(() => {
        const subscription = DataStore.observe(MessageModel, message.id).subscribe(msg => {
            if(msg.model === MessageModel && msg.opType === 'UPDATE'){
                setMessage(message => ({...message, ...msg.element}))
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        setMsgAsRead();
    }, [isMe]);

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

    const setMsgAsRead = async () => {
        if(isMe === false && message.status !== 'READ'){
            await DataStore.save(MessageModel.copyOf(message, (updated) => {
                updated.status = 'READ';
            }));
        }
    }

    if(!user){
        return <ActivityIndicator />
    }

    return(
        <View 
        style={{ flexDirection: 'row' }}>
            <Pressable 
            onLongPress={setAsMessageReply}
            style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>

                {repliedTo && (
                    <MessageReply message={repliedTo} />
                )}

                {message.image && (
                    <View style={{ 
                        marginTop: message.content ? 0 : 1,
                        marginBottom: message.content ? 10 : 0, 
                        borderWidth: message.content ? 1 : 0, 
                        borderColor: isMe ? 'white' : 'black',
                        borderRadius: 10,
                        overflow: 'hidden' }} >
                            <S3Image imgKey={message.image} style={{ width: width * 0.6, aspectRatio: 4 / 3, }}
                            resizeMode='contain'/>
                    </View>
                )}

                <Text style={{color: isMe ? 'white' : 'black', fontSize: message.content ? 16 : 0, }}>
                    { message.content }
                </Text>
            </Pressable>
            
            { isMe && 
            !!message.status && 
            // message.status !== 'SENT' && 
            (<View style={{ alignSelf: 'flex-end', marginRight: 2, }} >
                <Ionicons name={message.status === 'SENT' ? 'checkmark' : 'checkmark-done'} 
                        size={15} 
                        color={message.status === 'DELIVERED' || message.status === 'SENT' ? 'white' : 'cyan'} />
            </View>)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 7,
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: '70%',
        // backgroundColor: 'red',
        // flexDirection: 'row',
    },
    leftContainer: {
        borderRadius: 10,
        borderBottomLeftRadius: 0,
        // backgroundColor: '#233cad',
        backgroundColor: 'white',
        marginLeft: 10,
        marginRight: 'auto',
        borderWidth: 1,
        borderColor: 'black',
        // borderColor: '#ff0000',
    },
    rightContainer: {
        borderBottomRightRadius: 0,
        backgroundColor: 'black',
        marginLeft: 'auto',
        marginRight: 2,
        borderWidth: 1,
        // borderColor: '#bfbfbf',
        borderColor: 'white',
    },
});

export default Message;