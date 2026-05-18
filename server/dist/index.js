"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const snacks_1 = __importDefault(require("./routes/snacks"));
const upload_1 = __importDefault(require("./routes/upload"));
const ocr_1 = __importDefault(require("./routes/ocr"));
const config_1 = __importDefault(require("./routes/config"));
const auth_1 = __importDefault(require("./routes/auth"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 9091;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve uploaded images as static files (Public)
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../data/uploads')));
// Public routes
app.use('/api/v1/auth', auth_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Protected routes
app.use('/api/v1/snacks', auth_2.requireAuth, snacks_1.default);
app.use('/api/v1/upload', auth_2.requireAuth, upload_1.default);
app.use('/api/v1/ocr', auth_2.requireAuth, ocr_1.default);
app.use('/api/v1/config', auth_2.requireAuth, config_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
