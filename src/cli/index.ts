import { Command } from 'commander';
import { start } from './gen-module';
const program = new Command();

program
  .description('Generate Nest module.')
  .requiredOption('-m, --module [module]', '指定模块名如 demo')
  .option('-p, --path [path]', '指定模块路径如 src/module/business')
  .action(async (path, command) => {
    console.log(path.path);
    console.log(path.module);
    if (!path.module) {
      console.log('请输入模块名');
    }
    await start(path.module, path?.path);
  });

program.parse(process.argv);
