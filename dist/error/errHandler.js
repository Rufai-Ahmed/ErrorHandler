"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errHandler = void 0;
const enums_1 = require("../utils/enums");
const viewError = (err, res) => {
    return res.status(enums_1.HTTP.BAD).json({
        name: err.name,
        message: err.message,
        status: err.status,
        success: err.success,
        stack: err.stack,
        error: err,
    });
};
const errHandler = (err, req, res, next) => {
    return viewError(err, res);
};
exports.errHandler = errHandler;
