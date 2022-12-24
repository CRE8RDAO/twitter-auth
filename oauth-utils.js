import { OAuth } from 'oauth'
import { promisify } from 'util'
import dotenv from 'dotenv'
dotenv.config()

const TWITTER_CONSUMER_API_KEY = process.env.TWITTER_CONSUMER_KEY
const TWITTER_CONSUMER_API_SECRET_KEY = process.env.TWITTER_CONSUMER_SECRET
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL
const oauthConsumer = new OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  TWITTER_CONSUMER_API_KEY,
  TWITTER_CONSUMER_API_SECRET_KEY,
  '1.0A',
  TWITTER_CALLBACK_URL,
  'HMAC-SHA1'
)

// export const oauthGetUserById = (
//   userId,
//   { oauthAccessToken, oauthAccessTokenSecret } = {}
// ) => {
//   return promisify(oauthConsumer.get.bind(oauthConsumer))(
//     `https://api.twitter.com/1.1/users/show.json?user_id=${userId}`,
//     oauthAccessToken,
//     oauthAccessTokenSecret
//   ).then((body) => JSON.parse(body));
// };

export const oauthGetUserById = (
  userId,
  { oauthAccessToken, oauthAccessTokenSecret } = {}
) => {
  return promisify(oauthConsumer.get.bind(oauthConsumer))(
    `https://api.twitter.com/1.1/users/show.json?user_id=${userId}`,
    oauthAccessToken,
    oauthAccessTokenSecret
  )
    .then(body => JSON.parse(body))
    .catch(e => console.error(e))
}

export const getOAuthAccessTokenWith = async ({
  oauthRequestToken,
  oauthRequestTokenSecret,
  oauthVerifier
} = {}) =>
  new Promise((resolve, reject) => {
    oauthConsumer.getOAuthAccessToken(
      oauthRequestToken,
      oauthRequestTokenSecret,
      oauthVerifier,
      (error, oauthAccessToken, oauthAccessTokenSecret, results) =>
        error
          ? reject(new Error('Error getting OAuth access token'))
          : resolve({ oauthAccessToken, oauthAccessTokenSecret, results })
    )
  })

export const getOAuthRequestToken = async () =>
  new Promise((resolve, reject) => {
    oauthConsumer.getOAuthRequestToken(
      (error, oauthRequestToken, oauthRequestTokenSecret, results) =>
        error
          ? reject(new Error('Error getting OAuth request token'))
          : resolve({ oauthRequestToken, oauthRequestTokenSecret, results })
    )
  })
