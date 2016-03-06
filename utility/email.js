"use strict";

var moment = require("moment");

module.exports = {
    sendEmailToSenderAfterReceiverCheckIn: sendEmailToSenderAfterReceiverCheckIn,
    sendEmailToSenderBeforeReceiverCheckIn:sendEmailToSenderBeforeReceiverCheckIn
};

function sendEmailToSenderAfterReceiverCheckIn(toEmail, senderName, recieverName) {
    var sendgrid_username   = process.env.SENDGRID_USERNAME;
    var sendgrid_password   = process.env.SENDGRID_PASSWORD;
    var to                  = toEmail;
    var fromEmail           = process.env.FROM;
console.log("Email api called")
    var sendgrid   = require('sendgrid')(sendgrid_username, sendgrid_password);
    var email      = new sendgrid.Email();

    email.addTo(to);
    email.setFrom(fromEmail);

    email.setSubject('Avagaman Notifications: ' + recieverName + ' is checked in to office.');
    email.setHtml('<strong>Hi %firstuser%,</stromg><br/></br> %seconduser% is checked in to office.</strong>');
    email.addSubstitution("%firstuser%", senderName);
    email.addSubstitution("%seconduser%", recieverName);
    email.addHeader('X-Sent-Using', 'SendGrid-API');
    email.addHeader('X-Transport', 'web');

    sendgrid.send(email, function(err, json) {
      return true;
    });
}

function sendEmailToSenderBeforeReceiverCheckIn(toEmail, senderName, recieverName, msg) {
    var sendgrid_username   = process.env.SENDGRID_USERNAME;
    var sendgrid_password   = process.env.SENDGRID_PASSWORD;
    var to                  = toEmail;
    var fromEmail           = process.env.FROM;
    var sendgrid   = require('sendgrid')(sendgrid_username, sendgrid_password);
    var email      = new sendgrid.Email();

    email.addTo(to);
    email.setFrom(fromEmail);

    email.setSubject('Avagaman Notifications: ' + senderName + ' is looking for you in office.');
    email.setHtml('<strong>Hi %firstuser%,</strong><br/></br> %seconduser% is looking for you in office..');
    email.setHtml('Message: ' + msg);

    email.addSubstitution("%firstuser%", recieverName);
    email.addSubstitution("%seconduser%", senderName);
    email.addHeader('X-Sent-Using', 'SendGrid-API');
    email.addHeader('X-Transport', 'web');

    sendgrid.send(email, function(err, json) {
      return true;
    });
}
            