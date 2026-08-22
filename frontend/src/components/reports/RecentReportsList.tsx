import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

const recentReports = [
  { id: 1, period: 'August 2026', type: 'Financial Overview', date: '22 Aug 2026' },
  { id: 2, period: 'July 2026', type: 'Financial Overview', date: '31 Jul 2026' },
  { id: 3, period: 'Q2 2026', type: 'Financial Summary', date: '30 Jun 2026' },
  { id: 4, period: 'June 2026', type: 'Expense Analysis', date: '30 Jun 2026' }
];

interface Props {
  onOpenPreview: () => void;
}

export const RecentReportsList: React.FC<Props> = ({ onOpenPreview }) => {
  return (
    <div className="report-section-card">
      <h3 className="report-section-title">RECENT REPORTS</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table className="recent-reports-table">
          <thead>
            <tr>
              <th>Report Period</th>
              <th>Type</th>
              <th>Generated On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentReports.map(report => (
              <tr key={report.id}>
                <td style={{ fontWeight: 500 }}>{report.period}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{report.type}</td>
                <td style={{ color: 'var(--text-secondary)' }}>{report.date}</td>
                <td>
                  <button className="recent-action-btn" onClick={onOpenPreview}>VIEW</button>
                  <button className="recent-action-btn"><Download size={14} style={{ marginBottom: '-2px' }} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
