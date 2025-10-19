import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { exportToExcel } from '@/lib/excelExportService';
import { Download, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import FinalResults from './FinalResults';
import CalculationProcess from './CalculationProcess';
import VisualizationPanel from './VisualizationPanel';

const CalculationResultsPanel: React.FC = () => {
  const {
    calculationResults,
    calculating,
    calculationError,
    commonAreas,
    internalUnits,
    hierarchy
  } = useAppStore();

  const handleExportToExcel = () => {
    if (!calculationResults || calculationResults.length === 0) {
      toast.error('没有可导出的计算结果');
      return;
    }

    try {
      exportToExcel(calculationResults, commonAreas, internalUnits, hierarchy);
      toast.success('Excel文件已导出');
    } catch (error) {
      toast.error('导出失败：' + (error as Error).message);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">计算结果</h2>
          <p className="text-gray-600">查看最终计算结果、详细过程和可视化分析</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleExportToExcel}
            disabled={!calculationResults || calculationResults.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            导出Excel
          </Button>
        </div>
      </div>

      {calculating && (
        <div className="flex items-center justify-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mr-3" />
          <span className="text-lg">正在计算中，请稍候...</span>
        </div>
      )}

      {calculationError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-800">
              <span className="font-medium">计算错误：</span>
              <span className="ml-2">{calculationError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!calculating && !calculationError && (!calculationResults || calculationResults.length === 0) && (
        <div className="flex flex-col items-center justify-center p-12">
          <FileSpreadsheet className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">暂无计算结果</h3>
          <p className="text-gray-500 text-center max-w-md">
            请先在"分摊层级管理"页面配置分摊层级，然后点击"开始计算"按钮进行计算
          </p>
        </div>
      )}

      {!calculating && !calculationError && calculationResults && calculationResults.length > 0 && (
        <Tabs defaultValue="final-results" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="final-results">最终结果</TabsTrigger>
            <TabsTrigger value="calculation-process">计算过程</TabsTrigger>
            <TabsTrigger value="visualization">可视化</TabsTrigger>
          </TabsList>
          
          <TabsContent value="final-results" className="flex-1 mt-4">
            <FinalResults results={calculationResults} />
          </TabsContent>
          
          <TabsContent value="calculation-process" className="flex-1 mt-4">
            <CalculationProcess 
              results={calculationResults} 
              hierarchy={hierarchy}
              commonAreas={commonAreas}
              internalUnits={internalUnits}
            />
          </TabsContent>
          
          <TabsContent value="visualization" className="flex-1 mt-4">
            <VisualizationPanel 
              results={calculationResults} 
              hierarchy={hierarchy}
              commonAreas={commonAreas}
              internalUnits={internalUnits}
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CalculationResultsPanel;