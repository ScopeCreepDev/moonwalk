import styled from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import { Animated, Dimensions, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Icon from '../common/Icon';
import { TABBAR_HEIGHT } from '../constants';

const Wrapper = styled.View`
  height: ${TABBAR_HEIGHT}px;
  align-items: center;
  flex-direction: row;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: ${({ insetBottom }) => insetBottom}px;
`;

const IconWrapper = styled.View`
  height: 40px;
  align-items: center;
  justify-content: center;
`;

const TabIndicatorWrapper = styled(Animated.View)`
  align-items: center;
  position: absolute;
  bottom: 10px;
`;

const TabIndicator = styled.View`
  height: 4px;
  width: 50%;
  border-radius: 2px;
`;

const TabbarComponent = ({ props }) => {
  const insets = useSafeArea();
  const { colors } = useTheme();
  const [switchAnim] = useState(new Animated.Value(0))
  const { width } = Dimensions.get('window');

  const tabbarWidth = width - 32;

  const indicatorPosition = switchAnim.interpolate({
    inputRange: [0, props.state.routeNames.length - 1],
    outputRange: [0, tabbarWidth - tabbarWidth / 4],
  });

  useEffect(() => {
    Animated.spring(
      switchAnim,
      {
        toValue: props.state.index,
        duration: 250,
      }
    ).start();
  }, [props.state.index])

  return (
    <View style={{backgroundColor: colors.background}}>
    <Wrapper insetBottom={insets.bottom}>
      {props.state.routeNames.map(route => (
        <TouchableWithoutFeedback key={route} onPress={() => props.navigation.navigate(route)}>
          <IconWrapper style={{ width: tabbarWidth / 4 }} >
            <Icon color={colors.text} name={route} />
          </IconWrapper>
        </TouchableWithoutFeedback>
      ))}
      <TabIndicatorWrapper style={{ left: indicatorPosition, width: tabbarWidth / 4 }} insetBottom={insets.bottom}>
        <TabIndicator style={{ backgroundColor: colors.accent }} />
      </TabIndicatorWrapper>
    </Wrapper>
    </View>
  )
}

const Tabbar: React.FC = routeProps => <TabbarComponent props={routeProps} />;

export default Tabbar;