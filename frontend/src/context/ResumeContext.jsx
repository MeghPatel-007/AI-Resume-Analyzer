import { createContext, useContext, useReducer, useCallback } from 'react';
import { resumeApi } from '../services/api';
import { getSessionId } from '../utils/helpers';

const ResumeContext = createContext(null);

const initialState = {
  // Upload state
  uploadStatus: 'idle', // idle | uploading | processing | success | error
  uploadProgress: 0,
  uploadError: null,

  // Current analysis
  currentResume: null,
  currentResumeId: null,

  // History
  history: [],
  historyTotal: 0,
  historyPage: 1,
  historyLoading: false,

  // Stats
  stats: null,
  statsLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_START':
      return { ...state, uploadStatus: 'uploading', uploadProgress: 0, uploadError: null };
    case 'UPLOAD_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    case 'UPLOAD_PROCESSING':
      return { ...state, uploadStatus: 'processing', uploadProgress: 100 };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        uploadStatus: 'success',
        uploadProgress: 100,
        currentResumeId: action.payload.id,
        uploadError: null,
      };
    case 'UPLOAD_ERROR':
      return { ...state, uploadStatus: 'error', uploadError: action.payload, uploadProgress: 0 };
    case 'RESET_UPLOAD':
      return { ...state, uploadStatus: 'idle', uploadProgress: 0, uploadError: null };
    case 'SET_RESUME':
      return { ...state, currentResume: action.payload };
    case 'SET_HISTORY':
      return {
        ...state,
        history: action.payload.data,
        historyTotal: action.payload.pagination?.total || 0,
        historyLoading: false,
      };
    case 'HISTORY_LOADING':
      return { ...state, historyLoading: true };
    case 'HISTORY_ERROR':
      return { ...state, historyLoading: false };
    case 'SET_STATS':
      return { ...state, stats: action.payload, statsLoading: false };
    case 'STATS_LOADING':
      return { ...state, statsLoading: true };
    case 'DELETE_RESUME':
      return {
        ...state,
        history: state.history.filter(r => r._id !== action.payload),
        historyTotal: Math.max(0, state.historyTotal - 1),
      };
    default:
      return state;
  }
};

export const ResumeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const uploadResume = useCallback(async (file) => {
    dispatch({ type: 'UPLOAD_START' });
    try {
      const result = await resumeApi.upload(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        dispatch({ type: 'UPLOAD_PROGRESS', payload: percent });
        if (percent === 100) {
          dispatch({ type: 'UPLOAD_PROCESSING' });
        }
      });
      dispatch({ type: 'UPLOAD_SUCCESS', payload: result.data });
      return result.data;
    } catch (error) {
      dispatch({ type: 'UPLOAD_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const fetchResume = useCallback(async (id) => {
    try {
      const result = await resumeApi.getById(id);
      dispatch({ type: 'SET_RESUME', payload: result.data });
      return result.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const fetchHistory = useCallback(async (page = 1) => {
    dispatch({ type: 'HISTORY_LOADING' });
    try {
      const sessionId = getSessionId();
      const result = await resumeApi.getHistory(sessionId, page);
      dispatch({ type: 'SET_HISTORY', payload: result });
    } catch (error) {
      dispatch({ type: 'HISTORY_ERROR' });
      throw error;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    dispatch({ type: 'STATS_LOADING' });
    try {
      const result = await resumeApi.getStats();
      dispatch({ type: 'SET_STATS', payload: result.data });
    } catch {
      dispatch({ type: 'SET_STATS', payload: null });
    }
  }, []);

  const deleteResume = useCallback(async (id) => {
    await resumeApi.delete(id);
    dispatch({ type: 'DELETE_RESUME', payload: id });
  }, []);

  const resetUpload = useCallback(() => {
    dispatch({ type: 'RESET_UPLOAD' });
  }, []);

  return (
    <ResumeContext.Provider value={{
      ...state,
      uploadResume,
      fetchResume,
      fetchHistory,
      fetchStats,
      deleteResume,
      resetUpload,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};
