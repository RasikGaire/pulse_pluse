import React, { createContext, useReducer } from 'react';
import { NOTIFICATION_TYPES } from '../constants/notifications';

// Notification Context
export const NotificationContext = createContext();

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const newNotification = {
        id: Date.now() + Math.random(),
        ...action.payload,
        timestamp: new Date().toISOString(),
        read: false
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };
    }

    case 'MARK_AS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload.id
            ? { ...notification, read: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    }

    case 'MARK_ALL_AS_READ': {
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true
        })),
        unreadCount: 0
      };
    }

    case 'REMOVE_NOTIFICATION': {
      const notificationToRemove = state.notifications.find(n => n.id === action.payload.id);
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload.id),
        unreadCount: notificationToRemove && !notificationToRemove.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount
      };
    }

    case 'CLEAR_ALL_NOTIFICATIONS': {
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    }

    default: {
      return state;
    }
  }
};

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add a new notification
  const addNotification = (notification) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: notification
    });
  };

  // Mark notification as read
  const markAsRead = (id) => {
    dispatch({
      type: 'MARK_AS_READ',
      payload: { id }
    });
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  // Remove a notification
  const removeNotification = (id) => {
    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: { id }
    });
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  // Helper function to add blood request notification
  const addBloodRequestNotification = (requestData) => {
    addNotification({
      type: NOTIFICATION_TYPES.BLOOD_REQUEST,
      title: 'Blood Request Submitted',
      message: `Your request for ${requestData.bloodUnits} units of ${requestData.bloodGroup} blood at ${requestData.hospitalName} has been submitted successfully.`,
      icon: '🩸',
      priority: 'high',
      data: requestData
    });
  };

  // Helper function to add donor response notification
  const addDonorResponseNotification = (donorData, requestData) => {
    addNotification({
      type: NOTIFICATION_TYPES.DONOR_RESPONSE,
      title: 'Donor Interested',
      message: `${donorData.name} is interested in donating ${requestData.bloodGroup} blood for your request.`,
      icon: '💝',
      priority: 'high',
      data: { donor: donorData, request: requestData }
    });
  };

  // Helper function to add success notification
  const addSuccessNotification = (title, message) => {
    addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      icon: '✅',
      priority: 'medium'
    });
  };

  const value = {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    addNotification,
    addBloodRequestNotification,
    addDonorResponseNotification,
    addSuccessNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};