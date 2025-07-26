import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
const logDir = path.join(__dirname, '../../../logs/');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logStream = fs.createWriteStream(path.join(logDir, 'access.log'), {
  flags: 'a', // append mode
});

// Use 'dev' format for console but also always write to file
const morganLogger = [
  morgan('dev'), // Logs to console
  morgan('combined', { stream: logStream }), // Logs to file
];

export default morganLogger;
