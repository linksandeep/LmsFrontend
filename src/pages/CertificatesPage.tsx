import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { certificateService } from '../services/certificate.service';
import CertificateCard from '../components/certificate/CertificateCard';
import CertificatePreview from '../components/certificate/CertificatePreview';

interface Certificate {
  id: string;
  courseTitle: string;
  issueDate: string;
  certificateNumber: string;
  downloadUrl?: string;
}

const CertificatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    earnedThisMonth: 0,
    shared: 0
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getMyCertificates();
      const data = response.data?.certificates || [];
      setCertificates(data);
      
      // Calculate stats
      const thisMonth = new Date().getMonth();
      const earnedThisMonth = data.filter((c: Certificate) => 
        new Date(c.issueDate).getMonth() === thisMonth
      ).length;

      setStats({
        total: data.length,
        earnedThisMonth,
        shared: 0
      });
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
          <p className="text-gray-600 mt-2">Your achievements and completions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                🏆
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Total Certificates</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                📅
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.earnedThisMonth}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Earned This Month</h3>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">
                📤
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats.shared}</span>
            </div>
            <h3 className="text-gray-600 font-medium">Shared</h3>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-8xl mb-6">🎓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No certificates yet</h2>
            <p className="text-gray-600 mb-8">Complete courses to earn certificates and showcase your achievements</p>
            <button
              onClick={() => navigate('/courses')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onView={() => setSelectedCertificate(cert.id)}
              />
            ))}
          </div>
        )}

        {/* Certificate Preview Modal */}
        {selectedCertificate && (
          <CertificatePreview
            certificateId={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
