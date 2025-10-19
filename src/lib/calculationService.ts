import { AreaItem, ApportionmentLevel, HierarchyConfiguration, CalculationResult } from '../types';

/**
 * Performs the common area apportionment calculation based on the configured hierarchy.
 * This is a pure function that can be easily tested.
 * 
 * @param commonAreas - Array of common area items
 * @param internalUnits - Array of internal unit items
 * @param hierarchy - Configuration of apportionment levels and plans
 * @returns Array of calculation results for each internal unit
 */
export function calculateApportionment(
  commonAreas: AreaItem[],
  internalUnits: AreaItem[],
  hierarchy: HierarchyConfiguration
): CalculationResult[] {
  // Create a copy of all area items to work with
  const areaItemsMap = new Map<string, AreaItem>();
  
  // Add common areas to the map
  commonAreas.forEach(area => {
    areaItemsMap.set(area.id, { ...area });
  });
  
  // Add internal units to the map
  internalUnits.forEach(unit => {
    areaItemsMap.set(unit.id, { ...unit });
  });
  
  // Process each level in order
  const sortedLevels = [...hierarchy.levels].sort((a, b) => a.order - b.order);
  
  // Store apportionment details for each unit
  const apportionmentDetailsMap = new Map<string, Array<{
    levelId: string;
    levelName: string;
    planId: string;
    planName: string;
    apportionedArea: number;
  }>>();
  
  // Initialize apportionment details for internal units
  internalUnits.forEach(unit => {
    apportionmentDetailsMap.set(unit.id, []);
  });
  
  // Process each level
  sortedLevels.forEach(level => {
    // Process each plan in the level
    level.plans.forEach(plan => {
      // Calculate total area of participating objects
      let totalParticipatingArea = 0;
      
      plan.participatingObjects.forEach(objectId => {
        const object = areaItemsMap.get(objectId);
        if (object) {
          totalParticipatingArea += object.cumulativeArea;
        }
      });
      
      // Skip if total participating area is zero to avoid division by zero
      if (totalParticipatingArea === 0) {
        return;
      }
      
      // Calculate total area to be apportioned
      let totalAreaToApportion = 0;
      
      plan.areasToBeApportioned.forEach(areaId => {
        const area = areaItemsMap.get(areaId);
        if (area) {
          totalAreaToApportion += area.cumulativeArea;
        }
      });
      
      // Apportion area to each participating object
      plan.participatingObjects.forEach(objectId => {
        const object = areaItemsMap.get(objectId);
        if (!object) return;
        
        // Calculate the proportion of this object
        const proportion = object.cumulativeArea / totalParticipatingArea;
        
        // Calculate the apportioned area for this object
        const apportionedArea = totalAreaToApportion * proportion;
        
        // Update the cumulative area of the object
        object.cumulativeArea += apportionedArea;
        
        // Store apportionment details for internal units
        if (object.type === 'internal') {
          const details = apportionmentDetailsMap.get(object.id) || [];
          details.push({
            levelId: level.id,
            levelName: level.name,
            planId: plan.id,
            planName: plan.name,
            apportionedArea
          });
          apportionmentDetailsMap.set(object.id, details);
        }
      });
      
      // Set cumulative area of apportioned areas to zero
      plan.areasToBeApportioned.forEach(areaId => {
        const area = areaItemsMap.get(areaId);
        if (area) {
          area.cumulativeArea = 0;
        }
      });
    });
  });
  
  // Generate calculation results for internal units
  const results: CalculationResult[] = [];
  
  internalUnits.forEach(unit => {
    const finalArea = areaItemsMap.get(unit.id)?.cumulativeArea || unit.originalArea;
    const apportionedArea = finalArea - unit.originalArea;
    const details = apportionmentDetailsMap.get(unit.id) || [];
    
    results.push({
      unitId: unit.id,
      unitNumber: unit.id, // Using id as unit number for now
      originalArea: unit.originalArea,
      apportionedArea,
      finalArea,
      apportionmentDetails: details
    });
  });
  
  return results;
}

/**
 * Validates the hierarchy configuration to ensure it's ready for calculation.
 * 
 * @param hierarchy - Configuration of apportionment levels and plans
 * @returns Object with isValid flag and error messages
 */
export function validateHierarchy(hierarchy: HierarchyConfiguration): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Check if there are any levels
  if (hierarchy.levels.length === 0) {
    errors.push('至少需要创建一个分摊层级');
    return { isValid: false, errors };
  }
  
  // Check each level
  hierarchy.levels.forEach((level, levelIndex) => {
    // Check if level has a name
    if (!level.name.trim()) {
      errors.push(`层级 ${levelIndex + 1} 缺少名称`);
    }
    
    // Check if level has any plans
    if (level.plans.length === 0) {
      errors.push(`层级 "${level.name}" 没有分摊计划`);
      return;
    }
    
    // Check each plan
    level.plans.forEach((plan, planIndex) => {
      // Check if plan has a name
      if (!plan.name.trim()) {
        errors.push(`层级 "${level.name}" 的计划 ${planIndex + 1} 缺少名称`);
      }
      
      // Check if plan has areas to be apportioned
      if (plan.areasToBeApportioned.length === 0) {
        errors.push(`计划 "${plan.name}" 没有选择要分摊的共有面积`);
      }
      
      // Check if plan has participating objects
      if (plan.participatingObjects.length === 0) {
        errors.push(`计划 "${plan.name}" 没有选择参与分摊的对象`);
      }
    });
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}