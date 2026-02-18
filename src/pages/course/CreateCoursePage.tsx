import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import api from '../../services/api';
import { CreateCourseData } from '../../types/course';

interface Category {
  id: string;
  _id?: string;
  name: string;
}

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    category: '',
    level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    price: 0,
    requirements: [''],
    objectives: [''],
    tags: ['']
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await api.get('/categories');
      
      let categoriesList = [];
      if (response.data.data && response.data.data.categories) {
        categoriesList = response.data.data.categories;
      } else if (response.data.categories) {
        categoriesList = response.data.categories;
      } else if (Array.isArray(response.data)) {
        categoriesList = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        categoriesList = response.data.data;
      }
      
      const normalizedCategories = categoriesList.map((cat: any) => ({
        id: cat._id || cat.id,
        _id: cat._id,
        name: cat.name
      }));
      
      setCategories(normalizedCategories);
      
      if (normalizedCategories.length === 0) {
        setError('No categories found. Please contact administrator.');
      }
    } catch (err: any) {
      console.error('Failed to load categories:', err);
      setError(`Failed to load categories: ${err.message}. Make sure backend is running.`);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field: 'requirements' | 'objectives' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field: 'requirements' | 'objectives' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'requirements' | 'objectives' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray.length ? newArray : ['']
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const selectedCategory = categories.find(c => c.id === formData.category);
      
      if (!selectedCategory) {
        setError('Please select a valid category');
        setLoading(false);
        return;
      }

      const submitData: CreateCourseData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        category: selectedCategory.id,
        level: formData.level,
        price: Number(formData.price),
        requirements: formData.requirements.filter(r => r.trim() !== ''),
        objectives: formData.objectives.filter(o => o.trim() !== ''),
        tags: formData.tags.filter(t => t.trim() !== '')
      };

      console.log('Submitting course data:', submitData);
      const response = await courseService.createCourse(submitData);
      console.log('Course created response:', response);
      
      // Check where the course ID is located in the response
      let courseId;
      if (response.data?.course?._id) {
        courseId = response.data.course._id;
      } else if (response.data?.course?.id) {
        courseId = response.data.course.id;
      } else if (response.data?._id) {
        courseId = response.data._id;
      } else if (response.data?.id) {
        courseId = response.data.id;
      }
      
      console.log('Extracted course ID:', courseId);
      
      if (courseId) {
        navigate(`/courses/${courseId}`);
      } else {
        console.error('No course ID in response:', response);
        setError('Course created but could not get ID');
      }
    } catch (err: any) {
      console.error('Error creating course:', err);
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (categoriesLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-center text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {categories.length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No categories found. Please run the seed script in the backend.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Basic Information</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Short Description *</label>
            <input
              type="text"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={200}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Full Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={categories.length === 0}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Requirements</h2>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleArrayInput('requirements', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Basic JavaScript knowledge"
              />
              <button
                type="button"
                onClick={() => removeArrayField('requirements', index)}
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('requirements')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Requirement
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">What You'll Learn</h2>
          {formData.objectives.map((obj, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={obj}
                onChange={(e) => handleArrayInput('objectives', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Build real-world applications"
              />
              <button
                type="button"
                onClick={() => removeArrayField('objectives', index)}
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('objectives')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Learning Objective
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Tags</h2>
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleArrayInput('tags', index, e.target.value)}
                className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., javascript, web development"
              />
              <button
                type="button"
                onClick={() => removeArrayField('tags', index)}
                className="ml-2 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('tags')}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            + Add Tag
          </button>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/courses')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || categories.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
