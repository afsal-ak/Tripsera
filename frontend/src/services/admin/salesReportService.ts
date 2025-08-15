import api from '@/lib/axios/api';
import type { ReportFilter } from '@/types/IReportFilter ';

export const fetchSalesReports = async (filters: ReportFilter) => {
  const res = await api.get('/admin/salesReport', { params: filters });
  return res.data;
};

export const downloadSalesReportExcel = async (filters: ReportFilter) => {
  const res = await api.get('/admin/salesReport/excel/download', {
    params: filters,
    responseType: 'blob',
  });

  const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sales_report.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
};
export const downloadSalesReportPDF = async (filters: ReportFilter) => {
  const res = await api.get('/admin/salesReport/pdf/download', {
    params: filters,
    responseType: 'blob', // Must be blob for PDF
  });

  const blob = new Blob([res.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'sales_report.pdf');
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
};
