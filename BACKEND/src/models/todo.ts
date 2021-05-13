class Todo {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public userId: string,
    public createdDate: Date
  ) {}
}

export default Todo;
