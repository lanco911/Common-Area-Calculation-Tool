// 生成测试数据的脚本
const XLSX = require('xlsx');
const path = require('path');

// 生成套内单元测试数据
function generateInternalUnitsData() {
  const data = [];
  
  // 表头
  data.push(['户号', '套内面积']);
  
  // 生成100条测试数据
  for (let i = 1; i <= 100; i++) {
    const floor = Math.floor((i - 1) / 8) + 1;
    const unit = ((i - 1) % 8) + 1;
    const unitNumber = `${floor}0${unit}`;
    
    // 生成随机面积，范围在70-120平方米之间
    const area = (Math.random() * 50 + 70).toFixed(2);
    
    data.push([unitNumber, parseFloat(area)]);
  }
  
  return data;
}

// 生成共有面积测试数据
function generateCommonAreasData() {
  const data = [];
  
  // 表头
  data.push(['项目名称', '原始面积']);
  
  // 常见共有面积项目
  const commonAreas = [
    ['大堂', (Math.random() * 200 + 100).toFixed(2)],
    ['电梯井', (Math.random() * 50 + 30).toFixed(2)],
    ['楼梯间', (Math.random() * 100 + 50).toFixed(2)],
    ['设备层', (Math.random() * 300 + 200).toFixed(2)],
    ['屋顶机房', (Math.random() * 100 + 50).toFixed(2)],
    ['地下车库', (Math.random() * 1000 + 500).toFixed(2)],
    ['物业用房', (Math.random() * 100 + 50).toFixed(2)],
    ['配电室', (Math.random() * 50 + 30).toFixed(2)],
    ['水泵房', (Math.random() * 50 + 30).toFixed(2)],
    ['消防控制室', (Math.random() * 30 + 20).toFixed(2)],
    ['值班室', (Math.random() * 20 + 10).toFixed(2)],
    ['门卫室', (Math.random() * 20 + 10).toFixed(2)],
    ['垃圾房', (Math.random() * 30 + 20).toFixed(2)],
    ['公共卫生间', (Math.random() * 50 + 30).toFixed(2)],
  ];
  
  commonAreas.forEach(area => {
    data.push(area);
  });
  
  return data;
}

// 创建Excel文件
function createExcelFile(data, filename) {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, filename);
}

// 主函数
function main() {
  try {
    // 生成套内单元数据
    const internalUnitsData = generateInternalUnitsData();
    createExcelFile(internalUnitsData, 'test_internal_units.xlsx');
    console.log('套内单元测试数据已生成: test_internal_units.xlsx');
    
    // 生成共有面积数据
    const commonAreasData = generateCommonAreasData();
    createExcelFile(commonAreasData, 'test_common_areas.xlsx');
    console.log('共有面积测试数据已生成: test_common_areas.xlsx');
    
    console.log('\n测试数据生成完成！');
    console.log('您可以使用这些Excel文件来测试应用程序的导入功能。');
  } catch (error) {
    console.error('生成测试数据时出错:', error);
  }
}

// 运行主函数
main();