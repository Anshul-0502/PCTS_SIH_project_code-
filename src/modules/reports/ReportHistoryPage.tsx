import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Share2, 
  Eye, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  X, 
  ExternalLink,
  Copy,
  QrCode,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { reportService } from '../../services/reports.service';
import { useAuth } from '../../store/AuthContext';
import { AIPatientReport, ReportType } from '../../types/report';
import { ReportDocumentView } from '../../components/medical/ReportDocumentView';

export const ReportHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { patient } = useAuth();

  const [reports, setReports] = useState<AIPatientReport[]>([]);
  const [selectedType, setSelectedType] = useState<ReportType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<AIPatientReport | null>(null);
  const [shareModalReport, setShareModalReport] = useState<AIPatientReport | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    reportService.filterReports({
      searchQuery,
      reportType: selectedType,
    }).then(setReports);
  }, [searchQuery, selectedType, patient]);

  const reportTypeTabs: Array<{ id: ReportType | 'All'; label: string; count?: number }> = [
    { id: 'All', label: t('reports.allTypes') },
    { id: 'AI Consultation', label: t('reports.aiConsultation') },
    { id: 'Lab Report', label: t('reports.labReports') },
    { id: 'Prescription', label: t('reports.prescriptions') },
  ];

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
              Module 3 • Digital Records
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Read-Only Official Records</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {t('reports.title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('reports.subtitle')}
          </p>
        </div>

        <div className="text-xs text-slate-500 font-semibold bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs">
          Total Available Records: <span className="font-extrabold text-medical-600">{reports.length}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar (Matching images/45b61888 Step 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {reportTypeTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedType === tab.id
                    ? 'bg-medical-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('reports.searchPlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-medical-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

        </div>
      </div>

      {/* Reports List / Table */}
      {reports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">{t('reports.noReportsFound')}</h3>
            <p className="text-xs text-slate-400">Try modifying your search terms or filter criteria</p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setSelectedType('All'); }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            {t('reports.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map(report => (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {report.reportNumber}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      report.reportType === 'AI Consultation'
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : report.reportType === 'Lab Report'
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {report.reportType}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {report.consultationDate}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    {report.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{report.chiefComplaint}</h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {report.physicianReadySummary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 rounded-xl shadow-xs transition-colors"
                  id={`view-report-button-${report.id}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <button
                  onClick={() => setShareModalReport(report)}
                  className="p-2 text-slate-600 hover:text-medical-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  title="Share Report"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-slate-100 rounded-3xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto my-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 px-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-slate-600">
                Clinical Report Document Viewer
              </span>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-2xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ReportDocumentView report={selectedReport} />
          </div>
        </div>
      )}

      {/* Share Report Modal (Matching images/45b61888 Step 4) */}
      {shareModalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-medical-600" />
                <h3 className="font-bold text-slate-900 text-sm">Share Clinical Report</h3>
              </div>
              <button
                onClick={() => setShareModalReport(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <p className="font-mono font-bold text-xs text-slate-800">{shareModalReport.reportNumber}</p>
              <p className="text-xs text-slate-600">{shareModalReport.chiefComplaint}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={handleCopyShareLink}
                className="p-3 border border-slate-200 hover:border-medical-400 bg-white rounded-xl text-center font-bold text-slate-800 flex flex-col items-center gap-2 transition-all"
              >
                <Copy className="w-5 h-5 text-medical-600" />
                <span>{copiedLink ? 'Link Copied!' : 'Copy Secure Link'}</span>
              </button>

              <button
                onClick={() => alert(`Simulated secure doctor QR code for ${shareModalReport.reportNumber}`)}
                className="p-3 border border-slate-200 hover:border-medical-400 bg-white rounded-xl text-center font-bold text-slate-800 flex flex-col items-center gap-2 transition-all"
              >
                <QrCode className="w-5 h-5 text-teal-600" />
                <span>Doctor Scan QR</span>
              </button>
            </div>

            <div className="p-3 bg-medical-50/70 rounded-xl border border-medical-100 text-[11px] text-medical-900 flex items-start gap-2">
              <Lock className="w-4 h-4 text-medical-600 flex-shrink-0 mt-0.5" />
              <span>
                Reports are shared via time-limited encrypted links. Only verified medical staff can access full clinical history.
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
