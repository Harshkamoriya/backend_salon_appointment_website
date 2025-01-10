import express from 'express'
import {signup , login , getAllUsers ,logout, updateUser , getCurrentUser} from '../controllers/auth.js';
import authenticateUser from '../middleware/authenticateUser.js';
import { uploadSingle } from '../middleware/uploadMiddleware.js'; // Import the multer middleware
import { updatePassword } from '../controllers/auth.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers)
router.get('/users/me',authenticateUser, getCurrentUser )
router.put('/user-update', authenticateUser , uploadSingle('profilePhoto'),updateUser)
router.put("/change-password", authenticateUser , updatePassword)
router.post("/logout",logout)

export default router;