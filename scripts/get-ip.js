// Script để tự động lấy IP từ ipconfig và cập nhật ipconfig.ts
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Hàm lấy IP từ ipconfig (Windows)
function getIPFromIpconfig() {
  return new Promise((resolve, reject) => {
    exec('ipconfig', { encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing ipconfig: ${error.message}`);
        reject(error);
        return;
      }

      // Parse output để tìm IPv4 Address
      const lines = stdout.split('\n');
      let currentAdapter = '';
      const ipAddresses = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Lấy tên adapter
        if (line && !line.startsWith(' ') && line.includes('adapter')) {
          currentAdapter = line;
        }

        // Tìm IPv4 Address (không phải localhost)
        if (line.includes('IPv4 Address') || line.includes('IPv4 Địa chỉ')) {
          const match = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
          if (match) {
            const ip = match[1];
            // Bỏ qua localhost và loopback
            if (!ip.startsWith('127.') && !ip.startsWith('169.254.')) {
              ipAddresses.push({
                adapter: currentAdapter,
                ip: ip
              });
            }
          }
        }
      }

      // Ưu tiên IP trong dải 192.168.x.x hoặc 172.x.x.x hoặc 10.x.x.x
      const preferredIP = ipAddresses.find(addr => 
        addr.ip.startsWith('192.168.') || 
        addr.ip.startsWith('172.') || 
        addr.ip.startsWith('10.')
      );

      if (preferredIP) {
        resolve(preferredIP.ip);
      } else if (ipAddresses.length > 0) {
        resolve(ipAddresses[0].ip);
      } else {
        reject(new Error('Không tìm thấy IP address'));
      }
    });
  });
}

// Hàm cập nhật file ipconfig.ts
function updateIpconfigFile(ip) {
  const ipconfigPath = path.join(__dirname, '..', 'ipconfig.ts');
  
  try {
    let content = fs.readFileSync(ipconfigPath, 'utf8');
    
    // Tìm và thay thế IP mặc định
    // Tìm dòng: let currentIP = "172.20.10.2";
    const ipRegex = /let currentIP = ["']([^"']+)["'];?/;
    
    if (ipRegex.test(content)) {
      content = content.replace(ipRegex, `let currentIP = "${ip}";`);
      fs.writeFileSync(ipconfigPath, content, 'utf8');
      console.log(`✅ Đã cập nhật IP thành: ${ip}`);
      return true;
    } else {
      console.log('⚠️  Không tìm thấy dòng currentIP để cập nhật');
      return false;
    }
  } catch (error) {
    console.error(`❌ Lỗi khi cập nhật file ipconfig.ts: ${error.message}`);
    return false;
  }
}

// Hàm chính
async function main() {
  try {
    console.log('🔍 Đang lấy IP từ ipconfig...');
    const ip = await getIPFromIpconfig();
    console.log(`📡 IP tìm thấy: ${ip}`);
    
    console.log('📝 Đang cập nhật ipconfig.ts...');
    const updated = updateIpconfigFile(ip);
    
    if (updated) {
      console.log('✨ Hoàn tất! IP đã được cập nhật.');
    } else {
      console.log('⚠️  Không thể cập nhật file, nhưng IP đã được tìm thấy.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(`❌ Lỗi: ${error.message}`);
    console.log('⚠️  Sử dụng IP mặc định: 172.20.10.2');
    process.exit(0); // Không fail, chỉ cảnh báo
  }
}

// Chạy script
main();

