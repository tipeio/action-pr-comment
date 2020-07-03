const core = require('@actions/core')
const github = require('@actions/github')

const run = async () => {
  try {
    const userMap = JSON.parse(core.getInput('userMap'))
    const commentPayload = github.context.payload.pull_request_review_comment
    const slackToken = core.getInput('slackToken')

    const app = new App({
      token: slackToken,
      signingSecret: core.getInput('slackSigningSecret')
    })

    const result = await app.client.chat.postMessage({
      token: slackToken,
      channel: 'D781H60V9',
      text: commentPayload.body
    })
    
  } catch (e) {
    core.setFailed(error.message)
  }
}

run()
