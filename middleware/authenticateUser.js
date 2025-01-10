import jwt from 'jsonwebtoken';

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Authorization Header:", req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log(req.user);

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            
            console.error("JWT Verification Error: Token has expired");
            return res.status(401).json({ message: 'Token has expired' });
        }
        console.error("JWT Verification Error:", error.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authenticateUser;
