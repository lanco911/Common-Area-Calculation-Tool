import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalculationResult } from '@/types';

interface FinalResultsProps {
  results: CalculationResult[];
}

const FinalResults: React.FC<FinalResultsProps> = ({ results }) => {
  // Calculate summary statistics
  const totalOriginalArea = results.reduce((sum, result) => sum + result.originalArea, 0);
  const totalApportionedArea = results.reduce((sum, result) => sum + result.apportionedArea, 0);
  const totalFinalArea = results.reduce((sum, result) => sum + result.finalArea, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-600">原始套内总面积</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOriginalArea.toFixed(2)} m²</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-600">总计分摊面积</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApportionedArea.toFixed(2)} m²</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-600">最终建筑面积</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFinalArea.toFixed(2)} m²</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>分摊结果明细</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>户号</TableHead>
                  <TableHead>原始套内面积</TableHead>
                  <TableHead>总计分摊面积</TableHead>
                  <TableHead>最终建筑面积</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.unitId}>
                    <TableCell className="font-medium">{result.unitNumber}</TableCell>
                    <TableCell>{result.originalArea.toFixed(2)}</TableCell>
                    <TableCell>{result.apportionedArea.toFixed(2)}</TableCell>
                    <TableCell className="font-medium">{result.finalArea.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalResults;