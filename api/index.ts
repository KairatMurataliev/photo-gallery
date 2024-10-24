import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './src/routes/authRoutes';
import gallery from './src/routes/galleryRoutes';
import categories from './src/routes/categoriesRoutes';
import users from './src/routes/usersRouters';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/gallery', gallery);
app.use('/categories', categories);
app.use('/users', users);

const run = async () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
}

run().catch((err) => console.log(err));