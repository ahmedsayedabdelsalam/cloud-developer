import fs from "fs";
import Jimp = require("jimp");
import { URL } from "url";
import path from 'path'
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // using axios cuz the image sample given is not working cus of missing mime type
      const imageBuffer = await axios({
        method: 'get',
        url: inputURL,
        responseType: 'arraybuffer'
      })
      const photo = await Jimp.read(imageBuffer.data);
      const outpath =
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname + outpath, (img) => {
          resolve(__dirname + outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

// validateUrl
// helper function to check if the passed url string is valid
// INPUTS
//    url: string the url string we want to validate
// RETURNS
//    true if the url is valid, false if not
export function validateUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// readTempDir
// helper function to read files in temp directory
// RETURNS
//    array of files full paths in the temp directory
export function readTempDir(): Array<string> {
  const temDirPath = __dirname + '/tmp';

  return fs.readdirSync(temDirPath).map(file => path.resolve(temDirPath, file))
}
