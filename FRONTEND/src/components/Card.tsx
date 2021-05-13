import React, { useState } from "react";
import { Delete, Edit } from "@material-ui/icons";
import { useDispatch } from "react-redux";

import { TaskType } from "../models/Task";
import EditTask from "./EditTask";
import { deleteTodo } from "../store/actions/dataActions";
import { useAppSelector } from "../store/store";

interface IProps {
  task: TaskType;
  index: number;
}

const Card: React.FC<IProps> = ({ task, index }) => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const colors = [
    {
      primaryColor: "#5D93E1",
      secondaryColor: "#ECF3FC",
    },
    {
      primaryColor: "#F9D288",
      secondaryColor: "#FEFAF1",
    },
    {
      primaryColor: "#5DC250",
      secondaryColor: "#F2FAF1",
    },
    {
      primaryColor: "#F48687",
      secondaryColor: "#FDF1F1",
    },
    {
      primaryColor: "#B964F7",
      secondaryColor: "#F3F0FD",
    },
  ];

  const toggle = () => {
    setModal(!modal);
  };

  return (
    <div className="card-wrapper mr-5">
      <div
        className="card-top"
        style={{ backgroundColor: colors[index % 5].primaryColor }}
      ></div>
      <div className="task-holder">
        <span
          className="card-header"
          style={{
            backgroundColor: colors[index % 5].secondaryColor,
            borderRadius: "10px",
          }}
        >
          {task.title}
        </span>
        <p className="mt-3">{task.description}</p>

        <div style={{ position: "absolute", right: "20px", bottom: "20px" }}>
          <Edit
            className="mr-2"
            color="primary"
            fontSize="small"
            onClick={() => setModal(true)}
          />

          <Delete
            color="secondary"
            fontSize="small"
            onClick={() => dispatch(deleteTodo(user, task.id!))}
          />
        </div>
      </div>
      <EditTask modal={modal} toggle={toggle} task={task} />
    </div>
  );
};

export default Card;
