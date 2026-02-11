import { create } from 'zustand';
import { useDocsStore } from '../store/useDocsStore';
import { notificationService } from './notifications';
import { STORAGE_KEYS } from '../store/storageKeys';

interface BackupState {
  lastBackup: number | null;
  backupInProgress: boolean;
  backupHistory: Array<{
    timestamp: number;
    size: number;
    success: boolean;
    error?: string;
  }>;
  
  // Actions
  createBackup: () => Promise<boolean>;
  restoreBackup: (timestamp: number) => Promise<boolean>;
  getBackupStatus: () => { lastBackup: number | null; backupCount: number; totalSize: number };
  clearOldBackups: (maxAgeDays?: number) => void;
}

// Backup key for localStorage
const BACKUP_STORAGE_KEY = 'opendocs_backups';
const BACKUP_METADATA_KEY = 'opendocs_backup_metadata';

// Maximum backups to keep
const MAX_BACKUPS = 50;
const BACKUP_RETENTION_DAYS = 30;

export const useBackupStore = create<BackupState>((set, get) => ({
  lastBackup: null,
  backupInProgress: false,
  backupHistory: [],

  createBackup: async () => {
    const docsStore = useDocsStore.getState();
    
    set({ backupInProgress: true });
    
    try {
      // Get current state
      const { state } = docsStore;
      const { pages, folders, selectedPageId, expandedFolderIds, theme } = state;
      
      // Create backup data
      const backupData = {
        timestamp: Date.now(),
        data: {
          pages,
          folders,
          selectedPageId,
          expandedFolderIds,
          theme
        },
        version: '1.0.0',
        app: 'OpenDocs'
      };

      // Get existing backups
      const existingBackups = JSON.parse(localStorage.getItem(BACKUP_STORAGE_KEY) || '[]');
      
      // Add new backup
      existingBackups.push(backupData);
      
      // Limit backups to MAX_BACKUPS
      const trimmedBackups = existingBackups.slice(-MAX_BACKUPS);
      
      // Save to localStorage
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(trimmedBackups));
      
      // Update metadata
      const backupSize = new Blob([JSON.stringify(backupData)]).size;
      const newBackupRecord = {
        timestamp: backupData.timestamp,
        size: backupSize,
        success: true
      };
      
      const existingHistory = get().backupHistory;
      const updatedHistory = [...existingHistory, newBackupRecord].slice(-MAX_BACKUPS);
      
      set({
        lastBackup: backupData.timestamp,
        backupInProgress: false,
        backupHistory: updatedHistory
      });

      // Save metadata
      localStorage.setItem(BACKUP_METADATA_KEY, JSON.stringify({
        lastBackup: backupData.timestamp,
        backupHistory: updatedHistory
      }));

      notificationService.notifySuccess(
        'Backup Created',
        `Backup created successfully (${formatFileSize(backupSize)})`
      );

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      const backupRecord = {
        timestamp: Date.now(),
        size: 0,
        success: false,
        error: errorMessage
      };
      
      const existingHistory = get().backupHistory;
      const updatedHistory = [...existingHistory, backupRecord].slice(-MAX_BACKUPS);
      
      set({
        backupInProgress: false,
        backupHistory: updatedHistory
      });

      notificationService.notifyError(
        'Backup Failed',
        `Failed to create backup: ${errorMessage}`
      );

      return false;
    }
  },

  restoreBackup: async (timestamp: number) => {
    const docsStore = useDocsStore.getState();
    
    try {
      // Get backups from localStorage
      const backups = JSON.parse(localStorage.getItem(BACKUP_STORAGE_KEY) || '[]');
      
      // Find the specific backup
      const backup = backups.find((b: any) => b.timestamp === timestamp);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Restore the data
      const { pages, folders, selectedPageId, expandedFolderIds, theme } = backup.data;
      
      // Persist the complete state to localStorage
      const completeState = {
        ...docsStore.state,
        pages,
        folders,
        selectedPageId,
        expandedFolderIds,
        theme
      };
      localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(completeState));
      
      // Reload the page to apply the restored state
      window.location.reload();

      notificationService.notifySuccess(
        'Backup Restored',
        `Successfully restored backup from ${new Date(timestamp).toLocaleString()}`
      );

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      notificationService.notifyError(
        'Restore Failed',
        `Failed to restore backup: ${errorMessage}`
      );

      return false;
    }
  },

  getBackupStatus: () => {
    const state = get();
    const totalSize = state.backupHistory.reduce((sum, backup) => sum + backup.size, 0);
    
    return {
      lastBackup: state.lastBackup,
      backupCount: state.backupHistory.length,
      totalSize
    };
  },

  clearOldBackups: (maxAgeDays = BACKUP_RETENTION_DAYS) => {
    try {
      const cutoffTime = Date.now() - (maxAgeDays * 24 * 60 * 60 * 1000);
      
      // Get current backups
      const backups = JSON.parse(localStorage.getItem(BACKUP_STORAGE_KEY) || '[]');
      
      // Filter out old backups
      const recentBackups = backups.filter((backup: any) => backup.timestamp >= cutoffTime);
      
      // Update localStorage
      localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(recentBackups));
      
      // Update metadata
      const existingHistory = get().backupHistory;
      const recentHistory = existingHistory.filter(record => record.timestamp >= cutoffTime);
      
      set({
        backupHistory: recentHistory,
        lastBackup: recentHistory.length > 0 ? Math.max(...recentHistory.map(r => r.timestamp)) : null
      });

      const clearedCount = backups.length - recentBackups.length;
      
      if (clearedCount > 0) {
        notificationService.notifySuccess(
          'Backups Cleaned',
          `Cleared ${clearedCount} old backups`
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      notificationService.notifyError(
        'Cleanup Failed',
        `Failed to clear old backups: ${errorMessage}`
      );
    }
  }
}));

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Initialize backup store with saved metadata
export const initializeBackupStore = () => {
  try {
    const savedMetadata = localStorage.getItem(BACKUP_METADATA_KEY);
    if (savedMetadata) {
      const { lastBackup, backupHistory } = JSON.parse(savedMetadata);
      useBackupStore.setState({ lastBackup, backupHistory });
    }
  } catch (error) {
    console.warn('Failed to initialize backup store from localStorage:', error);
  }
};

// Auto-backup functionality
let autoBackupInterval: NodeJS.Timeout | null = null;

export const startAutoBackup = (intervalMinutes: number = 60): void => {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
  }
  
  autoBackupInterval = setInterval(async () => {
    const { backupInProgress } = useBackupStore.getState();
    if (!backupInProgress) {
      await useBackupStore.getState().createBackup();
    }
  }, intervalMinutes * 60 * 1000);
};

export const stopAutoBackup = () => {
  if (autoBackupInterval) {
    clearInterval(autoBackupInterval);
    autoBackupInterval = null;
  }
};