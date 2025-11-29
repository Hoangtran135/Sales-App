// ipConfig.ts
import * as Network from 'expo-network';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const port = "3000";

// IP mặc định (sẽ được cập nhật khi detect)
let currentIP = "192.168.217.1";

// Hàm tự động detect IP của máy chủ bằng cách thử kết nối
const detectServerIP = async (): Promise<string> => {
  try {
    // Lấy IP đã lưu trước đó
    const savedIP = await AsyncStorage.getItem('serverIP');
    if (savedIP) {
      // Kiểm tra xem IP đã lưu có còn hoạt động không
      const isWorking = await testConnection(savedIP);
      if (isWorking) {
        return savedIP;
      }
    }

    // Danh sách IP phổ biến để thử
    const ipCandidates = [
      "172.20.10.2", // IP cũ
      "192.168.1.100",
      "192.168.1.1",
      "192.168.0.100",
      "192.168.0.1",
      Platform.OS === 'android' ? "10.0.2.2" : "localhost", // Android emulator hoặc iOS simulator
      "127.0.0.1",
    ];

    // Thử từng IP cho đến khi tìm thấy IP hoạt động
    for (const ip of ipCandidates) {
      const isWorking = await testConnection(ip);
      if (isWorking) {
        await AsyncStorage.setItem('serverIP', ip);
        return ip;
      }
    }

    // Nếu không tìm thấy, trả về IP mặc định
    return "172.20.10.2";
  } catch (error) {
    console.log("Error detecting server IP:", error);
    return "172.20.10.2";
  }
};

// Hàm kiểm tra kết nối đến server
const testConnection = async (ip: string): Promise<boolean> => {
  try {
    const url = `http://${ip}:${port}`;
    
    // Tạo promise với timeout
    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(false), 2000); // Timeout 2 giây
    });

    const fetchPromise = fetch(url, {
      method: 'GET',
    })
      .then((response) => response.ok)
      .catch(() => false);

    // Race giữa fetch và timeout
    return Promise.race([fetchPromise, timeoutPromise]);
  } catch (error) {
    return false;
  }
};

// Hàm khởi tạo để tự động detect IP khi app khởi động
export const initializeIP = async (): Promise<void> => {
  try {
    const detectedIP = await detectServerIP();
    currentIP = detectedIP;
    console.log(`✅ Server IP detected: ${currentIP}`);
  } catch (error) {
    console.log("Error initializing IP:", error);
  }
};

// Hàm set IP thủ công (nếu cần)
export const setServerIP = async (ip: string): Promise<void> => {
  currentIP = ip;
  await AsyncStorage.setItem('serverIP', ip);
};

// Hàm get IP hiện tại
export const getCurrentIP = (): string => {
  return currentIP;
};

// BASE_URL động - tự động cập nhật khi IP thay đổi
export const getBaseURL = (): string => {
  return `http://${currentIP}:${port}`;
};

// Export BASE_URL để tương thích với code cũ
// Lưu ý: Gọi initializeIP() trong App.tsx để tự động detect IP
export const BASE_URL = `http://${currentIP}:${port}`;
