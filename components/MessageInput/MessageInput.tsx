import 'react-native-get-random-values';
import React, { useState, useEffect } from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    TextInput, 
    Pressable, 
    KeyboardAvoidingView,
    Platform,
    Image,
    Keyboard,
    // useWindowDimensions
} from 'react-native';
import { Feather, MaterialCommunityIcons, AntDesign, Fontisto, Ionicons, FontAwesome } from '@expo/vector-icons';
import { DataStore } from '@aws-amplify/datastore';
import { Auth, Storage } from 'aws-amplify';
import { ChatRoom, Message } from '../../src/models';
import EmojiSelector from 'react-native-emoji-selector';
import * as ImagePicker from 'expo-image-picker';
import { v4 as uuidv4 } from 'uuid';
// import { Audio } from 'expo-av';
import MessageComponent from '../Message';

const MessageInput = ({ chatRoom, messageReplyTo, removeMessageReplyTo }) => {
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    // const [recording, setRecording] = useState<Audio.Recording | null>(null);

    const resetFields = () => {
        setMessage('');
        setEmojiOpen(false);
        setImage(null);
        setProgress(0);
        removeMessageReplyTo();
    }

    useEffect(() => {
        async () => {
            if(Platform.OS !== 'web'){
                const galleryResponse = 
                    await ImagePicker.requestMediaLibraryPermissionsAsync();

                const cameraResponse =
                    await ImagePicker.requestCameraPermissionsAsync();

                // const micResponse = await Audio.requestPermissionsAsync();

                if(galleryResponse.status !== 'granted' || cameraResponse.status !== 'granted'){
                    alert('Media access is neccessary for functionality');
                }
            }
        }
    }, []);

    const sendMessage = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            userID: user.attributes.sub,
            chatroomID: chatRoom.id,
            status: 'SENT',
            replyToMessageID: messageReplyTo?.id,
        }))
        
        updateLastMessage(newMessage);

        resetFields();
    }

    const updateLastMessage = async (newMessage) => {
        DataStore.save(ChatRoom.copyOf(chatRoom, updatedChatRoom => {
            updatedChatRoom.lastMessage = newMessage;
        }))
    }

    const onPlusClicked = () => {
        //input files
        console.warn("input files");
    }

    const onPress = () => {
        if(image){
            sendImage();
        }
        else if(message){
            sendMessage();
        }
        else{
            onPlusClicked();
        }
    }

    const sendImage = async () => {
        if(!image){
            return;
        }
        const blob = await getImageBlob();
        const { key } = await Storage.put(`${uuidv4()}.png`, blob, { progressCallback });

        const user = await Auth.currentAuthenticatedUser();
        const newMessage = await DataStore.save(new Message({
            content: message,
            image: key,
            userID: user.attributes.sub,
            chatroomID: chatRoom.id,
            status: 'SENT',
            replyToMessageID: messageReplyTo?.id,
        }))

        updateLastMessage(newMessage);

        resetFields();
    }

    const progressCallback = ( progress ) => {
        setProgress(progress.loaded/progress.total)
    }

    const getImageBlob = async () => {
        if(!image){
            return null;
        }
        const response = await fetch(image);
        const blob = await response.blob();
        return blob;
    }

    // image picker
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled){
            setImage(result.uri);
        }
    };

    const takePhoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled){
            setImage(result.uri);
        }
    }

    // audio
    // async function startRecording() {
    //     try {
    //     //   console.log('Requesting permissions..');
    //     //   await Audio.requestPermissionsAsync();
    //       await Audio.setAudioModeAsync({
    //         allowsRecordingIOS: true,
    //         playsInSilentModeIOS: true,
    //       }); 
    //     //   console.log('Starting recording..');
    //       const { recording } = await Audio.Recording.createAsync(
    //          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    //       );
    //       setRecording(recording);
    //       console.log('Recording started');
    //     } catch (err) {
    //       console.error('Failed to start recording', err);
    //     }
    //   }
    
    //   async function stopRecording() {
    //     if (!recording){
    //         return;
    //     }
    //     // console.log('Stopping recording..');
    //     setRecording(null);
    //     await recording.stopAndUnloadAsync();
    //     const uri = recording.getURI(); 
    //     // console.log('Recording stopped and stored at', uri);
    //   }

    const handleInput = () => {
        if(!emojiOpen){
            Keyboard.dismiss();
        }
        setEmojiOpen((currentValue) => (!currentValue));
    }

    return(
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.root, { height: emojiOpen ? '50%' : 'auto' }]}>

            {messageReplyTo && (
                <View style={{ backgroundColor: '#303030', 
                borderRadius: 10, 
                overflow: 'hidden', 
                marginBottom: 10, 
                borderWidth: 1, 
                borderColor: 'white',
                flexDirection: 'row',
                justifyContent: 'space-between',
                }}>
                    <View>
                        <Text style={{ color: 'white', paddingHorizontal: 12, fontWeight: 'bold', marginTop: 1, }}>
                            Reply to :
                        </Text>
                        <MessageComponent message={messageReplyTo} />
                    </View>
                    <Pressable style={styles.replyCancelButton} onPress={() => removeMessageReplyTo()} >
                        <AntDesign name='close' size={21} color='red' />
                    </Pressable>
                </View>
            )}

            {image && (
                <View style={ styles.imageContainer }>
                    <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 10, }} />

                    <View style={{ flex: 1, justifyContent: 'flex-start', alignSelf: 'flex-end', paddingHorizontal: 10, }} >
                        <View style={{ height: 5, backgroundColor: 'grey', width: `${progress * 100}%`, borderRadius: 5, }} />
                    </View>

                    <Pressable style={styles.imageCancelButton} onPress={() => setImage(null)} >
                        <AntDesign name='close' size={24} color='black' />
                    </Pressable>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    {/* <Pressable onPress={() => setEmojiOpen((currentValue) => (!currentValue))}> */}
                    <Pressable onPress={handleInput}>
                        {emojiOpen ? <Fontisto name="smiley" size={24} color='white' /> : <Fontisto name="slightly-smile" size={24} color='white' />}
                    </Pressable>

                    <TextInput placeholderTextColor='grey' style={styles.input}
                    multiline={true}
                    placeholder='Message'
                    value={message}
                    onChangeText={setMessage}
                    />
                    
                    <Pressable onPress={pickImage}>
                        <Feather name='image' size={24} color='white' style={styles.icon}/>
                    </Pressable>

                    <Pressable onPress={takePhoto}>
                        <Feather name='camera' size={24} color='white' style={styles.icon}/>
                    </Pressable>
                </View>

                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    {message || image ? <Ionicons name='send' size={22} color='black' /> : <AntDesign name='plus' size={22} color='black' />}
                </Pressable>
            </View>

            {emojiOpen && (<EmojiSelector showHistory={true} showSearchBar={false} showTabs={false} onEmojiSelected={ emoji => setMessage(currentMessage => currentMessage + emoji)} columns={8} />)}
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    root: {
        padding: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        margin: 5,
        padding: 5,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
    },
    imageCancelButton: {
        backgroundColor: 'white',
        borderRadius: 18,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    replyCancelButton: {
        backgroundColor: '#303030',
        height: 26,
        width: 26,
        borderRadius: 13,
        borderWidth: 1,
        borderColor: 'red',
        margin: 5,
        // padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'red',
    },
    inputContainer: {
        backgroundColor: '#1c1c1c',
        flex: 1,
        marginRight: 5,
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#303030',
        alignItems: 'flex-end',
        flexDirection: 'row',
        paddingBottom: 7,
        paddingHorizontal: 5
        // marginBottom: 5,
    },
    buttonContainer: {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 3,
        borderColor: 'black',
        // transform: [{ rotate: '45deg' }],
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginBottom: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 35,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        color: 'white',
        fontSize: 16,
    },
    icon: {
        marginHorizontal: 5,
        marginVertical: 1,
    },
    row: {
        flexDirection: 'row',
    }
});

export default MessageInput;