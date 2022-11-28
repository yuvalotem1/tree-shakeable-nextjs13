import fs from 'fs';
import path from 'path';

export default function getDirectoryFileNames(folderPath){
    const allFiles = [];
    function throughDirectory(directory) {
      fs.readdirSync(directory).forEach((File) => {
        const absolute = path.join(directory, File);
        if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
        else {
          const fileName = absolute.split('/').pop().split('.')[0];
          return allFiles.push(fileName);
        }
      });
    }
    
    throughDirectory(folderPath);
    return allFiles
}