/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/

import {input} from '@inquirer/prompts';
import qr from 'qr-image';
import fs from 'fs';

var URL = await input({message:'Enter your URL you want to create a QR for:'});
console.log("Generating QR for:",URL);

// var qr = require('qr-image');
// var fs = require("fs");

var myQr_png = qr.image(URL,{type:'png'});

// var code = qr.image('http://www.google.com', { type: 'png' });

myQr_png.pipe(fs.createWriteStream('Bhoumish-QR.png'));

