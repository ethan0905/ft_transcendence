import { Request } from 'express';

interface User {
    userId: number;
}

interface AuthenticatedRequest extends Request {
    user: User;
}
