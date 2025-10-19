import * as XLSX from 'xlsx';
import { AreaItem, CalculationResult } from '../types';

/**
 * Exports common areas data to Excel format
 */
export function exportCommonAreasToExcel(commonAreas: AreaItem[]): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(
    commonAreas.map(area => ({
      '项目名称': area.id,
      '原始面积': area.originalArea,
      '累计面积': area.cumulativeArea
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '共有面积');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Exports internal units data to Excel format
 */
export function exportInternalUnitsToExcel(internalUnits: AreaItem[]): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(
    internalUnits.map(unit => ({
      '户号': unit.id,
      '原始套内面积': unit.originalArea,
      '累计面积': unit.cumulativeArea
    }))
  );
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '套内单元');
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Exports calculation results to Excel format
 */
export function exportCalculationResultsToExcel(results: CalculationResult[]): Uint8Array {
  // Main results sheet
  const mainResults = results.map(result => ({
    '户号': result.unitNumber,
    '原始套内面积': result.originalArea,
    '总计分摊面积': result.apportionedArea,
    '最终建筑面积': result.finalArea
  }));
  
  const mainWorksheet = XLSX.utils.json_to_sheet(mainResults);
  
  // Detailed breakdown sheets for each level
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, mainWorksheet, '最终结果');
  
  // Extract unique levels from results
  const levelsMap = new Map<string, string>();
  results.forEach(result => {
    result.apportionmentDetails.forEach(detail => {
      if (!levelsMap.has(detail.levelId)) {
        levelsMap.set(detail.levelId, detail.levelName);
      }
    });
  });
  
  // Create a sheet for each level
  levelsMap.forEach((levelName, levelId) => {
    const levelData: any[] = [];
    
    results.forEach(result => {
      const levelDetails = result.apportionmentDetails.filter(
        detail => detail.levelId === levelId
      );
      
      if (levelDetails.length > 0) {
        levelDetails.forEach(detail => {
          levelData.push({
            '户号': result.unitNumber,
            '分摊计划': detail.planName,
            '分摊面积': detail.apportionedArea
          });
        });
      } else {
        levelData.push({
          '户号': result.unitNumber,
          '分摊计划': '无',
          '分摊面积': 0
        });
      }
    });
    
    const levelWorksheet = XLSX.utils.json_to_sheet(levelData);
    XLSX.utils.book_append_sheet(workbook, levelWorksheet, levelName);
  });
  
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Imports common areas data from Excel file
 */
export function importCommonAreasFromExcel(arrayBuffer: ArrayBuffer): AreaItem[] {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames.includes('共有面积') ? '共有面积' : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  return data.map((row: any) => {
    const id = row['项目名称'] || row['项目编号'] || '';
    const originalArea = parseFloat(row['原始面积']) || 0;
    
    return {
      id: id.toString(),
      type: 'common' as const,
      originalArea,
      cumulativeArea: originalArea
    };
  }).filter(area => area.id && area.originalArea > 0);
}

/**
 * Imports internal units data from Excel file
 */
export function importInternalUnitsFromExcel(arrayBuffer: ArrayBuffer): AreaItem[] {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames.includes('套内单元') ? '套内单元' : workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  return data.map((row: any) => {
    const id = row['户号'] || '';
    const originalArea = parseFloat(row['原始套内面积']) || parseFloat(row['套内面积']) || 0;
    
    return {
      id: id.toString(),
      type: 'internal' as const,
      originalArea,
      cumulativeArea: originalArea
    };
  }).filter(unit => unit.id && unit.originalArea > 0);
}

/**
 * Downloads Excel file to user's computer
 */
export function downloadExcelFile(data: Uint8Array, filename: string): void {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}