import { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
  Alert
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type Props = {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  bucket?: string;
  folder?: string;
};

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
  bucket = "products",
  folder = ""
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      if (!isSupabaseConfigured()) {
        // Mock mode - just use the preview URL
        setError("Supabase not configured. Using preview only.");
        onImageUploaded(objectUrl);
        setUploading(false);
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      onImageUploaded(urlData.publicUrl);
      setPreview(urlData.publicUrl);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload image");
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageRemoved?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {preview ? (
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              maxWidth: "100%",
              maxHeight: 200,
              borderRadius: 2,
              objectFit: "cover",
              border: "1px solid",
              borderColor: "divider"
            }}
            onError={() => setPreview(null)}
          />
          <IconButton
            size="small"
            onClick={handleRemove}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "error.main",
              color: "white",
              "&:hover": { bgcolor: "error.dark" }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "action.hover"
            }
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <CircularProgress size={40} />
          ) : (
            <Stack spacing={1} alignItems="center">
              <CloudUploadIcon sx={{ fontSize: 48, color: "text.secondary" }} />
              <Typography variant="body1" color="text.secondary">
                Click to upload image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                PNG, JPG, WebP up to 5MB
              </Typography>
            </Stack>
          )}
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {!preview && !uploading && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ mt: 2 }}
          fullWidth
        >
          Select Image
        </Button>
      )}
    </Box>
  );
}
