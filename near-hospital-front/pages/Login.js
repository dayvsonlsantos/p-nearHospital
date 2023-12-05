import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from '../components/Svg';
import usuarioService from '../services/UsuarioService';
import AsyncStorage from "@react-native-async-storage/async-storage"; // Certifique-se de importar corretamente aqui
import { useAuth } from '../AuthContext';

export default function Login() {

    const { login, setUser } = useAuth();
    const navigation = useNavigation();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const getEmail = (text) => {
        setEmail(text);
    };

    const getPassword = (text) => {
        setPassword(text);
    };

    async function loginAnAccount() {
        try {
            const response = await usuarioService.login({ userEmail: email, userPassword: password });

            if (response.token) {
                await AsyncStorage.setItem('token', response.token);
                console.log("Login bem-sucedido");
                console.log("Token:", response.token);

                // Chame a função login do contexto de autenticação
                login(response.user);
                setUser(response.user);

                // Navegar para a tela inicial (Home)
                navigation.navigate('Home');
            } else {
                console.log("Login mal-sucedido");
                console.error("Erro:", response.error);
            }
        } catch (error) {
            console.error("Erro na solicitação:", error);
        }
    }

    useEffect(() => {
        async function checkAuthentication() {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                console.log("Usuário autenticado");
                console.log("Token:", token);
            } else {
                console.log("Usuário não autenticado");
            }
        }

        checkAuthentication();
    }, []);

    return (
        <View className="w-full h-screen">
            <View className="w-full h-full">
                <View className="w-full h-1/3 flex items-center justify-center">
                    <Icon iconName='LOGO' />
                </View>
                <View className="flex items-center w-full mb-2">
                    <Text className='w-5/6 mb-2 text-green-near-dark text-lg'>Email:</Text>
                    <View
                        className="flex flex-row items-center justify-center bg-white h-16 rounded-2xl w-5/6"
                        style={[styles.boxShadown, styles.androidShadow]}
                    >
                        <TextInput
                            placeholder={email}
                            value={email}
                            onChangeText={getEmail}
                            keyboardType="email-address"
                            className="flex items-start justify-start text-lg w-5/6 pl-8"
                        />
                    </View>
                </View>
                <View className="flex items-center w-full mb-2">
                    <Text className='w-5/6 mb-2 text-green-near-dark text-lg'>Senha:</Text>
                    <View
                        className="flex flex-row items-center justify-center bg-white h-16 rounded-2xl w-5/6"
                        style={[styles.boxShadown, styles.androidShadow]}
                    >
                        <TextInput
                            placeholder='******'
                            value={password}
                            onChangeText={getPassword}
                            secureTextEntry={true}
                            className="flex items-start justify-start text-lg w-5/6 pl-8"
                        />
                    </View>
                </View>
                <View className="flex items-center justify-center w-full mt-14">
                    <Text className="text-green-near-dark font-bold text-lg">Não possui um cadastro ?</Text>
                    <Pressable
                        className="flex items-center justify-center rounded-2xl w-32 mt-2"
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text className="text-gray-near font-bold text-lg">Cadastrar</Text>
                    </Pressable>
                    <Pressable
                        className="flex items-center justify-center mt-16 bg-green-near-light rounded-2xl w-32 h-14"
                        onPress={() => loginAnAccount()}
                    >
                        <Text className="text-white font-bold text-lg">Entrar</Text>
                    </Pressable>
                </View>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    boxShadown: {
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 6,
            height: 6,
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
    },
    androidShadow: {
        elevation: 10,
    },
});