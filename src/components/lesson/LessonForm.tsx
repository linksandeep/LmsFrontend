import React, { useState } from 'react';
import { LessonFormData } from '../../types/lesson';

interface LessonFormProps {
  initialData?: Partial<LessonFormData>;
  onSubmit: (data: LessonFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const LessonForm: React.FC<LessonFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  loading
}) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 0,
    videoUrl: initialData?.videoUrl || '',
    videoProvider: initialData?.videoProvider || 'youtube',
    isPreview: initialData?.isPreview || false,
    resources: initialData?.resources || [{ title: '', url: '' }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [...formData.resources, { title: '', url: '' }]
    });
  };

  const removeResource = (index: number) => {
    const newResources = formData.resources.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      resources: newResources.length ? newResources : [{ title: '', url: '' }]
    });
  };

  const updateResource = (index: number, field: 'title' | 'url', value: string) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    setFormData({
      ...formData,
      resources: updatedResources
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">Lesson Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="e.g., Introduction to the Course"
        />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          placeholder="Describe what students will learn in this lesson..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Duration (minutes)</label>
          <input
            type="number"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
            min="0"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Video Provider</label>
          <select
            value={formData.videoProvider}
            onChange={(e) => setFormData({ ...formData, videoProvider: e.target.value as any })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="custom">Custom URL</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Video URL</label>
        <input
          type="url"
          value={formData.videoUrl}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://www.youtube.com/watch?v=..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Supports YouTube, Vimeo, or direct video URLs
        </p>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isPreview"
          checked={formData.isPreview}
          onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
          className="mr-2"
        />
        <label htmlFor="isPreview" className="text-gray-700">
          Make this lesson available as a free preview
        </label>
      </div>

      {/* Resources */}
      <div className="border-t pt-4">
        <label className="block text-gray-700 mb-2">Resources (Optional)</label>
        {formData.resources.map((resource, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={resource.title}
              onChange={(e) => updateResource(index, 'title', e.target.value)}
              placeholder="Resource title"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="url"
              value={resource.url}
              onChange={(e) => updateResource(index, 'url', e.target.value)}
              placeholder="Resource URL"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => removeResource(index)}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addResource}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          + Add Resource
        </button>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData?.title ? 'Update Lesson' : 'Create Lesson'}
        </button>
      </div>
    </form>
  );
};

export default LessonForm;
