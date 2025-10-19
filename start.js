// 启动脚本
const { execSync } = require('child_process');
const path = require('path');

console.log('启动房地产共有面积分摊计算工具...');

try {
  // 检查是否已安装依赖
  try {
    require('electron');
    console.log('依赖已安装，直接启动应用...');
  } catch (error) {
    console.log('依赖未安装，正在安装...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // 启动开发服务器
  console.log('启动开发服务器...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('启动过程中出现错误:', error.message);
  process.exit(1);
}