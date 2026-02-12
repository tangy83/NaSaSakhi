'use client';

import { useState, useRef, useCallback, useId } from 'react';
import { VALIDATION_RULES } from '@/types/api';
import { FileUploadResponse } from '@/types/api';
import { uploadDocument, uploadLogo } from '@/lib/api';

// Component props interface
interface FileUploadProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  uploadType: 'document' | 'logo'; // Determines validation rules
  value?: string; // Current file URL
  onChange: (fileUrl: string) => void; // Callback when file is uploaded
  onRemove?: () => void; // Callback when file is removed
  accept?: string; // File input accept attribute
  maxFiles?: number; // For multiple file support (default: 1)
  className?: string;
}

// Upload state
type UploadState = 'idle' | 'uploading' | 'success' | 'error';

// File info interface
interface FileInfo {
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string; // For images
}

export function FileUpload({
  label,
  required = false,
  error,
  helperText,
  uploadType,
  value,
  onChange,
  onRemove,
  accept,
  maxFiles = 1,
  className = '',
}: FileUploadProps) {
  const id = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  // Get validation rules based on upload type
  const validationRules = VALIDATION_RULES.fileUpload[uploadType];
  const maxSize = validationRules.maxSize;
  const allowedTypes = validationRules.allowedTypes;

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = uploadType === 'document' 
        ? 'PDF, JPEG, and PNG' 
        : 'JPEG, PNG, and SVG';
      return `Only ${allowedExtensions} files are allowed.`;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = uploadType === 'document' ? '5MB' : '2MB';
      return `File exceeds ${maxSizeMB} limit. Please compress or select a different file.`;
    }

    return null;
  };

  // Upload file to server
  const uploadFile = async (file: File): Promise<void> => {
    setUploadState('uploading');
    setUploadProgress(0);
    setUploadError(null);

    // Validate first
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      setUploadState('error');
      return;
    }

    try {
      // Simulate progress (in real implementation, use XMLHttpRequest for progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Use unified API for file upload
      const uploadFunction = uploadType === 'document' ? uploadDocument : uploadLogo;
      const response = await uploadFunction(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Upload failed');
      }

      const data: FileUploadResponse = response.data;

      // Store file info
      setFileInfo({
        name: file.name,
        size: file.size,
        type: file.type,
        url: data.fileUrl,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      });

      // Call onChange with URL
      onChange(data.fileUrl);
      setUploadState('success');
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Upload failed. Please check your connection and try again.';
      setUploadError(errorMessage);
      setUploadState('error');
    }
  };

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    uploadFile(file);
  }, [uploadType, onChange]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle remove
  const handleRemove = () => {
    setFileInfo(null);
    setUploadState('idle');
    setUploadError(null);
    setUploadProgress(0);
    if (onRemove) {
      onRemove();
    }
    onChange('');
  };

  // Determine accept attribute
  const acceptTypes = accept || (uploadType === 'document' 
    ? '.pdf,.jpg,.jpeg,.png' 
    : '.jpg,.jpeg,.png,.svg');

  // Render preview
  const renderPreview = () => {
    if (!fileInfo && !value) return null;

    const fileUrl = fileInfo?.url || value;
    const fileName = fileInfo?.name || 'Uploaded file';
    const fileSize = fileInfo?.size;
    const preview = fileInfo?.preview;

    return (
      <div className="mt-4 p-3 sm:p-4 bg-gray-50 border border-gray-300 rounded-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {/* Image preview for logos and image documents */}
          {preview && (
            <img
              src={preview}
              alt={`Preview of uploaded ${label.toLowerCase()}`}
              className="w-16 h-16 object-cover rounded-md flex-shrink-0"
            />
          )}

          {/* File info */}
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
            {fileSize && (
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(fileSize)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 text-sm text-primary-600 hover:text-primary-700
                           border border-primary-300 rounded-md hover:bg-primary-50
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                           transition-colors duration-150
                           flex items-center justify-center"
                aria-label="View uploaded file"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="flex-1 sm:flex-none min-h-[44px] px-4 py-2.5 text-sm text-error-600 hover:text-error-700
                         border border-error-300 rounded-md hover:bg-error-50
                         focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-offset-2
                         transition-colors duration-150
                         flex items-center justify-center"
              aria-label="Remove uploaded file"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };

  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const progressId = `${id}-progress`;
  const describedBy = error || uploadError ? errorId : helperText ? helperId : undefined;

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-error-500 ml-1" aria-label="required">*</span>
        )}
      </label>

      {/* Upload Area */}
      {!fileInfo && !value && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label.toLowerCase()}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`
            relative border-2 border-dashed rounded-md p-6 sm:p-8 text-center
            transition-colors duration-150 cursor-pointer min-h-[120px] sm:min-h-[150px] flex items-center justify-center
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${isDragging 
              ? 'border-primary-500 bg-primary-50' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }
            ${error ? 'border-error-500' : ''}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            id={id}
            accept={acceptTypes}
            onChange={handleInputChange}
            className="hidden"
            disabled={uploadState === 'uploading'}
            aria-describedby={describedBy}
            aria-required={required}
            aria-invalid={error || uploadError ? 'true' : 'false'}
          />

          {/* Upload Icon */}
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            <div className="text-xs sm:text-sm text-gray-600">
              <span className="text-primary-600 font-medium">
                Click to upload
              </span>
              <span className="hidden sm:inline"> or drag and drop</span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {uploadType === 'document' 
                ? 'PDF, JPEG, PNG (max 5MB)'
                : 'JPEG, PNG, SVG (max 2MB)'
              }
            </p>
          </div>

          {/* Upload Progress */}
          {uploadState === 'uploading' && (
            <div className="mt-4" aria-live="polite" aria-atomic="true">
              <div 
                className="w-full bg-gray-200 rounded-full h-2"
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-labelledby={progressId}
              >
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                  aria-hidden="true"
                />
              </div>
              <p id={progressId} className="text-xs text-gray-500 mt-2">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {renderPreview()}

      {/* Error Message */}
      {(error || uploadError) && (
        <p role="alert" className="text-sm text-error-500 flex items-center gap-1">
          <span>⚠️</span>
          {error || uploadError}
        </p>
      )}

      {/* Helper Text */}
      {helperText && !error && !uploadError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
