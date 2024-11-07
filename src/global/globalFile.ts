import * as path from 'path';
import * as fs from 'fs/promises';


export const saveFile = async (file: Express.Multer.File, destination: string) => {
    const newDestination = destination.split('.')[1];
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(destination, fileName);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.buffer);
    return `${newDestination}/${fileName}`;
}

export const deleteFile=async(path: string)=>{
    try {
      await fs.unlink(path);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }