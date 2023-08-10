import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native';
import HabitList from './components/HabitList';
import CreateHabit from './components/CreateHabit';
import { HabitContext } from "./components/Realm-Habit";
import { AppProvider, UserProvider, createRealmContext, useUser} from '@realm/react';
import { LoginScreen } from './components/LoginScreen';
const {useRealm, RealmProvider} = HabitContext;

function App() {

  // Setting up subscriptions
  const user = useUser()!;

  const realm = useRealm(); 

  realm.subscriptions.update((subs) => {
    subs.add(realm.objects('Habit').filtered('ownerId = $0', user.id), {
      name: 'HabitSubscription',
    })
  });

  return (
      <SafeAreaView style={styles.container}>

          <Text style={styles.sectionTitle}>MY HABITS</Text>
          <HabitList/> 
          <CreateHabit/>

      </SafeAreaView>
  );
}
  
const AppWrapper = () => {
  return (
    <AppProvider id="habit-application-vjonx">
      <UserProvider fallback={ <LoginScreen />}>
        <RealmProvider 
          sync={{
            flexible: true,
            initialSubscriptions: {
              update(subs, realm) {
                subs.add(realm.objects('Habit'));
                subs.add(realm.objects('CompletedHabit'));
              },
            },
            onError: console.error,
          }}>
          <App />
         </RealmProvider> 
        </UserProvider>
    </AppProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  sectionTitle: {
    fontSize: 28, 
    fontWeight: 'bold',
    paddingTop: 50,
    paddingHorizontal: 20,
    fontFamily: "ArchivoBlack-Regular",
  },
});

 export default AppWrapper; 