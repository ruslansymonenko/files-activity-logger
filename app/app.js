const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../', 'logs');
const logsFile =  path.join(__dirname, '../', 'logs', 'logs.txt');
const dataDir = path.join(__dirname, '../', 'data');

function checkDir (directoryPath, directoryName) {
  if (!fs.existsSync(directoryPath)) {
    try {
      fs.mkdirSync(directoryPath, { recursive: true });
      console.log(`Folder was created: ${directoryName}`);
    } catch (error) {
      console.log(`Failed to create folder: ${directoryName}`, error.message);
    }
  } else {
    console.log(`Folder exists: ${directoryName}`);
  }
}

function checkFile (filePath) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      fs.writeFile(filePath, '', (error) => {
        if (error) {
          console.log('File creating error: ', error);
        } else {
          console.log(`File was created: ${filePath}`);
        }
      })
    } else {
      console.log(`File exist ${filePath}`);
    }
  })
}

function watchDataFolder (directoryPath, directoryName) {
  fs.watch(directoryPath, (event, filename) => {
    if (filename && !filename.endsWith('~')) {
      if (event === 'rename') {
        fs.access(path.join(directoryPath, filename), fs.constants.F_OK, (err) => {
          if (err) {
            createLog(`File deleted: ${filename} in folder: ${directoryName};`, logsFile);
          } else {
            createLog(`File added: ${filename} in folder: ${directoryName};`, logsFile);
          }
        });
      }
    } else if (!filename && !filename.endsWith('~')) {
      createLog(`Changes in folder: ${directoryName}, file: unknown! Changes type: ${event};`, logsFile);
    }
  })
}

function watchDataFolderFiles (directoryPath, directoryName) {
  fs.readdir(directoryPath, (error, files) => {
    if (error) throw error;

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      fs.watchFile(filePath, (current, previous) => {
        if (current.mtime !== previous.mtime) {
          createLog(`File: ${file}, in the folder ${directoryName} changed. Previous time: ${previous.mtime}, Current time: ${current.mtime}`, logsFile)
        }
      })
    })
  })
}

function createLog (message, logsFilePath) {
  const timeStamp = new Date().toISOString();
  const logMessage = `${timeStamp} - ${message}\n`;
  checkFile(logsFile);

  fs.appendFile(logsFilePath, logMessage, (err) => {
    if (err) {
      console.log('Logs writing error: ', err);
    }
  })
}

function app () {
  checkDir(logsDir, 'logs');
  checkDir(dataDir, 'data');
  checkFile(logsFile)
  watchDataFolder(dataDir, 'data');
  watchDataFolderFiles(dataDir, 'data files');
}

module.exports = {
  app
}