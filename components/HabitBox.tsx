import React, { useCallback, useEffect, useState } from "react";
import { Habit, HabitContext} from "./Realm-Habit";
import { Alert, Dimensions, Modal, Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { MarkedDates } from "react-native-calendars/src/types";
import Midnight from 'react-native-midnight'

const { useRealm, useObject } = HabitContext; 

export const HabitBox = ({item}: {item: Habit}) => {

    const realm = useRealm();  

/**** HABIT MODAL ****/
    const [habitModalOpen, setHabitModalOpen] = useState(false);

        //mark as completed
        const [completed, setCompleted] = useState(false);
        const currHabit = useObject(Habit, item._id);

        const handleCompletion = () => {
            
            setCompleted(true);

            realm.write(() => {

                currHabit?.completedHabits.push(
                    realm.create('CompletedHabit', {
                        _id: new Realm.BSON.ObjectID(),
                        habit: item,
                        dateCompleted: new Date(),
                        notes: "dailyCompletionNotes"
                     })
                )

            });

            findMarkedDates(); 
        }


    /**** DELETE HABIT ****/
    const deleteHabit = useCallback(() => {
        
        // Show an Alert dialogue before deleting 
        Alert.alert(
            'Delete Habit',
            'Are you sure you want to delete this Habit?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {

                        realm.write(() => {

                            let i = item.completedHabits.length-1; 
                            while (i >= 0){
                                realm.delete(item.completedHabits[i]);
                                i--;
                            }

                            realm.delete(item);
                        });
                    }
                }
            ],
            {cancelable: false},
        );
    }, [realm, item])

/**** MODAL CALENDAR ****/

    const [selectedDate, setSelectedDate] = useState('');
    const [markedDates, setMarkedDates] = useState<string[]>([]);

    // the dates in this array need to be dynamically created based on the array of 
    // CompletedHabit objects for each Habit. so, for each Habit, we run through the 
    // array we created and then parse each Completed Habit object to grab its date, 
    // then add to this array. this should work!!

    useEffect(() => {
        findMarkedDates(); 
      }, []);

    const findMarkedDates = () => {

        let date, year, month, day;
        const tempArr: string[] = []; 
        
        let i = 0; 

        while(i < item.completedHabits?.length){

            date = item.completedHabits[i].dateCompleted; 

            year = date.toLocaleString("default", { year: "numeric" });
            month = date.toLocaleString("default", { month: "2-digit" });
            day = date.toLocaleString("default", { day: "2-digit" });

           tempArr.push(year + "-" + month + "-" + day);
            i++; 
        }

        setMarkedDates(tempArr);

    }

    // translating our markedDates array to reflect on calendar
    let markedDatesObject = {};

    markedDates.forEach((day) => {
        markedDatesObject = {
            ...markedDatesObject,
            [day]: {
              selected: true,
              selectedColor: "#1605fa"
              //marked: true
            }
        }
      });
