import React, { useState, useEffect } from 'react';
import { View, Image, Text, useWindowDimensions, StyleSheet } from 'react-native';
import { Ionicons, AntDesign, SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';

import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { User, ChatRoomUser } from '../src/models';

const ChatRoomHeader = ({ id, children }) => {
    const [user, setUser] = useState<User | null>(null);
    
    const { width } = useWindowDimensions();
  
    useEffect(() => {
        if(!id){
            return;
        }
        const fetchUsers = async () => {
          const fetchedUsers = (await DataStore.query(ChatRoomUser))
          .filter(chatRoomUser => chatRoomUser.chatRoom.id === id)
          .map(chatRoomUser => chatRoomUser.user);
  
          // setUsers(fetchedUsers);
          const authUser = await Auth.currentAuthenticatedUser();
          setUser(fetchedUsers.find(user => user.id !== authUser.attributes.sub) || null);
        }
        fetchUsers();
    }, []);

    const getLastOnlineText = () => {
        if(!user?.lastOnlineAt){
            return 'ERROR : Missing Value';
        }
        const lastOnlineDiff = moment().diff(moment(user.lastOnlineAt));
        if(lastOnlineDiff < 5 * 60 * 1000){ 
            return 'online';
        } else {
          return `Last seen ${moment(user.lastOnlineAt).fromNow()}`;
        }
    };

    return(
        <View style={[styles.root, {width: width - 50}]}>

            <Image source={{ uri: user?.imageUri }} style={styles.imageStyle}/>

            <View style={styles.container} >
                <Text numberOfLines={1} style={styles.nameStyle}>{user?.name} </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                  <Text numberOfLines={1} 
                  style={ getLastOnlineText() === 'online' ? styles.timeStyle1 : getLastOnlineText() === 'ERROR : Missing Value' ? styles.timeStyle3 : styles.timeStyle2 } > 
                  { getLastOnlineText() } </Text>
                  {/* <FontAwesome name="circle" size={12} color='green' style={styles.statusIcon} /> */}
                </View>

                {/* <Text style={styles.timeStyle} > {getLastOnlineText()} </Text> */}

            </View>

            <View style={styles.iconContainer} >
              <AntDesign name="videocamera" size={21} color='white' style={styles.icon}/>
              <Ionicons name="call-outline" size={21} color='white' style={styles.icon}/>
              {/* <SimpleLineIcons name="options-vertical" size={16} color='white' style={styles.icon}/> */}
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        left: -25,
    },
    imageStyle: {
        width: 36, 
        height: 36, 
        borderRadius: 18,
    },
    nameStyle: {
        color: 'white',
        top: -1,
        fontWeight: 'bold', 
        fontSize: 18,
    },
    timeStyle1: {
        color: 'white',
    },
    timeStyle2: {
      color: 'grey',
    },
    timeStyle3: {
        color: 'red',
    },
    statusIcon: {
        marginHorizontal: 5,
        top: 1,
    },
    container: {
        flex: 1,
        marginHorizontal: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon: {
        padding: 5,
        marginHorizontal: 2,
    },
});

export default ChatRoomHeader;