import { FC, ReactElement } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native"

type ButtonType = {
    label : string,
    onPress : () => void,
    isLoading? : boolean,
    isDisabled? : boolean,
    icon : ReactElement,
    customColor? : string
}

const Button:FC<ButtonType> = ({ label, onPress, isDisabled=false, isLoading=false, icon, customColor="" }) => {
    return (
        <TouchableOpacity disabled={isDisabled} onPress={() => onPress()}>
            <View className={`flex-row items-center w-full h-[48px] ${isDisabled ? customColor !== "" ? customColor+" opacity-80" : "bg-blue-500 opacity-80" : customColor !== "" ? customColor :"bg-blue-500"} rounded-lg justify-center`}>
                {
                    isLoading ?
                        <ActivityIndicator size="small" color={"white"} className="mr-3"/>
                    :
                        icon
                }

                <Text className="font-medium text-lg text-white">
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default Button