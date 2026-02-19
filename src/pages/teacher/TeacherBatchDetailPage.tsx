import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { batchService, Batch } from '../../services/batch.service';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaPlus, FaUsers,
  FaBook, FaPlayCircle, FaCheckCircle, FaHourglassHalf,
  FaArchive, FaCalendarAlt, FaClock, FaVideo,
  FaFileAlt, FaTasks, FaGraduationCap, FaChartLine,
  FaUserPlus, FaDownload, FaShare, FaEllipsisV, FaTimes
} from 'react-icons/fa';

const TeacherBatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'learners' | 'resources'>('overview');
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleForm, setModuleForm] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (id) {
      loadBatch();
    }
  }, [id]);

  const loadBatch = async () => {
    try {
      setLoading(true);
      const response = await batchService.getBatch(id!);
      setBatch(response.data.batch);
    } catch (error) {
      console.error('Failed to load batch:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch) return;
    try {
      await batchService.addModule(batch.id, moduleForm);
      setShowModuleModal(false);
      setModuleForm({ name: '', description: '', startDate: '', endDate: '' });
      loadBatch();
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  const handleDeleteModule = async (moduleIndex: number) => {
    if (!batch) return;
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await batchService.deleteModule(batch.id, moduleIndex);
        loadBatch();
      } catch (error) {
        console.error('Failed to delete module:', error);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', icon: <FaPlayCircle className="mr-1" />, label: 'Active' },
      upcoming: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <FaHourglassHalf className="mr-1" />, label: 'Upcoming' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: <FaCheckCircle className="mr-1" />, label: 'Completed' },
      archived: { bg: 'bg-gray-100', text: 'text-gray-800', icon: <FaArchive className="mr-1" />, label: 'Archived' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.upcoming;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading batch details...</p>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Batch not found</h2>
          <button
            onClick={() => navigate('/teacher/batches')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Batches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/teacher/batches')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
                  {getStatusBadge(batch.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">Batch Code: {batch.batchCode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <FaShare className="mr-2" />
                Share
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                <FaDownload className="mr-2" />
                Export
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                <FaEdit className="mr-2" />
                Edit Batch
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FaEllipsisV className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200">
          <div className="px-8">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: FaBook },
                { id: 'modules', label: 'Modules', icon: FaVideo },
                { id: 'learners', label: 'Learners', icon: FaUsers },
                { id: 'resources', label: 'Resources', icon: FaFileAlt }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  <span>{tab.label}</span>
                  {tab.id === 'learners' && batch.enrolledLearners > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-xs">
                      {batch.enrolledLearners}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Info */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
                <div className="flex items-start space-x-4">
                  {batch.courseId?.thumbnail ? (
                    <img
                      src={batch.courseId.thumbnail}
                      alt={batch.courseId.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FaBook className="text-white text-3xl" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{batch.courseId?.title}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-500">Level: {batch.courseId?.level || 'All Levels'}</span>
                      <span className="text-sm text-gray-500">Price: ${batch.courseId?.price || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Details</h2>
                <dl className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-sm text-gray-500">Start Date</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">{formatDate(batch.startDate)}</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-sm text-gray-500">End Date</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">{formatDate(batch.endDate)}</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-sm text-gray-500">Duration</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">{batch.duration} days</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-sm text-gray-500">Max Learners</dt>
                    <dd className="text-sm font-medium text-gray-900 mt-1">{batch.maxLearners}</dd>
                  </div>
                </dl>
                {batch.description && (
                  <div className="mt-4">
                    <dt className="text-sm text-gray-500 mb-2">Description</dt>
                    <dd className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{batch.description}</dd>
                  </div>
                )}
              </div>

              {/* Instructors */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructors</h2>
                <div className="space-y-3">
                  {batch.instructors?.map((instructor) => (
                    <div key={instructor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">
                          {instructor.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{instructor.name}</p>
                        <p className="text-sm text-gray-500">{instructor.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Progress</h2>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-indigo-600">{batch.progress}%</div>
                  <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FaUsers className="text-indigo-600 text-xl" />
                    <span className="text-2xl font-bold text-gray-900">{batch.enrolledLearners}</span>
                  </div>
                  <p className="text-sm text-gray-600">Enrolled Learners</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FaVideo className="text-green-600 text-xl" />
                    <span className="text-2xl font-bold text-gray-900">{batch.modules?.length || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Modules</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowModuleModal(true)}
                    className="w-full px-4 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center">
                      <FaPlus className="mr-2" />
                      Add Module
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-between transition-colors">
                    <span className="flex items-center">
                      <FaUserPlus className="mr-2" />
                      Add Learners
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center justify-between transition-colors">
                    <span className="flex items-center">
                      <FaGraduationCap className="mr-2" />
                      View Progress
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
                <p className="text-sm text-gray-500 mt-1">Organize your course content into modules</p>
              </div>
              <button
                onClick={() => setShowModuleModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <FaPlus className="mr-2" />
                Add Module
              </button>
            </div>

            {batch.modules && batch.modules.length > 0 ? (
              <div className="space-y-4">
                {batch.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium">
                          {module.order}
                        </span>
                        <h3 className="font-medium text-gray-900">{module.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-indigo-600">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {module.description && (
                      <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-200">
                        {module.description}
                      </div>
                    )}
                    {module.lessons && module.lessons.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Lessons ({module.lessons.length})</p>
                        <div className="space-y-2">
                          {module.lessons.map((lesson: any, idx: number) => (
                            <div key={idx} className="flex items-center text-sm text-gray-600">
                              <FaPlayCircle className="text-indigo-500 mr-2 text-xs" />
                              {lesson.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaVideo className="mx-auto text-5xl text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">No modules added yet</p>
                <p className="text-sm text-gray-400 mb-4">Start by adding your first module</p>
                <button
                  onClick={() => setShowModuleModal(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
                >
                  <FaPlus className="mr-2" />
                  Add First Module
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learners' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Enrolled Learners</h2>
                <p className="text-sm text-gray-500 mt-1">Manage students enrolled in this batch</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search learners..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                  <FaUserPlus className="mr-2" />
                  Add Learners
                </button>
              </div>
            </div>

            <div className="text-center py-12">
              <FaUsers className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No learners enrolled yet</p>
              <p className="text-sm text-gray-400 mb-4">Enrolled students will appear here</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center">
                <FaUserPlus className="mr-2" />
                Enroll Students
              </button>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Resources</h2>
                <p className="text-sm text-gray-500 mt-1">Upload and manage course materials</p>
              </div>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                <FaPlus className="mr-2" />
                Upload Resource
              </button>
            </div>

            <div className="text-center py-12">
              <FaFileAlt className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">No resources uploaded yet</p>
              <p className="text-sm text-gray-400 mb-4">Upload course materials for your students</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center">
                <FaPlus className="mr-2" />
                Upload First Resource
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Module</h2>
                <button
                  onClick={() => setShowModuleModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </div>

              <form onSubmit={handleAddModule} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={moduleForm.name}
                    onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Introduction to the Course"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Describe what this module covers..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={moduleForm.startDate}
                      onChange={(e) => setModuleForm({ ...moduleForm, startDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={moduleForm.endDate}
                      onChange={(e) => setModuleForm({ ...moduleForm, endDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModuleModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Module
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

export default TeacherBatchDetailPage;