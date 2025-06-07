import { StyleSheet, Text, View, ViewProps } from "react-native"

type TitleProps = ViewProps & {}

export const Title = ({
  style,
  ...restProps
}: TitleProps) => {
  return (
    <View style={[styles.container, style]} {...restProps}>
      <Text style={styles.text}>SUD</Text>
      <Text style={[styles.text, { marginTop: -48 }]}>OKU</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'column',
  },
  text: {
    fontSize: 120,
    fontWeight: 900,

    fontStyle: 'italic',
    width: '100%',
    textAlign: 'center'
  }
})
