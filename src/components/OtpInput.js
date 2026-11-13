import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';

export default function OtpInput({
  code = '',
  onChangeCode,
  length = 6,
  hasError = false,
  isSuccess = false,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const digits = code.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const activeIndex = Math.min(code.length, length - 1);

  const handleBoxPress = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleChange = (text) => {
    // Only accept numeric input up to length
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChangeCode(cleaned);
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleBoxPress}
        style={styles.boxesRow}
        accessibilityRole="button"
        accessibilityLabel="Six digit verification code input"
      >
        {digits.map((digit, index) => {
          const isCurrentFocus = isFocused && index === activeIndex;
          const isFilled = digit !== '';

          return (
            <View
              key={index}
              style={[
                styles.box,
                isFilled && styles.boxFilled,
                isCurrentFocus && styles.boxActive,
                hasError && styles.boxError,
                isSuccess && styles.boxSuccess,
              ]}
            >
              <Text
                style={[
                  styles.digitText,
                  hasError && styles.digitTextError,
                  isSuccess && styles.digitTextSuccess,
                ]}
              >
                {digit}
              </Text>
            </View>
          );
        })}
      </Pressable>

      {/* Hidden real input capturing all keyboard and clipboard events */}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={false}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.hiddenInput}
        caretHidden
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 14,
    alignItems: 'center',
    width: '100%',
  },
  boxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    gap: 8,
  },
  box: {
    flex: 1,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxFilled: {
    borderColor: '#B9B7AB',
    backgroundColor: COLORS.card,
  },
  boxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  boxError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorLight,
  },
  boxSuccess: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.successLight,
  },
  digitText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  digitTextError: {
    color: COLORS.error,
  },
  digitTextSuccess: {
    color: COLORS.success,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
    top: 0,
    left: 0,
  },
});
