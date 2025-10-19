// 构建脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('开始构建房地产共有面积分摊计算工具...');

try {
  // 清理之前的构建
  if (fs.existsSync('dist')) {
    console.log('清理之前的构建文件...');
    fs.rmSync('dist', { recursive: true, force: true });
  }

  if (fs.existsSync('dist-electron')) {
    console.log('清理之前的 Electron 构建文件...');
    fs.rmSync('dist-electron', { recursive: true, force: true });
  }

  // 构建 React 应用
  console.log('构建 React 应用...');
  execSync('npm run build', { stdio: 'inherit' });

  // 构建 Electron 主进程
  console.log('构建 Electron 主进程...');
  execSync('npm run build:electron', { stdio: 'inherit' });

  // 打包 Electron 应用
  console.log('打包 Electron 应用...');
  execSync('npm run build:release', { stdio: 'inherit' });

  console.log('构建完成！');
  console.log('可执行文件位于 release/ 目录中。');
} catch (error) {
  console.error('构建过程中出现错误:', error.message);
  process.exit(1);
}