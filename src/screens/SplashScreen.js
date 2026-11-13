import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { STRUCTRA_LOGO_URI } from '../constants/structraLogo';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0.75)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(18)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation sequence
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0.35,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(ringScale, {
        toValue: 1.15,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Delayed typography reveal
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Linear progress indicator
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2200,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleExit();
      }
    });
  }, []);

  const handleExit = () => {
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      onFinish();
    });
  };

  const progressInterpolate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeOutAnim }]}>
      {/* Background architectural grid pattern decoration */}
      <View style={styles.backgroundDecor} pointerEvents="none">
        <View style={styles.gridLineHorizontal1} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineVertical1} />
        <View style={styles.gridLineVertical2} />
      </View>

      {/* Top bar with quick Skip option */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={handleExit}
          style={styles.skipButton}
          accessibilityRole="button"
          accessibilityLabel="Skip intro animation"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Center Animated Logo & Branding */}
      <View style={styles.centerContainer}>
        {/* Animated Accent Ring */}
        <Animated.View
          style={[
            styles.animatedRing,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* Logo Card with elevation */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={{ uri: STRUCTRA_LOGO_URI }}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Structra brand logo"
          />
        </Animated.View>

        {/* Animated Brand Typography */}
        <Animated.View
          style={[
            styles.textGroup,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          <Text style={styles.brandTitle}>STRUCTRA</Text>
          <View style={styles.taglineRow}>
            <Text style={styles.taglineText}>BUILD</Text>
            <View style={styles.taglineDot} />
            <Text style={styles.taglineText}>MANAGE</Text>
            <View style={styles.taglineDot} />
            <Text style={styles.taglineText}>GROW</Text>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Loading Progress Bar */}
      <View style={styles.bottomContainer}>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[
              styles.progressFill,
              { width: progressInterpolate },
            ]}
          />
        </View>
        <Text style={styles.loadingCaption}>INITIALIZING WORKSPACE...</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  gridLineHorizontal1: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  gridLineHorizontal2: {
    position: 'absolute',
    bottom: '24%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: COLORS.divider,
  },
  gridLineVertical1: {
    position: 'absolute',
    left: '20%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.divider,
  },
  gridLineVertical2: {
    position: 'absolute',
    right: '20%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: COLORS.divider,
  },
  topBar: {
    width: '100%',
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  skipButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.navyLight,
  },
  skipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: 0.4,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  animatedRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    top: -20,
  },
  logoContainer: {
    width: 170,
    height: 170,
    borderRadius: 36,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    overflow: 'hidden',
    padding: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  textGroup: {
    alignItems: 'center',
    marginTop: 26,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 6,
    marginBottom: 8,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taglineText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 2.5,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
  },
  bottomContainer: {
    width: '100%',
    maxWidth: 260,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 3,
    backgroundColor: COLORS.divider,
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
    borderRadius: 1.5,
  },
  loadingCaption: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: COLORS.textSecondary,
  },
});
