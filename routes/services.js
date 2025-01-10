import express from 'express';
import {deleteService, getServices , postServices, updateService} from '../controllers/serviceControllers.js'

const router = express.Router();

router.get('/', getServices);
router.post('/',postServices);
router.put('/:id',updateService);
router.delete('/:id',deleteService);

export default router;
