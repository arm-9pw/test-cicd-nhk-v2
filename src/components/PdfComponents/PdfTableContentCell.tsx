// import { StyleSheet, Text, View } from '@react-pdf/renderer'

// import { clrBlack200 } from 'styles/theme'

// const styles = StyleSheet.create({
//   tableCell: {
//     borderLeft: `1 solid ${clrBlack200}`,
//     borderRight: `1 solid ${clrBlack200}`,
//     fontSize: 7,
//     fontWeight: 800,
//     padding: '3px 3px',
//     marginLeft: -1,
//     textAlign: 'center',
//   },
//   textCell: {
//     margin: 'auto 0',
//     textOverflow: 'ellipsis',
//     maxLines: 2,
//   },
// })

// type PdfTableContentCellProps = {
//   value: string
//   isLastItem: boolean
//   width?: string
//   textAlign?: 'center' | 'left' | 'right'
//   customStyles?: object
// }

// const PdfTableContentCell = ({
//   value,
//   isLastItem,
//   width = '50px',
//   textAlign = 'center',
//   customStyles,
// }: PdfTableContentCellProps) => {
//   return (
//     <View
//       style={[
//         styles.tableCell,
//         {
//           width,
//           textAlign,
//           borderBottom: isLastItem ? `1 solid ${clrBlack200}` : 'none',
//           ...customStyles,
//         },
//       ]}
//     >
//       <Text style={[styles.textCell]}>{value}</Text>
//     </View>
//   )
// }

// export default PdfTableContentCell
