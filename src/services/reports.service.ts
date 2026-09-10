import { AIPatientReport, ReportType } from '../types/report';
import { mockReportsList } from '../mocks/reports';

class ReportsService {
  private reports: AIPatientReport[] = [...mockReportsList];

  async getReports(patientId?: string): Promise<AIPatientReport[]> {
    await new Promise(r => setTimeout(r, 300));
    if (patientId) {
      return this.reports.filter(r => r.patientId === patientId || r.patientId === 'PAT-2025-0892');
    }
    return [...this.reports];
  }

  async getReportById(id: string): Promise<AIPatientReport | null> {
    await new Promise(r => setTimeout(r, 200));
    const found = this.reports.find(r => r.id === id || r.reportNumber === id);
    return found || null;
  }

  async saveNewReport(report: AIPatientReport): Promise<AIPatientReport> {
    await new Promise(r => setTimeout(r, 400));
    const existingIndex = this.reports.findIndex(r => r.id === report.id);
    if (existingIndex >= 0) {
      this.reports[existingIndex] = report;
    } else {
      this.reports.unshift(report);
    }
    return report;
  }

  async filterReports(options: {
    searchQuery?: string;
    reportType?: ReportType | 'All';
    startDate?: string;
    endDate?: string;
  }): Promise<AIPatientReport[]> {
    await new Promise(r => setTimeout(r, 250));
    let filtered = [...this.reports];

    if (options.reportType && options.reportType !== 'All') {
      filtered = filtered.filter(r => r.reportType === options.reportType);
    }

    if (options.searchQuery && options.searchQuery.trim() !== '') {
      const q = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        r =>
          r.reportNumber.toLowerCase().includes(q) ||
          r.chiefComplaint.toLowerCase().includes(q) ||
          r.reportType.toLowerCase().includes(q) ||
          r.physicianReadySummary.toLowerCase().includes(q)
      );
    }

    if (options.startDate) {
      filtered = filtered.filter(r => r.consultationDate >= options.startDate!);
    }

    if (options.endDate) {
      filtered = filtered.filter(r => r.consultationDate <= options.endDate!);
    }

    return filtered;
  }
}

export const reportService = new ReportsService();
