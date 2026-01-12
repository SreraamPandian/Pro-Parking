import React, { useState, useRef } from 'react';
import { Plus, Trash, Video, X, Save, Film } from 'lucide-react';
import { useData } from '../context/DataContext';

const KioskManagement = () => {
  const { kioskVideos: videos, setKioskVideos: setVideos } = useData();
  const [showFormModal, setShowFormModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null); // For editing, not used yet
  const [formData, setFormData] = useState({
    title: '',
    videoFile: null,
    videoPreviewUrl: null,
  });
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert("Invalid file type. Please upload a video file (e.g., MP4, WebM).");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      // Optional: Add file size check here if needed
      // if (file.size > 50 * 1024 * 1024) { // Example: 50MB limit
      //   alert("File is too large. Max 50MB allowed for demo.");
      //   if (fileInputRef.current) fileInputRef.current.value = "";
      //   return;
      // }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, videoFile: file, videoPreviewUrl: reader.result });
      };
      reader.onerror = (error) => {
        console.error("Error reading video file:", error);
        alert("Error reading video file. Please try again.");
        if (fileInputRef.current) fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerVideoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetForm = () => {
    setFormData({ title: '', videoFile: null, videoPreviewUrl: null });
    setCurrentVideo(null); // For future editing
    if (fileInputRef.current) {
      try {
        fileInputRef.current.value = "";
      } catch (error) {
        console.warn("Could not reset file input:", error);
      }
    }
  };

  const handleOpenFormModal = (videoToEdit = null) => {
    resetForm();
    // Editing not implemented yet, so always opens for new video
    setShowFormModal(true);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.videoFile) {
      alert("Please upload a video file.");
      return;
    }

    const newVideoEntry = {
      id: Date.now(),
      title: formData.title || formData.videoFile.name, // Use filename if title is empty
      videoFile: formData.videoFile, // In a real app, you'd upload this file
      videoPreviewUrl: formData.videoPreviewUrl,
      uploadedAt: new Date().toISOString(),
    };
    setVideos(prevVideos => [...prevVideos, newVideoEntry]);
    handleCloseFormModal();
  };

  const handleDeleteVideo = (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(prevVideos => prevVideos.filter(video => video.id !== videoId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kiosk Management</h1>
          <p className="text-gray-600">Manage video content for display kiosks</p>
        </div>
        <button
          className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
          onClick={() => handleOpenFormModal()}
        >
          <Plus size={18} className="mr-2" />
          Add New Video
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {videos.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <Film size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No videos uploaded yet.</p>
            <p>Click "Add New Video" to upload content for kiosks.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-gray-50 rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4">
                  <h3 className="text-md font-semibold text-primary-blue truncate" title={video.title}>
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                {video.videoPreviewUrl && (
                  <div className="aspect-video bg-black">
                    <video
                      controls
                      src={video.videoPreviewUrl}
                      className="w-full h-full object-contain"
                      preload="metadata"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
                <div className="p-3 bg-gray-100 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="p-2 text-primary-red hover:text-red-700 focus:outline-none focus:ring-1 focus:ring-primary-red rounded-md"
                    title="Delete Video"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 transform transition-all max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-2 z-10 border-b">
              <h3 className="text-xl font-semibold text-gray-800">
                Add New Kiosk Video
              </h3>
              <button
                onClick={handleCloseFormModal}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="videoTitle" className="block text-sm font-medium text-gray-700 mb-1">Video Title (Optional)</label>
                <input
                  type="text"
                  name="title"
                  id="videoTitle"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                  placeholder="e.g., Welcome Video, Safety Instructions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Video File</label>
                <div className="mt-1 flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={triggerVideoUpload}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue flex items-center"
                  >
                    <Video size={16} className="mr-2" />
                    {formData.videoFile ? 'Change Video' : 'Select Video'}
                  </button>
                  <input
                    type="file"
                    name="videoFile"
                    id="videoFile"
                    ref={fileInputRef}
                    onChange={handleVideoFileChange}
                    className="hidden"
                    accept="video/*"
                  />
                  {formData.videoFile && <span className="text-sm text-gray-600 truncate max-w-xs" title={formData.videoFile.name}>{formData.videoFile.name}</span>}
                </div>
                <p className="mt-1 text-xs text-gray-500">Supported formats: MP4, WebM, Ogg. Keep file sizes reasonable for web display.</p>
              </div>

              {formData.videoPreviewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Preview</label>
                  <div className="aspect-video bg-gray-100 border border-gray-200 rounded-md overflow-hidden">
                    <video controls src={formData.videoPreviewUrl} className="w-full h-full object-contain">
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3 sticky bottom-0 bg-white py-3 border-t">
                <button
                  type="button"
                  onClick={handleCloseFormModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-blue"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-red text-white rounded-md hover:bg-red-700 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
                  disabled={!formData.videoFile}
                >
                  <Save size={18} className="mr-2" />
                  Upload Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KioskManagement;
