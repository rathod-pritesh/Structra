import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants/colors';

export function HomeIcon({ color = COLORS.primary, size = 22 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s }]}>
      {/* Roof peak */}
      <View
        style={{
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid',
          borderLeftWidth: s * 0.44,
          borderRightWidth: s * 0.44,
          borderBottomWidth: s * 0.38,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      {/* House base */}
      <View
        style={{
          width: s * 0.62,
          height: s * 0.46,
          backgroundColor: color,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          marginTop: -1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        {/* Door cutout */}
        <View
          style={{
            width: s * 0.22,
            height: s * 0.24,
            backgroundColor: COLORS.card,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

export function ProjectsIcon({ color = COLORS.primary, size = 22 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Structural building blueprint / grid shape */}
      <View
        style={{
          width: s * 0.72,
          height: s * 0.82,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 4,
          padding: 2,
          justifyContent: 'space-around',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: s * 0.18 }}>
          <View style={{ width: '42%', height: '100%', backgroundColor: color, borderRadius: 1.5 }} />
          <View style={{ width: '42%', height: '100%', backgroundColor: color, borderRadius: 1.5 }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: s * 0.18 }}>
          <View style={{ width: '42%', height: '100%', backgroundColor: color, borderRadius: 1.5 }} />
          <View style={{ width: '42%', height: '100%', backgroundColor: color, borderRadius: 1.5 }} />
        </View>
      </View>
    </View>
  );
}

export function TasksIcon({ color = COLORS.primary, size = 22 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      <View
        style={{
          width: s * 0.76,
          height: s * 0.84,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 4,
          paddingHorizontal: 3,
          paddingVertical: 3,
          justifyContent: 'space-evenly',
        }}
      >
        {/* Task line 1 with check dot */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, marginRight: 3 }} />
          <View style={{ flex: 1, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
        {/* Task line 2 with check dot */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, marginRight: 3 }} />
          <View style={{ flex: 1, height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
        {/* Task line 3 with check dot */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: color, marginRight: 3 }} />
          <View style={{ width: '60%', height: 2, backgroundColor: color, borderRadius: 1 }} />
        </View>
      </View>
    </View>
  );
}

export function ProfileIcon({ color = COLORS.primary, size = 22 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Head */}
      <View
        style={{
          width: s * 0.38,
          height: s * 0.38,
          borderRadius: (s * 0.38) / 2,
          borderWidth: 2,
          borderColor: color,
          marginBottom: 1,
        }}
      />
      {/* Shoulders */}
      <View
        style={{
          width: s * 0.72,
          height: s * 0.36,
          borderTopLeftRadius: s * 0.36,
          borderTopRightRadius: s * 0.36,
          borderWidth: 2,
          borderBottomWidth: 0,
          borderColor: color,
        }}
      />
    </View>
  );
}

export function PlusIcon({ color = COLORS.background, size = 18 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      <View style={{ position: 'absolute', width: s * 0.8, height: 2.5, backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ position: 'absolute', height: s * 0.8, width: 2.5, backgroundColor: color, borderRadius: 1.5 }} />
    </View>
  );
}

export function ChecklistIcon({ color = COLORS.background, size = 18 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ fontSize: s * 0.9, color, fontWeight: '800', lineHeight: s }}>✓</Text>
    </View>
  );
}

export function ChevronRightIcon({ color = COLORS.textSecondary, size = 16 }) {
  return (
    <Text style={{ fontSize: size, color, fontWeight: '700' }}>›</Text>
  );
}

export function InventoryIcon({ color = COLORS.primary, size = 22 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Box container */}
      <View
        style={{
          width: s * 0.82,
          height: s * 0.76,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 4,
          padding: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Horizontal top box lid seam */}
        <View style={{ width: '100%', height: 1.5, backgroundColor: color, marginBottom: 2 }} />
        {/* Vertical center tape */}
        <View style={{ width: 2, height: s * 0.32, backgroundColor: color }} />
      </View>
    </View>
  );
}

export function AttendanceIcon({ color = COLORS.primary, size = 20 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      {/* Badge / ID shape with check */}
      <View
        style={{
          width: s * 0.8,
          height: s * 0.85,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: 3,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: s * 0.55, color, fontWeight: '800' }}>✓</Text>
      </View>
    </View>
  );
}

export function MinusIcon({ color = COLORS.background, size = 16 }) {
  const s = size;
  return (
    <View style={[styles.iconBox, { width: s, height: s, justifyContent: 'center', alignItems: 'center' }]}>
      <View style={{ width: s * 0.8, height: 2.5, backgroundColor: color, borderRadius: 1.5 }} />
    </View>
  );
}

export function BuildingIcon({ color = COLORS.primary, size = 24 }) {
  const s = size;
  return (
    <View style={{ width: s, height: s, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: s * 0.75,
          height: s * 0.85,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 3,
          padding: 2,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: 3, height: 3, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, backgroundColor: color }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ width: 3, height: 3, backgroundColor: color }} />
          <View style={{ width: 3, height: 3, backgroundColor: color }} />
        </View>
        <View style={{ alignSelf: 'center', width: 5, height: 5, backgroundColor: color, borderTopLeftRadius: 2, borderTopRightRadius: 2 }} />
      </View>
    </View>
  );
}

export function LogOutIcon({ color = COLORS.error, size = 20 }) {
  return (
    <Text style={{ fontSize: size, color, fontWeight: '700' }}>↳</Text>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
