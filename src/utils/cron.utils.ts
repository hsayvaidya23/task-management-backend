import cron from 'node-cron';
import taskService from '../services/task.service';

// Schedule task to run every 5 minutes
export const initCronJobs = (): void => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Running auto-close task job');
      await taskService.autoCloseTasks();
      console.log('Auto-close task job completed');
    } catch (error) {
      console.error('Error in cron job:', error);
    }
  });
};