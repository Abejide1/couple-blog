import React, { useEffect, useState } from 'react';
import { Box, ImageList, ImageListItem, Dialog } from '@mui/material';
import axios from 'axios';

interface Photo {
  id: number;
  file_path: string;
  uploaded_at: string;
}

export default function ActivityGallery({ activityId }: { activityId: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const coupleCode = localStorage.getItem('coupleCode');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/photos/`, {
          params: { couple_code: coupleCode, activity_id: activityId }
        });
        setPhotos(res.data);
      } catch (e) {
        setPhotos([]);
      }
    };
    fetchPhotos();
  }, [activityId]);

  if (!photos.length) return null;
  return (
    <Box mt={2}>
      <ImageList cols={3} gap={8}>
        {photos.map((photo) => (
          <ImageListItem key={photo.id} onClick={() => { setSelected(photo.file_path); setOpen(true); }} sx={{ cursor: 'pointer' }}>
            <img src={`${import.meta.env.VITE_API_URL}/${photo.file_path}`} alt="activity" style={{ borderRadius: 8, width: '100%', height: 'auto' }} />
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
        {selected && <img src={`${import.meta.env.VITE_API_URL}/${selected}`} alt="full" style={{ maxWidth: 600, width: '100%' }} />}
      </Dialog>
    </Box>
  );
}
