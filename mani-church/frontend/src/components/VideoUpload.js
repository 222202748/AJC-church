import React, { useState } from 'react';
import { Upload, Video, Image, X, Play, Pause } from 'lucide-react';

const VideoUpload = ({ onUploadSuccess, maxFiles = 5 }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      return isVideo || isImage;
    });

    if (validFiles.length + selectedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files`);
      return;
    }

    // Create preview URLs for selected files
    const newPreviewUrls = {};
    validFiles.forEach(file => {
      newPreviewUrls[file.name] = URL.createObjectURL(file);
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => ({ ...prev, ...newPreviewUrls }));
  };

  const removeFile = (fileName) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    if (previewUrls[fileName]) {
      URL.revokeObjectURL(previewUrls[fileName]);
      setPreviewUrls(prev => {
        const updated = { ...prev };
        delete updated[fileName];
        return updated;
      });
    }
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    selectedFiles.forEach(file => {
      formData.append('media', file);
    });

    try {
      const response = await fetch('/api/upload/media', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (onUploadSuccess) {
        onUploadSuccess(result.media);
      }

      // Clear selected files after successful upload
      setSelectedFiles([]);
      Object.values(previewUrls).forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls({});
      
      alert('Files uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const MediaPreview = ({ file, previewUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const isVideo = file.type.startsWith('video/');

    const togglePlay = (videoElement) => {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
    };

    return (
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        {isVideo ? (
          <div className="relative">
            <video
              src={previewUrl}
              className="w-full h-32 object-cover"
              muted
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                const video = e.target.parentElement.querySelector('video');
                togglePlay(video);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-opacity"
            >
              {isPlaying ? (
                <Pause className="text-white" size={24} />
              ) : (
                <Play className="text-white" size={24} />
              )}
            </button>
          </div>
        ) : (
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-32 object-cover"
          />
        )}
        
        <div className="p-2">
          <div className="flex items-center gap-2 mb-1">
            {isVideo ? (
              <Video size={16} className="text-blue-500" />
            ) : (
              <Image size={16} className="text-green-500" />
            )}
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <div className="text-xs text-gray-500">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </div>
        </div>
        
        <button
          onClick={() => removeFile(file.name)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Upload Media Files</h3>
      
      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Images and Videos
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
            disabled={uploading}
          />
          <label htmlFor="media-upload" className="cursor-pointer">
            <Upload className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-gray-600">
              Click to select images and videos
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supports: JPG, PNG, GIF, MP4, AVI, MOV, WebM (Max {maxFiles} files)
            </p>
          </label>
        </div>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-medium mb-3">
            Selected Files ({selectedFiles.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file) => (
              <MediaPreview
                key={file.name}
                file={file}
                previewUrl={previewUrls[file.name]}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={uploadFiles}
            disabled={uploading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300 animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Uploading files...</p>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;