import React, { useState, useEffect } from 'react';
import { emailService } from '../../../services/email.service';

interface Preferences {
  marketing: boolean;
  courseUpdates: boolean;
  newLessons: boolean;
  achievements: boolean;
  weeklyDigest: boolean;
  discussionReplies: boolean;
}

const NotificationPreferences: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>({
    marketing: true,
    courseUpdates: true,
    newLessons: true,
    achievements: true,
    weeklyDigest: false,
    discussionReplies: true
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await emailService.getPreferences();
      setPreferences(response.data || preferences);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await emailService.updatePreferences(preferences);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  const preferenceItems = [
    { key: 'marketing' as const, label: 'Marketing emails', description: 'Receive updates about new courses and promotions' },
    { key: 'courseUpdates' as const, label: 'Course updates', description: 'Get notified when your courses are updated' },
    { key: 'newLessons' as const, label: 'New lessons', description: 'Email me when new lessons are added' },
    { key: 'achievements' as const, label: 'Achievements', description: 'Get notified when you earn certificates' },
    { key: 'weeklyDigest' as const, label: 'Weekly digest', description: 'Receive a weekly summary of your progress' },
    { key: 'discussionReplies' as const, label: 'Discussion replies', description: 'Get notified when someone replies to you' }
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Choose what emails you'd like to receive</p>
        </div>
        <div className="flex items-center space-x-3">
          {success && (
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <span className="mr-1">✅</span>
              Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            {saving ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              'Save Preferences'
            )}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {preferenceItems.map((item) => (
          <div
            key={item.key}
            className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex-1">
              <label
                htmlFor={item.key}
                className="text-base font-medium text-gray-900 dark:text-white cursor-pointer"
              >
                {item.label}
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                preferences[item.key] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={preferences[item.key]}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
        <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">📧 Email Frequency</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          You'll receive these emails immediately as events happen. The weekly digest comes every Monday at 9 AM.
        </p>
      </div>
    </div>
  );
};

export default NotificationPreferences;
