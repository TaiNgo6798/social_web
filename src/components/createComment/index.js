import React, { useState } from "react";
import withAuthLogged from "../utils/hoc/authLogged";
import { Input, Button } from "antd";


import "./index.scss";


const { TextArea } = Input;

function Index(props) {
  const [commentText, setCommentText] = useState("");
  const { idPost, setShowAllComment } = props;

  const onChangeCommentHandler = e => {
    setCommentText(e.target.value);
  };

  const postCommentHandler = () => {

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
