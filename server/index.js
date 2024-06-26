import express from 'express';
import cors from 'cors';
import analytics from './routes/anal_router.js';


const app = express();
// export express.Router()
// import {router } from './anal_router';
// app.use(router)
app.use(cors());
app.use(express.static('./public'))
app.use('/analytics', analytics)


app.use(express.static('dist'));

app.listen(8080, () => {
    console.log('Server is running on port 8080');
})
