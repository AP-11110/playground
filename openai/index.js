import express from "express";
import OpenAiRoutes from "./routes/openaiRoutes.js";
import './loadEnv.js';
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// es module err
const __dirname = path.resolve(); 
// set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.use("/openai", OpenAiRoutes);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));