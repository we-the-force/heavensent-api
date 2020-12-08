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

const moment = require('moment');

module.exports = {

    /**
     * Simple example.
     * Every monday at 1am.
     */
    // '0 1 * * 1': () => {
    //
    // }

    //   '* * * * *': async () => {
    '* * * * *': async() => {
        let today = new moment();
        console.log("~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~");
        // console.log(`${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`);
        console.log(`${today.format("hh:mm:ss")}`);

        // Get a collection of unsent memories.
        const unsentMemories = await strapi.api.memory.services.memory.find({
            sent: false,
        });
        console.log(`Unsent memories: ${unsentMemories.length}`);

        // Gets a collection of memories set to repeat themselves.
        const repeatMemories = await strapi.api.memory.services.memory.find({
            send_repeat: true,
        });
        console.log(`Repeat memories: ${repeatMemories.length}`);

        // Creates an array of memories to be sent.
        // Filters unsentMemories by date, leaves only the ones which release dates have already happened.
        const memoriesToSend = [];
        unsentMemories.forEach(memory => {
            if (memory.reminder.date != null) {
                let memoryDate = new moment(memory.reminder.date).add(1, 'day');
                console.log("Memory reminder thing:\r\n", memory.reminder);
                console.log(`  Checking memory, (date: ${memoryDate.format()} < ${new moment().format()})`);

                if (memoryDate <= new moment()) {
                    console.log(`    Memory '${memory.title}' will be sent`);
                    memoriesToSend.push(memory);
                } else {
                    console.log(`    Memory '${memory.title}' won't be sent`);
                }
            }
        });

        // Creates an array of memories to be sent on repeat.
        // Filters repeatMemories, leaves only the ones which release dates have already happened (and have already been sent).
        const repeatMemoriesToSend = [];
        repeatMemories.forEach(memory => {
            if (memory.sent)
            {
                if (memory.reminder.date != null) {
                    let memoryDate = new moment(memory.reminder.date);
                    console.log(`  Checking memory, (date: ${memoryDate.format()} < ${new moment().format()})`);
    
                    if (memoryDate <= new moment()) {
                        console.log(`    Memory '${memory.title}' will be sent`);
                        repeatMemoriesToSend.push(memory);
                    } else {
                        console.log(`    Memory '${memory.title}' won't be sent`);
                    }
                }
            }
        });

        console.log("Memories to be sent: " + (memoriesToSend.length + repeatMemoriesToSend.length));

        // console.log(await strapi.api.memory.services.memory);
        // const entry = await strapi.api.memory.services.memory.update({id: memoriesToSend[0].id}, {sent: true});

        //HandleNonsentMemories
        // Sends the memories.
        await handleNonsentMemories(memoriesToSend);
        // Sends the memories on repeat.
        await handleRepeatMemories(repeatMemoriesToSend);
        console.log();
    }
};

/**
 * @param {*memories to be sent} memoriesToSend
 * 
 * cylces through the memoriesToSend array, then cycles through its contacts and sends an email to each of them.
 * It then proceed to send a notification to the memory owner via email
 * If both of those actions were done successfully, it updates the status of the memory:
 *   Updates the next repeat date depending on the repeat lapse it's set to
 *   If the next repeat date is higher than the end repeat date, it sets the memory to no longer repeat itself.
 */
