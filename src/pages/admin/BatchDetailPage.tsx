import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { batchService, Batch } from '../../services/batch.service';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaPlus, FaBook,
  FaUsers, FaCalendarAlt, FaClock, FaChartLine,
  FaVideo, FaFileAlt, FaTasks, FaStickyNote,
  FaPlayCircle, FaCheckCircle, FaHourglassHalf,
  FaCog, FaDownload, FaUpload, FaEllipsisV
} from 'react-icons/fa';

const BatchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'modules' | 'learners' | 'resources'>('details');

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
      archived: <FaCog className="mr-1" />
    };
    return (
      <span className={`flex items-center px-3 py-1 text-sm rounded-full border ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
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
            onClick={() => navigate('/admin/batches')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/batches')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{batch.name}</h1>
                  {getStatusBadge(batch.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">ID: {batch.batchCode}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FaEdit className="mr-2" />
                Edit Batch
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center">
                <FaTrash className="mr-2" />
                Delete
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FaEllipsisV className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-t border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'details', label: 'Details', icon: FaBook },
              { id: 'modules', label: 'Modules', icon: FaVideo },
              { id: 'learners', label: 'Learners', icon: FaUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="text-lg" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {activeTab === 'details' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Course Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h2>
                  <div className="flex items-start space-x-4">
                    {batch.courseId?.thumbnail ? (
                      <img
                        src={batch.courseId.thumbnail}
                        alt={batch.courseId.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FaBook className="text-white text-4xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{batch.courseId?.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Course ID: {batch.courseId?.id}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="text-sm text-gray-600">Level: {batch.courseId?.level}</span>
                        <span className="text-sm text-gray-600">Price: ${batch.courseId?.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Batch Details */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Details</h2>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Start Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(batch.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">End Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(batch.endDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Duration</dt>
                    <dd className="text-sm font-medium text-gray-900">{batch.duration} days</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Max Learners</dt>
                    <dd className="text-sm font-medium text-gray-900">{batch.maxLearners}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Enrolled Learners</dt>
                    <dd className="text-sm font-medium text-gray-900">{batch.enrolledLearners}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Progress</dt>
                    <dd className="text-sm font-medium text-gray-900">{batch.progress}%</dd>
                  </div>
                </dl>
                {batch.description && (
                  <div className="mt-4">
                    <dt className="text-sm text-gray-500 mb-2">Description</dt>
                    <dd className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{batch.description}</dd>
                  </div>
                )}
              </div>

              {/* Instructors */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Instructors</h2>
                <div className="space-y-3">
                  {batch.instructors?.map((instructor) => (
                    <div key={instructor.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {instructor.name.charAt(0)}
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

            {/* Right Column - Stats & Progress */}
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Batch Progress</h2>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600">{batch.progress}%</div>
                  <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3"
                    style={{ width: `${batch.progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FaUsers className="text-blue-600 text-xl" />
                    <span className="text-2xl font-bold text-gray-900">{batch.enrolledLearners}</span>
                  </div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="text-xs text-gray-400">of {batch.maxLearners} max</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <FaBook className="text-green-600 text-xl" />
                    <span className="text-2xl font-bold text-gray-900">{batch.modules?.length || 0}</span>
                  </div>
                  <p className="text-sm text-gray-600">Modules</p>
                  <p className="text-xs text-gray-400">Total lessons: {
                    batch.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0)
                  }</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-between">
                    <span className="flex items-center">
                      <FaPlus className="mr-2" />
                      Add Module
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 flex items-center justify-between">
                    <span className="flex items-center">
                      <FaUpload className="mr-2" />
                      Upload Resource
                    </span>
                    <span>→</span>
                  </button>
                  <button className="w-full px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 flex items-center justify-between">
                    <span className="flex items-center">
                      <FaUsers className="mr-2" />
                      Add Learners
                    </span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Course Modules</h2>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                <FaPlus className="mr-2" />
                Add Module
              </button>
            </div>
            
            {batch.modules && batch.modules.length > 0 ? (
              <div className="space-y-4">
                {batch.modules.map((module, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                          {module.order}
                        </span>
                        <h3 className="font-medium text-gray-900">{module.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <FaEdit />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    {module.description && (
                      <div className="px-4 py-2 text-sm text-gray-600 border-t border-gray-200">
                        {module.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FaBook className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">No modules added yet</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create First Module
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'learners' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Enrolled Learners</h2>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Search learners..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Add Learner
                </button>
              </div>
            </div>
            
            <div className="text-center py-12">
              <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500">No learners enrolled yet</p>
              <p className="text-sm text-gray-400 mt-1">Total capacity: {batch.enrolledLearners}/{batch.maxLearners}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDetailPage;