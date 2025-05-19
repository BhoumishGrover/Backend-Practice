const myPromise = new Promise((resolve,reject)=>{
    const random = Math.floor(Math.random()*2);
    if(random === 1){
        resolve();
    } else {
        reject();
    }
});

myPromise
    .then(()=>{console.log("Success,Random was 1!")})
    .catch(()=>{console.error("Nope,Error!")});

