import adminApi from '@/lib/axios/adminAxios';
import type { ReportFilter } from '@/types/IReportFilter ';

export const fetchSalesReports = async (filters: ReportFilter) => {
  const res = await adminApi.get('/salesReport', { params: filters });
  return res.data;
};

export const downloadSalesReportExcel = async (filters: ReportFilter) => {
  const res = await adminApi.get('/salesReport/download', {
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
