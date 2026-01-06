import { useNavigate } from 'react-router-dom'

import {
  useApprovePRMutation,
  useDeletePRMutation,
  // useReceivePRMutation,
  useRejectPRMutation,
  useRevisePRMutation,
  useSubmitPRMutation,
} from 'api/prApi'
import { PurchaseRequisitionRespType } from 'api/prApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import { useNotification } from 'hooks/useNotification'

const usePRFlowOperations = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { openNotification } = useNotification()

  const [deletePR] = useDeletePRMutation()
  const [triggerSubmitPR] = useSubmitPRMutation()
  const [triggerApprovePR] = useApprovePRMutation()
  const [triggerRevisePR] = useRevisePRMutation()
  const [triggerRejectPR] = useRejectPRMutation()
  // const [triggerReceivePR] = useReceivePRMutation()

  const handleDeletePR = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await deletePR(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Delete Successful',
        description: 'The purchase requisition has been deleted successfully.',
      })
      dispatch(hideLoading())
      navigate('/purchase-requisition/')
    } catch (error) {
      console.error('Failed to delete PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to delete purchase requisition',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleSubmitPR = async ({
    id,
    prData,
  }: {
    id?: string | null
    prData?: Partial<PurchaseRequisitionRespType> | null
  }) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await triggerSubmitPR({ id, prData: prData ?? null }).unwrap()
      openNotification({
        type: 'success',
        title: 'Submit Successful',
        description: 'The purchase requisition has been submitted successfully.',
      })
    } catch (error) {
      console.error('Failed to submit PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to submit purchase requisition',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleApprovePR = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await triggerApprovePR(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Approve Successful',
        description: 'The purchase requisition has been approved successfully.',
      })
    } catch (error) {
      console.error('Failed to approve PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to approve purchase requisition',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleRevisePR = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await triggerRevisePR(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Revise Successful',
        description: 'The purchase requisition has been revised successfully.',
      })
    } catch (error) {
      console.error('Failed to revise PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to revise purchase requisition',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleRejectPR = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PR. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await triggerRejectPR(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Reject Successful',
        description: 'The purchase requisition has been rejected successfully.',
      })
    } catch (error) {
      console.error('Failed to reject PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to reject purchase requisition',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  // const handleReceivePR = async (id?: string | null) => {
  //   if (!id) {
  //     openNotification({
  //       type: 'error',
  //       title: 'Error',
  //       description: 'Invalid PR. ID.',
  //     })
  //     return
  //   }

  //   try {
  //     dispatch(showLoading())
  //     await triggerReceivePR(id).unwrap()
  //     openNotification({
  //       type: 'success',
  //       title: 'Receive Successful',
  //       description: 'The purchase requisition has been received successfully.',
  //     })
  //   } catch (error) {
  //     console.error('Failed to receive PR:', error)
  //     openNotification({
  //       type: 'error',
  //       title: 'Failed to receive purchase requisition',
  //       description: 'Please try again later.',
  //     })
  //   } finally {
  //     dispatch(hideLoading())
  //   }
  // }

  return {
    handleDeletePR,
    handleSubmitPR,
    handleApprovePR,
    handleRevisePR,
    handleRejectPR,
    // handleReceivePR,
  }
}

export default usePRFlowOperations
