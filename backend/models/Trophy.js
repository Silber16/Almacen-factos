class Trophy {
  constructor({ id, title, name, points, iconUrl }) {
    this.id = id;
    this.title = title;
    this.name = name || title;
    this.iconUrl = iconUrl;
    this.points = points;
  }
}

export default Trophy;