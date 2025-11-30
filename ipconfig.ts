import AsyncStorage from '@react-native-async-storage/async-storage';

const port = "3000";
let currentIP = "192.168.1.3";

export const initializeIP = async (): Promise<void> => {
  const savedIP = await AsyncStorage.getItem('serverIP');
  if (savedIP) currentIP = savedIP;
};

export const setServerIP = async (ip: string): Promise<void> => {
  currentIP = ip;
  await AsyncStorage.setItem('serverIP', ip);
};

export const getBaseURL = (): string => `http://${currentIP}:${port}`;

export const BASE_URL = `http://${currentIP}:${port}`;
