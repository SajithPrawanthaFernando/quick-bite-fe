'use client';

import React, { useState, useEffect } from 'react';
import { restaurantService } from '@/redux/services/restaurant.service';

interface OperatingHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

interface SpecialDay {
  date: string;
  isOpen: boolean;
  open?: string;
  close?: string;
  reason?: string;
}

interface VisibilitySettings {
  isTemporarilyClosed: boolean;
  operatingHours: OperatingHours[];
  temporaryClosureReason?: string;
  temporaryClosureEndDate?: string;
  specialDays: SpecialDay[];
}

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export default function VisibilitySettings() {
  const [settings, setSettings] = useState<VisibilitySettings>({
    isTemporarilyClosed: false,
    operatingHours: DAYS.map(day => ({
      day,
      open: '09:00',
      close: '21:00',
      isOpen: true
    })),
    temporaryClosureReason: '',
    temporaryClosureEndDate: '',
    specialDays: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getAvailabilitySettings();
      setSettings(response);
    } catch (error) {
      setError('Failed to load settings');
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOperatingHoursChange = (index: number, field: keyof OperatingHours, value: any) => {
    const newHours = [...settings.operatingHours];
    newHours[index] = { ...newHours[index], [field]: value };
    setSettings({ ...settings, operatingHours: newHours });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await restaurantService.updateAvailabilitySettings(settings);
      setSuccess('Settings updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to update settings');
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Restaurant Visibility Settings</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Restaurant Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Restaurant Status</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isTemporarilyClosed"
                  checked={settings.isTemporarilyClosed}
                  onChange={(e) => setSettings({ ...settings, isTemporarilyClosed: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isTemporarilyClosed" className="ml-2 block text-sm text-gray-900">
                  Temporarily Closed
                </label>
              </div>

              {settings.isTemporarilyClosed && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="closureReason" className="block text-sm font-medium text-gray-700">
                      Closure Reason
                    </label>
                    <input
                      type="text"
                      id="closureReason"
                      value={settings.temporaryClosureReason}
                      onChange={(e) => setSettings({ ...settings, temporaryClosureReason: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="closureEndDate" className="block text-sm font-medium text-gray-700">
                      Expected Reopening Date
                    </label>
                    <input
                      type="date"
                      id="closureEndDate"
                      value={settings.temporaryClosureEndDate}
                      onChange={(e) => setSettings({ ...settings, temporaryClosureEndDate: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Operating Hours */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
            <div className="space-y-4">
              {settings.operatingHours.map((hours, index) => (
                <div key={hours.day} className="flex items-center space-x-4">
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700">
                      {hours.day}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours.isOpen}
                      onChange={(e) => handleOperatingHoursChange(index, 'isOpen', e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-500">Open</span>
                  </div>
                  {hours.isOpen && (
                    <>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleOperatingHoursChange(index, 'open', e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleOperatingHoursChange(index, 'close', e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 