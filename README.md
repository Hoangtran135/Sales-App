# Sales App - Ứng dụng Bán Hàng

Ứng dụng bán hàng được xây dựng với React Native và Expo, hỗ trợ cả người dùng và quản trị viên.

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.x
- **npm**: >= 9.x hoặc **yarn**
- **Expo CLI**: Cài đặt global `npm install -g expo-cli`
- **Expo Go**: Ứng dụng trên điện thoại (iOS/Android) để test
- **MySQL**: Database server (chạy trên port 3306 mặc định)
- **Backend Server**: Node.js server chạy trên port 3000

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/Hoangtran135/Sales-App.git
cd Sales-App
```

### 2. Cài đặt dependencies

```bash
npm install
```

Hoặc nếu dùng yarn:

```bash
yarn install
```

### 3. Cấu hình IP Server

**Quan trọng**: Bạn cần cấu hình IP của server backend trước khi chạy app.

Mở file `ipconfig.ts` và thay đổi IP mặc định:

```typescript
let currentIP = "192.168.1.3"; // Thay bằng IP của server backend
```

Hoặc bạn có thể set IP thủ công trong code:

```typescript
import { setServerIP } from './ipconfig';

// Set IP server
await setServerIP('192.168.1.100'); // IP của server backend
```

**Lưu ý**:
- IP phải là địa chỉ IP local của máy chạy backend server
- Đảm bảo backend server đang chạy trên port 3000
- Nếu dùng emulator Android: dùng `10.0.2.2` thay vì localhost
- Nếu dùng iOS Simulator: dùng `localhost` hoặc `127.0.0.1`

### 4. Cấu hình Database (Backend)

Đảm bảo backend server đã được cấu hình và chạy. Xem file `server.js` để biết cấu hình database.

## 🏃 Chạy ứng dụng

### Chạy development server

```bash
npm start
```

Hoặc với cache reset:

```bash
npm run start:reset
```

### Chạy trên thiết bị cụ thể

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

### Quét QR Code

1. Mở Expo Go trên điện thoại
2. Quét QR code hiển thị trong terminal
3. Ứng dụng sẽ tự động load

## 📁 Cấu trúc thư mục

```
Sales-App/
├── admin/              # Các màn hình quản trị viên
├── assets/             # Hình ảnh, icons
├── components/         # Các component và màn hình người dùng
├── settings/           # Các màn hình cài đặt
├── styles/             # File styles chung
├── uploads/            # Thư mục upload files
├── App.tsx             # Entry point của ứng dụng
├── ipconfig.ts         # Cấu hình IP server
├── package.json        # Dependencies và scripts
├── tsconfig.json       # TypeScript config
└── server.js          # Backend server (Node.js/Express)
```

## 🔧 Scripts có sẵn

- `npm start` - Khởi động Expo development server
- `npm run start:reset` - Khởi động với cache reset
- `npm run android` - Chạy trên Android
- `npm run ios` - Chạy trên iOS
- `npm run web` - Chạy trên web browser
- `npm run clear` - Xóa cache

## ⚙️ Cấu hình

### IP Server Configuration

File `ipconfig.ts` quản lý cấu hình IP server:

```typescript
// Lấy IP hiện tại
import { getBaseURL } from './ipconfig';
const url = getBaseURL(); // http://192.168.1.3:3000

// Set IP mới
import { setServerIP } from './ipconfig';
await setServerIP('192.168.1.100');

// Load IP đã lưu (tự động khi app khởi động)
import { initializeIP } from './ipconfig';
await initializeIP();
```

### Environment Variables

Nếu cần, bạn có thể tạo file `.env` (không được commit vào git):

```
SERVER_IP=192.168.1.3
SERVER_PORT=3000
```

## 🐛 Troubleshooting

### Lỗi "Network request timed out"

- Kiểm tra IP server trong `ipconfig.ts` có đúng không
- Đảm bảo backend server đang chạy
- Kiểm tra firewall và network connection
- Thử tăng timeout trong `settings/Start.tsx` (mặc định 10 giây)

### Lỗi "Cannot find module"

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi "React Native version mismatch"

```bash
# Xóa cache và rebuild
npm run start:reset
```

Hoặc:

```bash
# Xóa cache Metro
npx expo start --clear --reset-cache
```

### Lỗi khi chạy trên Android/iOS

- Đảm bảo đã cài đặt Android Studio (cho Android) hoặc Xcode (cho iOS)
- Kiểm tra emulator/simulator đang chạy
- Thử rebuild native app: `npx expo run:android` hoặc `npx expo run:ios`

## 📱 Tính năng

### Người dùng
- Đăng nhập/Đăng ký
- Xem sản phẩm và danh mục
- Thêm sản phẩm vào giỏ hàng
- Đặt hàng
- Quản lý đơn hàng
- Xem voucher/khuyến mãi
- Chat với admin
- Quản lý tài khoản

### Quản trị viên
- Quản lý sản phẩm
- Quản lý danh mục
- Quản lý đơn hàng
- Quản lý người dùng
- Quản lý banner
- Quản lý voucher
- Báo cáo doanh thu
- Chat với người dùng

## 🛠️ Công nghệ sử dụng

- **React Native**: 0.81.5
- **Expo**: SDK 54
- **React Navigation**: Điều hướng
- **TypeScript**: Type safety
- **AsyncStorage**: Lưu trữ local
- **Axios**: HTTP client
- **React Native Reanimated**: Animations
- **React Native Gesture Handler**: Gesture handling

## 📝 Lưu ý quan trọng

1. **IP Server**: Luôn kiểm tra và cấu hình đúng IP server trước khi chạy
2. **Backend Server**: Đảm bảo backend server đang chạy trước khi test app
3. **Database**: Cấu hình database trong backend server
4. **Port**: Mặc định server chạy trên port 3000, có thể thay đổi trong `ipconfig.ts`

## 📄 License

ISC

## 👥 Tác giả

Hoangtran135

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.

