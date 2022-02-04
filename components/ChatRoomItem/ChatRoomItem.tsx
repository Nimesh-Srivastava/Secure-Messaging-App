import React, { useState, useEffect } from 'react';
import { Text, View, Image, Pressable, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { DataStore } from '@aws-amplify/datastore';
import { ChatRoomUser, User, Message } from '../../src/models';
import { Auth } from 'aws-amplify';
import moment from 'moment';

import styles from './styles';

export default function ChatRoomItem({ chatRoom }) {
  const [user, setUser] = useState<User | null>(null);
  const [lastMessage, setLastMessage] = useState<Message | undefined>();
  const navigation = useNavigation();

  useEffect(() => {
      const fetchUsers = async () => {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.chatRoom.id === chatRoom.id).map(chatRoomUser => chatRoomUser.user);

        // setUsers(fetchedUsers);
        const authUser = await Auth.currentAuthenticatedUser();
        setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
      }
      fetchUsers();
  }, []);

  useEffect(() => {
    if(!chatRoom.chatRoomLastMessageId){
      return;
    }
    DataStore.query(Message, chatRoom.chatRoomLastMessageId).then(setLastMessage);
  }, []);

  const onPress = () => {
    navigation.navigate('ChatRoom', { id: chatRoom.id });
  }

  if (!user){
    return <ActivityIndicator size="large" color='red' />
  }

  const time = moment(lastMessage?.createdAt ? lastMessage.createdAt : null).from(moment());

    return (
        <Pressable onPress={onPress} style={styles.container}>
        <Image 
          source = {{ uri: user.imageUri }} 
          style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{ user.name }</Text>
            <Text style={styles.timeText}>{ time }</Text>
          </View>
          <Text numberOfLines={1} style={styles.messText}>{ lastMessage?.content ? lastMessage.content : lastMessage?.image? 'Image' : 'N/A' }</Text>
          
          {!!chatRoom.newMessages && <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{ chatRoom.newMessages }</Text>
          </View>}

        </View>
      </Pressable>
    );
}