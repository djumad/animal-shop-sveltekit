import path from 'path';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
//svelte-filekit
/**
 * Simpan file ke direktori yang ditentukan dengan nama unik.
 */
export async function saveFile(
  file: File,
  dir: string
): Promise<{ success: boolean; path?: string; name?: string; error?: string }> {
  try {
    if (!file || typeof file === 'string') {
      return { success: false, error: 'File tidak valid' };
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.resolve('static', dir);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return {
      success: true,
      path: `/${path.posix.join(dir, fileName)}`,
      name: fileName,
    };
  } catch (err) {
    console.error('Upload error:', err);
    return { success: false, error: 'Gagal upload file' };
  }
}

/**
 * Hapus file berdasarkan path relatif dari direktori /static
 */
export async function deleteFile(relativePath: string) {
  try {
    const fullPath = path.resolve('static', relativePath.replace(/^\/+/, ''));
    await unlink(fullPath);
    return { success: true };
  } catch (err) {
    console.error('Delete error:', err);
    return { success: false, error: 'Gagal menghapus file' };
  }
}

/**
 * Ganti file lama dengan file baru. File lama akan dihapus jika berbeda.
 */
export async function replaceFile(
  existingFilePath: string,
  newFile: File,
  uploadDir: string
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const uploadsPath = path.resolve('static', uploadDir);
    if (!existsSync(uploadsPath)) {
      mkdirSync(uploadsPath, { recursive: true });
    }

    const fileName = `${Date.now()}-${newFile.name}`;
    const filePath = path.join(uploadsPath, fileName);

    // Normalisasi path lama
    const normalizedOldPath = existingFilePath?.replace(/\\/g, '/').replace(/^\/+/, '');
    const newRelativePath = path.posix.join(uploadDir, fileName);

    // Hapus file lama jika ada dan berbeda
    if (normalizedOldPath && normalizedOldPath !== newRelativePath) {
      const oldFilePath = path.resolve('static', normalizedOldPath);
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
        console.log(`Deleted old file: ${oldFilePath}`);
      }
    }

    // Simpan file baru
    const buffer = await newFile.arrayBuffer();
    writeFileSync(filePath, Buffer.from(buffer));
    console.log(`File uploaded successfully: ${filePath}`);

    return {
      success: true,
      path: `/${path.posix.join(uploadDir, fileName)}`, // Path dimulai dengan `/`
    };
  } catch (error: any) {
    console.error('Error replacing file:', error);
    return { success: false, error: error.message };
  }
}
