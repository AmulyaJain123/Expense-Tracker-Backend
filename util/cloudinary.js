const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const t1UploadToCloudinary = async (imagePath, publicId, width, height, folder) => {
    try {
        const res = await cloudinary.uploader.upload(imagePath, { public_id: publicId, folder: folder });
        if (!res) {
            throw "failed";
        }
        console.log(res, res.public_id);
        const url = cloudinary.url(res.public_id, {
            version: res.version,
            transformation: [
                {
                    quality: 'auto',
                    fetch_format: 'auto'
                },
                {
                    width: width,
                    height: height,
                    crop: "fill",
                    gravity: "auto"
                }
            ]
        })
        console.log(url);
        return url;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const t2UploadToCloudinary = async (imagePath, publicId, folder, mimetype) => {
    try {
        console.log(publicId)
        const res = await cloudinary.uploader.upload(imagePath, { public_id: publicId, resource_type: mimetype === "application/pdf" ? "image" : "auto", folder: folder });
        if (!res) {
            throw "failed";
        }
        console.log(res, res.public_id);
        const result = { previewUrl: undefined, uploadUrl: undefined };
        if (mimetype === "application/pdf") {
            const url = cloudinary.url(res.public_id, {
                version: res.version,
                format: 'pdf',
            })
            console.log(url);
            result.uploadUrl = url;
        }
        const url = cloudinary.url(res.public_id, {
            version: res.version,
            transformation: [
                {
                    quality: 'auto',
                    fetch_format: 'auto'
                },
            ]
        })
        result.previewUrl = url;
        if (result.uploadUrl === undefined) {
            result.uploadUrl = url;
        }

        return result;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const t3UploadToCloudinary = async (files, folder) => {
    try {
        const ans = [];
        for (let i of files) {
            const res1 = await cloudinary.uploader.upload(i.url, { folder: folder });
            if (!res1) {
                throw "failed";
            }
            console.log(res1, res1.public_id);
            const res2 = await cloudinary.uploader.upload(i.uploadUrl, { folder: folder });
            if (!res2) {
                throw "failed";
            }
            console.log(res2, res2.public_id);
            ans.push({ fakeName: i.name, previewUrl: res1.url, metaData: i.metaData, uploadUrl: res2.url });

        }
        console.log(ans);
        return ans;
    } catch (err) {
        console.log(err);
        return null;
    }

}

const deleteFolderInCloudinary = async (folder) => {
    try {
        await cloudinary.api.delete_resources_by_prefix(folder);
        await cloudinary.api.delete_folder(folder);
        return true;
    } catch (err) {
        console.log(err);
        return null;
    }
}

exports.t1UploadToCloudinary = t1UploadToCloudinary;
exports.t2UploadToCloudinary = t2UploadToCloudinary;
exports.t3UploadToCloudinary = t3UploadToCloudinary;
exports.deleteFolderInCloudinary = deleteFolderInCloudinary;



