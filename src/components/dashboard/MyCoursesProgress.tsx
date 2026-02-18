import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CourseProgress {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: 'active' | 'completed' | 'dropped';
  certificateUrl?: string;
}

interface MyCoursesProgressProps {
  courses: CourseProgress[];
}

const MyCoursesProgress: React.FC<MyCoursesProgressProps> = ({ courses }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'dropped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (courses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">You haven't enrolled in any courses yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">My Courses</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/courses/${course.courseId}`)}
          >
            <div className="flex items-start space-x-4">
              {course.courseThumbnail ? (
                <img
                  src={course.courseThumbnail}
                  alt={course.courseTitle}
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{course.courseTitle}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(course.status)}`}>
                    {course.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`rounded-full h-2 transition-all duration-300 ${
                        course.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {course.certificateUrl && (
                  <div className="mt-2">
                    <a
                      href={course.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-600 hover:underline flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="mr-1">🎓</span>
                      View Certificate
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursesProgress;
