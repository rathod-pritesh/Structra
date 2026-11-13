import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function DemoNotice({
  title = 'Frontend Simulation',
  message,
  accentColor = COLORS.secondary,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={[styles.indicator, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        {title && <Text style={[styles.title, { color: accentColor }]}>{title}</Text>}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F7F5EE',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 12,
    marginVertical: 10,
    overflow: 'hidden',
  },
  indicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});
