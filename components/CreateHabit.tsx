import React, { ChangeEvent, useCallback, useState } from "react";
import { Modal, Text, StyleSheet, Button, TextInput, Pressable, SafeAreaView, View, TouchableOpacity, Platform } from 'react-native';
import { Habit, HabitContext } from "./Realm-Habit";
import { useUser } from "@realm/react";
import DatePicker from "react-native-date-picker";

const { useRealm } = HabitContext; 

const CreateHabit = () => {
   
   const realm = useRealm();  
   const user = useUser(); 

   const [habitName, setHabitName] = useState("");
   const [habitNotes, setHabitNotes] = useState("");
   const [modalOpen, setModalOpen] = useState(false);

   const [startDate, setStartDate] = useState(new Date());
   const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
   const [endDate, setEndDate] = useState(new Date());
   const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

   const [notifTime, setNotifTIme] = useState(new Date());
   const [notifTimePickerOpen, setNotifTimePickerOpen] = useState(false);

   // pass an obj as an argument 
   const handleCreateHabit = useCallback((habitText: string, habitNotes: string, startDate: Date, endDate: Date, notifTime: Date) => {

      realm.write(() => {
         realm.create('Habit', {
            _id: new Realm.BSON.ObjectID(),
            name: habitText,
            ownerId: user.id,
            notes: habitNotes,
            startDate: startDate,
            endDate: endDate,
            notifTime: notifTime,
         });
      });

      setHabitName("");
      setHabitNotes("");

      }, [realm]
   )


   return(
   <SafeAreaView style={styles.fullView}>

      {/* Add New Habit Modal */}
      <Modal visible={modalOpen} animationType='slide'>
         <SafeAreaView style={styles.modalContent}>

            <Pressable 
               style={{marginLeft: 350}}
               onPress={() => setModalOpen(false)}>
                  <Text style={{fontSize: 27 , 
                     fontWeight: "bold", 
                     color: "black",
                     }}
                  >  
                     x
                  </Text>
            </Pressable>

            <Text style={{
               fontFamily: "ArchivoBlack-Regular", 
               fontSize: 20,
               marginLeft: 40,
               marginTop: 10,
               marginBottom: 0,
               padding: 20
               }}
            >
               [ START A NEW HABIT ]
            </Text>

            <Text style={styles.headers}>Name</Text>
            <TextInput 
               value={habitName}
               onChangeText={setHabitName} 
               style={{
                  fontSize: 17, 
                  fontFamily: "LotaGrotesqueAlt1-Regular",
                  padding: 10,
                  backgroundColor: "#EEEEEE",
                  flexGrow:1,
                  marginLeft: 20,
                  marginRight: 20
               }}
               placeholder="Habit name"
            />

            <Text style={styles.headers}>Notes</Text>
            <TextInput 
               value={habitNotes}
               onChangeText={setHabitNotes} 
               style={{
                  fontSize: 17, 
                  fontFamily: "LotaGrotesqueAlt1-Regular",
                  padding: 10,
                  backgroundColor: "#EEEEEE",
                  flexGrow:1,
                  marginLeft: 20,
                  marginRight: 20
               }}
               placeholder="Description and notes"
            />
            
{/* **** DATE PICKER **** */}
               <Text style={styles.headers}>Habit Term</Text>

               <View style={{
                  flexDirection: "row", 
                  justifyContent: "center", 
                  alignContent: "space-between"
               }}
               >
                  <TouchableOpacity 
                     onPress={() => setStartDatePickerOpen(true)}
                     style={{alignItems: 'center',
                     justifyContent: 'center',
                     paddingVertical: 8,
                     paddingHorizontal: 18,
                     borderRadius: 20,
                     backgroundColor: '#c3ff00',
                     borderWidth: 1.5}}
                  >
                     <Text style={{fontSize:14, fontFamily: "LotaGrotesqueAlt1-Regular"}}>Set Start Date</Text>
                  </TouchableOpacity>

                  <DatePicker
                     modal
                     open={startDatePickerOpen}
                     mode={"date"}
                     date={startDate}
                     onConfirm={ (newDate) => {
                        setStartDatePickerOpen(false)
                        setStartDate(newDate)
                     }}
                     onCancel={ () => {
                        setStartDatePickerOpen(false)
                     }}
                  />

                  <Text style={{
                     fontWeight: "600", 
                     marginRight: -5, 
                     marginLeft: -5,
                     marginTop: 3
                  }}> __________ </Text>

                  <TouchableOpacity 
                     onPress={() => setEndDatePickerOpen(true)}
                     style={{alignItems: 'center',
                     justifyContent: 'center',
                     paddingVertical: 8,
                     paddingHorizontal: 18,
                     borderRadius: 20,
                     backgroundColor: '#c3ff00',
                     borderWidth: 1.5}}
                  >
                     <Text style={{fontSize:14, fontFamily: "LotaGrotesqueAlt1-Regular"}}>Set End Date</Text>
                  </TouchableOpacity>

                  <DatePicker
                     modal
                     
                     open={endDatePickerOpen}
                     mode={"date"}
                     date={endDate}
                     onConfirm={ (newDate) => {
                        setEndDatePickerOpen(false)
                        setEndDate(newDate)
                     }}
                     onCancel={ () => {
                        setEndDatePickerOpen(false)
                     }}
                  />
               </View>

{/**** TIME PICKER ****/}
               <Text style={styles.headers}>Daily Reminder</Text>
               <TouchableOpacity 
                  onPress={() => setNotifTimePickerOpen(true)}
                  style={{alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 8,
                  marginLeft: 40,
                  marginRight: 40,
                  borderRadius: 20,
                  backgroundColor: '#c3ff00',
                  borderWidth: 1.5}}
               >
                  <Text style={{fontSize:16, fontFamily: "LotaGrotesqueAlt1-Regular"}}>Set Reminder Time</Text>
               </TouchableOpacity>
               <DatePicker
                     modal
                     
                     mode={"time"}
                     open={notifTimePickerOpen}
                     date={notifTime}
                     onConfirm={ (newTime) => {
                        setNotifTIme(newTime)
                        setNotifTimePickerOpen(false)
                     }}
                     onCancel={ () => {
                        setNotifTimePickerOpen(false)
                     }}
                  />

               {/* <Pressable onPress={ () => {console.log(notifTime.toString().substring(16,21))}}>
                  <Text>Testing notif time obj</Text>
               </Pressable> */}

{/**** SAVE HABIT ****/}

               <TouchableOpacity 
                  onPress={() => {
                     handleCreateHabit(habitName, habitNotes, startDate, endDate, notifTime);
                     setModalOpen(false);
                     //notif(notifTime);
                     }  
                  }
                  style={{alignItems: 'center',
                  justifyContent: 'center',
                  bottom: -215,
                  paddingVertical: 35,
                  paddingHorizontal: 24,
                  width: '100%',
                  backgroundColor: '#c3ff00',
                  position: 'absolute',
                  borderWidth: 1.5,
               }}
               >
                  <Text style={{fontSize:20, fontWeight: "bold", fontFamily: "ArchivoBlack-Regular"}}>SAVE HABIT</Text>
               </TouchableOpacity>

         </SafeAreaView>
      </Modal>

         <View>
            <Pressable style={{padding: 20}}onPress={() => setModalOpen(true)}>
               <Text style={styles.plusSign}>+</Text>
            </Pressable>
         </View>

   </SafeAreaView> 
)}

const styles = StyleSheet.create({
    plusSign: {
      fontSize: 50 , 
      fontWeight: "bold", 
      fontFamily: "ArchivoBlack-Regular",
      color: "#1605fa",
      marginRight: 15,
    },
    headers: {
      fontSize: 17, 
      padding: 13,
      marginLeft: 10,
      marginBottom: 8,
      marginTop: 25,
      fontFamily: "LotaGrotesque-Bold"
    },
    fullView: {
      flex: 1,
      flexDirection: "row", 
      minHeight: 100,
      alignItems: 'center',
      justifyContent: 'flex-end',
      
    }, 
    modalContent: {

    },
    datePicker:{
      flexDirection: 'row',
      justifyContent: 'center',
    },
    datePickerView: {
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22
    },
    datePickerModalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20, 
      width: '90%',
      padding: 35, 
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0, 
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4, 
      elevation: 5,
    },
});

export default CreateHabit;