const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username !== process.env.LOGIN || password !== process.env.PASSWORD) {
        return res.redirect('/login');
    }

    const user = { username, password };
    const token = jwt.sign(user, process.env.PRIVATE_KEY, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true });
    res.redirect('/dashboard');
};

exports.verifyToken = (req, res, next) => {
    const cookieToken = req.cookies.token;
    
    try {
        const user = jwt.verify(cookieToken, process.env.PRIVATE_KEY);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.redirect('/login');
    }
};