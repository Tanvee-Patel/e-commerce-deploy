const path = require('path')
// const __dirname = path.resolve()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv').config();

const http = require('http')
const { Server } = require("socket.io")

const authRouter = require('./routes/authRoute')
const adminProductsRouter = require('./routes/admin/productsRoutes')
const userProductsRouter = require('./routes/user/productsRoutes')
const userCartRouter = require('./routes/user/cartRoutes')
const userAddressRouter = require('./routes/user/addressRoutes')
const userOrderRouter = require('./routes/user/orderRoutes')
const adminOrderRouter = require('./routes/admin/orderRoutes')
const userSearchRouter = require('./routes/user/searchRoutes')
const userReviewRouter = require('./routes/user/reviewRoutes')
const commonFeatureRouter = require('./routes/common/featureRoutes');
const { connectRedis } = require('./models/redis');
const contactRouter = require('./routes/common/contactRoutes')
const adminNotificationsRouter = require('./routes/admin/notificationRoutes')
const notificationsRouter = require('./routes/user/notificationRoutes')

const app = express()
const PORT = process.env.PORT || 3000; 

app.use(express.static(path.join(__dirname, '../frontend/dist')))
app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

mongoose.connect(process.env.MONGO_URI,{
useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 40000,
})
   .then(() => console.log("MongoDB connected successfully!"))
   .catch((err) => console.error(err));

app.use(cors({
   origin: process.env.FRONTEND_URL,
   methods: ['GET', 'POST', 'DELETE', 'PUT'],
   credentials: true
}));

const server = http.createServer(app)
const io = new Server(server, {
   cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"]
   }
})

const onlineUsers = new Map();

module.exports = { io, onlineUsers }

server.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
})

connectRedis()

io.on("connection", (socket) => {
   console.log("User connected:", socket.id);
   socket.on("join", (userId) => {
      console.log(`📩 User joined: ${userId}`);
      onlineUsers.set(userId, socket.id)
      console.log("🗂 Updated Online Users:", onlineUsers);
   })
   socket.on("orderUpdated", ({ userId, message }) => {
      console.log(`📨 Received order update for ${userId}:`, message);
      const userSocketId = onlineUsers.get(userId)
      if (userSocketId) {
         io.to(userSocketId)
            .emit("notification", message)
      }
      else {
         console.log("Cannot send notification.");
      }
   })
   socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
         if (socketId === socket.id) {
            onlineUsers.delete(userId)
            break;
         }
      }
   })
})

app.use(cookieParser())
app.use(express.json())
app.use('/auth', authRouter)
app.use('/admin/products', adminProductsRouter)
app.use('/user/products', userProductsRouter)
app.use('/user/cart', userCartRouter)
app.use('/user/address', userAddressRouter)
app.use('/user/order', userOrderRouter)
app.use('/admin/order', adminOrderRouter)
app.use('/user/search', userSearchRouter)
app.use('/user/review', userReviewRouter)
app.use('/common/feature', commonFeatureRouter)
app.use('/contact', contactRouter)
app.use('/admin/notifications', adminNotificationsRouter)
app.use('/user/notifications', notificationsRouter)