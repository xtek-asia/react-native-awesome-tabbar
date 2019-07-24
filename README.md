## React Native Awesome Tabbar

The awesome tabbar made with React Native.

[![npm version](https://badge.fury.io/js/react-native-awesome-tabbar.svg)](https://badge.fury.io/js/react-native-awesome-tabbar)

<!-- <img src="https://cdn.dribbble.com/users/1233499/screenshots/4844696/preview.gif" > -->

## Add it to your project

1. Run `npm install react-native-awesome-tabbar --save`
2. `import TabBar from "react-native-awesome-tabbar";`

## Basic Usage

```js

import TabBar from "react-native-awesome-tabbar";
...
  render() {
      return (
        <TabBar onChangeTab={(childen, index) => {}} backgroundColor="">
          <TabBar.Item title="Home" icon={require("./home.png")} activeColor="#5b37b7">
            <View>{/* Page Content */}</View>
          </TabBar.Item>
          <TabBar.Item title="Search" icon={require("./search.png")} activeColor="#e6a919">
            <View>{/* Page Content */}</View>
          </TabBar.Item>
          <TabBar.Item title="Profile" icon={require("./profile.png")} activeColor="#1194aa">
            <View>{/* Page Content */}</View>
          </TabBar.Item>
          <TabBar.Item
            title="Notification"
            icon={require("./notification.png")}
            activeColor="#c9379d"
            count={{ number: 999 }}
          >
            <View>{/* Page Content */}</View>
          </TabBar.Item>
        </TabBar>
      );
    }
```

## Props

| prop            | value        | required/optional | description                  |
| --------------- | ------------ | ----------------- | ---------------------------- |
| title           | string       | required          | title of item                |
| icon            | image source | required          | icon of item                 |
| activeColor     | string       | optional          | color when item is focus     |
| onChangeTab     | function     | optional          | callback when switching tabs |
| backgroundColor | string       | optional          | background color of tab      |
| count           | object       | optional          | for badge of icon            |

## LICENSE!

react-native-awesome-tabbar is [MIT-licensed](https://github.com/xtek-asia/react-native-awesome-tabbar/blob/master/LICENSE).

## Let us know!

We’d be really happy if you send us links to your projects where you use our component. Just send an email to locnguyen99dev@gmail.com and do let us know if you have any questions or suggestion regarding our work.
