import { useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
  Alert,
  Grid2 as Grid
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type Props = {
  imageUrls: string[];
  onImagesChange: (urls: string[]) => void;
  bucket?: string;
  folder?: string;
  maxImages?: number;
};

export default function MultiImageUpload({
  imageUrls,
  onImagesChange,
  bucket = "products",
  folder = "",
  maxImages = 10
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - imageUrls.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    // Validate all files
    for (const file of filesToUpload) {
      if (!file.type.startsWith("image/")) {
        setError("Please select only image files");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB");
        return;
      }
    }

    setError("");
    setUploading(true);

    try {
      const newUrls: string[] = [];

      for (const file of filesToUpload) {
        if (!isSupabaseConfigured()) {
          // Mock mode - just use the preview URL
          const objectUrl = URL.createObjectURL(file);
          newUrls.push(objectUrl);
        } else {
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

          newUrls.push(urlData.publicUrl);
        }
      }

      onImagesChange([...imageUrls, ...newUrls]);
      
      if (!isSupabaseConfigured() && newUrls.length > 0) {
        setError("Supabase not configured. Using preview only.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload images");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImagesChange(newUrls);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newUrls = [...imageUrls];
    const draggedUrl = newUrls[draggedIndex];
    newUrls.splice(draggedIndex, 1);
    newUrls.splice(index, 0, draggedUrl);
    onImagesChange(newUrls);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Image Grid */}
      {imageUrls.length > 0 && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {imageUrls.map((url, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={`${url}-${index}`}>
              <Box
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                sx={{
                  position: "relative",
                  pt: "100%",
                  borderRadius: 2,
                  overflow: "hidden",
                  border: "2px solid",
                  borderColor: index === 0 ? "primary.main" : "divider",
                  cursor: "grab",
                  opacity: draggedIndex === index ? 0.5 : 1,
                  transition: "opacity 0.2s, border-color 0.2s",
                  "&:hover .image-actions": {
                    opacity: 1
                  }
                }}
              >
                <Box
                  component="img"
                  src={url}
                  alt={`Product image ${index + 1}`}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                />
                
                {/* Primary badge */}
                {index === 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      bgcolor: "primary.main",
                      color: "white",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: "0.625rem",
                      fontWeight: 600,
                      textTransform: "uppercase"
                    }}
                  >
                    Primary
                  </Box>
                )}

                {/* Actions overlay */}
                <Box
                  className="image-actions"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    opacity: 0,
                    transition: "opacity 0.2s"
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.9)",
                      "&:hover": { bgcolor: "white" }
                    }}
                  >
                    <DragIndicatorIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRemove(index)}
                    sx={{
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": { bgcolor: "error.dark" }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Upload area */}
      {imageUrls.length < maxImages && (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
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
              <CloudUploadIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                Click to upload images
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {imageUrls.length}/{maxImages} images • PNG, JPG, WebP up to 5MB each
              </Typography>
            </Stack>
          )}
        </Box>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      {imageUrls.length < maxImages && !uploading && (
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ mt: 2 }}
          fullWidth
        >
          Add Images
        </Button>
      )}

      {imageUrls.length > 1 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Drag images to reorder. First image is the primary image shown in listings.
        </Typography>
      )}
    </Box>
  );
}
