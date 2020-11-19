
// ------------------------- CRUD WORDS, MySQL -------------------------
const mysql = require('mysql');

const db = mysql.createPool({
    host: 'mydb.ct9zaewm7tpb.us-east-1.rds.amazonaws.com',
    user: 'mydb',
    password: 'vippro123',
    database: 'ebdb',
    port: '3306'
});

var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});

exports.handler = function (event, context) {
    console.log("Incoming: ", event);
    // var output = querystring.parse(event);
    function get_eParams(receivers) {
        var eParams = {
            Destination: {
                ToAddresses: receivers
            },
            Message: {
                Body: {
                    Text: {
                        Data: "Wake up and learn new words at English Master"
                    }
                },
                Subject: {
                    Data: "Assignment 3 - CC2018"
                }
            },
            Source: '"English Master" <nguyenhoangchuong2598@gmail.com>'
        };
        return eParams;
    }

    db.query("SELECT email from user_a3", (err, result) => {
        if (err) throw (err);

        var email_list = []
        for (let index = 0; index < result.length; index++) {
            email_list.push(result[index].email)
        }
        console.log(email_list)
        var email = ses.sendEmail(get_eParams(email_list), function (err, data) {
            if (err) console.log(err);
            else {
                context.succeed(event);
            }
        });
    })
};





