/**** RESET COMPLETED VARIABLES @ MIDNIGHT ****/
    useEffect(() => {
        const listener = Midnight.addListener(() => {
            setCompleted(false);
        })
        return () => listener.remove()
    }, [])

    return(
        <View>

            <TouchableOpacity onPress={() => setHabitModalOpen(true)}>
                <View style={styles.habit}>

                    {/* Habit Title in Box  */}
                    <Text style={{fontSize: 18, fontFamily: "LotaGrotesqueAlt1-Regular"}}>{item.name}</Text>

                    {/* Delete Habit (X) Button */}
                    <Pressable onPress={deleteHabit}>
                        <Text style={styles.deleteHabit}>x</Text>
                    </Pressable>

                </View>
            </TouchableOpacity>

            
            <Modal visible={habitModalOpen} animationType='slide'>
                <SafeAreaView>  
                    
                    <Pressable 
                    style={{marginLeft: 350}}
                    onPress={() => setHabitModalOpen(false)}>
                        <Text style={{fontSize: 27 , 
                     fontWeight: "bold", 
                     color: "black",
                     }}>
                        x
                    </Text>
                    </Pressable>

                    <View style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        padding: 20,
                        marginBottom: 10
                    }}>
                        <Text style={{
                            fontFamily: "ArchivoBlack-Regular", 
                            fontSize: 33,
                            marginTop: 10,
                            marginBottom: 7
                        }}>
                            {item.name.toLocaleUpperCase()}
                        </Text>

                        <View style={{
                            flexDirection: 'row',marginBottom: 7
                        }}>
                            <Text style={{fontSize:14.5, fontFamily: "LotaGrotesque-Bold"}}> 
                                {item.startDate.toDateString().substring(4, 10)}, {item.startDate.
                                toDateString().substring(11)} {item.endDate ? " -  " + item.endDate.toDateString().
                                substring(4, 10)+", "+item.endDate.toDateString().substring(11) : " - No End Date"}
                            </Text>

                            <Text style={{
                                marginLeft: 130,
                                fontSize:14.5, 
                                fontFamily: "LotaGrotesque-Bold"
                            }}>
                                {item.notifTime.toTimeString().substring(0,5)}
                            </Text>
                        </View>

                        <Text style={{
                            fontFamily: "LotaGrotesqueAlt1-Regular", 
                            fontSize: 15,
                            marginTop: 20,
                            marginBottom: 5,
                            marginLeft: 15,
                            marginRight: 15
                        }}>
                            {item.notes}
                        </Text>

                    </View>

                    <Calendar
                    // Customize the appearance of the calendar
                    style={{
                        borderWidth: 1.5,
                        borderColor: 'black',
                        //height: 330,
                        marginLeft: 25,
                        marginRight: 25,
                        marginBottom: 40,
                        marginTop: 6,
                        borderRadius: 24,
                        padding: 10,
                    }}
                    // Callback that gets called when the user selects a day
                    onDayPress={day => {
                        setSelectedDate(day.dateString);
                      }}
                    // Mark specific dates as marked
                    // markedDates={{
                    //     [selectedDate]: {selected: true, disableTouchEvent: true, selectedColor:"#1605fa"}
                    //   }}
                    // markingType={'dot'}
                    markedDates={markedDatesObject}
                    width={Dimensions.get("window").width}
                    theme={{
                        todayTextColor: '#1605fa',
                        arrowColor: '#1605fa',
                        textDayFontFamily: "LotaGrotesqueAlt1-Regular",
                        textMonthFontFamily: "LotaGrotesqueAlt1-Regular",
                        textDayHeaderFontFamily: "LotaGrotesqueAlt1-Regular"
                    }}
                    />

                    
                    <TouchableOpacity 
                        style={{alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 18,
                            marginLeft: 40,
                            marginRight: 40,
                            borderRadius: 20,
                            backgroundColor: '#c3ff00',
                            borderWidth: 1.5
                        }} 
                        onPress={() => handleCompletion()}>
                        <Text style={{fontSize:16, fontFamily: "LotaGrotesqueAlt1-Regular"}}>{completed ? 'Habit Completed for Today!' : 'Habit Uncompleted for Today'}</Text>
                    </TouchableOpacity>

                    {/* <View>
                        <Pressable onPress={() => displayTriggerNotification()} >
                            <Text>Display Notification</Text> 
                        </Pressable>
                    </View> */}

                </SafeAreaView>
            </Modal>
            
        </View>
    )
}
 
const styles = StyleSheet.create({
    habit: {
        flexGrow: 1,
        padding:10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
        backgroundColor: "#c3ff00",
        marginVertical: 8,
        marginHorizontal: 10,
        borderWidth: 1.5
    },
    deleteHabit: {
        fontWeight:"bold",
        fontFamily: "ArchivoBlack-Regular",
        marginHorizontal: 10,
        fontSize: 17,
    }
})