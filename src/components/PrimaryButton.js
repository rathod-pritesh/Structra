import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  style,
  textStyle,
  accessibilityLabel,
}) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={isDisabled ? null : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.baseButton,
        variant === 'primary' && styles.primaryButton,
        variant === 'primary' && pressed && !isDisabled && styles.primaryPressed,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'secondary' && pressed && !isDisabled && styles.secondaryPressed,
        variant === 'outline' && styles.outlineButton,
        variant === 'outline' && pressed && !isDisabled && styles.outlinePressed,
        variant === 'ghost' && styles.ghostButton,
        isDisabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={
              variant === 'outline' || variant === 'ghost'
                ? COLORS.primary
                : COLORS.background
            }
          />
          <Text
            style={[
              styles.baseText,
              variant === 'primary' && styles.primaryText,
              variant === 'secondary' && styles.primaryText,
              (variant === 'outline' || variant === 'ghost') && styles.outlineText,
              styles.loadingText,
            ]}
          >
            Please wait...
          </Text>
        </View>
      ) : (
        <Text
          style={[
            styles.baseText,
            variant === 'primary' && styles.primaryText,
            variant === 'secondary' && styles.primaryText,
            variant === 'outline' && styles.outlineText,
            variant === 'ghost' && styles.ghostText,
            isDisabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    minHeight: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryPressed: {
    backgroundColor: COLORS.primaryPressed,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
  },
  secondaryPressed: {
    backgroundColor: COLORS.secondaryPressed,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  outlinePressed: {
    backgroundColor: 'rgba(36, 92, 69, 0.06)',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  baseText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  primaryText: {
    color: COLORS.background,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  disabledText: {
    color: COLORS.disabledText,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 15,
  },
});
