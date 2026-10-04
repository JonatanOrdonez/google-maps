import { Router } from 'express';
import {
  createPolygonController,
  deletePolygonController,
  getPolygonsController,
} from './polygons.controller';

const router = Router();

router.post('/polygons', createPolygonController);
router.get('/polygons', getPolygonsController);
router.delete('/polygons/:id', deletePolygonController);

export default router;
