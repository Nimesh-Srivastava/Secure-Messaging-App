import { SafeAreaProvider } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
// import { View } from 'react-native';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import moment from 'moment';

//backend connection
import Amplify, { Hub, Auth } from 'aws-amplify';
import config from './src/aws-exports';
import { User, Message } from './src/models';
import { DataStore } from '@aws-amplify/datastore';

Amplify.configure(config);

function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const { event, data } = hubData.payload;
      if(event === 'outboxMutationProcessed' 
      && data.model === Message 
      && !(['DELIVERED', 'READ'].includes(data.element.status))) {
          DataStore.save(
            Message.copyOf(data.element, (updated) => {
              updated.status='DELIVERED';
            })
          )
        }
      })
    
    return () => listener();
  }, []);

  useEffect(() => {
    if(!user){
      return;
    }
    const subscription = DataStore.observe(User, user.id).subscribe(msg => {
        if(msg.model === User && msg.opType === 'UPDATE'){
            setUser(msg.element);
        }
    });

    return () => subscription.unsubscribe();
  }, [user?.id]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateOnline();
    }, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchUser = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const user = await DataStore.query(User, userData.attributes.sub);
    if(user){
      setUser(user);
    }
  };

  const updateOnline = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    const user = await DataStore.query(User, userData.attributes.sub);
    if(!user){
      return;
    }
    const response = await DataStore.save(User.copyOf(user, (updated) => {
      updated.lastOnlineAt = +(new Date());
    } ));
    setUser(response);
  }

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
      </SafeAreaProvider>
    );
  }
}

export default App;