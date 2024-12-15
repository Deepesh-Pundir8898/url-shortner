import fs from "node:fs";
import express from "express";

import  {nanoid} from "nanoid";

const app = express();

app.use(express.json());
app.use(express.urlencoded())

const isUrlValid = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

const getKeyByValue = (object, value)=> {
    return Object.keys(object).find(key =>
        object[key] === value);
}
const hasValue = (obj, value) => Object.values(obj).includes(value);


app.get("/",(req,res)=>{
    res.sendFile(import.meta.dirname +"\\form.html")
})
app.post("/shortner-url",(req,res)=>{

    try {
       const isValid = isUrlValid(req.body.longUrl);
       if(!isValid){
        return res.status(400).json(
            {
                success:false,
                message:"Please Enter valid url"
            }
        )
       }

        const shortUrl = nanoid(10);
       
        const oldData = fs.readFileSync("urlMap.json",{encoding: "utf-8"});
        const newData = JSON.parse(oldData);

        if(hasValue(newData[0] ,req.body.longUrl )){
            const preShortnerUrl = getKeyByValue(newData[0],req.body.longUrl);
            return res.json({
                success:true,
                message:"URL Shortner api",
                result:`http://localhost:8080/${preShortnerUrl}`
            })
        }
        newData[0][shortUrl] = req.body.longUrl;

        fs.writeFileSync("urlMap.json",JSON.stringify(newData));

        res.json({
            success:true,
            message:"URL Shortner api",
            result:`http://localhost:8080/${shortUrl}`
        })
    } 
    catch (error) {
        console.log("post shortner api error:",error);
    }
    
})

app.get("/:shortUrl",(req,res)=>{
    
    const shortUrl = req.params.shortUrl;


    const urlMap = fs.readFileSync("urlmap.json",{encoding:"utf-8"});
    const urlObject = JSON.parse(urlMap)[0];

    const longUrl = urlObject[shortUrl];

    res.redirect(longUrl);
})

app.listen("8080",()=>console.log("Server is runnning at port 8080"))

