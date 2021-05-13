import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import Task from "../models/Task";
import { saveTodo } from "../store/actions/dataActions";
import { useAppSelector } from "../store/store";

interface IProps {
  modal: boolean;
  toggle: () => void;
}

const CreateTaskPopup: React.FC<IProps> = ({ modal, toggle }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();
  const { saveLoading } = useAppSelector((state) => state.todos);
  const { user } = useAppSelector((state) => state.auth);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "Title") {
      setTitle(value);
    } else {
      setDescription(value);
    }
  };

  const handleSave = (event: any) => {
    event.preventDefault();

    if (title !== "") {
      dispatch(
        saveTodo(
          new Task(title, description, user.id, Math.random.toString()),
          user
        )
      );
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Create Task</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Task Name</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange}
            name="Title"
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
        <Button color="primary" onClick={handleSave}>
          {saveLoading ? <Spinner size="sm" /> : "Create"}
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateTaskPopup;
