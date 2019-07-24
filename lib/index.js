import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableHighlight,
  Animated,
  Easing
} from "react-native";
import PropTypes from "prop-types";

const { width: viewportWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    zIndex: 0,
    left: "4%",
    right: "4%",
    bottom: "2%",
    width: viewportWidth - 30,
    padding: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.58,
    shadowRadius: 20,
    elevation: 24
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  icon: {
    width: 20,
    height: 20
  },
  count: {
    position: "absolute",
    borderRadius: 100,
    height: 22,
    width: 22,
    justifyContent: "center",
    alignItems: "center",
    top: -10,
    right: -15
  },
  countText: {
    fontSize: 10
  }
});

function hexToRGBA(h, o) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (h.length == 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];

    // 6 digits
  } else if (h.length == 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  return "rgba(" + +r + "," + +g + "," + +b + "," + +o + ")";
}

class TabBarItem extends Component {
  render() {
    const child = this.props.children;

    if (child.length && child.length > 0)
      throw new Error("onlyChild must be passed a children with exactly one child.");

    return <View style={{ flex: 1 }}>{child}</View>;
  }
}

export default class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0
    };
    this.textAnimatedValue = new Animated.Value(0);
    this.viewAnimatedValue = new Animated.Value(0);
  }

  animate = async (easing, index) => {
    this.textAnimatedValue.setValue(0);
    this.viewAnimatedValue.setValue(0);
    if (index === this.state.activeItem)
      Animated.sequence([
        Animated.timing(this.textAnimatedValue, {
          toValue: 1,
          duration: 100,
          easing
        }),
        Animated.timing(this.viewAnimatedValue, {
          toValue: 1,
          duration: 100,
          easing
        })
      ]).start();
    else return;
  };

  render() {
    const { children, backgroundColor, onChangeTab } = this.props;
    const { activeItem } = this.state;
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: children[activeItem].props.activeColor
          }
        ]}
      >
        {children[activeItem]}
        <View style={[styles.content, { backgroundColor }]}>
          {React.Children.map(children, (child, index) => {
            const isActive = activeItem === index;
            if (isActive) this.animate(Easing.ease, index);

            const activeItemStyle = {
              backgroundColor: this.viewAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ["white", hexToRGBA(child.props.activeColor, 0.4)]
              }),
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 20
            };

            const activeImageStyle = {
              tintColor: isActive ? child.props.activeColor : child.props.color || "grey"
            };

            const activeTextStyle = {
              ...child.props.titleStyle,
              color: child.props.activeColor,
              marginLeft: this.textAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 10]
              })
            };

            return (
              <TouchableHighlight
                underlayColor="transparent"
                key={index}
                onPress={async () => {
                  await this.setState({ activeItem: index });
                  this.animate(Easing.in, index);
                  if (typeof onChangeTab === "function") onChangeTab(child, index);
                }}
              >
                <Animated.View style={[styles.item, isActive && activeItemStyle]}>
                  <Animated.Image
                    style={[styles.icon, isActive && activeImageStyle]}
                    resizeMode="cover"
                    source={child.props.icon}
                  />
                  {isActive && (
                    <Animated.Text style={[activeTextStyle]}>{child.props.title}</Animated.Text>
                  )}
                  {!isActive && child.props.count && child.props.count.number > 0 && (
                    <Animated.View
                      style={[
                        styles.count,
                        {
                          backgroundColor: child.props.count.bgColor
                            ? child.props.count.bgColor
                            : "#cc0000"
                        }
                      ]}
                    >
                      <Animated.Text
                        style={[
                          styles.countText,
                          {
                            color: child.props.count.txtColor ? child.props.count.txtColor : "white"
                          }
                        ]}
                      >
                        {child.props.count.number > 99 ? "99+" : child.props.count.number}
                      </Animated.Text>
                    </Animated.View>
                  )}
                </Animated.View>
              </TouchableHighlight>
            );
          })}
        </View>
      </View>
    );
  }
}

TabBar.Item = TabBarItem;

TabBar.defaultProps = {
  backgroundColor: "white"
};

TabBar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  onChangeTab: PropTypes.func,
  backgroundColor: PropTypes.string
};

TabBarItem.defaultProps = {
  activeColor: "#008080"
};

TabBarItem.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.shape({
      uri: PropTypes.string,
      headers: PropTypes.objectOf(PropTypes.string)
    }),
    PropTypes.number,
    PropTypes.arrayOf(
      PropTypes.shape({
        uri: PropTypes.string,
        width: PropTypes.number,
        height: PropTypes.number,
        headers: PropTypes.objectOf(PropTypes.string)
      })
    )
  ]).isRequired,
  activeColor: PropTypes.string,
  count: PropTypes.shape({
    number: PropTypes.number.isRequired,
    bgColor: PropTypes.string,
    txtColor: PropTypes.string
  })
};
