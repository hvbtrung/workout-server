const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const signAccessToken = (_id) => {
    return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
}

const signRefreshToken = (_id) => {
    return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create accessToken & refrehsToken(save to db)
        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ email, accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// signup user
const signupUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signup(email, password);

        // create accessTokens & refrehsToken(save to db)
        const accessToken = signAccessToken(user._id);
        const refreshToken = signRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ email, accessToken, refreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const refreshTokenUser = async (req, res) => {
    // verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // Bearer <token>
    const refreshToken = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ _id });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: 'Invalid RefreshToken' });
        }

        const newAccessToken = signAccessToken(user._id);
        const newRefreshToken = signRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.status(200).json({ email: user.email, accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const logoutUser = async (req, res) => {
    // verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' });
    }

    // Bearer <token>
    const refreshToken = authorization.split(' ')[1];

    try {
        const { _id } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ _id });

        user.refreshToken = '';
        await user.save();

        res.status(200).json({ msg: 'User logout' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { signupUser, loginUser, refreshTokenUser, logoutUser }
