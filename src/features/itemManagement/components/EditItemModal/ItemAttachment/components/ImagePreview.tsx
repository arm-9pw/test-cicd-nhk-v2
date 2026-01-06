import { Image } from 'antd'

type ImagePreviewProps = {
  previewImage: string
  previewOpen: boolean
  setPreviewOpen: (open: boolean) => void
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  previewImage,
  previewOpen,
  setPreviewOpen,
}) => {
  return (
    <Image
      src={previewImage}
      alt="preview"
      style={{ display: 'none' }} 
      preview={{
        visible: previewOpen, // ✅ แสดงรูปเต็มจอทันที ไม่ต้องมี Modal
        onVisibleChange: (visible) => setPreviewOpen(visible),
      }}
    />
  )
}

export default ImagePreview
