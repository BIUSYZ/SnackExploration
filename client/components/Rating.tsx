import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, PanResponder, Platform } from 'react-native';
import { COLORS } from '../constants/Theme';
import { CustomStar, CustomSkull } from './CustomIcons';
import * as Haptics from 'expo-haptics';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  type: 'red' | 'black';
  size?: number;
}

export default function Rating({ value, onChange, type, size = 32 }: RatingProps) {
  const containerRef = useRef<View>(null);
  const itemWidth = size + 8; // size + gap
  const lastEmittedValue = useRef(value);

  // Sync ref with prop value in case it changes from outside
  useEffect(() => {
    lastEmittedValue.current = value;
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 只有横向移动距离明显大于纵向移动时才接管手势，防止误触上下滚动
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 5;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt, gestureState) => {
        // 在移动时使用初始位置 + 偏移量，防止 locationX 在嵌套视图中跳变
        handleTouch(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleTouch = (x: number) => {
    // 增加一点容错，让判定更准确（比如滑动到一半就算作下一个星）
    let newValue = Math.ceil((x - itemWidth * 0.2) / itemWidth);
    if (newValue < 1) newValue = 1;
    if (newValue > 5) newValue = 5;
    
    if (newValue !== lastEmittedValue.current) {
      lastEmittedValue.current = newValue;
      if (Platform.OS === 'ios') {
        Haptics.selectionAsync();
      }
      onChange(newValue);
    }
  };

  return (
    <View 
      style={styles.container} 
      {...panResponder.panHandlers}
      ref={containerRef}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < value;
        return (
          <View key={i} style={styles.item} pointerEvents="none">
            {type === 'red' ? (
              <CustomStar 
                size={size} 
                color={active ? COLORS.star : COLORS.primaryLight} 
                active={active}
              />
            ) : (
              <CustomSkull 
                size={size} 
                color={active ? COLORS.skull : COLORS.primaryLight} 
                active={active}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  item: {
    marginHorizontal: 4,
  }
});
