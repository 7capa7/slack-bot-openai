import { App } from '@slack/bolt'
import { askGpt } from './openai';
import {slackBotToken,slackAppToken,slackSigningSecret} from './config/config'

const app = new App({
    token: slackBotToken,
    socketMode:true,
    appToken: slackAppToken,
    signingSecret: slackSigningSecret
});
 
app.command("/gpt", async ({ command, ack, say }) => {
    await ack('searching for : ' + command.text);
    const isChannelAvailable =  await isAvailable(await getAllChannels(), command.channel_id);

    if(isChannelAvailable){
        const txt:string = command.text;
        const user:string = command.user_name;

        const response:string = await askGpt(txt);
        say(`<@${user}>! \n ${response}`);
        }
    else 
        console.log('you forgot to add bot to this channel!')

});



//check if channel from request is available for bot
const isAvailable = async (channelsID: string[], requestChannelID: string):Promise<boolean>=>{

    let isAvailable = false;
    channelsID.forEach(id=>{
        if(id===requestChannelID) isAvailable = true;
    })

    return isAvailable;
}


//make list of all avaliable channels to check if am i invited to channel when responding
const getAllChannels = async () => {

    let availableChannels: Array<string> = [];
    const tempChannels = (await app.client.conversations.list()).channels

    if(tempChannels!= undefined){
        tempChannels.forEach((channel)=>{
        if(channel.is_member === true && channel.id)
            availableChannels.push( channel.id );
        })
    }
        return availableChannels;


            /* 
    TODO

        working only for public channels -> check if we are members of these channels
        cannot search for private channels because I used free slack version that do not allow me to use some permissions
        to search for private channels I need permissions: conversations:read:private, conversations:read
        I will make it as soon as I will get access to the enterprise slack version


        solution after setting mentioned permissions to my bot:
            const response = await app.client.conversations.list({
            types: "private"
            });
    TODO
    */
};


// start app
(async () => {
    await app.start(999)
    console.log('slack app started')
})();