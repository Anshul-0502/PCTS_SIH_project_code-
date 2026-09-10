import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Siren, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { mockHospitalInfo } from '../../mocks/hospitalInfo';

export const EmergencyBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-red-600 text-white px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between flex-wrap gap-2 shadow-sm border-b border-red-700 z-50">
      <div className="flex items-center gap-2">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <div className="flex items-center gap-1.5 font-bold tracking-wide">
          <Siren className="w-4 h-4 text-red-100" />
          <span>{t('common.emergency24x7')}:</span>
        </div>
        <span className="font-semibold">{mockHospitalInfo.emergencyHotline}</span>
        <span className="hidden sm:inline text-red-200">|</span>
        <span className="hidden sm:inline text-red-100">Ambulance: {mockHospitalInfo.ambulanceHelpline}</span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="hidden md:flex items-center gap-1 text-red-100 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Immediate emergency access without prior consultation</span>
        </span>
        <Link
          to="/hospital-services?tab=ambulance"
          className="bg-white text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          id="direct-ambulance-button"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>{t('common.callAmbulance')}</span>
        </Link>
      </div>
    </div>
  );
};
