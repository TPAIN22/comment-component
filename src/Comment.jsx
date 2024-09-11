import { useRef, useState } from "react";
import Data from "./data.json";
export default function Comment() {
  const [Comments, setComments] = useState(Data.comments);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [theid, setTheid] = useState("");
  const [repid, setRepid] = useState("");

  // use ref func to tagle the dialog

  const dialogRef = useRef(null);

  const openDialog = (id, rid) => {
    if (dialogRef.current) {
      dialogRef.current.showModal(); // Opens the dialog as a modal
      if (id) {
        setTheid(id);
      }
      if (rid) setRepid(rid);
    }
    console.log(rid);
    console.log(theid);
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close(); // Closes the dialog
    }
  };

  // Function to handle editing a comment
  const handleEditComment = (commentId) => {
    const commentToEdit = Comments.find((comment) => comment.id === commentId);
    setEditingCommentId(commentId); // Enable edit mode for this comment
    setEditContent(commentToEdit.content); // Set current content in input
  };

  // Function to handle saving the edited comment
  const saveEditedComment = (commentId) => {
    setComments(
      Comments.map((comment) =>
        comment.id === commentId
          ? { ...comment, content: editContent }
          : comment
      )
    );
    setEditingCommentId(null); // Exit edit mode
    setEditContent(""); // Clear input field
  };

  // Function to handle editing a reply
  const handleEditReply = (commentId, replyId) => {
    const comment = Comments.find((comment) => comment.id === commentId);
    const replyToEdit = comment.replies.find((reply) => reply.id === replyId);
    setEditingReplyId(replyId); // Enable edit mode for this reply
    setEditContent(replyToEdit.content); // Set current content in input
  };

  // Function to save the edited reply
  const saveEditedReply = (commentId, replyId) => {
    setComments(
      Comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: comment.replies.map((reply) =>
                reply.id === replyId
                  ? { ...reply, content: editContent }
                  : reply
              ),
            }
          : comment
      )
    );
    setEditingReplyId(null); // Exit edit mode
    setEditContent(""); // Clear input field
  };

  const handdleComment = () => {
    if (newComment.trim("")) {
      const newCommentObj = {
        id: Comments.length + 1,
        content: newComment,
        createdAt: "just Now",
        score: 0,
        voted:false,
        user: Data.currentUser,
        replies: [],
      };
      setComments([...Comments, newCommentObj]);
      setNewComment("");
    }
  };

  const handleReply = (commentId) => {
    if (newReply.trim()) {
      const newReplyB = {
        id: `${commentId}-${Date.now()}`,
        content: newReply,
        createdAt: "just now",
        score: 0,
        voted:false,
        replyingTo: Comments.find((c) => c.id === commentId).user.username,
        user: Data.currentUser,
      };
      setComments(
        Comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReplyB] }
            : comment
        )
      );
      setNewReply("");
      setReplyTo(null);
    }
  };

  const handleDelete = () => {
    setComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment.id === theid) {
          return {
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== repid),
          };
        }
        return comment;
      })
    );
    closeDialog();
  };
  const deleteCommentById = () => {
    // تحديث حالة التعليقات مع تصفية التعليقات التي لا تطابق الـ id المطلوب حذفه
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== theid)
    );
    closeDialog();
  };

  const updateScore = (commentid) => {
    const updatedComments = Comments.map((comment) =>
      comment.id === commentid && !comment.voted // Check if comment hasn't been voted on
        ? { ...comment, score: comment.score + 1, voted: true } // Update score and set hasVoted to true
        : comment
    );
    
    // Assuming you want to store the updated comments in state or variable
    setComments(updatedComments); // Update the comments state
  };

  const minusScore = (commentid) => {
    const updatedComments = Comments.map((comment) =>
      comment.id === commentid && !comment.voted
        ? { ...comment, score: comment.score - 1, voted: true } 
        : comment
    );
    
   
    setComments(updatedComments); 
  };
  
  const updateReplyScore = (commentId, replyId) => {
    const updatedComments = Comments.map((comment) => {
      if (comment.id === commentId) {
        
        const updatedReplies = comment.replies.map((reply) =>
          reply.id === replyId && !reply.hasVoted
            ? { ...reply, score: reply.score + 1, hasVoted: true }
            : reply
        );
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
  
    
    setComments(updatedComments);
  };

  const minusupdateReplyScore = (commentId, replyId) => {
    const updatedComments = Comments.map((comment) => {
      if (comment.id === commentId) {
        
        const updatedReplies = comment.replies.map((reply) =>
          reply.id === replyId && !reply.hasVoted
            ? { ...reply, score: reply.score - 1 , hasVoted: true }
            : reply
        );
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
  
    
    setComments(updatedComments);
  };

  return (
    <>
      <dialog className="p-8 gap-4 rounded-md model" ref={dialogRef}>
        <div className="text-2xl font-bold text-[var(--Darkblue)] mb-3">
          Delete comment
        </div>
        <div className="max-w-72 text-[var(--Grayish-Blue)] mb-3">
          Are you sure you want to delete this comment, This will remove the
          comment and can't be undone
        </div>
        <div className="flex gap-4 w-full mt-4">
          <button
            className="bg-[var(--Darkblue)] text-sm text-[var(--Light-gray)] font-medium px-6 py-2 rounded-md w-full"
            onClick={closeDialog}
          >
            NO,CANCEL
          </button>
          <button
            className="bg-[var(--Soft-Red)] text-sm text-[var(--Light-gray)] font-medium px-6 py-2 rounded-md w-full"
            onClick={repid === "" ? deleteCommentById : handleDelete}
          >
            YES, DELETE
          </button>
        </div>
      </dialog>







      <div className="max flex flex-col my-12 gap-2 w-full items-center justify-center">
        {Comment &&
          Comments.map((comment) => {
            return (
              <>
                <div
                  className="flex gap-6 bg-white p-4 rounded-md w-full"
                  key={comment.id}
                >

                  {/* -----------------bottons------------------------------ */}

                  <div className="grid place-items-center bg-[var(--Very-light-gray)] rounded-md">
                    <button
                    onClick={ ()=> updateScore(comment.id)}
                     className="w-10 h-full grid place-items-center fill-[var(--Light-grayish-blue)] hover:fill-[var(--blue)] cursor-pointer ">
                      <svg
                        width="11"
                        height="11"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                          className="fill-inherit"
                        />
                      </svg>
                    </button>
                    <p className="text-[var(--blue)] font-bold text-center">
                      {comment.score}
                    </p>
                    <button
                    onClick={()=> minusScore(comment.id)}
                     className=" h-full grid place-items-center fill-[var(--Light-grayish-blue)] hover:fill-[var(--blue)] cursor-pointer">
                      <svg
                        width="11"
                        height="3"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                          className="fill-inherit"
                        />
                      </svg>
                    </button>
                  </div>


                  {/* ----------------------comment-content-and-headers------------------------- */}
                  
                  <div className="comment grid gap-2 w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="title flex items-center gap-4">
                        <img
                          src={comment.user.image.webp}
                          className="w-8 h-8"
                        />
                        <p className="font-semibold">{comment.user.username}</p>
                        <span className="bg-[var(--blue)] rounded-md px-2 text-center text-white text-xs font-bold">
                          {comment.user.username == Data.currentUser.username
                            ? "You"
                            : ""}
                        </span>
                        <p className="text-[var(--Grayish-Blue)]">
                          {comment.createdAt}
                        </p>
                      </div>
                      {comment.user.username === Data.currentUser.username ? (
                        <div className="flex gap-4 items-center">
                          <div
                            className="flex items-center gap-1 cursor-pointer hover:opacity-40"
                            onClick={() => openDialog(comment.id)}
                          >
                            <img
                              src="./src/assets/icon-delete.svg"
                              className="w-3 h-3"
                            />
                            <p>Delete</p>
                          </div>
                          <div
                            className="flex items-center gap-1 cursor-pointer hover:opacity-40"
                            onClick={() => handleEditComment(comment.id)}
                          >
                            <img
                              src="./src/assets/icon-edit.svg"
                              className="w-3 h-3"
                            />
                            <p>Edit</p>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="flex gap-1 items-center  text-[var(--blue)] font-bold fill-[var(--blue)] hover:fill-[var(--Light-grayish-blue)] cursor-pointer hover:text-[var(--Light-grayish-blue)]"
                          onClick={() => setReplyTo(comment.id)}
                        >
                          <svg
                            width="14"
                            height="13"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-inherit"
                          >
                            <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" />
                          </svg>
                          <span>Reply</span>
                        </div>
                      )}
                      
                        {/* -------------------------------Edit-controls--------------------------------- */}

                    </div>
                    <div className="text-[var(--Grayish-Blue)] font-semibold">
                      {editingCommentId === comment.id ? (
                        <div className="w-full flex items-end flex-col gap-2">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full border-2 border-[var(--Light-gray)] resize-none h-24 rounded-md px-3 py-1"
                          />
                          <button
                            onClick={() => saveEditedComment(comment.id)}
                            className="p-2 bg-[var(--blue)] text-white font-bold rounded-md text-sm hover:bg-[var(--Light-grayish-blue)]"
                          >
                            UPDATE
                          </button>
                        </div>
                      ) : (
                        <p>{comment.content}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ---------------------------replyies---------- starts -------here -------------------*/}

                <div className="flex gap-4 mad w-full">
                  <div className="w-1 bg-[var(--Light-gray)] ml-10"></div>
                  <div className="grid w-full gap-4">
                    {comment.replies &&
                      comment.replies.map((reply) => {
                        return (
                          <div
                            className="comment-containor flex gap-4 items-top ml-4 bg-white p-5 rounded-md"
                            key={reply.id}
                          >
                            <div className="flex flex-col items-center gap-4 w-11 p-3 bg-[var(--Very-light-gray)] rounded-md h-fit">
                              <button 
                              onClick={()=> updateReplyScore(comment.id , reply.id)}
                              className="w-6 h-full grid place-items-center fill-[var(--Light-grayish-blue)] hover:fill-[var(--blue)] cursor-pointer ">
                                <svg
                                  width="11"
                                  height="11"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z"
                                    className="fill-inherit"
                                  />
                                </svg>
                              </button>
                              <p className="text-[var(--blue)] font-bold text-center">
                                {reply.score}
                              </p>
                              <button

                              onClick={()=> minusupdateReplyScore(comment.id , reply.id)}
                               className=" w-6 h-full grid place-items-center fill-[var(--Light-grayish-blue)] hover:fill-[var(--blue)] cursor-pointer">
                                <svg
                                  width="11"
                                  height="3"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z"
                                    className="fill-inherit"
                                  />
                                </svg>
                              </button>
                            </div>
                            <div className="comment grid w-full">
                              <div className="flex justify-between ">
                                <div className="title flex items-center gap-4">
                                  <img
                                    src={reply.user.image.webp}
                                    className="w-8 h-8"
                                  />
                                  <p className="font-semibold">
                                    {reply.user.username}
                                  </p>
                                  <span className="bg-[var(--blue)] rounded-md px-2 text-center text-white text-xs font-bold">
                                    {reply.user.username ==
                                    Data.currentUser.username
                                      ? "You"
                                      : null}
                                  </span>
                                  <p className="text-[var(--Grayish-Blue)]">
                                    {reply.createdAt}
                                  </p>
                                </div>
                                {reply.user.username ===
                                Data.currentUser.username ? (
                                  <div className="flex gap-4 items-center">
                                    <div
                                      className="flex items-center gap-1 cursor-pointer hover:opacity-40"
                                      onClick={() =>
                                        openDialog(comment.id, reply.id)
                                      }
                                    >
                                      <img
                                        src="./src/assets/icon-delete.svg"
                                        className="w-3 h-3"
                                      />
                                      <p>Delete</p>
                                    </div>

                                    <div
                                      className="flex items-center gap-1 cursor-pointer hover:opacity-40"
                                      onClick={() =>
                                        handleEditReply(comment.id, reply.id)
                                      }
                                    >
                                      <img
                                        src="./src/assets/icon-edit.svg"
                                        className="w-3 h-3"
                                      />
                                      <p>Edit</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="flex gap-1 items-center text-[var(--blue)] font-bold fill-[var(--blue)] hover:fill-[var(--Light-grayish-blue)] 
                                    cursor-pointer hover:text-[var(--Light-grayish-blue)]"
                                    onClick={() => setReplyTo(comment.id)}
                                  >
                                    <svg
                                      width="14"
                                      height="13"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="fill-inherit"
                                    >
                                      <path d="M.227 4.316 5.04.16a.657.657 0 0 1 1.085.497v2.189c4.392.05 7.875.93 7.875 5.093 0 1.68-1.082 3.344-2.279 4.214-.373.272-.905-.07-.767-.51 1.24-3.964-.588-5.017-4.829-5.078v2.404c0 .566-.664.86-1.085.496L.227 5.31a.657.657 0 0 1 0-.993Z" />
                                    </svg>
                                    <span>Reply</span>
                                  </div>
                                )}
                              </div>
                              <p className=" p-2 text-[var(--Grayish-Blue)]">
                                {editingReplyId === reply.id ? (
                                  <div className="w-full flex items-end flex-col gap-2">
                                    <textarea
                                      value={editContent}
                                      onChange={(e) =>
                                        setEditContent(e.target.value)
                                      }
                                      className="w-full border-2 border-[var(--Light-gray)] resize-none h-24 rounded-md px-3 py-1"
                                    />
                                    <button
                                      className="p-2 bg-[var(--blue)] rounded-md text-white font-bold text-sm hover:bg-[var(--Light-grayish-blue)]"
                                      onClick={() =>
                                        saveEditedReply(comment.id, reply.id)
                                      }
                                    >
                                      UPDATE
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="text-[var(--blue)] font-bold">
                                      @{reply.replyingTo}{" "}
                                    </span>
                                    <p>{reply.content}</p>
                                  </div>
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                    {replyTo === comment.id && (
                      <div className="flex gap-2 bg-white rounded-md p-4 w-full">
                        <img
                          src={Data.currentUser.image.webp}
                          className="w-8 h-8"
                        />
                        <textarea
                          placeholder="Add reply..."
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="py-2 text-sm px-4 resize-none w-full h-24 cursor-pointer border rounded-md border-[Light-gray]"
                        ></textarea>
                        <button
                          onClick={() => handleReply(comment.id)}
                          className="py-2 px-5 font-medium bg-[var(--blue)] text-white h-fit rounded-lg text-sm hover:bg-[var(--Light-grayish-blue)]"
                        >
                          REPLY
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })}

        <div className="flex gap-2 bg-white rounded-md p-6 w-full">
          <img src={Data.currentUser.image.webp} className="w-8 h-8" />
          <textarea
            placeholder="Add comment..."
            name="content"
            className="py-2 text-sm px-4 resize-none h-20 border rounded-md border-[Light-gray] w-full"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="py-2 px-5 font-medium bg-[var(--blue)] text-white h-fit rounded-lg text-sm hover:bg-[var(--Light-grayish-blue)]"
            onClick={handdleComment}
          >
            SEND
          </button>
        </div>
      </div>
    </>
  );
}
