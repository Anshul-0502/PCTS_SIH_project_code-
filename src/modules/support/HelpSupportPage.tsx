import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  AlertTriangle, 
  Star, 
  Video, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Send, 
  CheckCircle2, 
  Play,
  Upload,
  Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockFAQs, mockUserGuides, mockVideoTutorials, FAQItem } from '../../mocks/supportContent';

export const HelpSupportPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'faq' | 'guide' | 'contact' | 'feedback' | 'report_issue' | 'videos'>('faq');

  // FAQ Search & Accordion state
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');

  // Contact Form State
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactCategory, setContactCategory] = useState('AI Consultation Support');
  const [contactTicketId, setContactTicketId] = useState<string | null>(null);

  // Feedback Form State
  const [rating, setRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Issue Report Form State
  const [issueTitle, setIssueTitle] = useState('');
  const [issueModule, setIssueModule] = useState('Module 2: AI Consultation');
  const [issueDescription, setIssueDescription] = useState('');
  const [issueTicketId, setIssueTicketId] = useState<string | null>(null);

  const filteredFaqs = mockFAQs.filter(faq => {
    const matchesSearch = faqSearch.trim() === '' ||
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase());
    const matchesCategory = selectedFaqCategory === 'All' || faq.category === selectedFaqCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactTicketId(`TKT-AIIA-${Math.floor(10000 + Math.random() * 90000)}`);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(true);
    setTimeout(() => setFeedbackSuccess(false), 4000);
    setFeedbackText('');
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIssueTicketId(`ISSUE-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2.5 py-0.5 rounded-full border border-medical-200">
          Module 7 • Patient Assistance & Resolution
        </span>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          {t('nav.helpSupport')}
        </h1>
        <p className="text-xs text-slate-500">
          Frequently asked questions, clinical usage guides, technical issue reporting, and feedback
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 text-xs font-bold pb-2">
        {[
          { id: 'faq', label: 'FAQs', icon: HelpCircle },
          { id: 'guide', label: 'User Guides', icon: BookOpen },
          { id: 'contact', label: 'Contact Support', icon: MessageSquare },
          { id: 'feedback', label: 'Feedback', icon: Star },
          { id: 'report_issue', label: 'Report Issue', icon: AlertTriangle },
          { id: 'videos', label: 'Video Tutorials', icon: Video },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-medical-600 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: FAQs */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  placeholder="Search questions about AI consultation, reports, appointments..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-medical-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['All', 'AI Consultation', 'Reports', 'Appointments', 'Pharmacy'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedFaqCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      selectedFaqCategory === cat
                        ? 'bg-medical-100 text-medical-800 border border-medical-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Accordion List */}
            <div className="space-y-3 pt-2">
              {filteredFaqs.map(faq => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-medical-700 bg-medical-50 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-1">{faq.question}</h4>
                        {faq.questionHi && (
                          <p className="text-xs text-slate-500 font-medium">{faq.questionHi}</p>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 space-y-2 leading-relaxed animate-in fade-in">
                        <p className="font-medium text-slate-800">{faq.answer}</p>
                        {faq.answerHi && (
                          <p className="text-slate-600 border-t border-slate-200 pt-2 text-[11px] leading-relaxed">
                            {faq.answerHi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: User Guides */}
      {activeTab === 'guide' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockUserGuides.map(guide => (
            <div key={guide.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-medical-50 text-medical-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{guide.title}</h3>
                <p className="text-xs text-slate-500">{guide.description}</p>

                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5 pt-2">
                  {guide.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed pl-1">
                      <span className="font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-100 text-right">
                <span className="text-[11px] text-medical-600 font-bold">Verified Workflow Guide ✓</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Contact Support */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="space-y-1 text-center">
            <h3 className="text-xl font-black text-slate-900">Contact Hospital Support Desk</h3>
            <p className="text-xs text-slate-500">
              Submit an inquiry to the All India Institute of Ayurveda technical desk
            </p>
          </div>

          {contactTicketId ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-base">Support Request Logged</h4>
              <p className="text-xs text-slate-600">
                Your ticket has been registered. Reference ID: <strong className="font-mono text-slate-900">{contactTicketId}</strong>
              </p>
              <button
                onClick={() => { setContactTicketId(null); setContactSubject(''); setContactMessage(''); }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold mt-2"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={contactCategory}
                  onChange={e => setContactCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                >
                  <option value="AI Consultation Support">AI Consultation Support</option>
                  <option value="Appointment Booking Issue">Appointment Booking Issue</option>
                  <option value="Report Access & Download">Report Access & Download</option>
                  <option value="General Hospital Query">General Hospital Query</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="Brief summary of inquiry"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="Explain your question or request..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 4: Feedback */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-slate-900">Share Your Experience</h3>
            <p className="text-xs text-slate-500">
              Help us improve the AI case-taking software for patients and doctors
            </p>
          </div>

          {feedbackSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Thank you! Your feedback has been recorded.</span>
            </div>
          )}

          <form onSubmit={handleFeedbackSubmit} className="space-y-5">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-slate-700">Rate your consultation experience:</span>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Comments / Suggestions</label>
              <textarea
                rows={3}
                required
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder="What went well or what can we improve in the voice consultation?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-medical-600 hover:bg-medical-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: Report an Issue */}
      {activeTab === 'report_issue' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-slate-900">Report a Technical Issue</h3>
            <p className="text-xs text-slate-500">
              Found a bug in microphone recording, OCR extraction, or appointment slots?
            </p>
          </div>

          {issueTicketId ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-emerald-950 text-base">Issue Ticket Logged</h4>
              <p className="text-xs text-slate-600">
                Ticket ID: <strong className="font-mono text-slate-900">{issueTicketId}</strong>
              </p>
              <button
                onClick={() => { setIssueTicketId(null); setIssueTitle(''); setIssueDescription(''); }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold mt-2"
              >
                Log Another Issue
              </button>
            </div>
          ) : (
            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Affected Module</label>
                <select
                  value={issueModule}
                  onChange={e => setIssueModule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                >
                  <option value="Module 1: Patient Registration">Module 1: Patient Registration</option>
                  <option value="Module 2: AI Consultation">Module 2: AI Consultation (Voice/OCR)</option>
                  <option value="Module 3: My Report History">Module 3: My Report History</option>
                  <option value="Module 4: Notification Center">Module 4: Notification Center</option>
                  <option value="Module 8: Hospital Services">Module 8: Hospital Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  value={issueTitle}
                  onChange={e => setIssueTitle(e.target.value)}
                  placeholder="e.g. Microphone didn't record in Hindi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description & Steps to Reproduce</label>
                <textarea
                  rows={4}
                  required
                  value={issueDescription}
                  onChange={e => setIssueDescription(e.target.value)}
                  placeholder="Describe what happened..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500 cursor-pointer">
                <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                <span>Attach optional screenshot (PNG/JPG)</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Submit Bug Report
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 6: Video Tutorials */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockVideoTutorials.map(vid => (
            <div key={vid.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 group cursor-pointer">
                <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-95 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 text-medical-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-medical-600" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {vid.duration}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-medical-700 uppercase">{vid.category}</span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm mt-0.5">{vid.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{vid.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
