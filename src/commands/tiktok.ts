import { cac } from 'cac';
import dotenv from 'dotenv';
import { Listr, ListrBaseClassOptions } from 'listr2';
import { ContextProfiles } from '@/interfaces/tiktok';
import downloadAccount from '@/tasks/tiktok/downloadAccount';

dotenv.config();

const cli = cac();

const listrDefaultOptions: ListrBaseClassOptions = {
  rendererOptions: {
    showSubtasks: true,
  },
  concurrent: false,
};

cli
  .command('[...profiles]', 'Download profiles')
  .option('--session [session]', 'Session cookie', { default: '' })
  .action(async (profiles, options) => {
    const context: ContextProfiles = {
      session: options.session,
    };

    const tasks = new Listr<ContextProfiles>([], {
      ...listrDefaultOptions,
      ctx: context,
    });

    tasks.add({
      title: 'Download profiles',
      task: (_ctx, task) => {
        const taskProfiles = task.newListr([], {
          rendererOptions: { showSubtasks: true },
          exitOnError: false,
          ctx: context,
          concurrent: false,
        });

        profiles.forEach((value) => {
          taskProfiles.add(downloadAccount(value));
        });

        return taskProfiles;
      },
    });

    await tasks.run();
  });

cli.parse();
