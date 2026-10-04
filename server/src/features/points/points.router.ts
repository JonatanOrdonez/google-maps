import { Router } from 'express';
import {
  createPointController,
  deletePointController,
  getPointsController,
} from './points.controller';

const router = Router();

router.post('/points', createPointController);
router.get('/points', getPointsController);
router.delete('/points/:id', deletePointController);

export default router;
