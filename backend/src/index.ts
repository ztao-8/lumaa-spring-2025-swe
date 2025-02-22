import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import tasksRoutes from './routes/tasks';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

app.get('/', (req, res) => {
  res.send('Task Management API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
