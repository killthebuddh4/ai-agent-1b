import fs from "fs/promises";
import { supabase } from "../../../lib/supabase.js";

export const load = async ({
  fromDirectory,
  options,
}: {
  fromDirectory: string;
  options?: { fileExtsToInclude?: string[] };
}) => {
  const filenames = await getFilenames({ root: fromDirectory, options });

  for (const filename of filenames) {
    const text = await fs.readFile(filename, "utf-8");
    await supabase.from("files").insert([{ filename, text }]);
  }

  return { ok: true, numLoaded: filenames.length };
};

const getFilenames = async ({
  root,
  options,
}: {
  root: string;
  options?: { fileExtsToInclude?: string[] };
}) => {
  const paths = await fs.readdir(root);

  const files: string[] = [];

  const shouldIncludeFile = (path: string) => {
    if (options?.fileExtsToInclude === undefined) {
      return true;
    } else {
      return options.fileExtsToInclude.some((ext) => path.endsWith(ext));
    }
  };

  for (const path of paths) {
    const absPath = `${root}/${path}`;
    const stats = await fs.stat(absPath);

    if (stats.isDirectory()) {
      const children = await getFilenames({ root: absPath, options });
      files.push(...children);
    } else {
      if (shouldIncludeFile(absPath)) {
        files.push(absPath);
      }
    }
  }

  return files;
};
