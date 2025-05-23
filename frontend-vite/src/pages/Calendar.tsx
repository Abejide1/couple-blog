import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { format } from 'date-fns';
import { calendarApi, CalendarEvent } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// Event colors based on type
const eventColors: Record<string, string> = {
  birthday: '#FFD6A5',  // Soft orange
  anniversary: '#FDFFB6', // Soft yellow
  date: '#FF9AA2',      // Soft pink
  reminder: '#A0C4FF',   // Soft blue
  appointment: '#9BF6FF', // Soft teal
  activity: '#BDB2FF',   // Soft purple
  other: '#CAFFBF'       // Soft green
};

const initialEvent: Omit<CalendarEvent, 'id' | 'created_at' | 'couple_code' | 'created_by'> = {
  title: '',
  description: '',
  start_time: new Date(),
  end_time: undefined,
  all_day: false,
  location: '',
  event_type: 'other',
  recurrence: 'none',
  color: eventColors.other,
  reminder: 30,
  shared: true,
  activity_id: undefined,
};

const Calendar = () => {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id' | 'created_at' | 'couple_code' | 'created_by'>>(initialEvent);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch calendar events
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await calendarApi.getAll();
      
      // Handle successful response
      // Transform to FullCalendar format
      const formattedEvents = response.data.map(event => ({
        id: String(event.id),
        title: event.title,
        start: event.start_time,
        end: event.end_time,
        allDay: event.all_day,
        backgroundColor: event.color || eventColors[event.event_type || 'other'],
        borderColor: event.color || eventColors[event.event_type || 'other'],
        extendedProps: {
          description: event.description,
          location: event.location,
          event_type: event.event_type,
          recurrence: event.recurrence,
          reminder: event.reminder,
          shared: event.shared,
          activity_id: event.activity_id,
          created_by: event.created_by
        }
      }));
      setEvents(formattedEvents);
    } catch (error: any) {
      console.error('Error fetching calendar events:', error);
      
      // Display user-friendly error message
      if (error.offline) {
        setErrorMsg('Unable to connect to the server. Please check your internet connection.');
      } else if (error.response) {
        setErrorMsg(`Server error: ${error.response.status}. Please try again later.`);
      } else {
        setErrorMsg('An error occurred while loading calendar events. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle selecting a date range on the calendar
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setDialogMode('create');
    setNewEvent({
      ...initialEvent,
      start_time: selectInfo.start,
      end_time: selectInfo.end,
      all_day: selectInfo.allDay,
    });
    setOpenDialog(true);
  };

  // Handle clicking on an existing event
  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = Number(clickInfo.event.id);
    const eventData = clickInfo.event;
    
    const extendedProps = eventData.extendedProps as any;
    setSelectedEvent({
      id: eventId,
      title: eventData.title,
      description: extendedProps.description,
      start_time: eventData.start || new Date(),
      end_time: eventData.end ?? undefined,
      all_day: eventData.allDay,
      location: extendedProps.location,
      event_type: extendedProps.event_type,
      recurrence: extendedProps.recurrence,
      color: eventData.backgroundColor,
      reminder: extendedProps.reminder,
      shared: extendedProps.shared,
      activity_id: extendedProps.activity_id,
      created_by: extendedProps.created_by,
    });
    
    setDialogMode('edit');
    setNewEvent({
      title: eventData.title,
      description: extendedProps.description || '',
      start_time: eventData.start || new Date(),
      end_time: eventData.end ?? undefined,
      all_day: eventData.allDay,
      location: extendedProps.location || '',
      event_type: extendedProps.event_type || 'other',
      recurrence: extendedProps.recurrence || 'none',
      color: eventData.backgroundColor || eventColors[extendedProps.event_type || 'other'],
      reminder: extendedProps.reminder || 30,
      shared: extendedProps.shared !== undefined ? extendedProps.shared : true,
      activity_id: extendedProps.activity_id || undefined,
    });
    setOpenDialog(true);
  };

  // Create a new event
  const handleCreateEvent = async () => {
    try {
      setErrorMsg(null);
      const formattedEvent = {
        ...newEvent,
        color: newEvent.color || eventColors[newEvent.event_type || 'other']
      };
      
      const response = await calendarApi.create(formattedEvent);
      setEvents(prevEvents => [
        ...prevEvents,
        {
          id: String(response.data.id),
          title: response.data.title,
          start: response.data.start_time,
          end: response.data.end_time,
          allDay: response.data.all_day,
          backgroundColor: response.data.color,
          borderColor: response.data.color,
          extendedProps: {
            description: response.data.description,
            location: response.data.location,
            event_type: response.data.event_type,
            recurrence: response.data.recurrence,
            reminder: response.data.reminder,
            shared: response.data.shared,
            activity_id: response.data.activity_id,
            created_by: response.data.created_by
          }
        }
      ]);
      setOpenDialog(false);
      setNewEvent(initialEvent);
    } catch (error: any) {
      console.error('Error creating event:', error);
      setErrorMsg(error?.response?.data?.detail || 'Failed to create event');
    }
  };

  // Update an existing event
  const handleUpdateEvent = async () => {
    if (!selectedEvent?.id) return;
    
    try {
      setErrorMsg(null);
      const updatedEvent = {
        ...newEvent,
        color: newEvent.color || eventColors[newEvent.event_type || 'other']
      };
      
      const response = await calendarApi.update(selectedEvent.id, updatedEvent);
      
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === String(selectedEvent.id) ? {
          id: String(response.data.id),
          title: response.data.title,
          start: response.data.start_time,
          end: response.data.end_time,
          allDay: response.data.all_day,
          backgroundColor: response.data.color,
          borderColor: response.data.color,
          extendedProps: {
            description: response.data.description,
            location: response.data.location,
            event_type: response.data.event_type,
            recurrence: response.data.recurrence,
            reminder: response.data.reminder,
            shared: response.data.shared,
            activity_id: response.data.activity_id,
            created_by: response.data.created_by
          }
        } : event
      ));
      
      setOpenDialog(false);
      setSelectedEvent(null);
      setNewEvent(initialEvent);
    } catch (error: any) {
      console.error('Error updating event:', error);
      setErrorMsg(error?.response?.data?.detail || 'Failed to update event');
    }
  };

  // Delete an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent?.id) return;
    
    try {
      await calendarApi.delete(selectedEvent.id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== String(selectedEvent.id)));
      setOpenDialog(false);
      setSelectedEvent(null);
      setNewEvent(initialEvent);
    } catch (error: any) {
      console.error('Error deleting event:', error);
      setErrorMsg(error?.response?.data?.detail || 'Failed to delete event');
    }
  };

  const handleEventTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const eventType = event.target.value as CalendarEvent['event_type'];
    setNewEvent({
      ...newEvent,
      event_type: eventType,
      color: eventColors[eventType || 'other']
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3, pt: 8, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Calendar
      </Typography>

      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          {/* Error message display */}
          {errorMsg && (
            <Typography color="error" sx={{ alignSelf: 'center' }}>
              {errorMsg}
              <Button 
                size="small" 
                onClick={fetchEvents} 
                sx={{ ml: 2 }}
              >
                Retry
              </Button>
            </Typography>
          )}
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => {
              setDialogMode('create');
              setNewEvent(initialEvent);
              setOpenDialog(true);
            }}
            sx={{ marginLeft: 'auto' }}
          >
            Add Event
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
          }}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short'
          }}
          height="auto"
        />
      </Paper>

      {/* Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'Add New Event' : 'Edit Event'}
        </DialogTitle>
        <DialogContent>
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              fullWidth
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              required
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />

            <Box display="flex" gap={2}>
              <TextField
                label="Start Date"
                type="datetime-local"
                fullWidth
                value={format(new Date(newEvent.start_time), "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => setNewEvent({ ...newEvent, start_time: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="End Date"
                type="datetime-local"
                fullWidth
                value={newEvent.end_time ? format(new Date(newEvent.end_time), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value ? new Date(e.target.value) : undefined })}
                InputLabelProps={{ shrink: true }}
                disabled={newEvent.all_day}
              />
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={newEvent.all_day}
                  onChange={(e) => setNewEvent({ ...newEvent, all_day: e.target.checked })}
                />
              }
              label="All Day Event"
            />

            <TextField
              label="Location"
              fullWidth
              value={newEvent.location || ''}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />

            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                label="Recurrence"
              >
                <MenuItem value="none">None (One-time)</MenuItem>
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Reminder (minutes before)"
              type="number"
              fullWidth
              value={newEvent.reminder || 30}
              onChange={(e) => setNewEvent({ ...newEvent, reminder: parseInt(e.target.value) })}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={newEvent.shared}
                  onChange={(e) => setNewEvent({ ...newEvent, shared: e.target.checked })}
                />
              }
              label="Share with partner"
            />
          </Box>

          {errorMsg && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMsg}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          {dialogMode === 'edit' && (
            <Button 
              color="error" 
              startIcon={<DeleteIcon />}
              onClick={handleDeleteEvent}
            >
              Delete
            </Button>
          )}
          <Button 
            color="primary" 
            onClick={dialogMode === 'create' ? handleCreateEvent : handleUpdateEvent}
          >
            {dialogMode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Calendar;
