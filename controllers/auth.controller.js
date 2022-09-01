import {
  getOAuthAccessTokenWith,
  getOAuthRequestToken,
  oauthGetUserById
} from '../oauth-utils.js'

export const twitter = (method = 'authorize') => async (req, res) => {
  try {
    const {
      oauthRequestToken,
      oauthRequestTokenSecret
    } = await getOAuthRequestToken()

    req.session = req.session || {}
    req.session.oauthRequestToken = oauthRequestToken
    req.session.oauthRequestTokenSecret = oauthRequestTokenSecret

    const authorizationUrl = `https://api.twitter.com/oauth/${method}?oauth_token=${oauthRequestToken}`
    res.redirect(authorizationUrl)
  } catch (error) {
    res.status(400).json({ message: `Could not ${method} user`, error })
  }
}
export const handleTwitterCallback = async (req, res) => {
  const { oauthRequestToken, oauthRequestTokenSecret } = req.session
  const { oauth_verifier: oauthVerifier } = req.query

  const {
    oauthAccessToken,
    oauthAccessTokenSecret,
    results
  } = await getOAuthAccessTokenWith({
    oauthRequestToken,
    oauthRequestTokenSecret,
    oauthVerifier
  })
  req.session.oauthAccessToken = oauthAccessToken

  const { user_id: userId /*, screen_name */ } = results
  const user = await oauthGetUserById(userId, {
    oauthAccessToken,
    oauthAccessTokenSecret
  })

  req.session.twitter_screen_name = user.screen_name
  res.cookie('twitter_screen_name', user.screen_name, {
    maxAge: 900000,
    httpOnly: true
  })
  req.session.save(() =>
    res.redirect(
      `https://app.amplifi.gg/#/campaigns/CRE8R?username=${user.screen_name}`
    )
  )
}
