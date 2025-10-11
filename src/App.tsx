import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, View, Text, Button, TextInput } from 'react-native';
import { useAuthStore } from './store/authStore';
import SamplesScreen from './screens/SamplesScreen';

function HomeScreen({ navigation }: any) {
  const { logout } = useAuthStore();
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>API Showcase</Text>
        <Button title="Test API /ping" onPress={async () => {
          try {
            const res = await (await import('./shared/api')).api.get('/ping');
            alert(JSON.stringify(res.data));
          } catch (e: any) {
            alert(e?.message ?? 'Error');
          }
        }} />
        <View style={{ height: 8 }} />
        <Button title="View Samples" onPress={() => navigation.navigate('Samples')} />
        <View style={{ height: 8 }} />
        <Button title="Logout" onPress={logout} />
      </View>
    </SafeAreaView>
  );
}

function LoginScreen({ navigation }: any) {
  const { login } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  return (
    <SafeAreaView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Sign in</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail}
          autoCapitalize="none" keyboardType="email-address"
          style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword}
          secureTextEntry style={{ borderWidth: 1, padding: 10, marginBottom: 8 }} />
        <Button title="Sign in" onPress={async () => {
          const ok = await login({ email, password });
          if (ok) navigation.replace('Home');
        }} />
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const isAuthed = useAuthStore((s) => !!s.accessToken);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthed ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Samples" component={SamplesScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}