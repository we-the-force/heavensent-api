'use strict';
/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/3.0.0-beta.x/concepts/configurations.html#cron-tasks
 */

module.exports = {

  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  '0 0 16 * * *': async () => {
    let today = new Date();
    console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`);

    // console.log(strapi.api.memory.services.memory);
    const unsentMemories = await strapi.api.memory.services.memory.find({
      sent: false,
    });
    console.log(unsentMemories.length);

    const memoriesToSend = [];
    unsentMemories.forEach(memory => {
      if (memory.reminder.date != null)
      {
        let memoryDate = new Date(memory.reminder.date);
        // console.log(`Checking memory, (date: ${memoryDate} < ${new Date()})`);
        if (memoryDate <= new Date())
        {
          // console.log(`Memory '${memory.title}' will be sent`);
          memoriesToSend.push(memory);
        }
        else
        {
          // console.log(`Memory '${memory.title}' won't be sent`);
        }
      }
    });

    console.log("Memories to be sent: " + memoriesToSend.length);

    console.log();
    // console.log(await strapi.api.memory.services.memory);
    // const entry = await strapi.api.memory.services.memory.update({id: memoriesToSend[0].id}, {sent: true});
    
    for (let memIndex = 0; memIndex < memoriesToSend.length; memIndex++)
    {
      console.log("Inside memory for: " + memIndex);

      var memory = memoriesToSend[memIndex];
      var emailResult = true;

      for (let conIndex = 0; conIndex < memory.recipients.length; conIndex++)
      {
        console.log("Inside contact for: " + conIndex);
        var recipient = memory.recipients[conIndex];

        let obj = {
          url: `http://heavensentnow.com/#!/memory/${memory.id}`,
          sender: memory.owners[0].name != "" ? memory.owners[0].name : memory.owners[0].username,
          senderEmail: memory.owners[0].email,
          name: recipient.name != "" ? recipient.name : recipient.username,
          email: recipient.email
        }
        console.log("Object");
        console.log(obj);

        console.log('sending email');
        await strapi.plugins['email'].services.email.send({
          to: obj.email,
          from: 'about@wetheforce.com',
          // subject: `${entry.owner.username} set you as their admin.`,
          subject: `A memory is now available`,
          
          text: `A memory is now available for viewing`,
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
          
          <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title></title>
              <style type="text/css">
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProLight.otf");
                      font-weight: 300;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProLightItalic.otf");
                      font-weight: 300;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
                      font-weight: normal;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
                      font-weight: normal;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProMedium.otf");
                      font-weight: 500;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProMediumItalic.otf");
                      font-weight: 500;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProBold.otf");
                      font-weight: 600;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProBoldItalic.otf");
                      font-weight: 600;
                      font-style: italic;
                  }
              </style>
              <!--[if (gte mso 9)|(IE)]> <style type="text/css"> table{border-collapse: collapse;}</style><![endif]-->
          </head>
          
          <body style="Margin: 0; background-color: #ffffff !important; color: #2D444E; font-family: Arial,sans-serif; font-size: 14px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
              <center class="wrapper" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; table-layout: fixed; width: 100%;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                      <tr>
                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                      </tr>
                  </table>
                  <div class="webkit" style="margin: 0 auto; max-width: 600px;">
                      <!--[if (gte mso 9)|(IE)]> <table width="600" align="center"> <tr> <td><![endif]-->
                      <table class="outer" align="center" style="Margin: 0 auto; border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif; max-width: 600px; width: 100%;">
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td align="center" valign="top" style="padding: 0;">
                                              <a href="http://app.heavensent.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
          0; text-decoration: underline;"><img src="data:image/png;base64,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" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
                                          </td>
                                      </tr>
                                  </table>
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table class="content" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9" style="-moz-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); -webkit-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); background-color: #f9f9f9; border-collapse: separate !important; border-color: #e4e2e2; border-radius: 4px; border-spacing: 0; border-style: solid; border-width: 1px; box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td align="center" valign="top" style="padding: 0;">
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
          color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="35" style="font-size: 35px; line-height: 35px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td class="inner" align="center" valign="top" style="padding: 0px 10px;">
                                                          <p class="h1" style="Margin:
          0; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 25px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">You have received a memory...</p><br/><br/>
                                                        <p style="margin-left: auto; margin-right: auto; width: 80%; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
                                                           
                                                         We have a memory from <b>${obj.sender}</b> ready to be delivered to you. Click the button below to open it.
                                                        </p>
                                                        <br/><br/>
                                                      </td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
          color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="15" style="font-size: 15px; line-height: 15px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td class="padding-0-30" align="center" valign="top" style="padding: 0 30px;">
                                                          
                                                      </td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="10" style="font-size: 10px;
          line-height: 10px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table class="content__button" width="190" height="48" cellpadding="0" cellspacing="0" border="0" bgcolor="#9DD6EA" style="background-color: #9DD6EA; border-radius: 3px; border-spacing: 0; color: #ffffff !important; font-family: Arial,sans-serif; height: 48px; padding: 0 15px;">
                                                  <tr>
                                                    <!-- LINK DE 
          END -->
                                                      <td align="center" valign="middle" height="48" style="color: #ffffff !important; padding: 0;"> <a class="content__button-link" href="${obj.url}" target="_blank" style="Margin: 0; color: #ffffff !important; display: inline-block; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; padding: 0; text-decoration: none;">Open</a>                                                </td>
                                                      <!-- FIN LINK DE BACKEND -->
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 0;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td class="inner header__text" align="center" valign="top" style="color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; padding: 0px 10px; text-decoration: none;">
                                              <a class="header__link" href="http://app.heavensent.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 0;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]-->
                  </div>
              </center>
          </body>
          
          </html>`
       }).then(function(res){
          console.log("then");
          console.log(res);
       }).catch(function(err){
          console.log(`Error en el promise :c del ${obj.email}`);
          console.log(err);

         emailResult = false;
       });
       console.log("after email");
      }

      if (emailResult)
      {
        console.log(`Updating memory with id: ${memory.id}`);
        await strapi.api.memory.services.memory.update({id: memory.id}, {sent: true});
      }
      else
      {
        console.log(`Couldn't update memory with id: ${memory.id}`);
      }
    }

    // console.log()
    // memoriesToSend.forEach(memory => {
    //   // console.log("Sending Memory");
    //   var emailResult = true;
    //   memory.recipients.forEach(recipient => {
        
    //     let obj = {
    //       url: `http://heavensentnow.com/#!/memory/${memory.id}`,
    //       sender: memory.owners[0].name != "" ? memory.owners[0].name : memory.owners[0].username,
    //       senderEmail: memory.owners[0].email,
    //       name: recipient.name != "" ? recipient.name : recipient.username,
    //       email: recipient.email
    //     }
        
    //     // console.log("sending email:");
    //     // console.log(obj);
    //     // let asd = await sendEmail(obj);
    //     // if (asd.success)
    //     // {
    //     //   console.log("it worked ayy");
    //     // }
    //     // else
    //     // {
    //     //   console.log("Didn't work dude")
    //     //   emailResult = false;
    //     // }


    //     let asd = await strapi.plugins['email'].services.email.send({
    //       to: obj.email,
    //       from: 'about@wetheforce.com',
    //       // subject: `${entry.owner.username} set you as their admin.`,
    //       subject: `A memory is now available`,
          
    //       text: `A memory is now available for viewing`,
    //       html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    //       <html xmlns="http://www.w3.org/1999/xhtml">
          
    //       <head>
    //           <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    //           <meta http-equiv="X-UA-Compatible" content="IE=edge">
    //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //           <title></title>
    //           <style type="text/css">
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProLight.otf");
    //                   font-weight: 300;
    //                   font-style: normal;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProLightItalic.otf");
    //                   font-weight: 300;
    //                   font-style: italic;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
    //                   font-weight: normal;
    //                   font-style: normal;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
    //                   font-weight: normal;
    //                   font-style: italic;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProMedium.otf");
    //                   font-weight: 500;
    //                   font-style: normal;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProMediumItalic.otf");
    //                   font-weight: 500;
    //                   font-style: italic;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProBold.otf");
    //                   font-weight: 600;
    //                   font-style: normal;
    //               }
                  
    //               @font-face {
    //                   font-family: "Gotham";
    //                   src: url("http://app.mydoctorize.com/fonts/GothamProBoldItalic.otf");
    //                   font-weight: 600;
    //                   font-style: italic;
    //               }
    //           </style>
    //           <!--[if (gte mso 9)|(IE)]> <style type="text/css"> table{border-collapse: collapse;}</style><![endif]-->
    //       </head>
          
    //       <body style="Margin: 0; background-color: #ffffff !important; color: #2D444E; font-family: Arial,sans-serif; font-size: 14px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
    //           <center class="wrapper" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; table-layout: fixed; width: 100%;">
    //               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                   <tr>
    //                       <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
    //                   </tr>
    //               </table>
    //               <div class="webkit" style="margin: 0 auto; max-width: 600px;">
    //                   <!--[if (gte mso 9)|(IE)]> <table width="600" align="center"> <tr> <td><![endif]-->
    //                   <table class="outer" align="center" style="Margin: 0 auto; border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif; max-width: 600px; width: 100%;">
    //                       <tr>
    //                           <td class="inner" style="padding: 0px 10px;">
    //                               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td align="center" valign="top" style="padding: 0;">
    //                                           <a href="http://app.heavensent.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
    //       0; text-decoration: underline;"><img src="data:image/png;base64,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" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
    //                                       </td>
    //                                   </tr>
    //                               </table>
    //                               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
    //                                   </tr>
    //                               </table>
    //                           </td>
    //                       </tr>
    //                       <tr>
    //                           <td class="inner" style="padding: 0px 10px;">
    //                               <table class="content" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9" style="-moz-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); -webkit-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); background-color: #f9f9f9; border-collapse: separate !important; border-color: #e4e2e2; border-radius: 4px; border-spacing: 0; border-style: solid; border-width: 1px; box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td align="center" valign="top" style="padding: 0;">
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
    //       color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="35" style="font-size: 35px; line-height: 35px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td class="inner" align="center" valign="top" style="padding: 0px 10px;">
    //                                                       <p class="h1" style="Margin:
    //       0; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 25px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">You have received a memory...</p><br/><br/>
    //                                                     <p style="margin-left: auto; margin-right: auto; width: 80%; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
                                                           
    //                                                      We have a memory from <b>${obj.sender}</b> ready to be delivered to you. Click the button below to open it.
    //                                                     </p>
    //                                                     <br/><br/>
    //                                                   </td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
    //       color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="15" style="font-size: 15px; line-height: 15px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td class="padding-0-30" align="center" valign="top" style="padding: 0 30px;">
                                                          
    //                                                   </td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="10" style="font-size: 10px;
    //       line-height: 10px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                           <table class="content__button" width="190" height="48" cellpadding="0" cellspacing="0" border="0" bgcolor="#9DD6EA" style="background-color: #9DD6EA; border-radius: 3px; border-spacing: 0; color: #ffffff !important; font-family: Arial,sans-serif; height: 48px; padding: 0 15px;">
    //                                               <tr>
    //                                                 <!-- LINK DE 
    //       END -->
    //                                                   <td align="center" valign="middle" height="48" style="color: #ffffff !important; padding: 0;"> <a class="content__button-link" href="${obj.url}" target="_blank" style="Margin: 0; color: #ffffff !important; display: inline-block; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; padding: 0; text-decoration: none;">Open</a>                                                </td>
    //                                                   <!-- FIN LINK DE BACKEND -->
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                           <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                               <tr>
    //                                                   <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
    //                                               </tr>
    //                                           </table>
    //                                       </td>
    //                                   </tr>
    //                               </table>
    //                           </td>
    //                       </tr>
    //                       <tr>
    //                           <td style="padding: 0;">
    //                               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
    //                                   </tr>
    //                               </table>
    //                           </td>
    //                       </tr>
    //                       <tr>
    //                           <td class="inner" style="padding: 0px 10px;">
    //                               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td class="inner header__text" align="center" valign="top" style="color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; padding: 0px 10px; text-decoration: none;">
    //                                           <a class="header__link" href="http://app.heavensent.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
    //                                   </tr>
    //                               </table>
    //                           </td>
    //                       </tr>
    //                       <tr>
    //                           <td style="padding: 0;">
    //                               <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
    //                                   <tr>
    //                                       <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
    //                                   </tr>
    //                               </table>
    //                           </td>
    //                       </tr>
    //                   </table>
    //                   <!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]-->
    //               </div>
    //           </center>
    //       </body>
          
    //       </html>`
    //    }).then(function(res){
    //      console.log("then");

    //    }).catch(function(err){
    //      console.log(`Error en el promise :c del ${obj.email}`);
    //      console.log(err);

    //      emailResult = false;
    //    });
    //     // try
    //     // {
    //     //   console.log("Sending email: ");
    //     //   console.log(obj);
    //     //   let asd = await sendEmail(obj);
    //     //   console.log(asd);
    //     // }
    //     // catch (error)
    //     // {
    //     //   console.log(`!!Error sending email to ${obj.email}!!`);
    //     //   console.log(error);
    //     //   console.log("emailResult = false");
    //     //   emailResult = false;
    //     // }
    //   })
    //   if (emailResult)
    //   {
    //     console.log(`Updating memory with id: ${memory.id}`);
    //     // await strapi.api.memory.services.memory.update({id: memory.id}, {sent: true});
    //   }
    //   else
    //   {
    //     console.log(`Couldn't update memory with id: ${memory.id}`);
    //   }
    // })

    async function sendEmail(objj)
    {
      var result = {success: true, message: ""};
      try
      {

        result.message = await strapi.plugins['email'].services.email.send({
          to: objj.email,
          from: 'about@wetheforce.com',
          // subject: `${entry.owner.username} set you as their admin.`,
          subject: `A memory is now available`,
          
          text: `A memory is now available for viewing`,
          html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
          
          <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title></title>
              <style type="text/css">
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProLight.otf");
                      font-weight: 300;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProLightItalic.otf");
                      font-weight: 300;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
                      font-weight: normal;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProRegular.otf");
                      font-weight: normal;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProMedium.otf");
                      font-weight: 500;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProMediumItalic.otf");
                      font-weight: 500;
                      font-style: italic;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProBold.otf");
                      font-weight: 600;
                      font-style: normal;
                  }
                  
                  @font-face {
                      font-family: "Gotham";
                      src: url("http://app.mydoctorize.com/fonts/GothamProBoldItalic.otf");
                      font-weight: 600;
                      font-style: italic;
                  }
              </style>
              <!--[if (gte mso 9)|(IE)]> <style type="text/css"> table{border-collapse: collapse;}</style><![endif]-->
          </head>
          
          <body style="Margin: 0; background-color: #ffffff !important; color: #2D444E; font-family: Arial,sans-serif; font-size: 14px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
              <center class="wrapper" style="-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; table-layout: fixed; width: 100%;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                      <tr>
                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                      </tr>
                  </table>
                  <div class="webkit" style="margin: 0 auto; max-width: 600px;">
                      <!--[if (gte mso 9)|(IE)]> <table width="600" align="center"> <tr> <td><![endif]-->
                      <table class="outer" align="center" style="Margin: 0 auto; border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif; max-width: 600px; width: 100%;">
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td align="center" valign="top" style="padding: 0;">
                                              <a href="http://app.heavensent.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
          0; text-decoration: underline;"><img src="data:image/png;base64,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" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
                                          </td>
                                      </tr>
                                  </table>
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table class="content" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f9f9f9" style="-moz-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); -webkit-box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); background-color: #f9f9f9; border-collapse: separate !important; border-color: #e4e2e2; border-radius: 4px; border-spacing: 0; border-style: solid; border-width: 1px; box-shadow: 0px 7px 35px 0px rgba(16,43,200,0.2); color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td align="center" valign="top" style="padding: 0;">
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
          color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="45" style="font-size: 45px; line-height: 45px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="35" style="font-size: 35px; line-height: 35px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td class="inner" align="center" valign="top" style="padding: 0px 10px;">
                                                          <p class="h1" style="Margin:
          0; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 25px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">You have received a memory...</p><br/><br/>
                                                        <p style="margin-left: auto; margin-right: auto; width: 80%; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
                                                           
                                                         We have a memory from <b>${objj.sender}</b> ready to be delivered to you. Click the button below to open it.
                                                        </p>
                                                        <br/><br/>
                                                      </td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0;
          color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="15" style="font-size: 15px; line-height: 15px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td class="padding-0-30" align="center" valign="top" style="padding: 0 30px;">
                                                          
                                                      </td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="10" style="font-size: 10px;
          line-height: 10px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table class="content__button" width="190" height="48" cellpadding="0" cellspacing="0" border="0" bgcolor="#9DD6EA" style="background-color: #9DD6EA; border-radius: 3px; border-spacing: 0; color: #ffffff !important; font-family: Arial,sans-serif; height: 48px; padding: 0 15px;">
                                                  <tr>
                                                    <!-- LINK DE 
          END -->
                                                      <td align="center" valign="middle" height="48" style="color: #ffffff !important; padding: 0;"> <a class="content__button-link" href="${objj.url}" target="_blank" style="Margin: 0; color: #ffffff !important; display: inline-block; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; padding: 0; text-decoration: none;">Open</a>                                                </td>
                                                      <!-- FIN LINK DE BACKEND -->
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                                  <tr>
                                                      <td height="30" style="font-size: 30px; line-height: 30px; padding: 0;">&nbsp;</td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 0;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td class="inner" style="padding: 0px 10px;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td class="inner header__text" align="center" valign="top" style="color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; padding: 0px 10px; text-decoration: none;">
                                              <a class="header__link" href="http://app.heavensent.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 0;">
                                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; color: #2D444E; font-family: Arial,sans-serif;">
                                      <tr>
                                          <td height="40" style="font-size: 40px; line-height: 40px; padding: 0;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                      <!--[if (gte mso 9)|(IE)]> </td></tr></table><![endif]-->
                  </div>
              </center>
          </body>
          
          </html>`
       });
      }
      catch (err)
      {
        console.log(`Someting went wrong (${objj.email}) [sendEmail]`);
        result.success = false;
        result.message = err;
        console.log(`Success: ${result.success}`);
        console.log("Message:");
        console.log(result.message);
      }
     console.log("------- Returning result");
     return result;
    }
    // console.log(memoriesToSend);
  }
};
