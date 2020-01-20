process.env.UV_THREADPOOL_SIZE=4;
const crypto = require('crypto');
const fs = require('fs');
const https = require('https');


//const os = require('os');
//console.log('no. of cores are: ',os.cpus().length);


function doHashing () {
    crypto.pbkdf2('a','b', 100000, 512, 'sha512', ()=> {
        console.log(`Hash:` , Date.now()-start);
    })
}

function readFile () {
    fs.readFile('dummy.js', 'utf8', ()=> {
        console.log(`FS: ${Date.now() - start}`);
    })
}

function httpCall () {
    https.request('https://www.google.com', (res)=> {
        res.on('data', ()=>{});
        res.on('end', ()=> {
            console.log(`HTTP: ${Date.now() - start}`);
        })
    }).end();
}

const start = Date.now();
httpCall();
readFile();
doHashing();
doHashing();
doHashing();
doHashing();
// doHashing();
// doHashing();
// doHashing();
// doHashing();


/*
Explanation: libuv threadpool is used for all fs calls and libuv library functions. Networking calls are independent of this threadpool and handled by the OS itself. 
Hence saying that node is single threaded is not absolutely correct. Core functions like crypto, fs are handled by libuv threadpool (which is generally 4 but can be tweaked). Network calls are handled by OS itself and many simultaneous calls are possible. But yes event loop is single threaded and makes use of single core. 

Below timings explanation: http call is independent of threads and thus return quickly. FS call goes to Hard drive and thread is idle for sometime so it picks the leftover hashing task. Now FS will only by picked again after one of the hashing is finished. Now FS is picked and it finishes soon. Therefore if threads are increased to 5, FS again takes its original time (very minimum).
*/