import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Screens/Home/Home';
import Meeting from '../Screens/Meeting/Meeting';
import Chat from '../Screens/Chat/Chat';
import Lounge from '../Screens/Lounge/Lounge';
import Profile from '../Screens/Profile/Profile';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const Bottom :React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';
            
                    if (route.name === '홈') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === '내 미팅') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === '채팅') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === '라운지') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === '프로필') {
                        iconName = focused ? 'person-circle' : 'person-circle-outline';
                    }
            
                    return <Ionicons name={iconName as any} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            <Tab.Screen name="홈" component={Home} />
            <Tab.Screen name="내 미팅" component={Meeting} />
            <Tab.Screen name="채팅" component={Chat} />
            <Tab.Screen name="라운지" component={Lounge} />
            <Tab.Screen name="프로필" component={Profile} />
        </Tab.Navigator>
    );
};

export default Bottom;