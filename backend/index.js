require('dotenv').config({
    path:'./config/config.env'
});

const express = require('express');
const cors = require('cors')

const app = express();

const http = require("http");
const server = http.createServer(app);

//Database Connetion
const connectDB = require('./config/db');
connectDB()

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('FeedBank Backend'));

const { auth } = require('./middleware/auth')

const schoolRoutes = require('./routes/School')
const userRoutes = require('./routes/User')
const notificationRoutes = require('./routes/Notification')
const complaintRoutes = require('./routes/Complaint')
const chatRoutes = require('./routes/Chat')

app.use('/school', auth, schoolRoutes)
app.use('/user', userRoutes)
app.use('/notification', auth, notificationRoutes)
app.use('/complaint', auth, complaintRoutes)
app.use('/chat', auth, chatRoutes)

const port = process.env.PORT || 8082;

const io = require('socket.io')(server, {
    allowEIO3: true /* false by default**/ ,
    pingTimeout: 60000,
    cors: {
        origin: "http://143.110.188.175",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log("New User Connected Socket")

    socket.on('join chat', (complaintId) => {
        socket.join(complaintId)
        console.log('User joined in complaint: ' + complaintId)
    })

    socket.on('new message', newMessageRecieved => {
        socket.broadcast.to(newMessageRecieved.complaint_id).emit('recieve message', newMessageRecieved);
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
})

server.listen(port, () => {
    console.log("server running");
});

app.use((req, res, next) => {
    next(createError(404));
});

app.use((err, req, res, next) => {
    console.log(err);`enter code here`
    res.sendStatus(500);
});