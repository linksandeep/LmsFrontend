import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { batchService, Batch, BatchStats } from '../../services/batch.service';
import { courseService } from '../../services/course.service';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaUsers,
  FaBook, FaPlayCircle, FaCheckCircle, FaHourglassHalf,
  FaArchive, FaSearch, FaTimes, FaCalendarAlt,
  FaLayerGroup, FaArrowLeft, FaDownload, FaFilter
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const TeacherBatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState<BatchStats>({
    total: 0,
    active: 0,
    upcoming: 0,
    completed: 0,
    archived: 0
  });
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    courseId: '',
    startDate: '',
    duration: 30,
    maxLearners: 50,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedStatus, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [batchesRes, statsRes, coursesRes] = await Promise.all([
        batchService.getBatches({
          status: selectedStatus !== 'all' ? selectedStatus : undefined,
          search: searchTerm || undefined
        }),
        batchService.getBatchStats(),
        courseService.getCourses({ limit: 100 })
      ]);

      // Handle API response structure
      const batchesData = batchesRes.data?.batches || [];
      const statsData = statsRes.data || statsRes;
      const coursesData = coursesRes.data?.courses || [];

      // Debug logs
      console.log('Courses loaded:', coursesData);
      if (coursesData.length > 0) {
        console.log('First course:', {
          id: coursesData[0].id,
          _id: coursesData[0]._id,
          title: coursesData[0].title
        });
      }

      setBatches(batchesData);
      setStats({
        total: statsData.total || 0,
        active: statsData.active || 0,
        upcoming: statsData.upcoming || 0,
        completed: statsData.completed || 0,
        archived: statsData.archived || 0
      });
      setCourses(coursesData);
    } catch (error: any) {
      console.error('Failed to load batches:', error);
      toast.error(error.response?.data?.message || 'Failed to load batches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.courseId || !formData.startDate) {
      toast.error('Please fill all required fields');
      return;
    }

    // Check if courseId is a valid MongoDB ObjectId (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(formData.courseId);
    if (!isValidObjectId) {
      console.error('Invalid course ID:', formData.courseId);
      toast.error('Selected course is invalid. Please select a different course.');
      return;
    }

    console.log('Creating batch with data:', formData);

    try {
      setSubmitting(true);
      const response = await batchService.createBatch(formData);
      console.log('Batch created:', response);
      toast.success('Batch created successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        courseId: '',
        startDate: '',
        duration: 30,
        maxLearners: 50,
        description: ''
      });
      loadData();
    } catch (error: any) {
      console.error('Failed to create batch:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to create batch');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      return;
    }
    
    try {
      await batchService.deleteBatch(id);
      toast.success('Batch deleted successfully');
      loadData();
    } catch (error: any) {
      console.error('Failed to delete batch:', error);
      toast.error(error.response?.data?.message || 'Failed to delete batch');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: JSX.Element; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: <FaPlayCircle className="mr-1" />, label: 'Active' },
      upcoming: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaHourglassHalf className="mr-1" />, label: 'Upcoming' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <FaCheckCircle className="mr-1" />, label: 'Completed' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <FaArchive className="mr-1" />, label: 'Archived' }
    };
    const config = statusConfig[status] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/teacher')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to Dashboard"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <FaLayerGroup className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
                <p className="text-sm text-gray-500 mt-1">Create and manage course batches</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <FaDownload className="mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                New Batch
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Batches</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FaLayerGroup className="text-indigo-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaPlayCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.upcoming}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaHourglassHalf className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Archived</p>
                <p className="text-3xl font-bold text-gray-600">{stats.archived}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaArchive className="text-gray-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatus === 'all' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Batches
              </button>
              <button
                onClick={() => setSelectedStatus('active')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatus === 'active' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedStatus('upcoming')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatus === 'upcoming' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setSelectedStatus('completed')}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedStatus === 'completed' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>

            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search batches by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Batches Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Details</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learners</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length > 0 ? (
                  batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                          <p className="text-xs text-gray-500 font-mono mt-1">{batch.batchCode}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{batch.courseId?.title || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{batch.duration} days</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(batch.startDate)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{batch.enrolledLearners}/{batch.maxLearners}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 rounded-full h-2"
                              style={{ width: `${batch.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{batch.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(batch.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => navigate(`/teacher/batches/${batch.id}`)}
                            className="p-1 text-gray-400 hover:text-indigo-600"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="p-1 text-gray-400 hover:text-green-600"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteBatch(batch.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FaLayerGroup className="mx-auto text-5xl text-gray-300 mb-4" />
                      <p className="text-lg text-gray-500 mb-2">No batches found</p>
                      <p className="text-sm text-gray-400 mb-4">Create your first batch to get started</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Create New Batch
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Batch</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Data Science Batch 2024"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => {
                      // Handle both id and _id
                      const courseId = course.id || course._id;
                      return (
                        <option key={courseId} value={courseId}>
                          {course.title}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Learners
                  </label>
                  <input
                    type="number"
                    value={formData.maxLearners}
                    onChange={(e) => setFormData({ ...formData, maxLearners: parseInt(e.target.value) || 50 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter batch description..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Batch'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherBatchesPage;