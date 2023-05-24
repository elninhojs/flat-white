const fs = require("fs")
const { exec } = require("child_process");
const getVersion = () => JSON.parse(fs.readFileSync(`${__dirname}/.././package.json`)).version;

/**
 * Converting it callback to promise to await for that nicely :)
 */
const execAsync = (cmd, verbose) => new Promise((ok, nok)=>{
    exec(cmd, (error, stdout) => {
        if (error) {
            console.log(error);
            nok(error.message);
            return;
        }
        verbose && console.log(stdout);
        ok(stdout);
    })
});

const newNpmVersion = async({releaseType}) =>{
    await execAsync(`npm config set git-tag-version=false && npm version ${releaseType}`);
    return getVersion();
}

const hasTag = async({version}) =>{
    const existentTags = await execAsync(`git tag -l`);
    return existentTags.indexOf(version)!==-1
}

const newReleaseLink = ({version}) => `https://github.com/elninhojs/flat-white/releases/new?tag=v${version}`


const doGitStuff = async ({version, releaseType}) =>{

    if(!await hasTag({version})){
        await execAsync(`git add ./package.json`);
        await execAsync(`git add ./package-lock.json`);
        await execAsync(`git commit -m 'Releasing new version using npm run release:${releaseType}'`);
        await execAsync(`git push & exit 0`);
        console.log(`😎  The package.json and lock were pushed! Yay!`)

        await execAsync(`git tag v${version}`);
        await execAsync(`git push origin refs/tags/v${version}`);
        console.log(`🤓  Nice! the tag v${version} was created and we did push it already!`)

        console.log(`🥳  See below the relase link to complete the task!`)
        console.log(`\n    ${newReleaseLink({version})}\n\n`)
    }else{
        console.log(`😔  Ow no! The tag v${version} already exist!`)
    }
}



const [arg0, agr1, releaseType] = process.argv;
const invalid = (!releaseType || releaseType.length===0 || "patchminormajor".indexOf(releaseType)===-1);
invalid && console.error("😰  Release type not found!! To use: npm run release <patch, minor or major>")

if(!invalid){
    (async () =>{
        try{
            const version = await newNpmVersion({releaseType})
            console.log(`🧐  Working with npm version ${version}`)
            await doGitStuff({version, releaseType});
        }catch(e){
            console.error(`Unexpected error! ${JSON.stringify(e)}`);
        }
    })();
}
