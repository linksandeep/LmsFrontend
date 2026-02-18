import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Lesson } from '../../types/lesson';

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ lesson, onComplete }) => {
  const [played, setPlayed] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Use any type for the progress handler to avoid type conflicts
  const handleProgress = (progress: any) => {
    if (progress && typeof progress.played === 'number') {
      setPlayed(progress.played);
      // Mark as complete when 90% watched
      if (progress.played > 0.9 && !completed) {
        setCompleted(true);
        onComplete?.();
      }
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-black" style={{ paddingTop: '56.25%', position: 'relative' }}>
        {lesson.videoUrl ? (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <ReactPlayer
              url={lesson.videoUrl}
              width="100%"
              height="100%"
              controls
              onProgress={handleProgress}
              config={{
                youtube: {
                  playerVars: {
                    modestbranding: 1,
                    rel: 0
                  }
                } as any
              }}
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <p className="text-white">No video available for this lesson</p>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>📺 Duration: {formatDuration(lesson.duration)}</span>
          {played > 0 && (
            <span className="ml-4">📊 Progress: {Math.round(played * 100)}%</span>
          )}
        </div>
        
        {lesson.resources && lesson.resources.length > 0 && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">📎 Resources</h3>
            <div className="space-y-2">
              {lesson.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100"
                >
                  <span className="text-blue-600 mr-2">📄</span>
                  <span>{resource.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
        
        {completed && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-center">
            <span className="mr-2">✅</span>
            Lesson completed! Great job!
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonPlayer;
