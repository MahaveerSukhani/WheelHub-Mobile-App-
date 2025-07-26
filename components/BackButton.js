import React from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const BackButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <FontAwesome5 name="arrow-left" size={20} color="#fff" style={{ marginLeft: 15 }} />
  </TouchableOpacity>
);

export default BackButton;