async function handleRepeatMemories(memoriesToSend)
{
    console.log("Handle repeat memories");
    for (let memIndex = 0; memIndex < memoriesToSend.length; memIndex++)
    {
        var memory = memoriesToSend[memIndex];
        var receiverEmailResult = true;
        var ownerEmailResult = true;

        for (let conIndex = 0; conIndex < memory.recipients.length; conIndex++)
        {
            console.log("    Inside contact for: " + conIndex);
            var recipient = memory.recipients[conIndex];

            const contact = await strapi.api.contact.services.contact.find({
                contact: recipient.id,
            });

            let mail = contact[0].contactEmail ? contact[0].contactEmail : recipient.email;

            let obj = {
                url: `http://app.heavensentnow.com/#!/user/${recipient.id}/memory/${memory.id}/0`,
                sender: memory.owners[0].name != "" ? memory.owners[0].name : memory.owners[0].username,
                senderEmail: memory.owners[0].email,
                name: recipient.name != "" ? recipient.name : recipient.username,
                email: mail
            }

            // Enviar correo al receiver
            // console.log('  sending email');
            receiverEmailResult = await sendReceiverEmail(obj);
        }

        //Enviar correo al owner
        //aqui enviar al sender
        ownerEmailResult = await sendOwnerEmail(memory);

        if (receiverEmailResult && ownerEmailResult)
        {
            let currentDate = new moment(memory.reminder.date);
            console.log(`CurrentDate: ${memory.reminder.date}\r\nMomentDate: ${currentDate.format("YYYY-MM-DD")}`);
            let newDate = "";
            let oldEndDate = new moment(memory.reminder.date_end);
            switch (memory.reminder.repeat)
            {
                case "weekly":
                    console.log("    Was weekly lmao");
                    // newDate = new moment(memory.reminder.date).add(1, 'week');
                    newDate = currentDate.add(1, 'week');
                    break;
                case "monthly":
                    console.log("    Was montly lmao"); 
                    newDate = currentDate.add(1, 'month');
                    break;
                case "yearly":
                    console.log("    Was yearly lmao"); 
                    newDate = currentDate.add(1, 'year');
                    break;
                default:
                    break;
            }
            if (newDate > oldEndDate)
            {
                console.log("!!!Not repeating anymore unu");
                await strapi.api.memory.services.memory.update({ id: memory.id }, { send_repeat: false });
            }
            else
            {
                let formattedDate = newDate.add(1, 'day').format("YYYY-MM-DD");
                // let oldEndDate = new moment(memory.reminder.date_end).add(1, 'day').format("YYYY-MM-DD");
                console.log(`    Old date was: ${memory.reminder.date}`);
                console.log(`    New date will be: ${newDate.format("YYYY-MM-DD")}`);
                console.log(`    Old endDate was: ${memory.reminder.date_end}`);
                console.log("- - - - - - - - - - -");
                // console.log(`New date will be: ${newDate.format("YYYY-MM-DD")}`);
                await strapi.api.memory.services.memory.update({ id: memory.id }, 
                    { 
                        reminder: { 
                            date: formattedDate,
                            repeat: memory.reminder.repeat,
                            locationLat: memory.reminder.locationLat,
                            locationLng: memory.reminder.locationLng,
                            date_end: oldEndDate.add(1, 'day').format("YYYY-MM-DD")
                        } 
                    }).then(function(asd) {
                        console.log("  Then: ", asd.reminder);
                    });

            }
        }
    }
}

/**
 * @param {*memories to be sent} memoriesToSend
 * 
 * cylces through the memoriesToSend array, then cycles through its contacts and sends an email to each of them.
 * It then proceed to send a notification to the memory owner via email
 * If both of those actions were done successfully, it updates the status of the memory:
 *   The memory is set to 'sent'
 *   If the memory has been set to repeat, it handles the setup
 *      Sets the next repeat date
 *      Sets the memory to send_repeat: true; this will tell this cronjob to handle it separately from single-send memories.
 *      If the next repeat date is higher than the end repeat date, it sets the current memory to not repeat itself.
 */
async function handleNonsentMemories(memoriesToSend)
{
    console.log("Handle nonsent memories");
    for (let memIndex = 0; memIndex < memoriesToSend.length; memIndex++) {
        console.log("  Inside memory for: " + memIndex);

        var memory = memoriesToSend[memIndex];
        var receiverEmailResult = true;
        var ownerEmailResult = true;

        for (let conIndex = 0; conIndex < memory.recipients.length; conIndex++) {
            console.log("    Inside contact for: " + conIndex);
            var recipient = memory.recipients[conIndex];

            const contact = await strapi.api.contact.services.contact.find({
                contact: recipient.id,
            });

            let mail = contact[0].contactEmail ? contact[0].contactEmail : recipient.email;

            let obj = {
                url: `http://app.heavensentnow.com/#!/user/${recipient.id}/memory/${memory.id}/0`,
                sender: memory.owners[0].name != "" ? memory.owners[0].name : memory.owners[0].username,
                senderEmail: memory.owners[0].email,
                name: recipient.name != "" ? recipient.name : recipient.username,
                email: mail
            }

            console.log('  sending email');
            receiverEmailResult = await sendReceiverEmail(obj);
            // console.log("  after email");
        }

        //Enviar correo
        //aqui enviar al sender
        ownerEmailResult = await sendOwnerEmail(memory);

        if (receiverEmailResult && ownerEmailResult) {
            console.log(`  Updating memory with id: ${memory.id}`);
            console.log(`  repeats: ${memory.reminder.repeat}`);
            await strapi.api.memory.services.memory.update({ id: memory.id }, { sent: true });
            if (memory.reminder.repeat != "not")
            {
                await strapi.api.memory.services.memory.update({ id: memory.id }, { send_repeat: true });
                console.log(`    CurrentDate: ${memory.reminder.date}`);
                let newDate = "";
                let oldEndDate = new moment(memory.reminder.date_end);
                switch (memory.reminder.repeat)
                {
                    case "weekly":
                        // console.log("    Was weekly lmao");
                        newDate = new moment(memory.reminder.date).add(1, 'week');
                        break;
                    case "monthly":
                        // console.log("    Was monthly lmao"); 
                        newDate = new moment(memory.reminder.date).add(1, 'month');
                        break;
                    case "yearly":
                        // console.log("    Was yearly lmao"); 
                        newDate = new moment(memory.reminder.date).add(1, 'year');
                        break;
                    default:
                        break;
                }
                

                if (newDate > oldEndDate)
                {
                    console.log("!!!Not repeating anymore unu");
                    await strapi.api.memory.services.memory.update({ id: memory.id }, { send_repeat: false });
                }
                else
                {
                    let formattedDate = newDate.add(1, 'day').format("YYYY-MM-DD");
                    // let oldEndDate = new moment(memory.reminder.date_end).add(1, 'day').format("YYYY-MM-DD");
                    console.log(`Old date was: ${memory.reminder.date}`);
                    console.log(`New date will be: ${newDate.format("YYYY-MM-DD")}`);
                    console.log(`Old endDate was: ${memory.reminder.date_end}`);
                    console.log("- - - - - - - - - - -");
                    // console.log(`New date will be: ${newDate.format("YYYY-MM-DD")}`);
                    await strapi.api.memory.services.memory.update({ id: memory.id }, 
                        { 
                            reminder: { 
                                date: formattedDate,
                                repeat: memory.reminder.repeat,
                                locationLat: memory.reminder.locationLat,
                                locationLng: memory.reminder.locationLng,
                                date_end: oldEndDate.add(1, 'day').format("YYYY-MM-DD")
                            } 
                        }).then(function(asd) {
                            console.log("Then: ", asd.reminder);
                        });
                }

            }
        } else {
            console.log(`  Couldn't update memory with id: ${memory.id}`);
        }
    }
}

