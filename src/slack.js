const _response = ({question, user}) => (
{
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${question}`
      }
    },
    {
      type: 'context',
      elements: [{
        type: 'plain_text',
        emoji: true,
        text: `Poll by ???`
      }]
    },
    {
			type: 'divider'
		},
  ]
})

const _answer = (questionId, {answer, voters = [], id}) => (
  [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${answer} \`${voters.length}\``
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'Vote'
        },
        value: `${questionId}-${id}`
      }
    },
    {
      type: 'context',
      elements: _voters(voters)
    },
    {
      type: 'context',
      elements: _voterNames(voters)
    }
  ]
)

const _voters = (voters) => {
  if(voters.length > 0) {
    return voters.map(voter => {
      const image = {
        type: 'image',
        image_url: voter.pic,
        alt_text: voter.user,
      }
      return image
    }).concat([{
      type: 'plain_text',
      text: voters.length > 1 ? `${voters.length} votes` : 'one vote'
    }])
  } else {
    return [{
      type: 'plain_text',
      emoji: true,
      text: 'No voters yet.'
    }]
  }
}

const _voterNames = (voters) => {
  console.log(voters);
  if(voters.length > 0) {
    return voters.map(voter => {
      const image = {
        type: 'plain_text',
        text: voter.displayName
      }
      return image
    })
  } else {
    return [{
      type: 'plain_text',
      emoji: true,
      text: 'No voters yet.'
    }]
  }
}

const message = (question) => {
  const message = _response(question)
  question.answers.sort((a, b) => 
    a.voters && b.voters
    ? b.voters.length - a.voters.length
    : 0).forEach((a) => message.blocks = message.blocks.concat(_answer(question.id, a)))
  message.response_type = 'in_channel'
  return message
}

const privateFeedback = (message) => {
  return {
    'response_type': 'ephemeral',
    text: message
  }
}

module.exports = {
  message,
  privateFeedback
}
