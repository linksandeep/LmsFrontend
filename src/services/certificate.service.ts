import api from './api';

export const certificateService = {
  // Generate certificate for completed course
  async generateCertificate(enrollmentId: string) {
    const response = await api.post(`/certificates/generate/${enrollmentId}`);
    return response.data;
  },

  // Get user's certificates
  async getMyCertificates() {
    const response = await api.get('/certificates/my-certificates');
    return response.data;
  },

  // Download certificate PDF
  async downloadCertificate(certificateId: string) {
    const response = await api.get(`/certificates/download/${certificateId}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `certificate-${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Verify certificate
  async verifyCertificate(certificateId: string) {
    const response = await api.get(`/certificates/verify/${certificateId}`);
    return response.data;
  },

  // Get certificate preview
  async getCertificatePreview(certificateId: string) {
    const response = await api.get(`/certificates/preview/${certificateId}`, {
      responseType: 'blob'
    });
    return URL.createObjectURL(response.data);
  }
};
