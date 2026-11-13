import React from 'react';
import {
  Pressable,
  Text,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { GOOGLE_LOGO_URI } from '../constants/googleLogo';

export default function GoogleSignInButton({ onPress, title = 'Continue with Google' }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: GOOGLE_LOGO_URI }}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Google logo"
        />
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonPressed: {
    backgroundColor: '#F7F6F1',
    borderColor: '#CFCDBF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
  },
});
