import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import { importInternalUnitsFromExcel } from '@/lib/excelExportService';
import { toast } from 'react-hot-toast';
import { Upload, FileSpreadsheet } from 'lucide-react';

const InternalUnitImport: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { importInternalUnits } = useAppStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const units = importInternalUnitsFromExcel(arrayBuffer);
      
      if (units.length === 0) {
        toast.error('Excel文件中没有找到有效的套内单元数据');
        return;
      }
      
      importInternalUnits(units);
      toast.success(`成功导入 ${units.length} 个套内单元`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error('导入Excel文件失败，请检查文件格式');
      console.error('Import error:', error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleDownloadTemplate = () => {
    // Create a simple template with one example row
    const templateData = [
      {
        '户号': '101',
        '套内面积': 85.5
      },
      {
        '户号': '102',
        '套内面积': 92.3
      }
    ];
    
    // Create a temporary workbook
    const XLSX = require('xlsx');
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '套内单元');
    
    // Generate and download the file
    const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = '套内单元模板.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    toast.success('模板文件已下载');
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">
          选择Excel文件导入套内单元数据
        </p>
        <Button onClick={handleImportClick} className="mb-2">
          <Upload className="mr-2 h-4 w-4" />
          选择文件
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <div className="text-center">
        <Button variant="outline" onClick={handleDownloadTemplate}>
          下载模板文件
        </Button>
      </div>
      
      <div className="text-sm text-gray-500">
        <p className="font-medium mb-2">Excel文件格式要求：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>第一行为标题行</li>
          <li>必须包含"户号"列</li>
          <li>必须包含"套内面积"或"原始套内面积"列</li>
          <li>面积必须为大于0的数字</li>
        </ul>
      </div>
    </div>
  );
};

export default InternalUnitImport;