import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import fs from 'fs';

// Create logs directory if missing
const logDir = path.join(__dirname, '../../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Create a rotating write stream (rotates daily)
const accessLogStream = createStream('access.log', {
  interval: '1d', // rotate daily
  path: logDir,
  compress: 'gzip', // optional: compress old logs
});

// Morgan setup
export const morganConsole = morgan('dev'); // console log
export const morganLogger = morgan('combined', { stream: accessLogStream }); // file log
