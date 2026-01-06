import { useNavigate } from 'react-router-dom'

import {
  useApprovePOMutation,
  useDeletePOMutation,
  useRejectPOMutation,
  useRevisePOMutation,
  // useSubmitPOMutation,
} from 'api/poApi'
// import { UpdatePoDTOType } from 'api/poApi.types'
import { useAppDispatch } from 'app/hook'
import { hideLoading, showLoading } from 'app/slices/loadingSlice'
import { useNotification } from 'hooks/useNotification'

const usePOFlowOperations = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { openNotification } = useNotification()
  const [deletePO] = useDeletePOMutation()
  const [rejectPO] = useRejectPOMutation()
  // const [submitPO] = useSubmitPOMutation()
  const [approvePO] = useApprovePOMutation()
  const [revisePO] = useRevisePOMutation()

  const handleDeletePO = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PO. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await deletePO(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Delete Successful',
        description: 'The purchase order has been deleted successfully.',
      })
      dispatch(hideLoading())
      navigate('/purchase-order/')
    } catch (error) {
      console.error('Failed to delete PR:', error)
      openNotification({
        type: 'error',
        title: 'Failed to delete purchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  // const handleSubmitPO = async ({
  //   id,
  //   poData,
  // }: {
  //   id?: string | null
  //   poData: UpdatePoDTOType | null
  // }) => {
  //   if (!id) {
  //     openNotification({
  //       type: 'error',
  //       title: 'Error',
  //       description: 'Invalid PO. ID.',
  //     })
  //     return
  //   }

  //   try {
  //     dispatch(showLoading())
  //     await submitPO({ id, poData: poData ?? null }).unwrap()
  //     openNotification({
  //       type: 'success',
  //       title: 'Submit Successful',
  //       description: 'The purchase order has been submitted successfully.',
  //     })
  //   } catch (error) {
  //     console.error('Failed to submit PO:', error)
  //     openNotification({
  //       type: 'error',
  //       title: 'Failed to submit purchase order',
  //       description: 'Please try again later.',
  //     })
  //   } finally {
  //     dispatch(hideLoading())
  //   }
  // }

  const handleRejectPO = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PO. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await rejectPO(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Reject Successful',
        description: 'The purchase order has been rejected successfully.',
      })
    } catch (error) {
      console.error('Failed to reject PO:', error)
      openNotification({
        type: 'error',
        title: 'Failed to reject purchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleApprovePO = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PO. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await approvePO(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Approve Successful',
        description: 'The purchase order has been approved successfully.',
      })
    } catch (error) {
      console.error('Failed to approve PO:', error)
      openNotification({
        type: 'error',
        title: 'Failed to approve purchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  const handleRevisePO = async (id?: string | null) => {
    if (!id) {
      openNotification({
        type: 'error',
        title: 'Error',
        description: 'Invalid PO. ID.',
      })
      return
    }

    try {
      dispatch(showLoading())
      await revisePO(id).unwrap()
      openNotification({
        type: 'success',
        title: 'Revise Successful',
        description: 'The purchase order has been revised successfully.',
      })
    } catch (error) {
      console.error('Failed to revise PO:', error)
      openNotification({
        type: 'error',
        title: 'Failed to revise purchase order',
        description: 'Please try again later.',
      })
    } finally {
      dispatch(hideLoading())
    }
  }

  return {
    handleDeletePO,
    // handleSubmitPO,
    handleRejectPO,
    handleApprovePO,
    handleRevisePO,
  }
}

export default usePOFlowOperations
