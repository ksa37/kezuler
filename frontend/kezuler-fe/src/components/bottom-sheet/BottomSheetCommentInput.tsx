import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ArrowUpward } from '@mui/icons-material';
import { TextareaAutosize } from '@mui/material';

import KezulerStorageInstance from 'src/constants/api-storage';
import useIOSScroll from 'src/hooks/useIOSScroll';
import { RootState } from 'src/reducers';
import { createCommentActions } from 'src/reducers/CreateComment';
import { AppDispatch } from 'src/store';

import 'src/styles/Storage.scss';

function BottomSheetCommentInput({ currentUserId, setData }: any) {
  useIOSScroll();
  const inputRef = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { eventId } = useParams();
  const { setCommentContent, destroy } = createCommentActions;
  const { commentConent } = useSelector(
    (state: RootState) => state.createComment
  );

  const handleCommentPost = () => {
    KezulerStorageInstance.post(`/comment`, {
      eventId,
      userId: currentUserId,
      content: commentConent,
    }).then(() => {
      KezulerStorageInstance.get(`/storage/${eventId}`).then((res) => {
        setData(res.data);
      });
    });
    inputRef.current.focus();
    dispatch(destroy());
  };

  return (
    <div className="bottom-sheet-comment-input">
      <TextareaAutosize
        ref={inputRef}
        maxRows={2}
        className="bottom-sheet-comment-input-text"
        value={commentConent}
        onChange={(e) => dispatch(setCommentContent(e.target.value))}
      />
      <div
        className="bottom-sheet-comment-input-button"
        onClick={handleCommentPost}
      >
        <ArrowUpward />
      </div>
    </div>
  );
}

export default BottomSheetCommentInput;
