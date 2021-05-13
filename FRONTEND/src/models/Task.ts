export interface TaskType {
  id?: string;
  title: string;
  description: string;
  creatorId: string;
}

class Task {
  constructor(
    public title: string,
    public description: string,
    public creatorId: string,
    public id?: string
  ) {}
}

export default Task;
