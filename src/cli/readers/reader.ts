export interface Reader {
  list(): string[] | Promise<string[]>;
  read(name: string): string | Promise<string>;
  readAnyOf(filenames: string[]): string | Promise<string | undefined>;
  write(name: string, content: string): string | Promise<string>;
  rename(oldName: string, newName: string): string | Promise<string>;
  isDirectory(name: string): boolean | Promise<boolean>;
}
