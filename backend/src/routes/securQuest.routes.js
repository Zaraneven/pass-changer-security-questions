import express from 'express';
import securityQuestionController from '../controllers/securityQuestions.controller.js';

const router = express.Router();

router.get('/api/users/security', securityQuestionController.getSecurityQuestions);
router.put('/api/users/security/:userId', securityQuestionController.updateSecurityQuestions);

export default router;