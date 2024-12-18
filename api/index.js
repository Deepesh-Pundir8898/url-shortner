// import fs from "node:fs";
// import express from "express";

// import  {nanoid} from "nanoid";
// import { fileURLToPath } from 'url';
// import path from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


// const app = express();

// app.use(express.json());
// app.use(express.urlencoded())

// const isUrlValid = (url) => {
//     try {
//         new URL(url);
//         return true;
//     } catch (error) {
//         return false;
//     }
// }

// const getKeyByValue = (object, value)=> {
//     return Object.keys(object).find(key =>
//         object[key] === value);
// }
// const hasValue = (obj, value) => Object.values(obj).includes(value);


// app.get("/",(req,res)=>{
//     res.sendFile(path.join(__dirname, "form.html"));

// })
// app.post("/shortner-url",(req,res)=>{

//     try {
//        const isValid = isUrlValid(req.body.longUrl);
//        if(!isValid){
//         return res.status(400).json(
//             {
//                 success:false,
//                 message:"Please Enter valid url"
//             }
//         )
//        }

//         const shortUrl = nanoid(10);
       
//         const oldData = fs.readFileSync("urlMap.json",{encoding: "utf-8"});
//         const newData = JSON.parse(oldData);

//         if(hasValue(newData[0] ,req.body.longUrl )){
//             const preShortnerUrl = getKeyByValue(newData[0],req.body.longUrl);
//             return res.json({
//                 success:true,
//                 message:"URL Shortner api",
//                 result:`http://localhost:8080/${preShortnerUrl}`
//             })
//         }
//         newData[0][shortUrl] = req.body.longUrl;

//         fs.writeFileSync("urlMap.json",JSON.stringify(newData));

//         res.json({
//             success:true,
//             message:"URL Shortner api",
//             result:`http://localhost:8080/${shortUrl}`
//         })
//     } 
//     catch (error) {
//         console.log("post shortner api error:",error);
//     }
    
// })

// app.get("/:shortUrl",(req,res)=>{
    
//     const shortUrl = req.params.shortUrl;


//     const urlMap = fs.readFileSync("urlmap.json",{encoding:"utf-8"});
//     const urlObject = JSON.parse(urlMap)[0];

//     const longUrl = urlObject[shortUrl];

//     res.redirect(longUrl);
// })

// // app.listen("8080",()=>console.log("Server is runnning at port 8080"))

// export default app;

import fs from "fs";
import express from "express";
import { nanoid } from "nanoid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Helper functions
const isUrlValid = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};

const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);

const hasValue = (obj, value) => Object.values(obj).includes(value);

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "./form.html"));

})

// Shorten URL
app.post("/shortner-url", (req, res) => {
    try {
        const isValid = isUrlValid(req.body.longUrl);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Please Enter valid url",
            });
        }

        const shortUrl = nanoid(10);

        const oldData = fs.readFileSync(path.join(__dirname, "../urlMap.json"), {
            encoding: "utf-8",
        });
        const newData = JSON.parse(oldData);

        if (hasValue(newData[0], req.body.longUrl)) {
            const preShortnerUrl = getKeyByValue(newData[0], req.body.longUrl);
            return res.json({
                success: true,
                message: "URL Shortner API",
                result: `https://${req.headers.host}/${preShortnerUrl}`,
            });
        }
        newData[0][shortUrl] = req.body.longUrl;

        fs.writeFileSync(
            path.join(__dirname, "../urlMap.json"),
            JSON.stringify(newData)
        );

        res.json({
            success: true,
            message: "URL Shortner API",
            result: `https://${req.headers.host}/${shortUrl}`,
        });
    } catch (error) {
        console.log("post shortner api error:", error);
    }
});

// Redirect to the original URL
app.get("/:shortUrl", (req, res) => {
    const shortUrl = req.params.shortUrl;

    const urlMap = fs.readFileSync(path.join(__dirname, "../urlMap.json"), {
        encoding: "utf-8",
    });
    const urlObject = JSON.parse(urlMap)[0];

    const longUrl = urlObject[shortUrl];

    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send("URL not found.");
    }
});

app.listen(8080 ,()=>{console.log("Sever is Starting on PORT: 8080")})
export default app;
