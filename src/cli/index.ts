import { Command } from 'commander';
import { start } from './gen-module';
const program = new Command();

program
  .description('Generate Nest module.')
  .requiredOption('-m, --module [module]', '指定模块名如 demo')
  .option('-p, --path [path]', '指定模块路径如 src/module/business')
  .option('-t, --type [type]', '指定模板类型 base或者advanced')
  .action(async (name, command) => {
    console.log('module:', name.module);
    console.log('path:', name.path);
    console.log('type:', name.type);
    if (!name.module) {
      console.log('请输入模块名');
    }
    const path = name?.path || 'src/module/business';
    const dir =
      name?.type === 'base'
        ? 'src/cli/template-base'
        : 'src/cli/template-advanced';
    await start(name.module, path, dir);
  });

program.parse(process.argv);
