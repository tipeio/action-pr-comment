const core = require('@actions/core')
const github = require('@actions/github')
const slackifyMarkdown = require('slackify-markdown')
const { App } = require('@slack/bolt')

const createBlocks = ({repo, prNumber, prUrl, commentUrl, slackCommentorId, githubCommentorUsername, comment}) => {
  const titles = ["*You're* not allowed to do that! 🚫", "Hello? *911*? There's some people here writing bad code. 🚔", "Your code just looked real suspicous. 🕵🏻‍♀️"]
  const title = titles[Math.floor(Math.random() * titles.length)]

  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": title
      }
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": `*Pull Request:*\n\nRepo: <https://github.com/${repo}|${repo}>\nPR: <${prUrl}|${prNumber}>\nComment: <${commentUrl}|URL>`
        },
        {
          "type": "mrkdwn",
          "text": `*Comment By:*\n\nSlack: <@${slackCommentorId}>\nGithub: <https://github.com/${githubCommentorUsername}|${githubAuthorUsername}>`
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": slackifyMarkdown(comment)
      }
    }
  ]
}

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
      const repo = comment.pull_request.base.repo.name
      const prUrl = comment._links.pull_request.href
      const commentUrl = comment._links.self.href
      const prNumber = prUrl.split('/').slice(-1)[0]
      const githubCommentorUsername = comment.comment.user.login

      const { data: pr } = await octokit.pulls.get({
        repo,
        owner: comment.organization.login,
        pull_number: comment.pull_request.number
      })


      const commentorSlackEmail = userMap[githubCommentorUsername]
      const authorGhUsername = pr.user.login
      const authorSlackEmail = userMap[authorGhUsername]

      const {user: slackAuthor} = await app.client.users.lookupByEmail({
        token: slackToken,
        email: authorSlackEmail
      })

      const {user: slackCommentor} = await app.client.users.lookupByEmail({
        token: slackToken,
        email: commentorSlackEmail
      })
  
      const result = await app.client.chat.postMessage({
        token: slackToken,
        channel: slackAuthor.id,
        as_user: true,
        blocks: createBlocks({
          prNumber,
          prUrl,
          repo,
          commentUrl,
          githubCommentorUsername,
          comment: comment.comment.body,
          slackCommentorId: slackCommentor.id
        })
      })

    }
    
  } catch (e) {
    core.setFailed(e.message)
  }
}

run()
