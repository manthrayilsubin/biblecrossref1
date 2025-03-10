//use1 https://replit.com/@SubinBabu/biblecrossref1 for pass in environment
const redis = require('redis');
const client = redis.createClient({
    host: 'redis-18101.c305.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 18101,
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

   function firstFunction() {
      return new Promise((resolve, reject) => {
          let y = 0
          setTimeout(() => {
            for (i=0; i<100; i++) {
               y++
            }
             console.log('Loop completed.')  
             resolve(y)
          }, 500)
      })
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
initialVerse = await qryDB(sql, [], function(row) 
    {
        console.log(row);    
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
   
getRedis(references[p].ToVerse);
 
} 
}
const result = await firstFunction();//add a delay
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
  mainapp(res,mainverseloc);
});
app.get('/', (req, res) => {
  res.json({message: 'alive use /bibleverse?verse=Gen.1.5'});
});
