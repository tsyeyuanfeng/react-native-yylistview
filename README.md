[![Build Status](https://travis-ci.org/tsyeyuanfeng/react-native-yylistview.svg?branch=master)](https://travis-ci.org/tsyeyuanfeng/react-native-yylistview)

# React Native YYListView

YYListView is a memory-improved implementation of the React Native's ListView.

## The Problem
YYListView is inspired by [SGListView](https://github.com/sghiassy/react-native-sglistview). SGListView is implemented based on the `onChangVisibleRows` callback method of React Native ListView. But there is a big problem with `onChangVisibleRows` callback method. See [ListView onChangeVisibleRows() stops being triggered after 100 rendered rows #9101
](https://github.com/facebook/react-native/issues/9101). So I decided to write YYListView based on `onScroll` callback method of React Native ListView.

## Installation

Install via npm

```bash
npm install react-native-yylistview --save
```

## Usage

Import YYListView

```js
import YYListView from 'react-native-yylistview';
```

Change references from `ListView` to `YYListView`.

From:
```jsx
<ListView ... />
```
To:
```jsx
<YYListView ... />
```
