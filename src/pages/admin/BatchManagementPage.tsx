import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { batchService, Batch } from '../../services/batch.service';
import { courseService } from '../../services/course.service';
import { 
  FaPlus, FaEdit, FaTrash, FaEye, FaCalendarAlt,
  FaUsers, FaBook, FaClock, FaCheckCircle, FaHourglassHalf,
  FaArchive, FaPlayCircle, FaChartLine, FaDownload,
  FaSearch, FaFilter, FaTimes
} from 'react-icons/fa';

const BatchManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [stats, setStats] = useState({
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
    maxLearners: 100,
    description: ''
  });

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

      // Fix: Access data.data.batches (double nested)
      setBatches(batchesRes.data?.batches || []);
      setStats(statsRes.data);
      setCourses(coursesRes.data?.courses || []);
    } catch (error) {
      console.error('Failed to load batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await batchService.createBatch(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        courseId: '',
        startDate: '',
        duration: 30,
        maxLearners: 100,
        description: ''
      });
      loadData();
    } catch (error) {
      console.error('Failed to create batch:', error);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchService.deleteBatch(id);
        loadData();
      } catch (error) {
        console.error('Failed to delete batch:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    const icons = {
      upcoming: <FaHourglassHalf className="mr-1" />,
      active: <FaPlayCircle className="mr-1" />,
      completed: <FaCheckCircle className="mr-1" />,
      archived: <FaArchive className="mr-1" />
    };
    return (
      <span className={`flex items-center px-2 py-1 text-xs rounded-full border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
              <p className="text-sm text-gray-500 mt-1">Create and manage course batches</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPlus className="mr-2" />
              Create New Batch
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Batches</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaBook className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaPlayCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.upcoming}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FaHourglassHalf className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Archived</p>
                <p className="text-2xl font-bold text-gray-600">{stats.archived || 0}</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaArchive className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Batches
              </button>
              <button
                onClick={() => setSelectedStatus('active')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === 'active' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setSelectedStatus('upcoming')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === 'upcoming' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setSelectedStatus('completed')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setSelectedStatus('archived')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedStatus === 'archived' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Archived
              </button>
            </div>
            
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search batches by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            
            <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center whitespace-nowrap">
              <FaDownload className="mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Batches Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructors</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learners</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.length > 0 ? (
                  batches.map((batch, index) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                          <div className="text-xs text-gray-400">ID: {batch.batchCode}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{batch.courseId?.title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{batch.duration} days</div>
                        <div className="text-xs text-gray-400">Starts: {formatDate(batch.startDate)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {batch.instructors?.map(i => i.name).join(', ') || 'Not assigned'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{batch.enrolledLearners}/{batch.maxLearners}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>{batch.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 rounded-full h-2"
                              style={{ width: `${batch.progress}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(batch.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate(`/admin/batches/${batch.id}`)}
                            className="p-1 text-gray-400 hover:text-blue-600"
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
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                      <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
                      <p className="text-lg">No batches found</p>
                      <p className="text-sm text-gray-400 mt-1">Create your first batch to get started</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
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
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Learners
                    </label>
                    <input
                      type="number"
                      value={formData.maxLearners}
                      onChange={(e) => setFormData({ ...formData, maxLearners: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter batch description..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Batch
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

export default BatchManagementPage;