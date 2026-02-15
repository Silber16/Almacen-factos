class User {
  constructor({ id, name, username, bio, profilePicture, createdAt, score }) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.bio = bio;
    this.profilePicture = profilePicture;
    this.createdAt = createdAt; 
    this.score = score;
  }
}

export default User;