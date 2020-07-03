const core = require('@actions/core')
const github = require('@actions/github')
const { App } = require('@slack/bolt')

const run = async () => {
  try {
    const userMap = JSON.parse(core.getInput('userMap'))
    const slackToken = core.getInput('slackToken')

    const app = new App({
      token: slackToken,
      signingSecret: core.getInput('slackSigningSecret')
    })
    
    if (github.context.payload.comment) {

      const {channels} = await app.client.conversations.list({
        token: slackToken
      })

      console.log(JSON.stringify(channels, null, 2))
  
      const result = await app.client.chat.postMessage({
        token: slackToken,
        channel: 'D781H60V9',
        text: github.context.payload.comment.body
      })

    }
    
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
