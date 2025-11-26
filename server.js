import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables as early as possible
dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
