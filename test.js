// 测试脚本
const { execSync } = require('child_process');

console.log('运行房地产共有面积分摊计算工具的测试...');

try {
  // 运行单元测试
  console.log('运行单元测试...');
  execSync('npm run test', { stdio: 'inherit' });

  // 运行类型检查
  console.log('运行类型检查...');
  execSync('npm run type-check', { stdio: 'inherit' });

  // 运行代码检查
  console.log('运行代码检查...');
  execSync('npm run lint', { stdio: 'inherit' });

  console.log('所有测试通过！');
} catch (error) {
  console.error('测试过程中出现错误:', error.message);
  process.exit(1);
}