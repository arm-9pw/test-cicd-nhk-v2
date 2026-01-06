import { useAppSelector } from 'app/hook'
import { selectCurrentProgramElementAccessList } from 'app/slices/currentProgramSlice'

/* NOTE: currentActionPerms: ActionPerms[]
  Type ActionPerms: {
    id: string
    elementId: string
    elementDescription: string
    accessControl: {
      isVisible: boolean
      isEnable: boolean
    }
  }
*/

const useCheckActionPerms = () => {
  const elementAccessList = useAppSelector(selectCurrentProgramElementAccessList)

  // NOTE: elementId:string | string[] (can be a string or an array of strings)
  const checkActionPermission = ({
    elementId,
    type,
  }: {
    elementId: string | string[]
    type: 'isVisible' | 'isEnable'
  }) => {
    const selectedElements = elementAccessList
      ?.filter((action) => {
        if (Array.isArray(elementId)) {
          return elementId.includes(action?.elementId)
        } else {
          return action?.elementId === elementId
        }
      })
      .map((selectedElement) => selectedElement?.accessControl)

    if (selectedElements.length > 0) {
      return selectedElements.every((element) => element[type])
    }

    // NOTE: if the element is not found in the permissions, it is *visible and enable* by default
    return true
  }

  const isVisible = ({ elementId }: { elementId: string | string[] }) =>
    checkActionPermission({ elementId, type: 'isVisible' })

  const isDisabled = ({ elementId }: { elementId: string | string[] }) =>
    !checkActionPermission({ elementId, type: 'isEnable' })

  return {
    isVisible,
    isDisabled,
  }
}

export default useCheckActionPerms
