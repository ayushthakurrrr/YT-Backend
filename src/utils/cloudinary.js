import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ApiError } from './apiError.js';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // console.log(localFilePath,'localFilePath');
        // console.log(process.env.CLOUDINARY_API_KEY,'CLOUDINARY_API_KEY');
        if (!localFilePath) return null
        //upload the file on cloudinary
        // console.log(localFilePath,'localFilePath2');
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "Backend VDTUBE"
        })
        // file has been uploaded successfull
        console.log("file is uploaded on cloudinary ", response);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log(error)
        return null;
    }
}

// const getPublicIdFromUrl = (url) => {
//     // Extract the part after '/upload/'
//     const parts = url.split("/upload/")[1];

//     // Remove extension from the last part
//     const [publicIdWithoutExtension] = url.split("."); // removes .jpg/.png etc.

//     return publicIdWithoutExtension; // This is your public_id
// };

const getPublicIdFromUrl = (url) => {
    return url.substring(0, url.lastIndexOf('.'));
};


const deleteItem = async (url) => {
    try {
        console.log(url);
        const public_id = getPublicIdFromUrl(url)
        console.log(public_id);
        return await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        throw new ApiError(401, "Something went wrong on deleting cloudinary item", error);
    }
}

export { uploadOnCloudinary, deleteItem }