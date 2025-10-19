import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AreaList } from './AreaList';
import { useAppStore } from '@/lib/store';
import { AreaItem } from '@/types';

// Mock the store
vi.mock('@/lib/store', () => ({
  useAppStore: vi.fn(),
}));

// Mock the UI components
vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('AreaList', () => {
  const mockStore = {
    deleteCommonArea: vi.fn(),
    deleteInternalUnit: vi.fn(),
  };

  const commonAreaItems: AreaItem[] = [
    {
      id: '大堂',
      type: 'common',
      originalArea: 100,
      cumulativeArea: 100,
    },
    {
      id: '电梯井',
      type: 'common',
      originalArea: 50,
      cumulativeArea: 50,
    },
  ];

  const internalUnitItems: AreaItem[] = [
    {
      id: '101',
      type: 'internal',
      originalArea: 85.5,
      cumulativeArea: 85.5,
    },
    {
      id: '102',
      type: 'internal',
      originalArea: 92.3,
      cumulativeArea: 92.3,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppStore as any).mockReturnValue(mockStore);
  });

  it('renders common area list correctly', () => {
    render(<AreaList type="common" items={commonAreaItems} />);
    
    expect(screen.getByText('共有面积')).toBeInTheDocument();
    expect(screen.getByText('项目名称')).toBeInTheDocument();
    expect(screen.getByText('大堂')).toBeInTheDocument();
    expect(screen.getByText('电梯井')).toBeInTheDocument();
    expect(screen.getByText('100.00')).toBeInTheDocument();
    expect(screen.getByText('50.00')).toBeInTheDocument();
  });

  it('renders internal unit list correctly', () => {
    render(<AreaList type="internal" items={internalUnitItems} />);
    
    expect(screen.getByText('套内单元')).toBeInTheDocument();
    expect(screen.getByText('户号')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('102')).toBeInTheDocument();
    expect(screen.getByText('85.50')).toBeInTheDocument();
    expect(screen.getByText('92.30')).toBeInTheDocument();
  });

  it('renders empty state for common areas', () => {
    render(<AreaList type="common" items={[]} />);
    
    expect(screen.getByText('暂无共有面积数据')).toBeInTheDocument();
  });

  it('renders empty state for internal units', () => {
    render(<AreaList type="internal" items={[]} />);
    
    expect(screen.getByText('暂无套内单元数据')).toBeInTheDocument();
  });

  it('handles delete for common area', () => {
    render(<AreaList type="common" items={commonAreaItems} />);
    
    // Find and click the delete button for the first item
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete function was called
    expect(mockStore.deleteCommonArea).toHaveBeenCalledWith('大堂');
  });

  it('handles delete for internal unit', () => {
    render(<AreaList type="internal" items={internalUnitItems} />);
    
    // Find and click the delete button for the first item
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);
    
    // Check if the delete function was called
    expect(mockStore.deleteInternalUnit).toHaveBeenCalledWith('101');
  });
});