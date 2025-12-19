class Facts {
  constructor(Id, Title, Content, Font, Category, CreatedBy, UserName, Ia_response, Ia_verdict) {
    this.Id = Id;
    this.Title = Title;
    this.Content = Content;
    this.Font = Font;
    this.CreatedBy = CreatedBy;
    this.UserName = UserName;
    this.Category = Category;
    this.ia_response = Ia_response;
    this.ia_verdict = Ia_verdict;
  }
}

module.exports = Facts;