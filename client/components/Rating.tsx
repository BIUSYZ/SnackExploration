import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import { COLORS } from '../constants/Theme';
import { CustomStar, CustomSkull } from './CustomIcons';

interface RatingProps {
  value: number;
  onChange: (value: number) => void;
  type: 'red' | 'black';
  size?: number;
}

export default function Rating({ value, onChange, type, size = 32 }: RatingProps) {
  const containerRef = useRef<View>(null);
  const itemWidth = size + 8; // size + gap

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => handleTouch(evt.nativeEvent.locationX),
      onPanResponderMove: (evt) => handleTouch(evt.nativeEvent.locationX),
    })
  ).current;

  const handleTouch = (x: number) => {
    let newValue = Math.ceil(x / itemWidth);
    if (newValue < 1) newValue = 1;
    if (newValue > 5) newValue = 5;
    if (newValue !== value) {
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
          <View key={i} style={styles.item}>
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
