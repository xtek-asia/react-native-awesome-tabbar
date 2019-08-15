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
import { cloneDeep } from "lodash";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    width,
    height: 60,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingRight: 130,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  item: {
    paddingHorizontal: 30
  },
  icon: {
    width: 20,
    height: 20
  },
  plusButton: {
    position: "absolute",
    zIndex: 3,
    top: -15,
    right: 10,
    paddingVertical: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12
    },
    shadowOpacity: 0.58,
    shadowRadius: 16,
    elevation: 24
  }
});

class ExtendedTabbarItem extends Component {
  render() {
    const child = this.props.children;

    if (child.length && child.length > 0)
      throw new Error(
        "onlyChild must be passed a children with exactly one child."
      );

    return <View style={{ flex: 1 }}>{child}</View>;
  }
}

export default class ExtendedTabbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 0,
      isOpenMenu: false
    };
    this.iconAnimatedValue = new Animated.Value(0);
    this.tabContentAnimatedValue = new Animated.Value(0);
    this.plusButtonAnimatedValue = new Animated.Value(0);
  }

  animate = async index => {
    this.iconAnimatedValue.setValue(0);
    this.tabContentAnimatedValue.setValue(0);
    if (index === this.state.activeItem) {
      Animated.sequence([
        Animated.timing(this.iconAnimatedValue, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease
        }),
        Animated.timing(this.tabContentAnimatedValue, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease
        })
      ]).start();
    } else return;
  };

  toggleMenu = async easing => {
    Animated.timing(this.plusButtonAnimatedValue, {
      toValue: this.state.isOpenMenu ? 0 : 1,
      duration: 300,
      easing
    }).start();
    await this.setState({ isOpenMenu: !this.state.isOpenMenu });
  };

  renderItem = (children, child, index) => {
    const { activeItem, isOpenMenu } = this.state;
    const isActive = activeItem === index;
    const Icon = cloneDeep(child.props.icon);

    if (typeof Icon === "object")
      Icon.props.color = isActive ? "white" : "black";
    if (isActive && !isOpenMenu) this.animate(index);
    if (index > 2) return;

    return (
      <TouchableHighlight
        underlayColor="transparent"
        key={index}
        style={[styles.item]}
        onPress={async () => {
          await this.setState({ activeItem: index, isOpenMenu: false });
          this.plusButtonAnimatedValue.setValue(0);
          this.animate(index);
          if (typeof onChangeTab === "function") onChangeTab(child, index);
        }}
      >
        <Animated.View
          style={[
            isActive && {
              transform: [
                {
                  scale: this.iconAnimatedValue.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.3, 1.5]
                  })
                }
              ]
            }
          ]}
        >
          {typeof Icon === "object" ? (
            Icon
          ) : (
            <Animated.Image
              style={[
                styles.icon,
                {
                  tintColor:
                    !isOpenMenu && isActive ? "white" : child.props.activeColor
                }
              ]}
              resizeMode="cover"
              source={child.props.icon}
            />
          )}
        </Animated.View>
      </TouchableHighlight>
    );
  };

  render() {
    const { children, backgroundColor, onChangeTab } = this.props;
    const { activeItem, isOpenMenu } = this.state;
    return (
      <View style={[styles.container]}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: children[activeItem].props.activeColor
          }}
        >
          {children[activeItem]}
        </Animated.View>
        <View style={[styles.content, { backgroundColor }]}>
          {React.Children.map(children, (child, index) => {
            return this.renderItem(children, child, index);
          })}
          <TouchableHighlight
            style={[styles.item, styles.plusButton]}
            underlayColor="transparent"
            onPress={async () => {
              this.toggleMenu(Easing.in);
            }}
          >
            <Animated.Image
              source={require("../assets/icons/plus.png")}
              style={{
                height: 25,
                width: 25,
                transform: [
                  {
                    rotate: this.plusButtonAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "45deg"]
                    })
                  }
                ]
              }}
            />
          </TouchableHighlight>
        </View>
        {isOpenMenu ? (
          <Animated.View
            style={{
              backgroundColor: "white",
              position: "absolute",
              borderRadius: 10,
              bottom: this.plusButtonAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-1000, 70]
              }),
              right: 10,
              padding: 20
            }}
          >
            {React.Children.map(children, (child, index) => {
              const isActive = activeItem === index;
              const Icon = cloneDeep(child.props.icon);

              if (typeof Icon === "object")
                Icon.props.color = isActive ? "black" : "red";
              if (index < 3) return;

              return (
                <TouchableHighlight
                  underlayColor="transparent"
                  key={index}
                  style={[styles.item, { paddingVertical: 20 }]}
                  onPress={async () => {
                    await this.setState({
                      activeItem: index,
                      isOpenMenu: false
                    });
                    this.plusButtonAnimatedValue.setValue(0);
                    this.animate(index);
                    if (typeof onChangeTab === "function")
                      onChangeTab(child, index);
                  }}
                >
                  <Animated.View
                    style={[
                      { flexDirection: "row" },
                      isActive && {
                        transform: [
                          {
                            scale: this.iconAnimatedValue.interpolate({
                              inputRange: [0, 0.5, 1],
                              outputRange: [1, 1.1, 1.1]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    {typeof Icon === "object" ? (
                      Icon
                    ) : (
                      <Animated.Image
                        style={[
                          styles.icon,
                          {
                            tintColor: isActive
                              ? "black"
                              : child.props.activeColor
                          }
                        ]}
                        resizeMode="cover"
                        source={child.props.icon}
                      />
                    )}
                    <Text style={{ marginLeft: 10 }}>{child.props.title}</Text>
                  </Animated.View>
                </TouchableHighlight>
              );
            })}
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

ExtendedTabbar.Item = ExtendedTabbarItem;

ExtendedTabbar.defaultProps = {
  backgroundColor: "#c9379d"
};

ExtendedTabbar.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
  onChangeTab: PropTypes.func,
  backgroundColor: PropTypes.string
};

ExtendedTabbarItem.defaultProps = {
  activeColor: "white"
};

ExtendedTabbarItem.propTypes = {
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
  title: PropTypes.string,
  activeColor: PropTypes.string
};
