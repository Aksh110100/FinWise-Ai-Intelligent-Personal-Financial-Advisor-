import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface CustomDropdownProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className={`custom-dropdown-container ${isOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button className="custom-dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span>{selectedLabel}</span>
        <span className="custom-dropdown-arrow">▼</span>
      </button>
      {isOpen && (
        <div className="custom-dropdown-menu">
          {options.map(opt => (
            <div 
              key={opt.value} 
              className={`custom-dropdown-item ${opt.value === value ? 'active' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ReportControls: React.FC = () => {
  const [reportType, setReportType] = useState('Financial Overview');
  const [period, setPeriod] = useState('August 2026');
  const [compare, setCompare] = useState('Previous Month');

  const reportTypeOptions = [
    { label: 'Financial Overview', value: 'Financial Overview' },
    { label: 'Expense Analysis', value: 'Expense Analysis' },
    { label: 'Savings Report', value: 'Savings Report' },
    { label: 'Investment Summary', value: 'Investment Summary' },
    { label: 'Goal Progress', value: 'Goal Progress' },
    { label: 'Complete Financial Report', value: 'Complete Financial Report' },
  ];

  const periodOptions = [
    { label: 'This Month', value: 'This Month' },
    { label: 'August 2026', value: 'August 2026' },
    { label: 'July 2026', value: 'July 2026' },
    { label: 'Last 3 Months', value: 'Last 3 Months' },
    { label: 'Last 6 Months', value: 'Last 6 Months' },
    { label: 'This Year', value: 'This Year' },
  ];

  const compareOptions = [
    { label: 'Compare: None', value: 'None' },
    { label: 'Compare: Previous Month', value: 'Previous Month' },
    { label: 'Compare: Previous Period', value: 'Previous Period' },
    { label: 'Compare: Previous Year', value: 'Previous Year' },
  ];

  return (
    <div className="report-controls-bar">
      <div className="report-control-group">
        
        <CustomDropdown 
          value={reportType} 
          options={reportTypeOptions} 
          onChange={setReportType} 
        />
        
        <CustomDropdown 
          value={period} 
          options={periodOptions} 
          onChange={setPeriod} 
        />

        <CustomDropdown 
          value={compare} 
          options={compareOptions} 
          onChange={setCompare} 
        />

      </div>

      <button className="report-generate-btn">
        <Download size={16} />
        GENERATE REPORT
      </button>
    </div>
  );
};
