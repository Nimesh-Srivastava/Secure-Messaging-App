import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import Message from '../components/Message';
import MessageInput from '../components/MessageInput';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoom, Message as MessageModel } from '../src/models';
import { SortDirection } from 'aws-amplify';

export default function ChatRoomScreen() {
    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
    const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(null);

    const route = useRoute();
    // const navigation = useNavigation();

    useEffect(() => {
        fetchChatRoom();
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [chatRoom]);

    useEffect(() => {
        const subscription = DataStore.observe(MessageModel).subscribe(msg => {
            if(msg.model === MessageModel && msg.opType === 'INSERT'){
                setMessages(existingMessages => [msg.element,...existingMessages])
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchMessages = async () => {
        if(!chatRoom){
            return;
        }
        const fetchedMessages = (await DataStore.query(MessageModel, message => message.chatroomID('eq', chatRoom.id),
            {sort: message => message.createdAt(SortDirection.DESCENDING)}
        ));
        setMessages(fetchedMessages);
    }

    const fetchChatRoom = async () => {
        if(!route.params?.id){
            return;
        }

        const chatRoom = await DataStore.query(ChatRoom, route.params.id);
        if(!chatRoom){
            console.error('ChatRoom not found');
        } else {
            setChatRoom(chatRoom);
        }
    }

    if(!chatRoom){
        return <ActivityIndicator />
    }

    return(
        <SafeAreaView style={styles.page}>
            <FlatList 
            data={messages}
            renderItem={({ item }) => (<Message message={item} 
            setAsMessageReply={() => setMessageReplyTo(item)}
            />)}
            inverted
            />
        
            <MessageInput chatRoom={chatRoom} messageReplyTo={messageReplyTo} removeMessageReplyTo={() => setMessageReplyTo(null)} />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        // backgroundColor: '#11291d',
        backgroundColor: 'black',
        paddingTop: 2,
        borderTopWidth: 1,
        borderColor: 'white',
    },
});