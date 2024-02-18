import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

app.use(express.urlencoded({extended:true}))

//TODO 1: Fill in your values for the 3 types of auth.
const username = "BRENZ_GILBOY";
const password = "12345687";
const apiKey = "84f5726a-d40b-40be-ba0d-e98a534eb17f";
const bearerToken = "d3dd565e-c821-418a-a649-b809b6691e1f";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
    //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
  try {
    const result = await axios.get(`https://secrets-api.appbrewery.com/random`);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/basicAuth", async (req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
 const URL = `https://secrets-api.appbrewery.com/all?page=2`;
 try{
  const response = await axios.get(URL,{
    auth: {
      username,
      password,
    }
  })
  const data = response.data;
  res.render("index.ejs", {content: JSON.stringify(data)});
  console.log(data);
 } catch(err){
  res.render('index.ejs',{content: 
    `Error nigga: ${err.message}`})
 }  
});

app.get("/apiKey", async (req, res) => {
  const score = Math.floor((Math.random()*5)+5);
  //TODO 4: Write your code here to hit up the /filter endpoint
  try{
    const generatedApiKey = await axios.get(`https://secrets-api.appbrewery.com/filter?score=${score}&apiKey=${apiKey}`, {
      method: 'GET'
    });
    console.log(generatedApiKey);
    res.render("index.ejs", {content: JSON.stringify(generatedApiKey.data)})
  } catch(err){
    console.log(err);
    res.render("index.ejs", {content: err.message})
  }
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  const url = `https://secrets-api.appbrewery.com/secrets/42`;
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
try{
  const response = await axios.get(url,{
    headers:{
      Authorization: `Bearer ${bearerToken}`
    }
   })
   res.render('index.ejs', {content: JSON.stringify(response.data)})
}
catch(err){
  console.log(err);
  res.render('index.ejs', {content: err.message})
}


});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
