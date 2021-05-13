import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { TaskType } from "../models/Task";
import { updateTodo } from "../store/actions/dataActions";
import { useAppSelector } from "../store/store";

interface IProps {
  modal: boolean;
  toggle: () => void;
  task: TaskType;
}

const EditTaskPopup: React.FC<IProps> = ({ modal, toggle, task }) => {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "taskName") {
      setTaskName(value);
    } else {
      setDescription(value);
    }
  };

  useEffect(() => {
    setTaskName(task.title);
    setDescription(task.description);
  }, [task.title, task.description]);

  const handleUpdate = (e: any) => {
    e.preventDefault();
    dispatch(
      updateTodo(user, task.id!, { title: taskName, description: description })
    );
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Update Task</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            className="form-control"
            value={taskName}
            onChange={handleChange}
            name="taskName"
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={5}
            className="form-control"
            value={description}
            onChange={handleChange}
            name="description"
          ></textarea>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleUpdate}>
          Update
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditTaskPopup;
