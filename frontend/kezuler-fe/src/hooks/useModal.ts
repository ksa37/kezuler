// import { useCallback } from 'react';
// import { useDispatch } from 'react-redux';
//
// import { modalAction } from 'src/reducers/modal';
// import { ModalProps, ModalType } from 'src/types/Modal';
//
// const useModal = () => {
//   const { show } = modalAction;
//   const dispatch = useDispatch();
//
//   const openModal = useCallback(
//     <T extends ModalType>(
//       targetType: ModalType,
//       targetProps: ModalProps<T>
//     ) => {
//       dispatch(show({ type: targetType, props: targetProps }));
//     },
//     [dispatch, show]
//   );
//
//   return { openModal };
// };
//
// export default useModal;

export {};
