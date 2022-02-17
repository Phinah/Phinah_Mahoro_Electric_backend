import { Router } from 'express';
import user_route from './user/user.route'

const router = Router()

router.use('/user', user_route)

export default router;