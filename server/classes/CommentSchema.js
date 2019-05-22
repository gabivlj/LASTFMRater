/**
 * @description A comment schema.
 */
class CommentSchema {
  /**
   * @param {String} user, id
   * @param {String} username, user's name
   * @param {String} text, comment's text
   * @param {Array} likes, likes []
   * @param {Array} dislikes, dislikes []
   * @param {Array} date, the date of the comment
   */
  constructor(
    user,
    username,
    text,
    likes = [],
    dislikes = [],
    date = Date.now()
  ) {
    this.user = user;
    this.username = username;
    this.text = text;
    this.likes = likes;
    this.dislikes = dislikes;
    this.date = date;
  }
}

module.exports = CommentSchema;
