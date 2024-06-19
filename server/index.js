import express from 'express';


const app = express();

app.use(express.static('dist'));
app.get('/', (req, res) => {
    res.send('ok')
})

app.listen(5001, () => {
    console.log('Server is running on port 5001');
})
