import { useState, useRef, ChangeEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Loader2, Upload } from 'lucide-react';
import { uploadAPI, ORIGIN_BASE_URL, getErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  buttonText?: string;
  className?: string;
}

export default function ImageUpload({ 
  onUploadSuccess, 
  onUploadError, 
  buttonText = 'Upload Image',
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const errorMsg = 'Please select a valid image file (JPEG, PNG, etc.)';
      onUploadError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const errorMsg = 'Image size should be less than 5MB';
      onUploadError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const { data } = await uploadAPI.uploadFile(file);
      const url: string = data?.imageUrl || '';
      const absolute = typeof url === 'string' && url.startsWith('/') 
        ? `${ORIGIN_BASE_URL}${url}`
        : url;
      onUploadSuccess(absolute);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMsg = getErrorMessage(error);
      onUploadError?.(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Input
        id="image-upload"
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <Label htmlFor="image-upload" className="w-full">
        <div className="flex items-center justify-center w-full">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>{buttonText}</span>
              </>
            )}
          </Button>
        </div>
      </Label>
      <p className="text-xs text-muted-foreground text-center">
        Supports JPG, PNG up to 5MB
      </p>
    </div>
  );
}
