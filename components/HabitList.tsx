import Realm from "realm"; 
import React, { useState } from "react";
import {FlatList, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Habit, HabitContext } from "./Realm-Habit";
import { HabitBox } from "./HabitBox";

const {useQuery} = HabitContext; 

const HabitList = () => {

    const items = useQuery(Habit);

    return (
        <View style={{flexGrow: 1, padding: 18}}>
            <FlatList
                data={items}
                contentContainerStyle={{flexGrow: 1, height: '70%'}}
                renderItem={({item}) => 
                    <HabitBox item={item} 
                />}
            />
        </View>
    )
} 

export default HabitList;
