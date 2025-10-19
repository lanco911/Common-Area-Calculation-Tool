export interface AreaItem {
  id: string;
  type: 'common' | 'internal';
  originalArea: number;
  cumulativeArea: number;
}

export interface ApportionmentPlan {
  id: string;
  name: string;
  areasToBeApportioned: string[];
  participatingObjects: string[];
}

export interface ApportionmentLevel {
  id: string;
  name: string;
  order: number;
  plans: ApportionmentPlan[];
}

export interface HierarchyConfiguration {
  levels: ApportionmentLevel[];
}

export interface CalculationResult {
  unitId: string;
  unitNumber: string;
  originalArea: number;
  apportionedArea: number;
  finalArea: number;
  apportionmentDetails: Array<{
    levelId: string;
    levelName: string;
    planId: string;
    planName: string;
    apportionedArea: number;
  }>;
}

export interface ExcelData {
  commonAreas: AreaItem[];
  internalUnits: AreaItem[];
}

export interface AppState {
  commonAreas: AreaItem[];
  internalUnits: AreaItem[];
  hierarchy: HierarchyConfiguration;
  calculationResults: CalculationResult[];
  isCalculating: boolean;
  calculationError: string | null;
}

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: string;
}