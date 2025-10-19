import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';
import CommonAreaForm from './CommonAreaForm';
import AreaList from './AreaList';
import InternalUnitImport from './InternalUnitImport';
import { toast } from 'react-hot-toast';
import { exportCommonAreasToExcel, exportInternalUnitsToExcel, downloadExcelFile } from '@/lib/excelExportService';

const DataInputPanel: React.FC = () => {
  const { commonAreas, internalUnits } = useAppStore();
  const [activeTab, setActiveTab] = useState('common-areas');

  const handleExportCommonAreas = () => {
    try {
      if (commonAreas.length === 0) {
        toast.error('没有可导出的共有面积数据');
        return;
      }
      
      const data = exportCommonAreasToExcel(commonAreas);
      downloadExcelFile(data, '共有面积.xlsx');
      toast.success('共有面积数据已导出');
    } catch (error) {
      toast.error('导出共有面积数据失败');
      console.error('Export common areas error:', error);
    }
  };

  const handleExportInternalUnits = () => {
    try {
      if (internalUnits.length === 0) {
        toast.error('没有可导出的套内单元数据');
        return;
      }
      
      const data = exportInternalUnitsToExcel(internalUnits);
      downloadExcelFile(data, '套内单元.xlsx');
      toast.success('套内单元数据已导出');
    } catch (error) {
      toast.error('导出套内单元数据失败');
      console.error('Export internal units error:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">数据输入</h2>
        <p className="text-gray-600">输入共有面积和套内单元数据，支持手动输入和Excel导入</p>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="common-areas">共有面积</TabsTrigger>
            <TabsTrigger value="internal-units">套内单元</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="common-areas" className="h-full mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>添加共有面积</CardTitle>
                    <CardDescription>手动输入共有面积项目</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CommonAreaForm />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>共有面积列表</CardTitle>
                      <CardDescription>当前已添加的共有面积项目</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleExportCommonAreas}
                      disabled={commonAreas.length === 0}
                    >
                      导出Excel
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <AreaList type="common" items={commonAreas} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="internal-units" className="h-full mt-0 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle>导入套内单元</CardTitle>
                    <CardDescription>从Excel文件导入套内单元数据</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InternalUnitImport />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>套内单元列表</CardTitle>
                      <CardDescription>当前已导入的套内单元</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={handleExportInternalUnits}
                      disabled={internalUnits.length === 0}
                    >
                      导出Excel
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <AreaList type="internal" items={internalUnits} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default DataInputPanel;