'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    async create(ctx){
        let entity;

        if (ctx.is('multipart'))
        {
            const {data, files} = parseMultipartData(ctx);
            entity = await strapi.services.payment.create(data, {files});
        }
        else
        {
            entity = await strapi.services.payment.create(ctx.request.body);
        }

        let entry = sanitizeEntity(entity, {model: strapi.models.payment});

        console.log(`About to send email to ${entry.userEmail}`);
        // strapi.plugins['email'].services.email.send({
        //     to: entry.userEmail,
        //     from: 'about@heavensentnow.com',
        //     // subject: `${entry.owner.username} set you as their admin.`,
        //     subject: `You've been charged for membership`,
            
        //     text: `Membership charge`,
        //     html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        //     <html xmlns="http://www.w3.org/1999/xhtml">
            
        //     <head>
        //         <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        //         <meta http-equiv="X-UA-Compatible" content="IE=edge">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //         <title></title>
        //         <style type="text/css">
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProLight.otf");
        //                 font-weight: 300;
        //                 font-style: normal;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProLightItalic.otf");
        //                 font-weight: 300;
        //                 font-style: italic;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
        //                 font-weight: normal;
        //                 font-style: normal;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
        //                 font-weight: normal;
        //                 font-style: italic;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProMedium.otf");
        //                 font-weight: 500;
        //                 font-style: normal;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProMediumItalic.otf");
        //                 font-weight: 500;
        //                 font-style: italic;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProBold.otf");
        //                 font-weight: 600;
        //                 font-style: normal;
        //             }
                    
        //             @font-face {
        //                 font-family: "Gotham";
        //                 src: url("http://app.mydoctorize.com/fonts/GothamProBoldItalic.otf");
        //                 font-weight: 600;
        //                 font-style: italic;
        //             }
        //         </style>
        //         <!--[if (gte mso 9)|(IE)]> <style type="text/css"> table{border-collapse: collapse;}</style><![endif]-->
        //     </head>
            
        //     <body style="Margin: 0; background-color: #ffffff !important; color: #2D444E; font-family: Arial,sans-serif; font-size: 14px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
        //         <center class="wrapper" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; table-layout: fixed; width: 100%;">
        //             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                 <tr>
        //                     <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
        //                 </tr>
        //             </table>
        //             <div class="webkit" style="margin: 0 auto; max-width: 600px;">
        //                 <!--[if (gte mso 9)|(IE)]> <table width="600" align="center"> <tr> <td><![endif]-->
        //                 <table class="outer" align="center" style="Margin: 0 auto; border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif; max-width: 600px; width: 100%;">
        //                     <tr>
        //                         <td class="inner" style="padding: 0px 10px;">
        //                             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td align="center" valign="top" style="padding: 0;">
        //                                         <a href="http://app.heavensentnow.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
        //     0; text-decoration: underline;"><img src="https://app.heavensentnow.com/static/img/logo-email.png" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
        //                                     </td>
        //                                 </tr>
        //                             </table>
        //                             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
        //                                 </tr>
        //                             </table>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td class="inner" style="padding: 0px 10px;">
        //                             <table class="content" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9" style="-moz-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); -webkit-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); background-color: #f9f9f9; border-collapse: separate !important; border-color: #e4e2e2; border-radius: 4px; border-spacing: 0; border-style: solid; border-width: 1px; box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td align="center" valign="top" style="padding: 0;">
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
        //     color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="35" style="font-size: 35px; line-height: 35px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td class="inner" align="center" valign="top" style="padding: 0px 10px;">
        //                                                     <p class="h1" style="Margin:
        //     0; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 25px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">You've been charged with a membership</p><br/><br/>
        //                                                   <p style="margin-left: auto; margin-right: auto; width: 80%; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
                                                             
        //                                                     Amount: <b>$${entry.amountUSD}</b>
        //                                                     <br>
        //                                                     Date: <b>${entry.date}</b>
        //                                                     <br>
        //                                                     Concept: <b>${entry.concept}</b>
        //                                                   </p>
        //                                                   <br/><br/>
        //                                                 </td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
        //     color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="15" style="font-size: 15px; line-height: 15px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td class="padding-0-30" align="center" valign="top" style="padding: 0 30px;">
                                                            
        //                                                 </td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="10" style="font-size: 10px;
        //     line-height: 10px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                         <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                             <tr>
        //                                                 <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
        //                                             </tr>
        //                                         </table>
        //                                     </td>
        //                                 </tr>
        //                             </table>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td style="padding: 0;">
        //                             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
        //                                 </tr>
        //                             </table>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td class="inner" style="padding: 0px 10px;">
        //                             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td class="inner header__text" align="center" valign="top" style="color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; padding: 0px 10px; text-decoration: none;">
        //                                         <a class="header__link" href="http://app.heavensentnow.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
        //                                 </tr>
        //                             </table>
        //                         </td>
        //                     </tr>
        //                     <tr>
        //                         <td style="padding: 0;">
        //                             <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
        //                                 <tr>
        //                                     <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
        //                                 </tr>
        //                             </table>
        //                         </td>
        //                     </tr>
        //                 </table>
        //                 <!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]-->
        //             </div>
        //         </center>
        //     </body>
            
        //     </html>`
        //  });
        // console.log("Finish email request");
        // console.log("Resulting entry");
        // console.log(entry);
        return entry;
    }
};
