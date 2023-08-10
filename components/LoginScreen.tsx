import React, { useCallback, useState } from "react";
import {  StyleSheet, View, Text, TextInput, Pressable, SafeAreaView, TextStyle, Alert } from "react-native";
import { useApp } from "@realm/react";
import { Icon, Input, Button } from 'react-native-elements'
import {SafeAreaProvider} from 'react-native-safe-area-context';

export const LoginScreen = () => {

    const realmApp = useApp()

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 

    // state values for toggable visibility of features in the UI
    const [passwordHidden, setPasswordHidden] = useState(true);
    const [isInSignUpMode, setIsInSignUpMode] = useState(true);

    const logIn = useCallback(async () => {
        const credentials = Realm.Credentials.emailPassword(email, password);
        await realmApp.logIn(credentials);
      }, [realmApp, email, password]);
    
      // onPressSignIn() uses the emailPassword authentication provider to log in
      const onPressLogIn = useCallback(async () => {
        try {
          await logIn();
        } catch (error: any) {
          Alert.alert(`Failed to sign in: ${error?.message}`);
        }
      }, [logIn]);
    
      // onPressSignUp() registers the user and then calls signIn to log the user in
      const onPressSignUp = useCallback(async () => {
        try {
          await realmApp.emailPasswordAuth.registerUser({email, password});
          await logIn();
        } catch (error: any) {
          Alert.alert(`Failed to sign up: ${error?.message}`);
        }
      }, [logIn, realmApp, email, password]);

    return (
        <SafeAreaProvider style={{flex: 1 }}>
            <View style={styles.LogInPage}>

                <Text style={$text}>HABIT TRACKER</Text>

                <Input 
                    style={styles.TextInput} 
                    placeholder="Email" 
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete={undefined}
                />
                <Input 
                    style={styles.TextInput} 
                    placeholder="Password" 
                    textContentType="password"
                    value={password}
                    onChangeText={setPassword }
                    secureTextEntry={passwordHidden}
                    rightIcon={
                        <Icon
                          type="material-community"
                          name={passwordHidden ? 'eye-off-outline' : 'eye-outline'}
                          size={12}
                          color="black"
                          onPress={() => setPasswordHidden(!passwordHidden)}
                        //   tvParallaxProperties={undefined}
                        />
                      }
                />

                {isInSignUpMode ? (
                <>
                    <Button
                    title="Create Account"
                    titleStyle={{color: 'black', fontFamily: "LotaGrotesqueAlt1-Regular",
                    }}
                    buttonStyle={styles.mainButton}
                    style={{
                      marginTop: 15,
                      
                    }}
                    onPress={onPressSignUp}
                    />
                    <Button
                    title="Already have an account? Log In"
                    type="clear"
                    titleStyle={styles.secondaryButton}
                    onPress={() => setIsInSignUpMode(!isInSignUpMode)}
                    />
                </>
                ) : (
                <>
                    <Button
                    title="Log In"
                    buttonStyle={styles.mainButton}
                    titleStyle={{color: 'black',fontFamily: "LotaGrotesqueAlt1-Regular"}}
                    onPress={onPressLogIn}
                    />
                    <Button
                    title="Don't have an account? Create Account"
                    type="clear"
                    titleStyle={styles.secondaryButton}
                    onPress={() => setIsInSignUpMode(!isInSignUpMode)}
                    />
                </>
                )}  

            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    LogInPage: {
        flex:1, 
        padding: 30,
        justifyContent: "center",
    },
    TextInput: {
        fontSize: 20,
        fontFamily: "LotaGrotesqueAlt1-Regular"
    },
    mainButton: {
        width: '100%',
        backgroundColor: "#c3ff00",
        marginBottom: 15,
        borderRadius:24,
        borderWidth: 1.5,
        borderColor: 'black',
        
      },
      secondaryButton: {
        color: "black",
        fontFamily: "LotaGrotesqueAlt1-Regular"
      },
})

const $text: TextStyle = {
    fontSize: 35,
    paddingVertical: 12, 
    fontFamily: "ArchivoBlack-Regular",
    color: 'black',
}