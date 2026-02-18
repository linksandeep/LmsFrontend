import React from 'react';
import { Lesson } from '../../types/lesson';

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId?: string;
  onLessonSelect: (lesson: Lesson) => void;
  isTeacher?: boolean;
  onEdit?: (lesson: Lesson) => void;
  onDelete?: (lessonId: string) => void;
  onCreateClick?: () => void;
}

const LessonList: React.FC<LessonListProps> = ({
  lessons,
  currentLessonId,
  onLessonSelect,
  isTeacher,
  onEdit,
  onDelete,
  onCreateClick
}) => {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Course Content</h3>
          <p className="text-sm text-gray-500">{lessons.length} lessons</p>
        </div>
        {isTeacher && onCreateClick && (
          <button
            onClick={onCreateClick}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Lesson
          </button>
        )}
      </div>
      
      <div className="divide-y max-h-96 overflow-y-auto">
        {sortedLessons.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            {isTeacher ? (
              <p>No lessons yet. Click "Add Lesson" to create your first lesson.</p>
            ) : (
              <p>No lessons available for this course yet.</p>
            )}
          </div>
        ) : (
          sortedLessons.map((lesson, index) => (
            <div
              key={lesson.id}
              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                currentLessonId === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onLessonSelect(lesson)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                    <span className="font-medium">{lesson.title}</span>
                    {lesson.isPreview && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded">
                        Preview
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mt-1 ml-8">
                    <span>📺 {formatDuration(lesson.duration)}</span>
                  </div>
                </div>
                
                {isTeacher && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(lesson);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(lesson.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LessonList;
