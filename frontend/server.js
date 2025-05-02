const express = require('express');
const path = require('path');
const app = express();

// تقديم الملفات الثابتة من مجلد src
app.use(express.static(path.join(__dirname, 'src')));

// توجيه كل الطلبات إلى index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
