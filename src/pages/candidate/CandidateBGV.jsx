import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import mockApi from '../../services/mockApi';
import { useToast } from '../../contexts/ToastContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { DocumentTextIcon, ArrowUpTrayIcon, EyeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const CandidateBGV = () => {
  const [uploadingDoc, setUploadingDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await mockApi.getBGVDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'verified': { variant: 'success', label: 'Verified', color: 'bg-green-100 text-green-700 border-green-200' },
      'pending': { variant: 'warning', label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      'rejected': { variant: 'danger', label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
      'not_uploaded': { variant: 'default', label: 'Not Uploaded', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    };
    const config = statusMap[status] || { variant: 'default', label: status, color: 'bg-gray-100 text-gray-700 border-gray-200' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleFileUpload = async (docId) => {
    setUploadingDoc(docId);

    // Simulate file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) {
        setUploadingDoc(null);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        setUploadingDoc(null);
        return;
      }

      try {
        await mockApi.uploadBGVDocument(docId, file);
        toast.success('Document uploaded successfully!');
        await fetchDocuments(); // Refresh documents
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload document');
      } finally {
        setUploadingDoc(null);
      }
    };

    input.click();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-emerald-500"></div>
      </div>
    );
  }

  const uploadedDocs = documents.filter(doc => doc.status !== 'not_uploaded');
  const pendingDocs = documents.filter(doc => doc.status === 'not_uploaded');
  const verifiedCount = documents.filter(doc => doc.status === 'verified').length;
  const totalRequired = documents.filter(doc => doc.required).length;
  const completionPercentage = totalRequired > 0 ? Math.round((verifiedCount / totalRequired) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">BGV Documents</h1>
        <p className="text-gray-600 mt-1">Upload and manage background verification documents</p>
      </div>

      {/* Verification Progress */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Verification Progress</h3>
            <p className="text-sm text-gray-600">
              {verifiedCount} of {totalRequired} required documents verified
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">{completionPercentage}%</div>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Documents', value: documents.length, icon: '📄', color: 'from-blue-500 to-blue-600' },
          { label: 'Verified', value: verifiedCount, icon: '✅', color: 'from-green-500 to-green-600' },
          { label: 'Pending', value: documents.filter(d => d.status === 'pending').length, icon: '⏳', color: 'from-amber-500 to-amber-600' },
          { label: 'Not Uploaded', value: pendingDocs.length, icon: '📤', color: 'from-gray-500 to-gray-600' },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`text-4xl bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Uploaded Documents */}
      {uploadedDocs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
          <div className="space-y-4">
            {uploadedDocs.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${doc.status === 'verified' ? 'bg-green-100' : doc.status === 'pending' ? 'bg-amber-100' : 'bg-red-100'
                        }`}>
                        {doc.status === 'verified' ? (
                          <CheckCircleIcon className="h-6 w-6 text-green-600" />
                        ) : (
                          <DocumentTextIcon className={`h-6 w-6 ${doc.status === 'pending' ? 'text-amber-600' : 'text-red-600'
                            }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                            {doc.uploadedDate && (
                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded on {doc.uploadedDate}
                              </p>
                            )}
                            {doc.verifiedDate && (
                              <p className="text-xs text-emerald-600 mt-1">
                                ✓ Verified on {doc.verifiedDate}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(doc.status)}
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {doc.status === 'rejected' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleFileUpload(doc.id)}
                              disabled={uploadingDoc === doc.id}
                            >
                              <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                              {uploadingDoc === doc.id ? 'Uploading...' : 'Re-upload'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Uploads */}
      {pendingDocs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Documents</h2>
          <div className="space-y-4">
            {pendingDocs.map((doc) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card hover className="border-dashed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{doc.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {doc.required ? 'Required for verification' : 'Optional'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(doc.status)}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleFileUpload(doc.id)}
                        disabled={uploadingDoc === doc.id}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                        {uploadingDoc === doc.id ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="text-2xl mr-2">ℹ️</span>
          Upload Guidelines
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>All documents must be in PDF or image format (JPG, PNG)</li>
          <li>Maximum file size: 5MB per document</li>
          <li>Ensure documents are clear and readable</li>
          <li>Official stamps and signatures should be visible</li>
          <li>Documents must not be older than 3 months (except educational certificates)</li>
        </ul>
      </Card>
    </div>
  );
};

export default CandidateBGV;
