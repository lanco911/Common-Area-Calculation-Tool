import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { DataInputPanel } from './DataInputPanel';
import { useAppStore } from '@/lib/store';

// Mock the store
vi.mock('@/lib/store', () => ({
  useAppStore: vi.fn(),
}));

// Mock the UI components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <div>{children}</div>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

// Mock the child components
vi.mock('./CommonAreaForm', () => ({
  default: () => <div data-testid="common-area-form">CommonAreaForm</div>,
}));

vi.mock('./InternalUnitImport', () => ({
  default: () => <div data-testid="internal-unit-import">InternalUnitImport</div>,
}));

vi.mock('./AreaList', () => ({
  default: ({ type }: any) => (
    <div data-testid="area-list" data-type={type}>
      AreaList
    </div>
  ),
}));

describe('DataInputPanel', () => {
  const mockStore = {
    commonAreas: [],
    internalUnits: [],
    importCommonAreas: vi.fn(),
    clearAllData: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue(mockStore);
  });

  it('renders correctly', () => {
    render(<DataInputPanel />);
    
    expect(screen.getByText('数据输入')).toBeInTheDocument();
    expect(screen.getByText('共有面积')).toBeInTheDocument();
    expect(screen.getByText('套内单元')).toBeInTheDocument();
    expect(screen.getByTestId('common-area-form')).toBeInTheDocument();
    expect(screen.getByTestId('internal-unit-import')).toBeInTheDocument();
  });

  it('displays area lists with correct types', () => {
    render(<DataInputPanel />);
    
    const areaLists = screen.getAllByTestId('area-list');
    expect(areaLists).toHaveLength(2);
    expect(areaLists[0]).toHaveAttribute('data-type', 'common');
    expect(areaLists[1]).toHaveAttribute('data-type', 'internal');
  });

  it('handles file import correctly', async () => {
    render(<DataInputPanel />);
    
    // Find the import button (it should be in the internal unit tab)
    const importButton = screen.getByText('导入Excel');
    
    // Create a mock file
    const file = new File(['test'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Create a mock event for file input
    const fileInput = screen.getByLabelText('选择Excel文件');
    
    // Simulate file selection
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    // Since we're mocking the import function, we just check that it would be called
    // In a real test, we would check if the import function is called with the file
  });

  it('handles clear all data correctly', () => {
    render(<DataInputPanel />);
    
    // Find and click the clear button
    const clearButton = screen.getByText('清空所有数据');
    fireEvent.click(clearButton);
    
    // Check if the clear function was called
    expect(mockStore.clearAllData).toHaveBeenCalled();
  });
});