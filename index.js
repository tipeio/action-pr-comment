const core = require('@actions/core')
const github = require('@actions/github')
const { App } = require('@slack/bolt')

const run = async () => {
  try {
    
    const octokit = github.getOctokit(core.getInput('githubToken'))
    const userMap = JSON.parse(core.getInput('userMap'))
    const slackToken = core.getInput('slackToken')
    const comment = github.context.payload

    const app = new App({
      token: slackToken,
      signingSecret: core.getInput('slackSigningSecret')
    })
    
    if (github.context.payload.comment) {
      console.log(JSON.stringify(pull_request, null, 2))
      const { data: pr } = await octokit.pulls.get({
        owner: comment.organization.login,
        repo: comment.pull_request.base.repo.name,
        pull_number: comment.pull_request.number
      })

      const commentorGhUsername = comment.user.login
      const commentorSlackUsername = userMap[commentorGhUsername]

      const authorGhUsername = pr.user.login
      const authorSlackUsername = userMap[authorGhUsername]

      console.log('commentor ', commentorGhUsername, commentorSlackUsername)

      console.log('author ', authorGhUsername, authorSlackUsername)

      const {channels} = await app.client.conversations.list({
        token: slackToken
      })
  
      const result = await app.client.chat.postMessage({
        token: slackToken,
        channel: 'U77DZRXEU',
        as_user: true,
        text: comment.comment.body
      })

    }
    
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
