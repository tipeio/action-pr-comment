const core = require('@actions/core')
const github = require('@actions/github')
const { App } = require('@slack/bolt')

const run = async () => {
  try {
    const userMap = JSON.parse(core.getInput('userMap'))
    console.log(JSON.stringify(userMap, null, 2))
    const slackToken = core.getInput('slackToken')

    const app = new App({
      token: slackToken,
      signingSecret: core.getInput('slackSigningSecret')
    })

    const result = await app.client.chat.postMessage({
      token: slackToken,
      channel: 'D781H60V9',
      text: github.context.payload.comment.body
    })
    
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
