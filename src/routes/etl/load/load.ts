import fs from "fs/promises";
import { supabase } from "../../../lib/supabase.js";

export const load = async ({
  fromDirectory,
  options,
}: {
  fromDirectory: string;
  options?: { fileExtsToInclude?: string[] };
}) => {
  const filenamesToRead = await walkDirForFilenames({
    root: fromDirectory,
    options,
  });

  for (const filename of filenamesToRead) {
    const fileText = await fs.readFile(filename, "utf-8");
    await supabase.from("files").insert([{ filename, text: fileText }]);
  }

  return { ok: true, numFilesLoaded: filenamesToRead.length };
};

const walkDirForFilenames = async ({
  root,
  options,
}: {
  root: string;
  options?: { fileExtsToInclude?: string[] };
}) => {
  const pathsInDir = await fs.readdir(root);
  const filesInDir: string[] = [];
  const dirsInDir: string[] = [];

  for (const path of pathsInDir) {
    const absPath = `${root}/${path}`;
    const stats = await fs.stat(absPath);

    if (stats.isDirectory()) {
      dirsInDir.push(absPath);
    } else {
      if (options?.fileExtsToInclude === undefined) {
        filesInDir.push(absPath);
      } else if (
        options.fileExtsToInclude.some((ext) => absPath.endsWith(ext))
      ) {
        filesInDir.push(absPath);
      }
    }
  }

  for (const dir of dirsInDir) {
    const children = await walkDirForFilenames({ root: dir, options });
    filesInDir.push(...children);
  }

  return filesInDir;
};
