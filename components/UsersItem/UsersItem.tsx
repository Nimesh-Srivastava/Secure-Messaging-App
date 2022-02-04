import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Auth, DataStore } from 'aws-amplify';

import styles from './styles';

import { ChatRoom, User, ChatRoomUser } from '../../src/models';

export default function UsersItem({ user }) {

  const navigation = useNavigation();

  const onPress = async () => {
    //create a chatRoom with new user
    const newChatRoom = await DataStore.save(new ChatRoom({newMessages: 0}));

    //connect authenticated user with chatroom
    const authUser = await Auth.currentAuthenticatedUser();
    const dbUser = await DataStore.query(User, authUser.attributes.sub);
    await DataStore.save(new ChatRoomUser({
      user: dbUser,
      chatRoom: newChatRoom,
    }));

    //connect pressed user with chatroom
    await DataStore.save(new ChatRoomUser({
      user,
      chatRoom: newChatRoom,
    }));

    navigation.navigate('ChatRoom', { id: newChatRoom.id });
  }

    return (
        <Pressable onPress={onPress} style={styles.container}>
        <Image 
          source = {{ uri: user.imageUri }} 
          style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{ user.name }</Text>
          </View>
        </View>
      </Pressable>
    );
}