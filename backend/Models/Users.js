class User {
  constructor(id, name, username, bio, profile_picture, created_at, score) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.bio = bio;
    this.profile_picture = profile_picture;
    this.created_at = created_at;
    this.score = score;
  }
}

module.exports = User;