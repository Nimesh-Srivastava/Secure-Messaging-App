import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, FlatList, Pressable } from 'react-native';

import ChatRoomItem from '../components/ChatRoomItem';
// import Users from '../assets/dummy-data/Users';
import UsersItem from '../components/UsersItem';
import { User } from '../src/models';
import NewGroupButton from '../components/NewGroupButton';

import { useNavigation } from '@react-navigation/native';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';

export default function UsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   DataStore.query(User).then(setUsers);
  //   console.log(User);
  // }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const myData = await Auth.currentAuthenticatedUser();

      const fetchedUsers = (await DataStore.query(User))
        .filter(User => User.id !== myData.attributes.sub);
      setUsers(fetchedUsers);
    };
    fetchUsers();
  }, []);

  return (
    <View style={styles.page}>
      <FlatList 
        data={users}
        renderItem={({ item }) => <UsersItem user={item}/> }
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={NewGroupButton}
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
