import express from 'express';
import changePasswordController from '../controllers/changePassword.controller.js';

const router = express.Router();

router.route('/api/users/change-password/:userId')
    .put(changePasswordController.changePassword);

    

export default router;