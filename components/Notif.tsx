import notifee, {
    AuthorizationStatus,
    EventType,
    Notification,
    RepeatFrequency,
    TimestampTrigger,
    TriggerType,
  } from '@notifee/react-native';
import { Habit, HabitContext} from "./Realm-Habit";
import { useEffect } from 'react';
import React from 'react';

const { useRealm } = HabitContext; 

const notif = (notifTime: Date) => {

  useEffect(() => {
    
    displayTriggerNotification()

}, [])
  
  async function displayTriggerNotification() {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: notifTime.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };
  
    const triggerNotificationId = await notifee.createTriggerNotification(
      {
        title: "hi", 
        body: "hi", 
        android: {
          channelId,
        },
      }, 
      trigger,
    );

    return triggerNotificationId;
  }
}

export default notif; 
