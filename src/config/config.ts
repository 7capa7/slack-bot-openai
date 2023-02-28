import dotenv from 'dotenv'
dotenv.config();

export const slackBotToken: string | undefined = process.env.SLACK_APP_BOT_TOKEN;

export const slackAppToken: string | undefined = process.env.SLACK_APP_TOKEN;

export const slackSigningSecret: string | undefined = process.env.SLACK_APP_SIGNING_SECRET;

export const openaiToken: string | undefined = process.env.OPENAI_TOKEN;