import React, { useState } from "react";
import withAuthLogged from "../utils/hoc/authLogged";
import { Input, Button } from "antd";
import axios from "axios";

import "./index.scss";
import { postDelete } from "../../firebase/my-firebase";

const { TextArea } = Input;

function Index(props) {
  const [commentText, setCommentText] = useState("");
  const { idPost, setShowAllComment } = props;

  const onChangeCommentHandler = e => {
    setCommentText(e.target.value);
  };

  const postCommentHandler = () => {
    if (!postDelete.hasOwnProperty(idPost)) {
      axios({
        method: "post",
        url: `http://localhost:8080/reviewbook/review/comment/${idPost}?token=${localStorage.getItem(
          "token"
        )}`,
        data: {
          body: commentText
        }
      }).then(() => {});
      setShowAllComment(true);
    }
    window.document.querySelector("#cmtText").value = "";
  };

  return (
    <div className="postComment">
      <TextArea
        id="cmtText"
        placeholder="Type comment here ..."
        autoSize
        style={{ border: "none" }}
        onPressEnter={e => postCommentHandler(e)}
        onChange={e => {
          onChangeCommentHandler(e);
        }}
      />
      <Button onClick={() => postCommentHandler()}>Đăng</Button>
    </div>
  );
}

export default withAuthLogged(Index);
