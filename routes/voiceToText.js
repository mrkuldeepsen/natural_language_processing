const express = require('express') ;
const path = require('path');
const {Leopard} = require("@picovoice/leopard-node");

const accessKey = process.env.Access_key;
const handle = new Leopard(accessKey);

const router = express.Router() ;




module.exports = router ;