'use client';

import { Button } from '@repo/ui';
import { Download } from 'lucide-react';
import { useDataContext } from '@/app/provider/data-provider';

export const ExportData = () => {
  const data = useDataContext();

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      dateRange: {
        start: data.startDate,
        end: data.endDate,
      },
      currentMetrics: data.currentMetrics,
      goals: data.goalTargets,
      charts: {
        steps: data.linearCharts.steps,
        weight: data.linearCharts.weight,
        exercise: data.linearCharts.exercise,
        energy: data.linearCharts.energy,
        distance: data.linearCharts.distance,
        water: data.linearCharts.water,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `motivate-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csvRows: string[] = [];

    // Header
    csvRows.push('Metric,Value,Date');

    // Current metrics
    Object.entries(data.currentMetrics).forEach(([key, value]) => {
      if (value !== undefined) {
        csvRows.push(
          `${key},${value},${new Date().toISOString().split('T')[0]}`,
        );
      }
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `motivate-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={exportToJSON}>
        <Download className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
      <Button variant="outline" size="sm" onClick={exportToCSV}>
        <Download className="mr-2 h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
