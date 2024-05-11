const express= require('express')
const router= express.Router()
const feedbackController= require('../controller/feedbackC')
const reportController = require('../controller/reportAbug')

router.route("/feedback").post(feedbackController.feedback)
router.route("/report").post(reportController.report)
router.route('/hello').get(feedbackController.hello)

module.exports= router