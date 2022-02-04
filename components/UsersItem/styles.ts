import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingLeft: 7,
      paddingRight: 7,
      borderBottomColor: '#1c1c1c',
      // borderBottomWidth: 1,
      paddingTop: 12,
      paddingBottom: 12,
    },
    rightContainer: {
      flex: 1,
      justifyContent: 'center',
      // backgroundColor: 'red',
    },
    image: {
      height: 46,
      width: 46,
      borderRadius: 23,
      marginRight: 10,
      // borderColor: '#09ff00',
      // borderWidth: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    name: {
      fontSize: 17,
      fontWeight: '500',
      color: 'white',
      marginBottom: 3,
    },
    messText:{
      fontSize: 15,
      color: 'grey',
      paddingRight: 30,
      top: -4,
    },
    timeText: {
      fontSize: 13,
      color: 'grey',
      top: -3,
    },
    badgeContainer: {
      backgroundColor: '#3872E9',
    //   backgroundColor: 'darkblue',
    //   borderColor: 'white',
    //   borderWidth: 1,
      width: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 9,
      position: 'absolute',
      right: 5,
      bottom: 4,
    },
    badgeText: {
      color: 'white',
      fontSize: 12,
    },
  });

  export default styles;