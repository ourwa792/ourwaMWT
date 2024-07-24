// المسار: /src/middleware/uploadMiddleware.js
const multer = require('multer');
const upload = require('../config/multer');

// إنشاء Middleware للتحقق من رفع الملفات
const uploadMiddleware = (req, res, next) => {
    try {
        // استخدام Multer لرفع الملفات مع التحقق من الشروط
        upload.fields([{ name: 'file' }, { name: 'thumbnail' }])(req, res, (err) => {
            // في حالة حدوث خطأ أثناء رفع الملفات
            if (err) {
                let errorMessage = 'حدث خطأ أثناء رفع الملف.';
                // التحقق مما إذا كان الخطأ من نوع MulterError
                if (err instanceof multer.MulterError) {
                    switch (err.code) {
                        // تخصيص رسالة خطأ إذا كان حجم الملف يتجاوز الحد المسموح به
                        case 'LIMIT_FILE_SIZE':
                            errorMessage = 'حجم الملف يتجاوز الحد المسموح به!';
                            break;
                        // تخصيص رسالة خطأ إذا تم رفع ملف غير متوقع
                        case 'LIMIT_UNEXPECTED_FILE':
                            errorMessage = 'تم رفع ملف غير متوقع!';
                            break;
                        // إضافة المزيد من الحالات هنا بناءً على أنواع الأخطاء الأخرى
                        default:
                            errorMessage = `Multer Error: ${err.message}`;
                    }
                } else {
                    // في حالة حدوث خطأ آخر غير متعلق بـ Multer
                    errorMessage = err.message;
                }
                // إعداد رسالة الفلاش لعرضها في واجهة المستخدم
                //req.flash('error_msg', errorMessage);
                console.error('Upload error:', err.message);
                return res.status(400).render('resources/upload',{
                    pageTitle:"مصادر", error_msg: [errorMessage]
                });
            }

            // التحقق من وجود الملف
            if (!req.files || !req.files['file'] || req.files['file'].length === 0) {
                //req.flash('error_msg', 'يرجى تحميل ملف.');
                //return res.redirect('/resources/upload');
                return res.render('resources/upload',{
                    error_msg:['يرجى تحميل ملف'], pageTitle:"مصادر تعليمية"
                })
            }

            const file = req.files['file'][0];
            console.log("---------file here---------"+file);

            const thumbnail = req.files['thumbnail'] ? req.files['thumbnail'][0] : null;
            console.log("--------thumbnail here --------"+thumbnail)
            // التحقق من حجم الملف
            if (file.size > 5 * 1024 * 1024) { // 5MB
                //req.flash('error_msg', 'حجم الملف يتجاوز 5MB!');
                //return res.redirect('/resources/upload');
                return res.render('resources/upload',{
                    error_msg:['حجم الملف يتجاوز 5MB'], pageTitle:"مصاددر"})
            }

            if (thumbnail && thumbnail.size > 2 * 1024 * 1024) { // 2MB
                //req.flash('error_msg', 'حجم الصورة المصغرة يتجاوز 2MB!');
                //return res.redirect('/resources/upload');
                return res.render('resources/upload',{
                    error_msg:['حجم الصورة المصغرة يتجاوز 2MB'], pageTitle:"مصادر"})
            }

            // الانتقال إلى الميدل وير التالي
            next();
        });
    } catch (error) {
        console.error('Unexpected upload error:', error.message);
        //req.flash('error_msg', 'حدث خطأ غير متوقع أثناء الرفع.');
        //res.redirect('/resources/upload'); 
        next(error)
        res.status(500).render('resources/upload', {
            pageTitle: 'رفع مصادر تعليمية',
            error_msg: ['حدث خطأ غير متوقع أثناء الرفع.']
        });
    }
};

module.exports = uploadMiddleware;
