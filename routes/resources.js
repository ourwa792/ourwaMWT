// المسار: /src/routes/resources.js
const express = require('express');
const Resource  = require('../model/association').Resources
const upload = require('../config/multer');
const isAdmin = require('../middleware/isAdmin');
const {cloudinary} = require('../config/cloudinary')
const uploadMiddleWare = require('../middleware/uploadMulter')
const axios = require('axios') ;
const fs = require('fs')
const path = require('path');


const route = express.Router();


route.get('/', async (req, res) => {
    try {
        const resources = await Resource.findAll();
        res.render('resources/index', { pageTitle: 'Resources', resources });  
    } catch (error) {
        console.error('Error fetching resources:', error);
        req.flash('error_msg', 'Failed to load resources. Please try again later.');
        res.redirect('/');
    }
 
}); 

route.get('/upload', isAdmin, (req, res, next) => {
    res.render('resources/upload',{pageTitle: 'رفع مصادر'});
});


route.post('/upload', isAdmin, uploadMiddleWare ,
    
    async (req, res, next) => {

    try {
     /*   if (!req.files || !req.files['file'] || req.files['file'].length === 0) {
            req.flash('error_msg', 'يرجى اختيار ملف.');
            return res.redirect('/resources/upload');
        } */ 

        const { title } = req.body;
        const file = req.files['file'][0]; console.log('file----'+file)
        const fileUrl = file.path; console.log('fileURL----'+fileUrl)
        const filePublicId = file.filename; console.log('filePublicId===='+filePublicId)
        const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
        //const thumbnailUrl = thumbnail ? thumbnail.path : null;
        //const thumbnailPublicId = thumbnail ? thumbnail.filename : null;
        console.log('File details:', file.mimetype, file.size);

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
            'application/msword', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint'];
        if (!allowedTypes.includes(file.mimetype)) {
            req.flash('error_msg', 'تنسيق غير مدعوم');
            return res.redirect('/resources/upload');
        }

        // التحقق من حجم الملف
        if (file.size > 5 * 1024 * 1024) { // 5MB
            req.flash('error_msg', 'File size exceeds the limit of 5MB.');
            return res.redirect('/resources/upload');
        }

        if (thumbnail && thumbnail.size > 2 * 1024 * 1024) { // 2MB
            req.flash('error_msg', 'Thumbnail size exceeds the limit of 2MB.');
            return res.redirect('/resources/upload');
        }

        let fileType;

        if (file.mimetype.startsWith('image')) {
            fileType = 'image';
        } else if (file.mimetype === 'application/pdf') {
            fileType = 'pdf';
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.mimetype === 'application/msword') {
            fileType = 'docx';
        } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                file.mimetype === 'application/vnd.ms-powerpoint') {
            fileType = 'pptx';
        }

        // استخراج public_id من Cloudinary response
        let fileResult;
        try {
            fileResult = await cloudinary.uploader.upload(file.path, {
                folder: 'educational-resources',
                resource_type: fileType === 'image' ? 'image' : 'raw'
            });
        } catch (uploadError) {
            console.error('Error uploading file to Cloudinary:', uploadError);
            req.flash('error_msg', 'Error uploading file to Cloudinary');
            return res.redirect('/resources/upload');
        }
        console.log('fileResult==========='+JSON.stringify(fileResult));


      let thumbnailResult;
        if (thumbnail) {
            try {
                thumbnailResult = await cloudinary.uploader.upload(thumbnail.path, {
                    folder: 'educational-resources',
                    resource_type: 'image'
                });
            } catch (uploadError) {
                console.error('Error uploading thumbnail to Cloudinary:', uploadError);
                req.flash('error_msg', 'Error uploading thumbnail to Cloudinary');
                return res.redirect('/resources/upload');
            }
        }
        console.log('thumbnailResult is ------------ '+thumbnailResult)

        await Resource.create({
            title,
            url: fileResult.secure_url,
            thumbnailUrl: thumbnailResult ? thumbnailResult.secure_url : null,
            type: fileType,
            publicId: filePublicId, 
            //fileResult.public_id,
            thumbnailPublicId: thumbnailResult ? thumbnailResult.original_filename/* public_id */ : null,
        });
        req.flash('success_msg', 'تم رفع المصادر التعليمية بنجاح');
        res.redirect('/resources');
    } catch (error) {
        console.error('Error uploading resource:', error);
        req.flash('error_msg', 'Failed to upload resource. Please try again later.');
        res.redirect('/resources/upload');
    }
});


route.delete('/:id', isAdmin, async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findByPk(resourceId);
        console.log('resource------------------------------'+resource.publicId)
        if (!resource) {
            return res.status(404).send('Resource not found');
        }

        // حذف الملف من Cloudinaryب
        await cloudinary.uploader.destroy(resource.publicId);
        console.log(resource.publicId+'------------ is deleted')
        if (resource.thumbnailPublicId) {
            await cloudinary.uploader.destroy('educational-resources/'+resource.thumbnailPublicId);
            console.log('thumbnail deleted------------'+ resource.thumbnailPublicId)
        }

        // حذف المورد من قاعدة البيانات
        await resource.destroy();
        res.redirect('/resources');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


route.get('/download/:id', async (req, res) => {
    try {
        const resourceId = req.params.id;
        const resource = await Resource.findByPk(resourceId);
        if (!resource) {
            return res.status(404).send('Resource not found');
        }

        //res.redirect(resource.url);
        const fileUrl = resource.url ;
        const fileExtension = path.extname(fileUrl)
        console.log('fileEXt is ======>>'+fileExtension)
        //res.download(fileUrl, fileExtension, (err) => {})


        const fileName = `${resource.title}${fileExtension}`
        console.log('fileName is ----------->>'+fileName);

        const response = await axios({
            url: fileUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 60000, // 60 ثانية
        })

        const tempryFilePath = path.join(__dirname, '..', 'temp', fileName)
        //console.log('tempryFilePath--------->'+tempryFilePath)
        const writer = fs.createWriteStream(tempryFilePath) ;
        response.data.pipe(writer) ;
        //console.log('response.data.pipe(writer) --->'+response.data.pipe(writer))
        writer.on('finish', ()=>{
            res.download(tempryFilePath, fileName, (err) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('internal server error')
                }

                //fs.unlinkSync(tempryFilePath)
            })
        })

        writer.on('error', (err) => {
            console.error(err);
            res.status(500).send('internal--server--error')
        })

    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

   
module.exports = route;