/**
 * 
 * @param {Email object} obj
 * Sends a notification email to the receiver of a memory
 */
async function sendReceiverEmail(obj)
{
    await strapi.plugins['email'].services.email.send({
        to: obj.email,
        from: 'info@heavensentnow.com',
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
                                                <a href="http://app.heavensentnow.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
            0; text-decoration: underline;"><img src="https://app.heavensentnow.com/static/img/logo-email.png" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
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
                                                            
                                                            We have a memory from <b>${obj.sender}</b> ready to be delivered to you. Click the button below to open it. </br> Or order it <a href="https://wa.me/14155238886?text=join+wash-season">on demand</a>
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
                                                <a class="header__link" href="http://app.heavensentnow.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
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
    }).then(function(res) {
        console.log("then");
        console.log(res);
    }).catch(function(err) {
        console.log(`Error en el promise :c del ${obj.email}`);
        console.log(err);
        return false;
    });
    return true;
}

/**
 * 
 * @param {memory object that the owner will be notified about} memory
 * Sends a notification email to the owner of the memory.
 */
async function sendOwnerEmail(memory)
{
    await strapi.plugins['email'].services.email.send({
        to: memory.owners[0].email,
        from: 'info@heavensentnow.com',
        // subject: `${entry.owner.username} set you as their admin.`,
        subject: `Your memory has been delivered`,
        text: `Your memory is now available for your contacts`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title></title>
           
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
                                      <a href="http://app.heavensentnow.com/" target="_blank" style="Margin: 0; color: #9DD6EA; font-family: Arial,sans-serif; font-weight: normal; line-height: 1.3; margin: 0 !important; padding:
  0; text-decoration: underline;"><img src="https://app.heavensentnow.com/static/img/logo-email.png" width="auto" height="80" border="0" alt="Heaven Sent" style="border: none; display: block; height: 80px !important; margin: 0; padding: 0; width: auto !important;"></a>
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
  0; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 25px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
Your memory has been delivered</p><br/><br/>
                                                <p style="margin-left: auto; margin-right: auto; width: 80%; color: #2D444E; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 !important; padding: 0;">
                                                   
                                                 
We have sent your memory to all the contacts you assigned to it. Click the button below to open it.
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
                                              <td align="center" valign="middle" height="48" style="color: #ffffff !important; padding: 0;"> <a class="content__button-link" href="http://app.heavensentnow.com/#!/user/${memory.owners[0].id}/memory/${memory.id}/0" target="_blank" style="Margin: 0; color: #ffffff !important; display: inline-block; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 20px; font-weight: 600; line-height: 48px; margin: 0 !important; padding: 0; text-decoration: none;">Open</a>                                                </td>
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
                                      <a class="header__link" href="http://app.heavensentnow.com" target="_blank" style="Margin: 0; color: #cccccc; font-family: 'Gotham',Helvetica,Arial,sans-serif; font-size: 13px; font-weight: 300; line-height: 1.3; margin: 0 !important; padding: 0; text-decoration: none;">&copy;&nbsp;2020&nbsp;Heaven Sent&nbsp;</a>                                    </td>
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
    }).then(function(res) {
        console.log("then");
        console.log(res);
    }).catch(function(err) {
        console.log(`Error en el promise :c del ${memory.owners[0].email}`);
        console.log(err);
        return false;
    });
    return true;
}