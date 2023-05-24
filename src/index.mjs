import express from 'express'
import bodyParser from 'body-parser';
import cors  from 'cors'
import fs from 'fs'

const registred = {
    gets:[],
    posts:[],
    puts:[],
    deletes:[]
};
const FW_PORT = process.env.FW_PORT || 4321;
const FW_DIR = process.env.FW_DIR || "./";

const {gets, posts, puts, deletes} = (()=>{
    const gets = (fs.existsSync(`${FW_DIR}gets.json`) && JSON.parse(fs.readFileSync(`${FW_DIR}gets.json`, 'utf-8')) || undefined);
    const posts = (fs.existsSync(`${FW_DIR}posts.json`) && JSON.parse(fs.readFileSync(`${FW_DIR}posts.json`, 'utf-8')) || undefined);
    const puts = (fs.existsSync(`${FW_DIR}puts.json`) && JSON.parse(fs.readFileSync(`${FW_DIR}puts.json`, 'utf-8')) || undefined);
    const deletes = (fs.existsSync(`${FW_DIR}deletes.json`) && JSON.parse(fs.readFileSync(`${FW_DIR}deletes.json`, 'utf-8')) || undefined);
    return {gets, posts, puts, deletes}
})();


process.title = 'flat-white-api';

const app = express()
app.use(cors());
app.use(bodyParser.json())

bindRoutes({app, fileContent: gets, verb: 'get'})
bindRoutes({app, fileContent: posts, verb: 'post'})
bindRoutes({app, fileContent: puts, verb: 'put'})
bindRoutes({app, fileContent: deletes, verb: 'delete'})

function printPath(verb, path){
    console.log(`   ${verb} ==> http://localhost:${FW_PORT}${path}`);
}

app.listen(FW_PORT ,()=>{
    console.log('\n☕ Mock api up and running...');
    console.log(`   ==> Mocked resources are <==`);
    registred.gets.forEach(path=>printPath("GET", path));
    registred.posts.forEach(path=>printPath("POST", path));
    registred.puts.forEach(path=>printPath("PUT", path));
    registred.deletes.forEach(path=>printPath("DELETE", path));

});

process.on('SIGINT', function() {
    console.log('\n\n👋 The mock-api was shut down gracefully...');
    process.exit(0);
  });

function register({app, completePath, fileContent, verb}){
    const path = completePath.split("?")[0];
    const isRegistred = registred[verb+"s"].filter(p => p===path).length > 0;
    if(!isRegistred){
        app[verb](path, (req, res)=>{
            const response = fileContent[req.originalUrl]
            if(response && response.conditions){
                const conditionalResponse = getConditionalResponse({
                    conditions: response.conditions,
                    body: req.body,
                    header: req.headers
                });
                processResponse(conditionalResponse, req, res)
            }else{
                processResponse(response, req, res)
            }
        });
        registred[verb+"s"].push(path);
    }
}

function processResponse(responseContent, req, res){
    if(responseContent){
        const {headers, code, body} = responseContent.response;
        if(headers){
            Object.keys(headers).forEach(hKey => {
                res.setHeader(hKey, headers[hKey])
            });
        }
        res.status(code || 200).send(body || "");
    }else{
        res.status(404).send('Not found '+ req.originalUrl);
    }
}

function bindRoutes({app, fileContent, verb}) {
    fileContent && Object.keys(fileContent).forEach(completePath => {
        register({app, completePath, fileContent, verb})
    })
}

//body and header available at condition context
function evaluate({condition, body, header}){
    try{
        return eval(condition);
    }catch(e){
        console.log(`Exception received evaluating: ${condition}. Error: ${e}. The condition was treated as false.`);
        return false;
    }
}

function getConditionalResponse({conditions, body, header}) {
    let conditionalResponse;
    conditions && conditions.forEach(conditionItem => {
        const condition = Object.keys(conditionItem)[0]
        if(evaluate({condition, body, header})){
            conditionalResponse = conditionItem[condition];
            return;
        }
    })
    return conditionalResponse;
}
