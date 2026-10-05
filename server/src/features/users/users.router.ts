import { Router } from 'express';
import { getUserController, updateUserLocationController } from './users.controller';

const router = Router();

router.get('/users/:id', getUserController);
router.patch('/users/:id', updateUserLocationController);

export default router;
