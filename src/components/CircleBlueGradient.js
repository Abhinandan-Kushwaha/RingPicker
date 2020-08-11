import React from "react";
import { View } from 'react-native';
import Svg, {
    G,
    Path,
    LinearGradient,
    Stop
} from "react-native-svg";

export const CircleBlueGradient = () => (
    // <View style={{ justifyContent: 'center', alignItems: 'center', width: 300, height: 300, borderWidth: 1, borderRadius: 150, }}>
    //     <View style={{ width: 100, height: 100, borderWidth: 1, borderRadius: 50 }} />
    // </View>
    <View>
        <View style={{position:'absolute',width:322,height:322,borderRadius:161, borderWidth:1,borderColor:'gray'}}/>
    <Svg width="100%" height="100%" viewBox="0 0 955 955">
        <G id="layer_2">
            <G id="layer_1-2">
                <LinearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="477.3691" y1="0.2666" x2="477.3691" y2="955">
                <Stop offset="0" stopColor="#eedffc"/>
                    {/* <Stop offset="0.2815" stopColor="#efdecd"/> */}
                    {/* <Stop offset="0.5674" stopColor="#defecd"/> */}
                    <Stop offset="0.8652" stopColor="#eeefef"/>
                    {/* <Stop offset="0.9944" stopColor="#ceeecd"/> */}
                </LinearGradient>
                <Path fill="url(#SVGID_1_)" d="M477.4,955C214.1,955,0,740.9,0,477.6S214.1,0.3,477.4,0.3s477.4,214.1,477.4,477.4S740.6,955,477.4,955z
     M477.4,178.6c-164.9,0-299,134.1-299,299s134.1,299,299,299s299-134.1,299-299S642.2,178.6,477.4,178.6z"/>
            </G>
        </G>
    </Svg>
    {/* <View style={{position:'absolute',top:0,left:'46%',height:26,width:26,borderRadius:13,backgroundColor:'#aaaaaa'}}/> */}
    </View>
);