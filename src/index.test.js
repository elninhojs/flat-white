let Client = require('node-rest-client').Client;
const client = new Client();

const send = (verb, path, data, headers) => new Promise((ok, nok)=>{
    client[verb](path, {data, headers}, (data, response)=>{
        ok({data, response, headers: response.headers});
    })
})

const verbs = ["get", "post", "put", "delete"];

for(const verb of verbs){
    test(`${verb} with headers, body, query params and code`, async ()=>{
        const {data, response, headers} = await send(verb,"http://localhost:8111/crazy-path/here?nice=ok");
        expect(response.statusCode).toBe(200)
        expect(headers['x-banana']).toBe('nanica')
        expect(headers['x-minions']).toBe('banana')
        expect(data).toStrictEqual({
            "Cool!":"yes"
        });
    })
    
    test(`${verb} changing the query params`, async ()=>{
        const {data, response} = await send(verb,"http://localhost:8111/crazy-path/here?nice=nok");
        expect(response.statusCode).toBe(504)
        expect(data).toStrictEqual({
            "Cool!":"not cool!"
        });
    })
    
    test(`${verb} with conditional response`, async ()=>{
        const {data, response} = await send(verb,"http://localhost:8111/crazy-path/here", {id: 1}, {"Content-Type": "application/json"});
        expect(response.statusCode).toBe(405)
        expect(data).toStrictEqual({
            "yes":"man!"
        });
    })
    
    test(`${verb} with conditional response`, async ()=>{
        const {data, response} = await send(verb,"http://localhost:8111/crazy-path/here", {id: 2}, {"Content-Type": "application/json"});
        expect(response.statusCode).toBe(200)
        expect(data).toStrictEqual({
            "super":"man!"
        });
    })

    test(`${verb} with conditional response objects`, async ()=>{
        const {data, response} = await send(verb,"http://localhost:8111/crazy-path/here", {person:{id:2}}, {"Content-Type": "application/json"});
        expect(response.statusCode).toBe(200)
        expect(data).toStrictEqual({
            "object":"noice"
        });
    })

    test(`${verb} for a path that doesn't exist - 404 case`, async ()=>{
        const {data, response} = await send(verb,"http://localhost:8111/a/12938103/b");
        expect(response.statusCode).toBe(404)
    })
}