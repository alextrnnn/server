import express from "express"
//bodyParser middleware for Express, allows parsing of
//incoming reequest bodies such as JSON, URL-encoded, or form data
import bodyParser from "body-parser"
//interact with MongoDB databases
import mongoose from "mongoose"
//CORS (corss origin resource sharing) middleware for Express, allows
//enabling cross-origin requests from other domains
import cors from "cors"
//environment variables
import dotenv from "dotenv"
//file uploads
import multer from "multer"
//improve security
import helmet from "helmet"
//for logging
import morgan from "morgan"
//utilties for working with file and directory paths
import path from "path"
import { fileURLToPath } from "url"

import { register } from "./controllers/auth.js";

/* CONFIGURATIONS */
// Middleware - Functions that run between requests

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()
const app = express()
app.use(express.json)
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }))
app.use(morgan("common"))
app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())
app.use("/assets", express.static(path.join(__dirname, 'public/assets')))

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    } 
})

const upload = multer({ storage })

/* ROUTES WITH FILES" */
//upload.single is a middleware function ran before register (controller: logic of endpoint)
app.post("/auth/register", upload.single("picture"), register);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`))
}).catch((error) => console.log(`${error} did not connect`))

