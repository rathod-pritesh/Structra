import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../constants/colors';
import { STRUCTRA_LOGO_URI } from '../constants/structraLogo';

export default function BrandHeader({ heading, description, showLogoOnly = false }) {
  if (showLogoOnly) {
    return (
      <View style={styles.logoOnlyContainer}>
        <View style={styles.largeLogoBox}>
          <Image
            source={{ uri: STRUCTRA_LOGO_URI }}
            style={styles.largeLogoImage}
            resizeMode="contain"
            accessibilityLabel="Structra brand logo"
          />
        </View>
        <Text style={styles.brandNameLarge}>STRUCTRA</Text>
        <Text style={styles.taglineSmall}>BUILD • MANAGE • GROW</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Brand Mark with consistent logo icon */}
      <View style={styles.brandRow}>
        <View style={styles.logoMark} accessibilityRole="image" accessibilityLabel="Structra logo">
          <Image
            source={{ uri: STRUCTRA_LOGO_URI }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.brandTextCol}>
          <Text style={styles.brandName}>STRUCTRA</Text>
          <Text style={styles.brandTag}>BUILD • MANAGE • GROW</Text>
        </View>
      </View>

      {heading && (
        <View style={styles.textContainer}>
          <Text style={styles.heading}>{heading}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    alignItems: 'flex-start',
    width: '100%',
  },
  logoOnlyContainer: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  largeLogoBox: {
    width: 86,
    height: 86,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 10,
  },
  largeLogoImage: {
    width: '100%',
    height: '100%',
  },
  brandNameLarge: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.primary,
    marginBottom: 2,
  },
  taglineSmall: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.8,
    color: COLORS.secondary,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoMark: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: COLORS.card,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTextCol: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    color: COLORS.primary,
    lineHeight: 22,
  },
  brandTag: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: COLORS.secondary,
  },
  textContainer: {
    width: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 8,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});
