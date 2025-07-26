
import { StyleSheet } from 'react-native';

const colors = {
  primary: '#44C2B7',
  secondary: '#888',
  background: '#fff',
};

const fonts = {
  regular: 'Arial',
  bold: 'Arial-Bold',
};

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.secondary,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  screenHeader: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 20,
  },
});

export { globalStyles, colors, fonts };
