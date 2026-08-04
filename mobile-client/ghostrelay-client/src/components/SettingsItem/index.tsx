import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";

interface SettingsItemProps{

icon:any;

title:string;

subtitle?:string;

onPress:()=>void;

}

export default function SettingsItem({

icon,

title,

subtitle,

onPress,

}:SettingsItemProps){

return(

<TouchableOpacity

style={styles.container}

activeOpacity={0.8}

onPress={onPress}

>

<View style={styles.left}>

<Ionicons

name={icon}

size={22}

color="#10D6B3"

/>

<View style={styles.textContainer}>

<Text style={styles.title}>

{title}

</Text>

{subtitle && (

<Text style={styles.subtitle}>

{subtitle}

</Text>

)}

</View>

</View>

<Ionicons

name="chevron-forward"

size={20}

color="#8C9AA8"

/>

</TouchableOpacity>

);

}