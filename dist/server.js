const app = require('./app');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const mongoose = require('mongoose');
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB);
const port = 5001;
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map