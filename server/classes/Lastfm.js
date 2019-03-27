const APIKEYS = require('../config/api')
const md5 = require('md5')
const axios = require('axios')

class Lastfm {
  constructor(usersession = null) {
    this.usersession = usersession
    // Get API keys
    this.API_KEY = APIKEYS.API_KEY
    this.SECRET = APIKEYS.SECRET
    this.API_SIGNATURE = null
    this.LASTFMROUTE = 'http://ws.audioscrobbler.com/2.0'
  }

  // Auth handle
  async setUser(token) {
    return new Promise(async (resolve, reject) => {
      this.API_SIGNATURE = md5(
        `api_key${this.API_KEY}methodauth.getSessiontoken${token}${this.SECRET}`
      )
      try {
        const user = await axios.get(
          `${this.LASTFMROUTE}?token=${token}&api_key=${this.API_KEY}&api_sig=${
            this.API_SIGNATURE
          }&method=auth.getSession`
        )
        if (!user.data || !user) {
          resolve({ error: 'Error with Lasftm API', moreinfo: user })
        }
        // Maybe parse info though
        resolve(user.data)
      } catch (err) {
        reject(err)
      }
    })
  }

  async getUsersArtist(username) {
    return new Promise(async (resolve, reject) => {
      try {
        const albums = await axios.get(
          `${this.LASTFMROUTE}/?method=library.getartists&api_key=${
            this.API_KEY
          }&user=${username}&format=json`
        )
        if (!albums) {
          resolve({ error: 'Error.', moreinfo: albums })
        }
        resolve(albums.data)
      } catch (err) {
        reject(`ERROR WITH LAST'S FM API: ${err.response}`)
      }
    })
  }

  /**
   * @param params : Object: {
   *                 limit (Optional) : The number of results to fetch per page. Defaults to 30.
   *                 page (Optional) : The page number to fetch. Defaults to first page.
   *                 album (Required) : The album name
   *                 --> Lastfm Class already provides it => api_key (Required) : A Last.fm API key.
   *                 }
   **/

  async getAlbums(params) {
    return new Promise(async (resolve, reject) => {
      try {
        params.api_key = this.API_KEY
        const albums = await axios.get(
          `${this.LASTFMROUTE}/2.0/?method=album.search&format=json`,
          { params: params }
        )
        if (!albums) {
          resolve({ error: 'Error.', moreinfo: albums })
        }
        resolve(albums.data)
      } catch (err) {
        reject(`ERROR WITH LAST'S FM API: ${err.response}`)
      }
    })
  }

  async getArtist(artist) {
    return new Promise(async (resolve, reject) => {
      try {
        const artist__ = await axios.get(
          `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artist}&api_key=${
            this.API_KEY
          }&format=json`
        )
        if (!artist__) {
          resolve({ error: 'Error.', moreinfo: artist__ })
        }
        resolve(artist__.data)
      } catch (err) {
        reject(`ERROR WITH LAST'S FM API: ${err.response}`)
      }
    })
  }

  /**
   * @param params : Object: {
   *                  artist (Required): The artist's name
   *                  albumname (Required) : The album name
   *                  --> Lastfm Class already provides it => api_key (Required) : A Last.fm API key.
   *                  username (Optional): The current logged username
   *                 }
   **/

  async getAlbum(albumData) {
    return new Promise(async (resolve, reject) => {
      let username
      try {
        if (albumData.username) {
          username = `&username=${albumData.username}`
        } else username = ''
        const album = await axios.get(
          `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${
            this.API_KEY
          }&artist=${albumData.artist}&album=${
            albumData.albumname
          }${username}&format=json`
        )

        if (!album) {
          resolve(null)
        }
        resolve(album.data)
      } catch (err) {
        console.log(err)
        resolve(null)
      }
    })
  }
}

module.exports = Lastfm
