const service = require('./service');

exports.register = async (req, res) => {
    try {
        const result = await service.register(req.body);
        res.status(201).json({ success: true, message: "회원가입 성공" });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await service.login(req.body);
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(401).json({ success: false, error: err.message });
    }
};