import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { STRUCTRA_LOGO_URI } from '../constants/structraLogo';
import { LogOutIcon } from '../components/Icons';

export default function ProfileScreen({ user = {}, onLogOut }) {
  const {
    name = 'Aarav Patel',
    role = 'Chief Project Director',
    company = 'Structra Infra Gujarat Ltd',
    email = 'aarav.patel@structra.in',
    licenseNo = 'GJ-AMD-884920',
    initials = 'AP',
  } = user;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.screenTitle}>Supervisor Profile</Text>
        <Text style={styles.screenSubtitle}>Site Credentials & Personnel</Text>
      </View>

      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        <Text style={styles.userName}>{name}</Text>
        <Text style={styles.userRole}>{role}</Text>
        <Text style={styles.userCompany}>{company}</Text>

        <View style={styles.badgeRow}>
          <View style={styles.licenseBadge}>
            <Text style={styles.licenseLabel}>License: </Text>
            <Text style={styles.licenseValue}>{licenseNo}</Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified Supervisor ✓</Text>
          </View>
        </View>
      </View>

      {/* Details Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Personnel Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Email Address</Text>
          <Text style={styles.detailValue}>{email}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Division</Text>
          <Text style={styles.detailValue}>Structural Engineering</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Safety Clearance</Text>
          <Text style={[styles.detailValue, { color: COLORS.success }]}>
            Level 4 (Site Director)
          </Text>
        </View>
      </View>

      {/* Structra Organization Card */}
      <View style={styles.brandCard}>
        <View style={styles.brandLogoBox}>
          <Image
            source={{ uri: STRUCTRA_LOGO_URI }}
            style={styles.brandLogoImg}
            resizeMode="contain"
          />
        </View>
        <View style={styles.brandInfoCol}>
          <Text style={styles.brandTitleText}>STRUCTRA</Text>
          <Text style={styles.brandMottoText}>BUILD • MANAGE • GROW</Text>
          <Text style={styles.brandSystemStatus}>Enterprise Operations Cloud</Text>
        </View>
      </View>

      {/* App & System Info */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Application Information</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Version</Text>
          <Text style={styles.detailValue}>Structra v1.0.0 (Expo Mobile)</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Environment</Text>
          <Text style={styles.detailValue}>Local Frontend Demo</Text>
        </View>
      </View>

      {/* Log Out Button */}
      <TouchableOpacity
        onPress={onLogOut}
        style={styles.logOutButton}
        accessibilityRole="button"
        accessibilityLabel="Log out of Structra"
        activeOpacity={0.8}
      >
        <LogOutIcon color={COLORS.error} size={18} />
        <Text style={styles.logOutText}>Sign Out of Structra</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#ECEAE3',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.background,
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  licenseBadge: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBackground,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  licenseLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  licenseValue: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(52, 118, 83, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.success,
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: COLORS.inputBorder,
    padding: 14,
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  brandLogoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 3,
    marginRight: 12,
  },
  brandLogoImg: {
    width: '100%',
    height: '100%',
  },
  brandInfoCol: {
    flex: 1,
  },
  brandTitleText: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
  },
  brandMottoText: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  brandSystemStatus: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    padding: 16,
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0EFE9',
    marginVertical: 10,
  },
  logOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(182, 66, 53, 0.08)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(182, 66, 53, 0.2)',
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  logOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.error,
  },
});
