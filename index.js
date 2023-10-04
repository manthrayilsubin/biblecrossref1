//use https://replit.com/@SubinBabu/biblecrossref1 for pass in environment
const redis = require('redis');
const client = redis.createClient({
    host: 'redis-14431.c278.us-east-1-4.ec2.cloud.redislabs.com',
    port: 14431,
    password: process.env.pass
});

function getRedis(verseName)
 {
  // console.log(verseName.split("-")[0]);
client.get(verseName.split("-")[0], (err, reply) => {
        if (err) throw err;
       
        addverses(verseName,reply); 
    });

 }

function qryDB(query, params) {
    return new Promise(function(resolve, reject) {
        if(params == undefined) params=[]

        db.all(query, params, function(err, rows)  {
            if(err) reject("Read error: " + err.message)
            else {
                resolve(rows)
            }
        })
    }) 
}



function addverses(Name,word)
{
  verseRef[counter++]=Name+"-"+word;
}
let verseRef=[];
let counter=0;
let promise=[];
const sqlite3 = require('sqlite3').verbose();

// open the database to get the new records
let db = new sqlite3.Database('./BME.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the malayalam english bible database.');
});

let mainverse='Gen.1.2';
let sql = 'select OsisID||"."||chNum||"."||verseNum as Name,word from words inner join BibleBooks on BookId=bookNum and OsisID||"."||chNum||"."||verseNum ="'+mainverse+'"';

let sqlRef='';
let sqlRefWrd='';
let refVerse='';

async function mainapp(res,mainverseloc)
{
  sql = 'select OsisID||"."||chNum||"."||verseNum as Name,word from words inner join BibleBooks on BookId=bookNum and OsisID||"."||chNum||"."||verseNum ="'+mainverseloc+'"';
  counter=0;
initialVerse = await qryDB(sql, [], function(row) {
       // console.log(row);    
    });
if(initialVerse[0]!=null)
{
addverses(initialVerse[0].Name,initialVerse[0].word);  
sqlRef='select ToVerse from biblecrosswithverseid where FromVerse="'+initialVerse[0].Name+'" ORDER by verseId asc';
references = await qryDB(sqlRef, [], function(row) {
        //console.log(row);    
    });
for(p in references)
{
  //console.log(references[p].ToVerse);
  /*sqlRefWrd='select OsisID||"."||chNum||"."||verseNum as Name,word from words inner join BibleBooks on BookId=bookNum and OsisID||"."||chNum||"."||verseNum ="'+references[p].ToVerse+'"';
  referenceword = await qryDB(sqlRefWrd, [], function(row) {
        console.log(row);    
    });
  if(referenceword[0]!=null)
  {
addverses(referenceword[0].Name,referenceword[0].word); 
  }*/
  console.log(p); 
getRedis(references[p].ToVerse);
 
} 

}
let htmlStr='';
let hrefStr='';
let vers=[];
for(indVerse in verseRef)
{
vers=verseRef[indVerse].split('-');
hrefStr='<a href="bibleverse?verse='+vers[0]+'">#</a>';
htmlStr=htmlStr+'<div>'+hrefStr+verseRef[indVerse]+'</div><hr>';
}
try
{
  res.send(htmlStr);    
  
}
catch(e)
{
console.log(e);
}
}
    
const express = require('express');
const app = express();
const port = 3000 ;

var server=app.listen(port, () => {
 
});
server.timeout = 1000*60*5;

app.get('/bibleverse', (req, res) => {
   let mainverseloc=req.query.verse;
  console.log(mainverseloc);
  mainapp(res,mainverseloc);
});
app.get('/', (req, res) => {
  res.json({message: 'alive'});
});
