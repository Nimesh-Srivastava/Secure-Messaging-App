import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, FlatList, Pressable } from 'react-native';

import ChatRoomItem from '../components/ChatRoomItem';
import chatRoomsData from '../assets/dummy-data/ChatRooms';
import { ChatRoom, ChatRoomUser } from '../src/models';

import { useNavigation } from '@react-navigation/native';

import { Auth, DataStore } from 'aws-amplify';

export default function HomeScreen() {

  const [loading, setLoading] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  // const navigation = useNavigation();

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
          .filter(ChatRoomUser => ChatRoomUser.user.id === userData.attributes.sub)
          .map(chatRoomUser => chatRoomUser.chatRoom);
      
      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);

  const logout = () => {
    Auth.signOut();
  }

  return (
    <View style={styles.page}>
      <Pressable onPress={logout} style={{ height: 40, margin: 10, borderRadius: 25, backgroundColor: 'brown', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{ color: 'white', fontWeight: 'bold'}}>LOGOUT</Text>
      </Pressable>

      <FlatList 
        data={chatRooms}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item}/> }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
});
