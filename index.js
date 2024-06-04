//require('dotenv').config();
const port = process.env.PORT || 4000;
const app = require('./app');



// Set Server to Listen
app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);

});
