import React, { useState } from 'react';
import { certificateService } from '../../services/certificate.service';

interface CertificateCardProps {
  certificate: {
    id: string;
    courseTitle: string;
    issueDate: string;
    certificateNumber: string;
    downloadUrl?: string;
  };
  onView?: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onView }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await certificateService.downloadCertificate(certificate.id);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${certificate.courseTitle}`,
        text: `I've completed the course ${certificate.courseTitle}!`,
        url: window.location.origin + `/certificate/verify/${certificate.id}`
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all">
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-32 flex items-center justify-center">
        <span className="text-6xl">🏆</span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {certificate.courseTitle}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          Issued: {new Date(certificate.issueDate).toLocaleDateString()}
        </p>
        
        <p className="text-xs text-gray-500 mb-4 font-mono">
          ID: {certificate.certificateNumber}
        </p>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {downloading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Downloading...
              </>
            ) : (
              <>
                <span className="mr-2">📥</span>
                Download
              </>
            )}
          </button>
          
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="Share Certificate"
          >
            <span className="text-xl">📤</span>
          </button>
          
          <button
            onClick={onView}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
            title="View Certificate"
          >
            <span className="text-xl">👁️</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;
