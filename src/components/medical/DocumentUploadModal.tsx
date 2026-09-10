import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Trash2, Loader2, Sparkles } from 'lucide-react';
import { UploadedDocument } from '../../types/consultation';
import { consultationService } from '../../services/consultation.service';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentAdded: (doc: UploadedDocument) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onDocumentAdded,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<UploadedDocument['category']>('Prescription');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<UploadedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories: UploadedDocument['category'][] = [
    'Prescription',
    'Lab Report',
    'Discharge Summary',
    'Diagnostic Report',
    'Previous Consultation Report',
  ];

  const handleFileProcess = async (file: File) => {
    setError(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Only PDF, JPG, JPEG, and PNG files are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum supported size is 10 MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(20);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const doc = await consultationService.uploadAndProcessDocument(file, selectedCategory);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadedDoc(doc);
      onDocumentAdded(doc);
    } catch {
      setError('Error extracting medical data from document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Previous Medical Document</h3>
            <p className="text-xs text-slate-500">AI OCR will extract medications, lab values, and history</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="mt-4">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Select Document Category
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                  selectedCategory === cat
                    ? 'border-medical-600 bg-medical-50 text-medical-700 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dropzone */}
        {!uploadedDoc && (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-4 border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-medical-500 bg-medical-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-medical-400 hover:bg-slate-50/70'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />

            {isUploading ? (
              <div className="space-y-3">
                <Loader2 className="w-10 h-10 text-medical-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">Analyzing Document & Extracting Medical Data...</p>
                <div className="w-48 mx-auto bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-medical-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-medical-50 text-medical-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag and drop your report
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supported: PDF, JPG, PNG (Max: 10 MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Extracted Data Result Preview */}
        {uploadedDoc && (
          <div className="mt-4 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{uploadedDoc.fileName}</p>
                  <p className="text-[10px] text-slate-500">
                    {(uploadedDoc.fileSize / 1024).toFixed(1)} KB • {uploadedDoc.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setUploadedDoc(null)}
                className="text-slate-400 hover:text-red-500 p-1"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>OCR Extracted Clinical Insights</span>
              </div>
              {uploadedDoc.extractedData?.medicines && (
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">Medications: </span>
                  {uploadedDoc.extractedData.medicines.join(', ')}
                </p>
              )}
              {uploadedDoc.extractedData?.labValues && (
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">Lab Values: </span>
                  {uploadedDoc.extractedData.labValues.map(v => `${v.test} (${v.value} ${v.unit})`).join(', ')}
                </p>
              )}
              {uploadedDoc.extractedData?.diagnosesMentioned && (
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-900">Prior Conditions: </span>
                  {uploadedDoc.extractedData.diagnosesMentioned.join(', ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {uploadedDoc ? 'Done' : 'Cancel'}
          </button>
          {uploadedDoc && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-medical-600 hover:bg-medical-700 rounded-xl transition-colors shadow-xs"
            >
              Attach to Consultation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
