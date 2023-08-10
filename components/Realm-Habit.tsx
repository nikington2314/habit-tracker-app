import React from 'react';
import Realm from 'realm';
import {BSON} from 'realm';
import {createRealmContext} from '@realm/react';

export class Habit extends Realm.Object<Habit> {
	
	_id!: Realm.BSON.ObjectId; 
	name!: string;
	ownerId!: string;
	notes?: string;
	startDate!: Date;
	endDate?: Date;
	notifTime!: Date;
	completedHabits?: Realm.List<CompletedHabit>

	static schema = {
		name: 'Habit',
		primaryKey: '_id',
		properties: {
			_id: 'objectId',
			name:'string', 
			ownerId: 'string',
			notes: 'string',
			startDate: 'date',
			endDate: 'date',
			notifTime: 'date',
			completedHabits: 'CompletedHabit[]'
		},
	};
}

export class CompletedHabit extends Realm.Object<Habit> {

	_id!: Realm.BSON.ObjectId;
	habit!: Habit; 
	dateCompleted!: Date; 
	notes?: string; 

	static schema = {
		name: 'CompletedHabit',
		primaryKey: '_id',
		properties: {
			_id: 'objectId',
			habit: 'Habit', 
			dateCompleted: 'date', 
			notes: 'string', 
		},
	};

}

const realmConfigHabit: Realm.Configuration = {
	schema: [Habit, CompletedHabit],
};

export const HabitContext = createRealmContext(realmConfigHabit); 



