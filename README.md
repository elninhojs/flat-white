## Flat White service mock 

It's a nice and easy way to lie to your app and satisfy any integration need with beauty fake data!

### How it works

It ups an http server creating get, post, put and delete based in json configurations.

For every http verb you want to mock (GET, for instance), you must have a file with it's name on it in plural.

For instance:

`
/your-mock-dir/gets.json
`

If you are looking for mock get, post, put and delete you will have:

`/your-mock-dir/gets.json`

`/your-mock-dir/posts.json`

`/your-mock-dir/puts.json`

`/your-mock-dir/deletes.json`
```

Inside each file, the sintax to be used is the same. You can start copying the simple snipped below:

```json
    "/my-path/here?param=ok": {
        "response":{
            "body":{
                "right":"yes"
            },
            "code":200,
            "headers":{
                "x-believe-me":"bro"
            }
        }
    }

```
If you are looking for something more advanced, you can use conditional responses as shown below:

```json
    "/my-path/here": {
        "conditions":[
            {
                "body.id!==3":{
                    "response":{
                        "body":{
                            "that's bad":"man!"
                        },
                        "code":405
                    }
                }   
            },
            {
                "body.id===2":{
                    "response":{
                        "body":{
                            "super":"man!"
                        },
                        "code":200
                    }   
                }
            },
            {
                "body.id!==0 && body.id > 2 && body.id < 5":{
                    "response":{
                        "body":{
                            "super":"amazing!"
                        },
                        "code":200,
                        "headers":{
                            "x-awesome":"bro"
                        }
                    }
                }   
            }
        ]
    }....

```

### How to use it in your projects

The first step is to have the dev dependency installed 

```sh
npm i flat-white@latest
```

Than you have to inform your mock directory and if you wish a different port than 4321 you have to say that too.

```bash
FW_PORT=9999 FW_DIR=./mock-directory-here/ node node_modules/flat-white 
```

Ideally, you will end up adding the command to your package.json. For instance:

```json
"scripts": {
    "test":".....",
    "start:mock": "FW_PORT=9999 FW_DIR=./mock-directory-here/ node node_modules/flat-white"
    ...
  },
```

### How to dev on this project

You can start the mock api and use postman to test it _or_
you can run `npm test` and use an unit test to do so.

